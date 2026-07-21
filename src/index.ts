import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiRoutes from "@/routes";

import {
    errorHandler,
    notFoundHandler,
} from "@/middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {

    res.status(200).json({
        name: "Todo REST API",
        version: "1.0.0",
        description: "REST API built with Express and TypeScript",
        endpoints: {
            health: "/api/health",
            todos: "/api/todos",
            stats: "/api/todos/stats",
        },
    });
});

app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
app.listen(PORT, () => {

    console.log("");
    console.log("===================================");
    console.log(`Server started successfully`);
    console.log(`http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log("===================================");
});