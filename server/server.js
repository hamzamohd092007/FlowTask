import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.use(express.json());

connectDB();

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    process.exit(1);
}

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
