import type { TokenUserPayload } from "../app/utils/token.util.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenUserPayload;
    }
  }
}

export {};
