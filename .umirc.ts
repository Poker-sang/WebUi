import { defineConfig } from '@umijs/max';
import Path from './src/utils/Path';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '神经网络',
  },
  theme: {
    'border-radius-base': '5px',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
    {
      path: Path.Train,
      name: '网络训练',
      component: './Train/TrainStep',
    },
    {
      path: Path.Sequential,
      name: '序列管理',
      component: './Sequential/SequentialManager',
    },
    {
      path: Path.SequentialEdit(),
      component: './Sequential/SequentialEdit',
    },
    {
      path: Path.LayerEdit(),
      component: './Sequential/LayerEdit',
    },
    {
      path: Path.SequentialNew,
      component: './Sequential/SequentialEdit',
    },
  ],
  npmClient: 'pnpm',
  proxy: {
    '/server': {
      target: 'https://localhost:7251/',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
      secure: false,
    },
  },
});
