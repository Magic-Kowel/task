import { pool } from "../db.js";
import path from 'path';
export const getTasks = async(req,res) =>{
    try {
        const [rows] = await pool.query(`
        SELECT
            COUNT(*) AS total,
            tasks.id_tasks,
            titulo,
            descripcion,
            estatus,
            fecha_entrega,
            comentarios,
            creador.usuario AS usuario_creador,
            responsable.usuario AS responsable,
            tags,
            archivo
        FROM
            tasks
        INNER JOIN usuarios AS creador ON tasks.usuario_creador = creador.id_usuario
        INNER JOIN usuarios AS responsable ON tasks.responsable = responsable.id_usuario
        WHERE estatus = 1
        `);
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}
export const getTask = async(req,res) =>{
    try {
        const [rows] = await pool.query(`SELECT * 
        FROM tasks 
        WHERE estatus = 1 
        AND id_tasks = ?`,[req.params.idTask])
        if(rows.length <= 0){
            return res.status(404).json({
                message: 'Restaurant not found'
            })
        }
        res.json(rows[0]);
    } catch (error) {
         return res.status(500).json({
             message: 'Something goes wrong'
         });
    }
}
export const createTask = async(req, res) =>{
    try {
        const {
            titulo,
            descripcion,
            estatus,
            fecha_entrega,
            publico,
            comentarios,
            usuario_creador,
            responsable,
            tags,
            archivo
        } = req.body;
        const curenDate = new Date();
        const date = new Date(fecha_entrega);
        console.log(curenDate.getTime() > date.getTime());
        if(curenDate.getTime() > date.getTime()){
            return res.status(400).json({
                created:false,
                message:"the date is not valid"
            });
        }
        pool.query(`INSERT INTO 
        tasks(
            titulo,
            descripcion,
            estatus,
            fecha_entrega,
            publico,
            comentarios,
            usuario_creador,
            responsable,
            tags,
            archivo) 
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`,[
            titulo ?? null,
            descripcion ?? null,
            estatus ?? null,
            fecha_entrega ?? null,
            publico ?? null,
            comentarios ?? null,
            usuario_creador ?? null,
            responsable ?? null,
            tags ?? null,
            archivo ?? null
        ]);
        res.status(200).json({
            created:true,
            message:"Created with success"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            created:false,
            message: 'Something goes wrong'
        })
    }
}
export const deleteTasks = async (req,res) =>{
    try {
        const [result] = await pool.query('UPDATE tasks SET estatus = 0 WHERE id_tasks = ?',[
            req.params.idTask
        ]);
        if(result.affectedRows <= 0){
            return res.status(404).json({
                message: 'Task not found'
            });
        }
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
}
export const updateTask = async (req,res) => {
    console.log("patch");
    try {
        const {idTask} = req.params;
        const {
            titulo,
            descripcion,
            estatus,
            fecha_entrega,
            publico,
            comentarios,
            responsable,
            tags,
            archivo
        } = req.body;
        const [result] = await 
        pool.query(`UPDATE tasks 
            SET 
            titulo = IFNULL(?,titulo),
            descripcion = IFNULL(?,descripcion),
            estatus = IFNULL(?,estatus),
            fecha_entrega = IFNULL(?,fecha_entrega),
            publico = IFNULL(?,publico),
            comentarios = IFNULL(?,comentarios),
            responsable = IFNULL(?,responsable),
            tags = IFNULL(?,tags),
            archivo = IFNULL(?,archivo)
            WHERE id_tasks = ?`,
        [
            titulo ?? null,
            descripcion ?? null,
            estatus ?? null,
            fecha_entrega ?? null,
            publico ?? null,
            comentarios ?? null,
            responsable ?? null,
            tags ?? null,
            archivo ?? null,
            idTask
        ]);
        if(result.affectedRows === 0){
            return res.status(404).json({
                message:'Task not found'
            })
        }
        res.status(200).json({
            update:true,
            message:"Update with success"
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}
export const uploadFile = async (req, res) => {
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No se ha seleccionado ningún archivo' });
    }
    
      // Accede al archivo subido
      let file = req.files.file;
    
      // Mueve el archivo a la ubicación deseada
    file.mv(`../files`, (err) => {
    if (err) {
        return res.status(500).json({ message: 'Error al subir el archivo', error: err });
    }
    
        // El archivo se ha subido exitosamente
        res.status(200).json({ message: 'Archivo subido correctamente' });
      });
  };