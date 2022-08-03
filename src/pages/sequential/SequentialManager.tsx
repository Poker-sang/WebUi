import { ProColumns, ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button } from "antd";
import { Component } from "react";
import { Link } from "umi";
import request from "umi-request";

type SequentialInfo = {
  key: number;
  name: string;
  layers: number;
  usedCount: number;
  createdAt: number;
  remark: string;
};

class SequentialManager extends Component {
  static columns: ProColumns<SequentialInfo>[] = [
    {
      title: "序列名称",
      width: 100,
      key: "name",
      dataIndex: "name",
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
      render: (_, record) => [
        <Link key="edit" to={{
          pathname: "/sequential/edit",
          query: {
            name: record.name
          }
        }}>编辑</Link>,
        <a key="link2">报警</a>,
        <a key="link3">监控</a>,
        <TableDropdown
          key="actionGroup"
          menus={[
            { key: "copy", name: "复制" },
            { key: "delete", name: "删除" }
          ]}/>
      ]
    }
  ];

  render() {
    return <ProTable<SequentialInfo>
      columns={SequentialManager.columns}
      request={async (params, sorter, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        const response: SequentialInfo[] = await request("/server/api/Sequential/All", { method: "post" });
        return {
          data: response,
          success: true
        };
      }}
      rowKey="key"
      pagination={{ showQuickJumper: true }}
      search={{ optionRender: false, collapsed: false }}
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
