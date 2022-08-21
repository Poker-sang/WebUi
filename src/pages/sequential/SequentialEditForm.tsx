import { FormInstance, ProForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Row, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { Component } from "react";
import SequentialLayerTable from "./components/SequentialLayerTable";
import { request } from "umi";

interface IState {
  remark: string,
  tableSource: DataType[]
}

interface DataType {
  key: number | "*",
  name: string,
  type: string
}

class SequentialEditForm extends Component <any, IState> {
  params: URLSearchParams = new URL(location.toString()).searchParams;
  name: string | null = this.params.get("name");

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
    }];

  constructor(props: any) {
    super(props);
    this.state = { remark: "", tableSource: [] };
  }

  async componentDidMount() {
    if (this.name === null)
      return;
    const resForm = await request("/server/api/Sequential/Find/Property", {
      method: "post",
      params: {
        sequentialName: this.name,
        propertyName: "Remark"
      }
    });

    const resTable: DataType[] = await request("/server/api/Sequential/Params",
      {
        method: "post",
        params: { sequentialName: this.name }
      });
    resTable.unshift({ key: "*", name: "InputChannels", type: "Int64" });

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
      <SequentialLayerTable sequentialName={this.name}/>
    </Space>;
  }
}

export default SequentialEditForm;
