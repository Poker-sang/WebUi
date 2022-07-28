export default {
  "/server": {
    target: "https://localhost:7251/",
    changeOrigin: true,
    pathRewrite: {"^/server": ""},
    secure: false
  }
};
