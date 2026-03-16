import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"
import { processImage } from "../../utils/imageProcessor.js"
import { uploadToSupabase, deleteFromSupabase } from "../../utils/supabaseUpload.js"
import { parseFlexibleArray } from "../../utils/dataParser.js"
import path from "path"

export const postProject = async (req) => {
    let uploadedPaths = [];
    const bucketName = "project_images";

    try {
        const {
            title, tagline, short_desc, problem, solution, role, timeline, 
            category, status, featured, github_url, live_url,
            features, process, tech_stack
        } = req.body;

        const imageFile = req.file;
        const user = req.user;

        if (!user || !user.id) {
            throw new AppError('Unauthorized: User information missing', 401);
        }

        if (!imageFile) {
            throw new AppError('Main project image is required', 400);
        }

        // Check featured is already present or not
        if (featured === 'true' || featured === true) {
            const featuredProject = await prisma.project.findFirst({where: {featured: true}});
            if (featuredProject) {
                throw new AppError('Featured project is already present, change its status.', 400);
            }
        }

        // Order 
        const maxDisplayOrder = await prisma.project.findFirst({
            select: {
                order: true
            },
            orderBy: {
                order: 'desc'
            }
        })
        const newOrder = maxDisplayOrder ? maxDisplayOrder.order + 1 : 1
            

        // 1. Precise Data Parsing
        const parsedTechStack = parseFlexibleArray(tech_stack, "tech_stack").map(t => t.trim().toLowerCase());
        const parsedFeatures = parseFlexibleArray(features, "features").map(f => f.trim());

        // Process parsing is slightly different (can be array of objects or comma-separated titles)
        let parsedProcess = [];
        if (typeof process === "string") {
            const trimmed = process.trim();
            if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                try {
                    parsedProcess = JSON.parse(trimmed);
                } catch (e) {
                    throw new AppError("Invalid JSON format for process", 400);
                }
            } else {
                parsedProcess = trimmed.split(",").map(title => ({ 
                    process_title: title.trim(), 
                    process_desc: "" 
                })).filter(p => p.process_title);
            }
        } else if (Array.isArray(process)) {
            parsedProcess = process.map(p => {
                if (typeof p === 'string') return { process_title: p.trim(), process_desc: "" };
                return { 
                    process_title: p.process_title || "", 
                    process_desc: p.process_desc || "" 
                };
            }).filter(p => p.process_title);
        }

        // 2. Image Processing (using sharp)
        const originalName = path.parse(imageFile.originalname).name.replace(/\s+/g, '_');
        const timestamp = Date.now();
        const mainImagePath = `main_image/${originalName}_${timestamp}.webp`;
        const thumbnailPath = `thumbnail_image/${originalName}_${timestamp}.webp`;

        // Process main image (Standardize/Convert to WebP)
        const mainImageBuffer = await processImage(imageFile.buffer, { quality: 80 });
        
        // Process thumbnail (Resize/Compress/WebP)
        const thumbnailBuffer = await processImage(imageFile.buffer, { 
            width: 600, // Standard card size width
            quality: 70 
        });

        // 3. Supabase Upload
        const mainImageUrl = await uploadToSupabase(mainImageBuffer, bucketName, mainImagePath, "image/webp");
        uploadedPaths.push(mainImagePath);

        const thumbnailUrl = await uploadToSupabase(thumbnailBuffer, bucketName, thumbnailPath, "image/webp");
        uploadedPaths.push(thumbnailPath)

        // 4. Database Transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create the main project
            const newProject = await tx.project.create({
                data: {
                    title,
                    tagline,
                    short_desc,
                    problem,
                    solution,
                    role,
                    timeline,
                    category,
                    status: status || "not-completed",
                    featured: featured === 'true' || featured === true,
                    order: parseInt(newOrder) || 0,
                    image_url: mainImageUrl,
                    thumbnail_url: thumbnailUrl,
                    live_url: live_url || "",
                    github_url: github_url || "",
                    user_id_fk: user.id
                }
            });

            // Handle Features
            if (parsedFeatures.length > 0) {
                await tx.project_features.createMany({
                    data: parsedFeatures.map(f => ({
                        feature: f,
                        project_id_fk: newProject.id
                    }))
                });
            }

            // Handle Process
            if (parsedProcess.length > 0) {
                await tx.project_process.createMany({
                    data: parsedProcess.map(p => ({
                        process_title: p.process_title,
                        process_desc: p.process_desc,
                        project_id_fk: newProject.id
                    }))
                });
            }

            // Handle Tech Stack (Many-to-Many logic)
            if (parsedTechStack.length > 0) {
                for (const techName of parsedTechStack) {
                    // Find or create the tech_stack record
                    const tech = await tx.tech_stack.upsert({
                        where: { tech_stack: techName },
                        update: {},
                        create: { tech_stack: techName }
                    });

                    // Link to the project
                    await tx.project_tech_stack.create({
                        data: {
                            project_id_fk: newProject.id,
                            tech_stack_id_fk: tech.id
                        }
                    });
                }
            }

            return newProject;
        });

        return result.id

    } catch (error) {
        // Rollback uploaded images on failure
        if (uploadedPaths.length > 0) {
            console.log("Rolling back uploaded images...");
            await deleteFromSupabase(bucketName, uploadedPaths);
        }

        console.error('Error creating project:', error);
        
        if (error.code === 'P2002') {
            throw new AppError(`Project with this ${error.meta.target?.join(', ') || 'field'} already exists`, 400);
        }
        
        if (error instanceof AppError) throw error;
        
        throw new AppError(error.message || 'Failed to create project', 500);
    }
}