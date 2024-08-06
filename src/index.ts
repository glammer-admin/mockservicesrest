import { serve } from "bun";
import { handleRequest } from "./routes";

serve({
  port: 3000,
  fetch(req) {
    return handleRequest(req);
  },
});
