import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"
import { processImage } from "../../utils/imageProcessor.js"
import { uploadToSupabase, deleteFromSupabase } from "../../utils/supabaseUpload.js"
import { parseFlexibleArray } from "../../utils/dataParser.js"
import path from "path"

export const editProject = async (req) => {
    let uploadedPaths = [];
    let oldImagePaths = [];
    const bucketName = "project_images";

    try {
        const { id } = req.params;
        const {
            title, tagline, short_desc, problem, solution, role, timeline, 
            category, status, github_url, live_url,
            features, process, tech_stack
        } = req.body;

        const imageFile = req.file;
        const user = req.user;

        // 1. Check if project exists and get current images
        const existingProject = await prisma.project.findUnique({
            where: { id }
        });

        if (!existingProject) {
            throw new AppError('Project not found', 404);
        }

        // 2. Precise Data Parsing
        const parsedTechStack = tech_stack ? parseFlexibleArray(tech_stack, "tech_stack").map(t => t.trim().toLowerCase()) : null;
        const parsedFeatures = features ? parseFlexibleArray(features, "features").map(f => f.trim()) : null;

        let parsedProcess = null;
        if (process) {
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
        }

        // 3. Image Processing (if new image provided)
        let mainImageUrl = existingProject.image_url;
        let thumbnailUrl = existingProject.thumbnail_url;

        if (imageFile) {
            const originalName = path.parse(imageFile.originalname).name.replace(/\s+/g, '_');
            const timestamp = Date.now();
            const mainImagePath = `main_image/${originalName}_${timestamp}.webp`;
            const thumbnailPath = `thumbnail_image/${originalName}_${timestamp}.webp`;

            // Process main image
            const mainImageBuffer = await processImage(imageFile.buffer, { quality: 80 });
            
            // Process thumbnail
            const thumbnailBuffer = await processImage(imageFile.buffer, { 
                width: 600, 
                quality: 70 
            });

            // Upload to Supabase
            mainImageUrl = await uploadToSupabase(mainImageBuffer, bucketName, mainImagePath, "image/webp");
            uploadedPaths.push(mainImagePath);

            thumbnailUrl = await uploadToSupabase(thumbnailBuffer, bucketName, thumbnailPath, "image/webp");
            uploadedPaths.push(thumbnailPath);

            // Collect old paths for deletion
            if (existingProject.image_url) {
                const oldMainPath = existingProject.image_url.split(`${bucketName}/`)[1];
                if (oldMainPath) oldImagePaths.push(oldMainPath);
            }
            if (existingProject.thumbnail_url) {
                const oldThumbPath = existingProject.thumbnail_url.split(`${bucketName}/`)[1];
                if (oldThumbPath) oldImagePaths.push(oldThumbPath);
            }
        }

        // 4. Database Transaction
        const updatedProject = await prisma.$transaction(async (tx) => {
            // Update the core project data
            const project = await tx.project.update({
                where: { id },
                data: {
                    title,
                    tagline,
                    short_desc,
                    problem,
                    solution,
                    role,
                    timeline,
                    category,
                    status: status || undefined,
                    image_url: mainImageUrl,
                    thumbnail_url: thumbnailUrl,
                    live_url: live_url || undefined,
                    github_url: github_url || undefined
                }
            });

            // Handle Features
            if (parsedFeatures !== null) {
                await tx.project_features.deleteMany({ where: { project_id_fk: id } });
                if (parsedFeatures.length > 0) {
                    await tx.project_features.createMany({
                        data: parsedFeatures.map(f => ({
                            feature: f,
                            project_id_fk: id
                        }))
                    });
                }
            }

            // Handle Process
            if (parsedProcess !== null) {
                await tx.project_process.deleteMany({ where: { project_id_fk: id } });
                if (parsedProcess.length > 0) {
                    await tx.project_process.createMany({
                        data: parsedProcess.map(p => ({
                            process_title: p.process_title,
                            process_desc: p.process_desc,
                            project_id_fk: id
                        }))
                    });
                }
            }

            // Handle Tech Stack
            if (parsedTechStack !== null) {
                await tx.project_tech_stack.deleteMany({ where: { project_id_fk: id } });
                if (parsedTechStack.length > 0) {
                    for (const techName of parsedTechStack) {
                        const tech = await tx.tech_stack.upsert({
                            where: { tech_stack: techName },
                            update: {},
                            create: { tech_stack: techName }
                        });

                        await tx.project_tech_stack.create({
                            data: {
                                project_id_fk: id,
                                tech_stack_id_fk: tech.id
                            }
                        });
                    }
                }
            }
            return project;
        }, {
            timeout: 10000 // Increase timeout for many-to-many upserts
        });

        // 5. Cleanup: Delete old images if new ones were successfully uploaded
        if (oldImagePaths.length > 0) {
            console.log("Cleaning up old images...");
            await deleteFromSupabase(bucketName, oldImagePaths);
        }

        return updatedProject.id

    } catch (error) {
        // Rollback newly uploaded images on failure
        if (uploadedPaths.length > 0) {
            console.log("Rolling back uploaded images...");
            await deleteFromSupabase(bucketName, uploadedPaths);
        }

        console.error('Error updating project:', error);
        
        if (error.code === 'P2002') {
            throw new AppError(`Project with this ${error.meta.target?.join(', ') || 'field'} already exists`, 400);
        }
        
        if (error.code === 'P2025') {
            throw new AppError('Project not found', 404);
        }

        if (error instanceof AppError) throw error;
        
        throw new AppError(error.message || 'Failed to update project', 500);
    }
}
