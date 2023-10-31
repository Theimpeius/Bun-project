import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/tasks/', taskRoutes);
app.use('/users/', userRoutes);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});