export function pagination(req, defaultLimit = 10, maxLimit = 50){
    let limit = parseInt(req.query.limit) || defaultLimit
    let page = parseInt(req.query.page) || 1

    // limiting the maximum limit
    if(limit > maxLimit) limit = maxLimit
    if(limit < 1) limit = defaultLimit
    if(page < 1) page = 1

    const start = (page - 1) * limit
    const end = start + limit - 1

    return {limit, page, start, end}
}