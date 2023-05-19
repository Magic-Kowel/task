import { Router } from "express";

import{
    getTasks,
    getTask,
    createTask,
    deleteTasks,
    updateTask,
    uploadFile
} from "../controllers/task.controller.js";
const router = Router();
router.get('/tasks',getTasks);
router.get('/task/:idTask',getTask);
router.post('/task',createTask);
router.post('/upload',uploadFile)
router.delete('/task/:idTask',deleteTasks);
router.patch('/task/:idTask',updateTask);
export default router;