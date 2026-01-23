import express from 'express';
import authRoutes from './routes/auth.route';
import chatRoutes from './routes/chat.route';
import messageRoutes from './routes/message.route';
import userRoutes from './routes/user.route';
import { clerkMiddleware } from '@clerk/express';

const app = express();
const PORT = process.env.PORT || 3000


app.use(express.json());
// Middleware that integrates Clerk authentication into your Express application. It checks the request's cookies and headers for a session JWT and, if found, attaches the Auth object to the request object under the auth key.
app.use(clerkMiddleware());



app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)

export default app;