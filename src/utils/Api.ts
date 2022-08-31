import { request } from "@@/plugin-request/request";

class Api {
  static Sequential = "/server/api/Sequential";

  static async SequentialGet<T = any>(route: string, params?: {}): Promise<T> {
    return await request(`${Api.Sequential}/${route}`,
      {
        method: "get",
        params: params
      });
  }

  static async SequentialPost<T = any>(route: string, data?: {}): Promise<T> {
    return await request(`${Api.Sequential}/${route}`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: data
      });
  }

  static async SequentialPut<T = any>(route: string, data?: {}): Promise<T> {
    return await request(`${Api.Sequential}/${route}`,
      {
        method: "put",
        headers: { "Content-Type": "application/json" },
        data: data
      });
  }
}

export default Api;
