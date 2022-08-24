import Path from "../src/utils/Path";

export default [
  {
    icon: "home",
    path: Path.Home,
    name: "训练相关",
    component: "@/pages/layouts/BasicLayout",
    routes: [
      {
        path: Path.Train,
        name: "网络训练",
        component: "@/pages/train/TrainStepForm"
      },
      {
        path: Path.Sequential,
        name: "序列管理",
        component: "@/pages/layouts/EmptyLayout",
        routes: [
          {
            path: Path.Sequential,
            component: "@/pages/sequential/SequentialManager"
          },
          {
            path: Path.SequentialEdit(),
            title: "编辑",
            component: "@/pages/sequential/SequentialEditForm"
          },
          {
            path: Path.LayerEdit(),
            title: "编辑层",
            component: "@/pages/sequential/LayerEditForm"
          }
        ]
      }
    ]
  }
];
