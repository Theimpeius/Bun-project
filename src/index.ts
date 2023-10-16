import express from 'express';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
const app = express();
const port = 3000;

app.use(express.json());
app.use('/tasks/', taskRoutes);
app.use('/users/', userRoutes);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});