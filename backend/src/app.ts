import express from 'express';
import path from 'path';
import cors from 'cors';

import authRoutes from './routes/auth.route';
import chatRoutes from './routes/chat.route';
import messageRoutes from './routes/message.route';
import userRoutes from './routes/user.route';
import { clerkMiddleware } from '@clerk/express';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

const defaultAllowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8081',
];

const envAllowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([
  ...defaultAllowedOrigins,
  ...envAllowedOrigins,
  process.env.FRONTEND_URL,
].filter(Boolean)));

app.use(cors(
  {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true, // for cookies and other credentials;
  }
))
app.use(express.json());
// Middleware that integrates Clerk authentication into your Express application. It checks the request's cookies and headers for a session JWT and, if found, attaches the Auth object to the request object under the auth key.

app.use(clerkMiddleware());

app.get('/user', (req, res) => {
    res.json({
        message: "Hello World",
    })
})

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);


// serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../web/dist');

  app.use(express.static(distPath));

  // Express 5 compatible catch-all
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}


app.use(errorHandler);


export default app;
