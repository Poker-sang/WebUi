export default [
  {
    path: "/",
    name: "训练相关",
    component: "@/layouts/basicLayout",
    routes: [
      {
        path: "/train",
        name: "网络训练",
        component: "@/pages/train/TrainStepForm"
      }
    ]
  }, {
    path: "/s",
    name: "Lorem ipsum",
    component: "@/layouts/basicLayout",
    routes: [
      {
        path: "/users",
        name: "userIndex",
      }
    ]
  }
];
