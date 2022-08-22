import { defineConfig } from "umi";
import routes from "./route";
import proxy from "./proxy";

export default defineConfig({
  nodeModulesTransform: {
    type: "none"
  },
  proxy: proxy,
  routes: routes,
  mfsu: {},
  // dva: {},
  fastRefresh: {}
});
