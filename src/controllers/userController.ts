import { Request, Response } from 'express';
import db from '../database/db.ts';
import { User } from '../models/userModel.ts';

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const usersStatement = await db.query(`SELECT * FROM users`);
        const users = usersStatement.all();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Internal error'});
    }
};

const getUser = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userQuery = db.query(`SELECT * FROM users WHERE id = $id`);
        const user = userQuery.get({$id: id});
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Internal error'});
    }
};

const singup = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await Bun.password.hash(password);
        db.query(`INSERT INTO users (username, email, password) VALUES ($username, $email, $hashedPassword)`).run({$username: username, $email: email, $hashedPassword: hashedPassword});
        res.status(200).send({message: 'User registered!'});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error registered user!'});
        
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const userQuery = db.query(`SELECT * FROM users WHERE username = $username`);
        const user = userQuery.get({$username: username}) as User;
        
        if(user){
            const isMatch = await Bun.password.verify(password, user.password);
            isMatch ? res.send({ message: 'Login successful!' }) : res.send({ message: 'Invalid password.' });
        }else{
            res.send({ message: 'User does not exist.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error login user!'});
    }

};

const updateUser = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        db.query(`UPDATE users SET username = $username, email = $email, password = $password WHERE id = $id`).run({$username: username, $email: email, $password: password, $id: id});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error updating user!'});
    }
};

const deleteUser = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        db.query(`DELETE FROM users WHERE id = $id`).run({$id: id});
        res.status(200).send({message: 'User deleted!'});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error deleted user!'});
    }
};

export default {
    getAllUsers,
    getUser,
    singup,
    login,
    updateUser,
    deleteUser
}