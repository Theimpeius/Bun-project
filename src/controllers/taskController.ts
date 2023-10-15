import { Request, Response } from 'express';
import { Task } from '../models/taskModel';
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
        const { id } = req.params;
        const taskQuery = db.query(`SELECT * FROM tasks WHERE id = $id`);
        const task = taskQuery.get({$id: id});
        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Internal error'});
    }
};

const createTask = (req: Request, res: Response) => {
    try {
        const { description }: Task = req.body;
        db.query(`INSERT INTO tasks (description, done) VALUES ($description, $done)`).run({$description: description, $done: false});
        res.status(200).send({message: 'Task created!'});      
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error creating task!'});
    }

};

const updateTask = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { description }: Task = req.body;
        db.query(`UPDATE tasks SET description = $description WHERE id = $id`).run({$description: description, $id: id});
        res.status(200).send({message: 'Task updated!'});       
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error updating task!'});
    }

};

const deleteTask = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        db.query(`DELETE FROM tasks WHERE id = $id`).run({$id: id});
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