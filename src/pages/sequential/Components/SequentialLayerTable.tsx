import { MenuOutlined } from "@ant-design/icons";
import { arrayMoveImmutable, EditableProTable, ProColumns } from "@ant-design/pro-components";
import React, { Component } from "react";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { request } from "umi";
import { Space } from "antd";
import "../drag.less";

interface DataType {
  key: number,
  name: string,
  outputChannels: number | string | null
  kernelSize: number | string | null
}

interface IState {
  dataSource: DataType[],
  editableKeys: React.Key[],
}

interface IProp {
  sequentialName: string;
}

class SequentialLayerTable extends Component<any, IState> {
  static DragHandle: any = SortableHandle(() => <MenuOutlined style={{ cursor: "grab", color: "#999" }}/>);
  static SortableItem: any = SortableElement((props: any) => <tr {...props} />);
  static SortContainer: any = SortableContainer((props: any) => <tbody {...props} />);
  columns: ProColumns[] = [
    {
      title: "排序",
      key: "sort",
      dataIndex: "sort",
      width: 60,
      className: "drag-visible",
      editable: false,
      render: () => <SequentialLayerTable.DragHandle/>
    },
    {
      title: "类型",
      key: "name",
      width: 150,
      dataIndex: "name",
      editable: false,
      className: "drag-visible"
    },
    {
      title: "输出",
      key: "outputChannels",
      width: 100,
      editable: (text, record: DataType, index) => record.outputChannels !== "*" && record.outputChannels !== null,
      dataIndex: "outputChannels"
    },
    {
      title: "卷积核",
      key: "kernelSize",
      width: 120,
      editable: (text, record: DataType, index) => record.kernelSize !== "*" && record.kernelSize !== null,
      dataIndex: "kernelSize"
    },
    {
      title: "选项",
      key: "option",
      valueType: "option",
      render: (text, record: DataType, _, action) =>
        <Space>
          <a
            key="editable"
            onClick={() => { action?.startEditable?.(record.key); }}>
            编辑
          </a>
          <a
            key="delete"
            onClick={() => {
              this.setState({ dataSource: this.state.dataSource.filter((item) => item.key !== record.key) });
            }}>
            删除
          </a>
        </Space>
    }
  ];

  constructor(props: IProp) {
    super(props);
    this.state = {
      dataSource: [], editableKeys: []
    };
  }

  onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    if (oldIndex !== newIndex)
      this.setState({
        dataSource: [
          ...arrayMoveImmutable([...this.state.dataSource], oldIndex, newIndex).filter((el) => !!el)
        ]
      });
  };

  DraggableContainer =
    (props: any) => <SequentialLayerTable.SortContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}/>;

  DraggableBodyRow = (props: any) => {
    const { className, style, ...restProps } = props;
    // function findIndex base on Table rowKey props and should always be a right array key
    const key = this.state.dataSource.findIndex((x) => x.key === restProps["data-row-key"]);
    return <SequentialLayerTable.SortableItem index={key} {...restProps}/>;
  };

  render() {
    return (
      <EditableProTable
        rowKey="key"
        headerTitle="可编辑表格"
        recordCreatorProps={{
          position: "bottom",
          record: () => ({ key: (Math.random() * 1000000).toFixed(0) })
        }}
        loading={false}
        value={this.state.dataSource}
        onChange={(dataSource: any) => this.setState({ dataSource: dataSource })}
        editable={{
          type: "multiple",
          editableKeys: this.state.editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
          },
          onChange: (editableKeys) => this.setState({ editableKeys: editableKeys })
        }}
        columns={this.columns}
        search={false}
        pagination={false}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const response: [] = await request("/server/api/Sequential/Layers/All",
            {
              method: "post",
              params: {
                sequentialName: this.props.sequentialName
              }
            });
          return {
            data: response,//need key
            success: response.length !== 0 //TODO here
          };
        }}
        components={{
          body: {
            wrapper: this.DraggableContainer,
            row: this.DraggableBodyRow
          }
        }}/>
    );
  }
}

export default SequentialLayerTable;


