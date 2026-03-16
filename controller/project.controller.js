import { projectService } from "../service/project.js"
import CatchAsync from "../utils/catchAsync.js"

export const getAllProjects = CatchAsync(async(req, res, next) =>{
    const result = await projectService.getAllProjects(req)
    res.json({
        success: true,
        message: "Projects fetched successfully",
        data: result
    })
})

export const getSingleProject = CatchAsync(async(req, res, next) =>{
    const result = await projectService.getSingleProject(req)
    res.json({
        success: true,
        message: "Project fetched successfully",
        data: result
    })
})

export const postProject = CatchAsync(async(req, res, next) =>{
    const result = await projectService.postProject(req)
    res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: result
    })
})

export const editProject = CatchAsync(async(req, res, next) =>{
    const result = await projectService.editProject(req)
    res.json({
        success: true,
        message: "Project updated successfully",
        data: result
    })
})

export const deleteProject = CatchAsync(async(req, res, next) =>{
    await projectService.deleteProject(req)
    res.json({
        success: true,
        message: "Project deleted successfully",
    })
})

export const patchFeaturedProject = CatchAsync(async(req, res, next) =>{
    const result = await projectService.patchFeaturedProject(req)
    res.json({
        success: true,
        message: "Project featured status updated successfully",
        data: result
    })
})
