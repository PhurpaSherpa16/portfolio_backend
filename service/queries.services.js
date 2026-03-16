import { getAllQueries } from "./queries/getAllQueries.js";
import { postQuery } from "./queries/postQuery.js";
import { getSingleQuery } from "./queries/getSingleQuery.js";
import { deleteQuery } from "./queries/deleteQuery.js";

export const queries_services = {
    getAllQueries,
    postQuery,
    getSingleQuery,
    deleteQuery
}