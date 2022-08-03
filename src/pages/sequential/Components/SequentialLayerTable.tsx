import { MenuOutlined } from "@ant-design/icons";
import { arrayMoveImmutable, EditableProTable, ProColumns } from "@ant-design/pro-components";
import React, { Component } from "react";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { request } from "umi";
import "../drag.less";

interface DataType {
  key: any,
  type: string,
  outputChannels: number,
  id: number
}

interface IState {
  dataSource: DataType[],
  editableKeys: React.Key[],
}

class SequentialLayerTable extends Component<any, IState> {
  static DragHandle: any = SortableHandle(() => <MenuOutlined style={{ cursor: "grab", color: "#999" }}/>);
  static SortableItem: any = SortableElement((props: any) => <tr {...props} />);
  static SortContainer: any = SortableContainer((props: any) => <tbody {...props} />);
  static columns: ProColumns[] = [
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
      key: "type",
      width: 150,
      dataIndex: "type",
      className: "drag-visible"
    },
    {
      title: "输出",
      key: "outputChannels",
      width: 50,
      editable: (text, record, index) => record.outputChannels !== -1,
      dataIndex: "outputChannels"
    },
    {
      title: "选项",
      key: "option",
      editable: false,
      render: (text, record, _, action) => <a
        key="editable"
        onClick={() => { action?.startEditable?.(record.id); }}>
        编辑
      </a>
    }
  ];

  constructor(props: any) {
    super(props);
    this.state = { dataSource: [], editableKeys: [] };
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
    // function findIndex base on Table rowKey props and should always be a right array id
    const id = this.state.dataSource.findIndex((x) => x.id === restProps["data-row-key"]);
    return <SequentialLayerTable.SortableItem index={id} {...restProps}/>;
  };

  render() {
    return (
      <EditableProTable
        rowKey="id"
        headerTitle="可编辑表格"
        maxLength={5}
        scroll={{ x: 960 }}
        recordCreatorProps={{
          position: "bottom",
          record: () => ({ id: (Math.random() * 1000000).toFixed(0) })
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
        columns={SequentialLayerTable.columns}
        search={false}
        pagination={false}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const response = await request("/server/api/Sequential/All", { method: "post" });
          return {
            data: response,
            success: true//TODO here
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


