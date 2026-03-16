import { getAllProjects } from "./project/getAllProject.js";
import { getSingleProject } from "./project/getSingleProject.js";
import { postProject } from "./project/postProject.js";
import { editProject } from "./project/editProject.js";
import { deleteProject } from "./project/deleteProject.js";
import { patchFeaturedProject } from "./project/patchFeaturedProject.js";

export const projectService = {
    getAllProjects,
    getSingleProject,
    postProject,
    editProject,
    deleteProject,
    patchFeaturedProject
}