import "dotenv/config"
import express from "express"
import cors from 'cors'
import { errorHandler, urlNotFound } from "./middleware/errorHandler.js"
import projectRoutes from './routes/project.routes.js'
import authRoutes from './routes/auth.routes.js'
import queriesRoutes from './routes/queries.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import { startLatestProject } from "./corn/Corn.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/projects', projectRoutes)
app.use('/auth', authRoutes)
app.use('/queries', queriesRoutes)
app.use('/notifications', notificationRoutes)
startLatestProject()

// error 
app.use(errorHandler)
// error url not found
app.use(urlNotFound)


const PORT = process.env.PORT || 9000
if(process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`📊 API running at http://localhost:${PORT}`)
    })
}

export default app