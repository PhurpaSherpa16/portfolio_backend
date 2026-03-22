// hitting api every 3 day to keep the website alive
import corn from "node-cron"
import prisma from "../lib/prisma.js";

export const startLatestProject = () =>{
    corn.schedule("0 0 * * *", async() => {
        try {
            console.log("⏱ Running latest project cron...");
            const response = await prisma.project.findFirst({
                orderBy: {createdAt: "desc"},
                select: {title: true} 
            })
            if(response) console.log("✅ Latest project:", response.title)
            else console.log("❌ No projects found")
        } catch (error) {
            console.error("❌ Cron error:", error.message);
        }
    })
}
