import { FormInstance, ProForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Space } from "antd";
import React, { Component } from "react";
import SequentialLayerTable from "./Components/SequentialLayerTable";
import { request } from "umi";


class SequentialEditForm extends Component <any, { remark: string }> {
  params: URLSearchParams = new URL(location.toString()).searchParams;
  name: string | null = this.params.get("name");
  formRef = React.createRef<FormInstance>();

  constructor(props: any) {
    super(props);
    this.state = { remark: "" };
  }

  async componentDidMount() {
    if (this.name === null)
      return;
    const res = await request("/server/api/Sequential/Find", {
      method: "post",
      params: {
        name: this.name,
        property: "Remark"
      }
    });
    this.setState({ remark: res });
    this.formRef.current?.resetFields();
  }

  render() {
    return <Space direction="vertical">
      <ProForm<{ name: string, remark: string }>
        formRef={this.formRef}>
        <ProFormText
          width="md"
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
      <SequentialLayerTable/>
    </Space>;
  }
}

export default SequentialEditForm;
