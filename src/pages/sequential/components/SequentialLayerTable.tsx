import {
  ActionType,
  arrayMoveImmutable,
  ModalForm,
  ProColumns,
  ProFormDependency,
  ProFormGroup,
  ProFormSelect,
  ProFormSwitch,
  ProTable
} from "@ant-design/pro-components";
import React, { Component } from "react";
import { Link } from "umi";
import { Button, Space } from "antd";
import "./drag.less";
import { OptParam } from "@/pages/sequential/types/kernel";
import Path from "@/utils/Path";
import { MenuOutlined } from "@ant-design/icons";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import Api from "@/utils/Api";

interface DataType {
  key: number,
  type: "normal" | "sequential",
  name: string,
  outputChannels: [] | OptParam,
  kernelSize: [] | OptParam,
  stride: [] | OptParam
}

interface IState {
  tableSource: DataType[],
  editableKeys: React.Key[],
}

interface IProp {
  sequentialName?: string;
}

class SequentialLayerTable extends Component<IProp, IState> {
  static DragHandle: any = SortableHandle(() => <MenuOutlined style={{ cursor: "grab", color: "#999" }}/>);
  static SortableItem: any = SortableElement((props: any) => <tr {...props} />);
  static SortContainer: any = SortableContainer((props: any) => <tbody {...props} />);
  ref = React.createRef<ActionType>();
  dataSource: [][] = [];

  constructor(props: IProp) {
    super(props);
    this.state = { tableSource: [], editableKeys: [] };
  }

  onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
    if (oldIndex !== newIndex)
      this.setState({
        tableSource: [
          ...arrayMoveImmutable([...this.state.tableSource], oldIndex, newIndex).filter((el) => !!el)
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
    const key = this.state.tableSource.findIndex((x) => x.key === restProps["data-row-key"]);
    return <SequentialLayerTable.SortableItem index={key} {...restProps}/>;
  };

  paramRender = (dom: React.ReactNode, data: [] | OptParam) =>
    typeof data === "string"
      ? <span style={{ color: "red" }}>{dom}</span>
      : dom?.toString();

  columns: ProColumns<DataType>[] = [
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
      render: (dom, rowData) => rowData.type === "sequential" ? dom : <strong>{dom}</strong>,
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
              pathname: Path.LayerEdit(this.props.sequentialName, rowData.key),
              state: { dataSource: this.dataSource[rowData.key] }
            }}>
            编辑
          </Link>
          <a
            key="delete"
            onClick={() => {
              this.setState({ tableSource: this.state.tableSource.filter(item => item.key !== rowData.key) });
            }}>
            删除
          </a>
        </Space>
    }
  ];

  async componentDidMount() {
    if (this.props.sequentialName === undefined)
      return;
    const response = await Api.SequentialGet<DataType[]>("Layers", { sequentialName: this.props.sequentialName });
    this.dataSource = await Api.SequentialGet<[][]>("Layers/Edit", { sequentialName: this.props.sequentialName });
    this.setState({ tableSource: response });
    //this.ref.current?.reload();
  }

  render() {
    return <ProTable
      rowKey="key"
      headerTitle="包含层"
      loading={false}
      actionRef={this.ref}
      dataSource={this.state.tableSource}
      columns={this.columns}
      search={false}
      pagination={false}
      toolBarRender={() => {
        return [
          <ModalForm<{ bindingMode: boolean, builtin?: string, sequential?: string }>
            title="选择层类型"
            trigger={<Button>添加一行</Button>}
            onFinish={async (values) => {
              const response = await Api.SequentialGet<{ desc: DataType, params: [] }>("Layers/Default", {
                layerName: values.bindingMode ? values.builtin : values.sequential
              });
              response.desc.key = this.state.tableSource[this.state.tableSource.length - 1].key + 1;
              const ts = this.state.tableSource.concat(response.desc);
              this.dataSource.push(response.params);
              this.setState({ tableSource: ts });
              return true;
            }}>
            <ProFormGroup>
              <ProFormSwitch checkedChildren="自定义序列" unCheckedChildren="框架内置层"
                             name={"bindingMode"} initialValue={false}/>
              <ProFormDependency name={["bindingMode"]}>
                {switchData => {
                  let mode = false;
                  for (let key in switchData)
                    mode = switchData[key];
                  return mode
                    ? <ProFormSelect
                      name="builtin"
                      width="md"
                      rules={[{ required: true }]}
                      request={async () => await Api.SequentialGet("Layers/All")}/>
                    : <ProFormSelect
                      name="sequential"
                      width="md"
                      rules={[{ required: true }]}
                      request={async () => await Api.SequentialGet("Layers/New")}/>;
                }}
              </ProFormDependency>
            </ProFormGroup>
          </ModalForm>,
          <Button type="primary" onClick={async () => {
            await Api.SequentialPost("", this.dataSource);
          }}>提交</Button>
        ];
      }}
      components={{
        body: {
          wrapper: this.DraggableContainer,
          row: this.DraggableBodyRow
        }
      }}></ProTable>;
  }
}

export default SequentialLayerTable;


