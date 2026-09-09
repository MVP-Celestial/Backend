import "dotenv/config"
import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  initSocket(httpServer);
};

startServer();
