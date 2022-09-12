import { request } from 'umi';

class Api {
  static Sequential = '/server/api/Sequential';

  static async SequentialGet<T = any>(route: string, params?: any): Promise<T> {
    return await request(`${Api.Sequential}/${route}`, {
      method: 'get',
      params: params,
    });
  }

  static async SequentialPost<T = any>(route: string, data?: any): Promise<T> {
    return await request(`${Api.Sequential}/${route}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: data,
    });
  }

  static async SequentialPut<T = any>(
    route: string,
    params?: any,
    data?: any,
  ): Promise<T> {
    return await request(`${Api.Sequential}/${route}`, {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: data,
    });
  }

  static async SequentialDelete<T = any>(
    route: string,
    params?: any,
  ): Promise<T> {
    return await request(`${Api.Sequential}/${route}`, {
      method: 'delete',
      params: params,
    });
  }
}

export default Api;
