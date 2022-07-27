import { defineConfig } from "umi";
import routes from "./route";

export default defineConfig({
  nodeModulesTransform: {
    type: "none"
  },
  routes: routes,
  layout: {
    name: "神经网络",
    // 拂晓蓝
    primaryColor: "#1890ff",
    layout: "mix",
    contentWidth: "Fluid",
    fixedHeader: false,
    fixSiderbar: true
  },
  mfsu: {},
  fastRefresh: {}
});
