import { queries_services } from "../service/queries.services.js"
import CatchAsync from "../utils/catchAsync.js"

export const getAllQueries = CatchAsync(async(req, res, next) =>{
    const queries = await queries_services.getAllQueries(req)
    res.json({
        success: true,
        message: "Queries fetched successfully",
        data: queries
    })
})
    
export const postQuery = CatchAsync(async(req, res, next) =>{
    const queries = await queries_services.postQuery(req)
    res.json({
        success: true,
        message: "Query posted successfully",
        data: queries
    })
})

export const getSingleQuery = CatchAsync(async(req, res, next) =>{
    console.log('runnign... single');
    const query = await queries_services.getSingleQuery(req)
    res.json({
        success: true,
        message: "Query fetched successfully",
        data: query
    })
})

export const deleteQuery = CatchAsync(async(req, res, next) =>{
    await queries_services.deleteQuery(req)
    res.json({
        success: true,
        message: "Query deleted successfully"
    })
})

export const getUnreadQueryCount = CatchAsync(async(req, res, next) =>{
    console.log('runnign...');
    const count = await queries_services.getUnreadQueryCount()
    res.json({
        success: true,
        message: "Unread query count fetched successfully",
        data: count
    })
})

    