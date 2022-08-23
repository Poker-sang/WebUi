import { ActionType, DragSortTable, ProColumns } from "@ant-design/pro-components";
import React, { Component } from "react";
import { Link, request } from "umi";
import { Space } from "antd";
import "../drag.less";
import { OptParam } from "@/pages/sequential/types/kernel";

interface DataType {
  key: number,
  type: "normal" | "sequential",
  name: string,
  outputChannels: [] | OptParam,
  kernelSize: [] | OptParam,
  stride: [] | OptParam
}

interface IState {
  dataSource: DataType[],
  editableKeys: React.Key[],
}

interface IProp {
  sequentialName: string | null;
}

class SequentialLayerTable extends Component<IProp, IState> {
  ref = React.createRef<ActionType>();

  constructor(props: IProp) {
    super(props);
    this.state = { dataSource: [], editableKeys: [] };
  }

  paramRender = (dom: React.ReactNode, data: [] | OptParam) =>
    typeof data === "string"
      ? <span style={{ color: "red" }}>{dom}</span>
      : dom?.toString();

  columns: ProColumns<DataType>[] = [
    {
      title: "排序",
      width: 50,
      dataIndex: "sort",
      render: (dom, rowData, index) => <span className="customRender">{index}</span>
    },
    {
      title: "类型",
      key: "name",
      width: 150,
      dataIndex: "name",
      render: (dom, rowData) => rowData.type === "sequential" ? <strong>{dom}</strong> : dom,
      className: "drag-visible"
    },
    {
      title: "输出",
      key: "outputChannels",
      width: 80,
      dataIndex: "outputChannels",
      render: (dom, rowData) => this.paramRender(dom, rowData.outputChannels)
    },
    {
      title: "卷积核",
      key: "kernelSize",
      width: 100,
      dataIndex: "kernelSize",
      render: (dom, rowData) => this.paramRender(dom, rowData.kernelSize)
    },
    {
      title: "Stride",
      key: "stride",
      width: 100,
      dataIndex: "stride",
      render: (dom, rowData) => this.paramRender(dom, rowData.stride)
    },
    {
      title: "包含参数",
      key: "containsParams",
      width: 150,
      dataIndex: "containsParams",
      render: dom => dom?.toString()
    },
    {
      title: "选项",
      key: "option",
      dataIndex: "option",
      render: (dom, rowData) =>
        <Space>
          <Link
            key="edit"
            to={{
              pathname: "/sequential/layer/edit",
              query: {
                name: this.props.sequentialName,
                index: rowData.key
              }
            }}>
            编辑
          </Link>
          <a
            key="delete"
            onClick={() => {
              this.setState({ dataSource: this.state.dataSource.filter(item => item.key !== rowData.key) });
            }}>
            删除
          </a>
        </Space>
    }
  ];

  async componentDidMount() {
    if (this.props.sequentialName === null)
      return;
    const response: [] = await request("/server/api/Sequential/Layers",
      {
        method: "post",
        params: { sequentialName: this.props.sequentialName }
      });
    this.setState({ dataSource: response });
    this.ref.current?.reload();
  }

  render() {
    return <DragSortTable
      rowKey="key"
      headerTitle="包含层"
      loading={false}
      actionRef={this.ref}
      dataSource={this.state.dataSource}
      columns={this.columns}
      dragSortKey="sort"
      search={false}
      onDragSortEnd={newDataSource => { this.setState({ dataSource: newDataSource }); }}
      pagination={false}/>;
  }
}

export default SequentialLayerTable;


