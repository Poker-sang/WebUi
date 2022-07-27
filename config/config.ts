import { defineConfig } from "umi";
import routes from "./route";

export default defineConfig({
  nodeModulesTransform: {
    type: "none"
  },
  routes: routes,
  mfsu: {},
  fastRefresh: {}
});
