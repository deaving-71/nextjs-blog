import cors from "cors";
import { config } from "#config/cors";

export default () => {
  return cors(config);
};
