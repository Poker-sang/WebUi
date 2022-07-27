export default [
  {
    icon: "home",
    path: "/",
    name: "训练相关",
    component: "@/layouts/basicLayout",
    routes: [
      {
        path: "/train",
        name: "网络训练",
        component: "@/pages/train/TrainStepForm"
      },
      {
        path: "/sequential",
        name: "序列管理",
        component: "@/pages/sequential/SequentialManager"
      }
    ]
  }, {
    path: "/s",
    name: "Lorem ipsum",
    component: "@/layouts/basicLayout",
    routes: [
      {
        path: "/users",
        name: "userIndex"
      }
    ]
  }
];
