import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Variables required to read from the edge config
const edgeConfigReadEnv = createEnv({
  server: {
    EDGE_CONFIG: z.string().url(),
  },
  runtimeEnv: {
    EDGE_CONFIG: process.env.EDGE_CONFIG,
  },
});

export default edgeConfigReadEnv;
