import express from "express";
import morgan from "morgan";
import fileUpload from 'express-fileupload';

import cors from "cors"
import {PORT} from "./config.js";
//routes
import tasksRoutes from "./routes/task.routes.js";
const app = express();
app.use(fileUpload());
app.use(cors());
app.use(morgan('short'));
app.use(express.json());
app.use('/api',tasksRoutes);
app.use((req,res,next)=>{
    res.status(404).json({
        message: "endpoint not found"
    });
});
app.listen(PORT);
console.log(`server on port ${PORT}`);