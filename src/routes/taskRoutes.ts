import { Router } from 'express';
import taskController from '../controllers/taskController';

const router = Router();

router.get('/', taskController.getAllTasks);
router.get('/:username', taskController.getTask);
router.post('/', taskController.createTask);
router.put('/:username/:id', taskController.updateTask);
router.delete('/:username/:id', taskController.deleteTask);

export default router;