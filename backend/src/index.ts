import "dotenv/config";
import { createServer } from "node:http";
import { expressApplication } from "./app/app.js";

(async function main() {
  try {
    const nodeServer = createServer(await expressApplication());
    const PORT = 8000;

    nodeServer.listen(PORT, () => {
      console.log(
        `Server starts at PORT ${PORT} and URL http://localhost:${PORT}`,
      );
    });
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
})();
