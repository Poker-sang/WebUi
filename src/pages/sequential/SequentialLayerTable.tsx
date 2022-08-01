import { MenuOutlined } from "@ant-design/icons";
import { arrayMoveImmutable, EditableProTable, ProColumns, ProFormRadio } from "@ant-design/pro-components";
import React, { Component } from "react";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import "./drag.less";

interface DataType {
  key: any,
  type: string,
  outputChannels: number,
  id: number
}

const data: DataType[] = [
  {
    key: "1",
    type: "John Brown",
    outputChannels: 32,
    id: 0
  },
  {
    key: "2",
    type: "Jim Green",
    outputChannels: -1,
    id: 1
  },
  {
    key: "3",
    type: "Joe Black",
    outputChannels: 32,
    id: 2
  }
];

interface IState {
  dataSource: DataType[],
  editableKeys: React.Key[],
  position: "top" | "bottom" | "hidden"
}


class SequentialLayerTable extends Component<{}, IState> {
  DragHandle: any = SortableHandle(() => <MenuOutlined style={{cursor: "grab", color: "#999"}}/>);
  columns: ProColumns[] = [
    {
      title: "排序",
      key: "sort",
      dataIndex: "sort",
      width: 60,
      className: "drag-visible",
      editable: false,
      render: () => <this.DragHandle/>
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
      render: (text, record, _, action) => <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}>
        编辑
      </a>
    }
  ];
  SortableItem: any = SortableElement((props: any) => <tr {...props} />);
  SortContainer: any = SortableContainer((props: any) => <tbody {...props} />);

  constructor(props: any) {
    super(props);
    this.state = {dataSource: data, editableKeys: [], position: "bottom"};
  }

  onSortEnd = ({oldIndex, newIndex}: { oldIndex: number; newIndex: number }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable([...this.state.dataSource], oldIndex, newIndex).filter(
        (el) => !!el
      );
      this.setState({dataSource: [...newData]});
    }
  };

  DraggableContainer =
    (props: any) => <this.SortContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />;

  DraggableBodyRow = (props: any) => {
    const {className, style, ...restProps} = props;
    // function findIndex base on Table rowKey props and should always be a right array id
    const id = this.state.dataSource.findIndex((x) => x.id === restProps["data-row-key"]);
    return <this.SortableItem index={id} {...restProps} />;
  };

  render() {
    return (
      <EditableProTable
        rowKey="id"
        headerTitle="可编辑表格"
        maxLength={5}
        scroll={{x: 960}}
        recordCreatorProps={
          this.state.position !== "hidden"
            ? {
              position: this.state.position as "top",
              record: () => ({id: (Math.random() * 1000000).toFixed(0)})
            }
            : false
        }
        loading={false}
        toolBarRender={() => [
          <ProFormRadio.Group
            key="render"
            fieldProps={{
              value: this.state.position,
              onChange: (e) => this.setState({position: e.target.value})
            }}
            options={[
              {
                label: "添加到顶部",
                value: "top"
              },
              {
                label: "添加到底部",
                value: "bottom"
              },
              {
                label: "隐藏",
                value: "hidden"
              }
            ]}
          />
        ]}
        value={this.state.dataSource}
        onChange={(dataSource: any) => this.setState({dataSource: dataSource})}
        editable={{
          type: "multiple",
          editableKeys: this.state.editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
          },
          onChange: (editableKeys) => this.setState({editableKeys: editableKeys})
        }}
        columns={this.columns}
        search={false}
        pagination={false}
        dataSource={this.state.dataSource}
        components={{
          body: {
            wrapper: this.DraggableContainer,
            row: this.DraggableBodyRow
          }
        }}
      />
    );
  }
}

export default SequentialLayerTable;


