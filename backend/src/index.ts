import "dotenv/config";
import { createServer } from "node:http";
import { expressApplication } from "./app/app.js";
import { envZod } from "./common/utils/envSanitization.js";
import { startOverdueTaskJob } from "./app/jobs/overdueTask.job.js";
import { initSocketServer } from "./lib/socket.js";

(async function main() {
  try {
    const nodeServer = createServer(await expressApplication());
    const PORT = envZod.PORT ? parseInt(envZod.PORT, 10) : 8000;

    initSocketServer(nodeServer);

    nodeServer.listen(PORT, () => {
      console.log(
        `Server starts at PORT ${PORT} and URL http://localhost:${PORT}`,
      );
      startOverdueTaskJob();
    });
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
})();
