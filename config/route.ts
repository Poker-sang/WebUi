export default [
  {
    icon: "home",
    path: "/",
    name: "训练相关",
    component: "@/pages/layouts/BasicLayout",
    routes: [
      {
        path: "/train",
        name: "网络训练",
        component: "@/pages/train/TrainStepForm"
      },
      {
        path: "/sequential",
        name: "序列管理",
        component: "@/pages/layouts/EmptyLayout",
        routes: [
          {
            path: "/sequential",
            component: "@/pages/sequential/SequentialManager"
          },
          {
            path: "/sequential/edit",
            title: "编辑",
            component: "@/pages/sequential/SequentialEditForm"
          },
          {
            path: "/sequential/layer/edit",
            title: "编辑层",
            component: "@/pages/sequential/LayerEditForm"
          }
        ]
      }
    ]
  }
];
