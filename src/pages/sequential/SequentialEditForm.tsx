import { FormInstance, ProForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Row, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { Component } from "react";
import SequentialLayerTable from "./components/SequentialLayerTable";
import Api from "@/utils/Api";
import { KeepAlive } from "umi";

interface IState {
  remark: string,
  tableSource: DataType[]
}

interface DataType {
  key: number | "*",
  name: string,
  type: string,
  remark: string | null,
  default: string | null
}

class SequentialEditForm extends Component <any, IState> {
  name?: string;
  formRef = React.createRef<FormInstance>();
  columns: ColumnsType<DataType> = [
    {
      title: "$",
      width: 30,
      dataIndex: "key",
      key: "key"
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type"
    },
    {
      title: "默认值",
      dataIndex: "default",
      key: "default",
      render: dom => dom?.toString()
    }];


  constructor(props: any) {
    super(props);
    this.name = this.props.match.params.name;
    this.state = { remark: "", tableSource: [] };
  }

  async componentDidMount() {
    if (this.name === undefined)
      return;
    const resForm = await Api.SequentialGet<string>("Find/Metadata", {
      sequentialName: this.name,
      metadataName: "Remark"
    });

    const resTable = await Api.SequentialGet<DataType[]>("Params", { sequentialName: this.name });
    resTable.unshift({ key: "*", name: "InputChannels", type: "Int64", remark: null, default: null });


    this.setState({ remark: resForm, tableSource: resTable });
    this.formRef.current?.resetFields();
  }

  render() {
    return <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Row gutter={32}>
        <Col span={12}>
          <ProForm<{ name: string, remark: string }>
            formRef={this.formRef}>
            <ProFormText
              name="name"
              label="名称"
              initialValue={this.name}
              tooltip="最长为 32 位，用于标定的唯一id"
              placeholder="请输入名称"/>
            <ProFormTextArea
              name="remark"
              label="备注"
              placeholder="请输入备注"
              initialValue={this.state.remark}/>
          </ProForm>
        </Col>
        <Col span={12}>
          <Table
            title={() => "参数列表"}
            dataSource={this.state.tableSource}
            columns={this.columns}
            pagination={false}
            size="small"
            rowKey="key"/>
        </Col>
      </Row>
      {/*@ts-ignore*/}
      <KeepAlive>
        <SequentialLayerTable sequentialName={this.name}/>
      </KeepAlive>
    </Space>;
  }
}

export default SequentialEditForm;
