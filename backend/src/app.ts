import express from 'express';
import authRoutes from './routes/auth.route';
import chatRoutes from './routes/chat.route';
import messageRoutes from './routes/message.route';
import userRoutes from './routes/user.route';

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)

export default app;