import { Router, Request, Response } from "express";
import todoRoutes from "@/routes/todos";

const router = Router();

router.get("/health", (req: Request, res: Response) => {

    res.status(200).json({
        success: true,
        message: "API is running",
        timestamp: new Date(),
        uptime: process.uptime(),
    });
});

router.use("/todos", todoRoutes);

export default router;