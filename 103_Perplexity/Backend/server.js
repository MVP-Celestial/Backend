import "dotenv/config"
import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";
import {testAi} from "./src/services/ai.service.js";

const PORT = process.env.PORT || 5000;

testAi();

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();