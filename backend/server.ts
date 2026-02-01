import app from "./src/app";
import "dotenv/config";
import { createServer } from "http";

import { initializeSocket } from "./src/utils/socket";
import { connectDB } from "./src/config/database";


const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB(); // fire-and-forget
});
