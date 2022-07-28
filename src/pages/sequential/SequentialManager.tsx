import type { ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button } from "antd";
import { Component } from "react";
import request from "umi-request";

export type TableListItem = {
  key: number;
  name: string;
  layers: number;
  usedCount: number;
  createdAt: number;
  remark: string;
};


const columns: ProColumns<TableListItem>[] = [
  {
    title: "序列名称",
    width: 100,
    key: "name",
    dataIndex: "name",
    render: (_) => <a>{_}</a>,
    sorter: (a, b) => a.name.localeCompare(b.name)
  },
  {
    title: "层数",
    width: 80,
    key: "layers",
    dataIndex: "layers",
    align: "right",
    sorter: (a, b) => a.layers - b.layers
  },
  {
    title: "使用数",
    width: 80,
    key: "usedCount",
    dataIndex: "usedCount",
    align: "right",
    sorter: (a, b) => a.usedCount - b.usedCount
  },
  {
    title: "创建时间",
    width: 100,
    key: "createdAt",
    dataIndex: "createdAt",
    valueType: "date",
    sorter: (a, b) => a.createdAt - b.createdAt
  },
  {
    title: "备注",
    key: "remark",
    dataIndex: "remark",
    ellipsis: true,
    copyable: true
  },
  {
    title: "操作",
    width: 180,
    key: "option",
    valueType: "option",
    render: () => [
      <a key="link">链路</a>,
      <a key="link2">报警</a>,
      <a key="link3">监控</a>,
      <TableDropdown
        key="actionGroup"
        menus={[
          {key: "copy", name: "复制"},
          {key: "delete", name: "删除"}
        ]}/>
    ]
  }
];

class SequentialManager extends Component {
  render() {
    return <ProTable<TableListItem>
      columns={columns}
      request={async (params, sorter, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        console.log(params, sorter, filter);
        const response: TableListItem[] = await request("/server/api/WeatherForecast", {method: "get"});
        console.log(response);
        return {
          data: response,
          success: true
        };
      }}
      rowKey="key"
      pagination={{showQuickJumper: true}}
      search={{optionRender: false, collapsed: false}}
      dateFormatter="string"
      headerTitle="表格标题"
      toolBarRender={() => [
        <Button key="showLog">查看日志</Button>,
        <Button key="output">导出数据</Button>,
        <Button type="primary" key="primary">
          新建序列
        </Button>
      ]}
    />;
  }
}

export default SequentialManager;
