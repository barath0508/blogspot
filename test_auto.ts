import { publishTrendingPost } from "./lib/automation/autoPublisher";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

publishTrendingPost()
  .then(res => console.log("Success:", res))
  .catch(err => console.error("Error:", err));
