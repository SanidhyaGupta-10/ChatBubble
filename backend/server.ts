import app from "./src/app";
import 'dotenv/config';
import { createServer } from 'http'
import { ConnectDB } from "./src/config/database";
import { initializeSocket } from "./src/utils/socket";

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

initializeSocket(httpServer);

ConnectDB()
    .then(() => {
        httpServer.listen(PORT, () => {
            console.log(`Server is Running on ${PORT}`)
        });
    })
    .catch((err) => {
        console.log('Failed to Connect with th server', err);
        process.exit(1);
    });