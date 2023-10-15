import { Router } from 'express';
import userController from '../controllers/userController';

const router = Router();

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUser);
router.post('/singup', userController.singup);
router.post('/login', userController.login);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

export default router;