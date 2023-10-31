import { Request, Response } from 'express';
import { Task } from '../models/taskModel';
import { User } from '../models/userModel.ts';
import db from '../database/db.ts';

const getAllTasks =  async (req: Request, res: Response) => {
    try {
        const tasksStatement = await db.query(`SELECT * FROM tasks`);
        const tasks = tasksStatement.all();
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Internal error'});
    }
    
};

const getTask = (req: Request, res: Response) => {
    try {
        //Obtiene el valor de "username" de los parámetros de la ruta (req.params).
        const { username } = req.params;

        //Verifica si "username" es nulo o está vacío.
        if (!username) {
            return res.status(400).send({ message: 'Username is required in the route parameter' });
        }

        //Prepara una consulta SQL para obtener el ID del usuario basado en su nombre de usuario.
        const userQuery = db.prepare(`SELECT id FROM users WHERE username = ?`);

        //Ejecuta la consulta SQL preparada y obtiene el usuario.
        const user = userQuery.get(username) as User;

        // Verifica si el usuario existe.
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        //Prepara una consulta SQL para seleccionar todas las tareas asociadas al usuario.
        const taskQuery = db.query(`SELECT * FROM tasks WHERE user_id = ?`);
        
        //Ejecuta la consulta SQL y obtiene todas las tareas del usuario.
        const tasks = taskQuery.all(user.id);
        
        //Responde con un código de estado 200 (OK) y envía las tareas en formato JSON como respuesta.
        res.status(200).json(tasks);
    } catch (error) {
        //Si ocurre un error, captura la excepción y envía una respuesta con un código de estado 500 (Error interno del servidor) y un mensaje de error.
        console.error(error);
        res.status(500).send({ message: 'Internal error' });
    }
};

const createTask = (req: Request, res: Response) => {
    try {
        //Obtiene los datos de descripción y id de usuario (id) del cuerpo de la solicitud (req.body).
        const { description, username }: Task = req.body;

        //Prepara y ejecuta una consulta SQL para obtener el ID del usuario basado en su nombre de usuario.
        const userQuery = db.prepare(`SELECT id FROM users WHERE username = ?`);
        const user = userQuery.get(username) as User;

        //Verifica si el usuario existe.
        if (!user) {
            //Si el usuario no existe, responde con un código de estado 404 (No encontrado) y un mensaje de error.
            return res.status(404).send({ message: 'User not found' });
        }

        //Prepara y ejecuta una consulta SQL para insertar un nuevo registro en la base de datos
        const taskQuery = db.prepare(`INSERT INTO tasks (description, done, user_id) VALUES (?, ?, ?)`);
        taskQuery.run(description, false, user.id);

        //Responde con un código de estado 200 (OK) y un mensaje indicando que la tarea se creó con éxito.
        res.status(200).send({ message: 'Task created!' });
    } catch (error) {
        //Si ocurre un error, captura la excepción y envía una respuesta con un código de estado 500 (Error interno del servidor) y un mensaje de error.
        console.error(error);
        res.status(500).send({ message: 'Error creating task!' });
    }
};

const updateTask = (req: Request, res: Response) => {
    try {
        //Obtiene los datos de la ruta (parámetros) y el cuerpo de la solicitud.
        const { username, id } = req.params;
        const { description, done }: Task = req.body;

        // Verifica si el parámetro de "username" en la ruta.
        if (!username) {
            return res.status(400).send({ message: 'Username is required in the route parameter' });
        }

        //Prepara y ejecuta una consulta SQL para obtener el ID del usuario basado en su nombre de usuario.
        const userQuery = db.prepare(`SELECT id FROM users WHERE username = ?`);
        const user = userQuery.get(username) as User;

        //Verifica si el usuario existe.
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        //Prepara una consulta SQL para obtener una tarea específica del usuario por su ID.
        const taskQuery = db.query(`SELECT * FROM tasks WHERE user_id = ? AND id = ?`);

        //Ejecuta la consulta SQL y obtiene la tarea correspondiente.
        const task = taskQuery.get(user.id, id);

        //Verifica si la tarea existe para este usuario.
        if (!task) {
            return res.status(404).send({ message: 'Task not found for this user' });
        }

        //Prepara una consulta SQL para actualizar la descripción de la tarea basada en su ID.
        db.prepare("UPDATE tasks SET description = ?, done = ? WHERE id = ?").run(description, done, id);

        //Responde con un código de estado 200 (OK) y un mensaje indicando que la tarea se actualizó con éxito.
        res.status(200).send({ message: 'Task updated!' });
    } catch (error) {
        //Si ocurre un error, captura la excepción y envía una respuesta con un código de estado 500 (Error interno del servidor) y un mensaje de error.
        console.error(error);
        res.status(500).send({ message: 'Error updating task!' });
    }
};

const deleteTask = (req: Request, res: Response) => {
    try {
        const { username, id } = req.params;
        // Verifica si el parámetro de "username" está en la ruta.
        if (!username) {
            return res.status(400).send({ message: 'Username is required in the route parameter' });
        }
        //Prepara una consulta SQL para obtener el ID del usuario basado en su nombre de usuario.
        const userQuery = db.prepare(`SELECT id FROM users WHERE username = ?`);
        //Ejecuta la consulta SQL preparada y obtiene el usuario.
        const user = userQuery.get(username) as User;
        //Verifica si el usuario existe.
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        //Prepara y ejecuta una consulta SQL para obtener una tarea específica del usuario por su ID.
        const taskQuery = db.query(`SELECT * FROM tasks WHERE user_id = ? AND id = ?`);
        const task = taskQuery.get(user.id, id);
        //Verifica si la tarea existe para este usuario.
        if (!task) {
            return res.status(404).send({ message: 'Task not found for this user' });
        }
        db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
        res.status(200).send({message: 'Task deleted!'});        
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error deleted task!'});
    }

};

export default {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
};