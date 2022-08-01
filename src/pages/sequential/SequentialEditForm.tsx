import { ProForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Modal } from "antd";
import { Component } from "react";
import SequentialLayerTable from "./SequentialLayerTable";

interface IProp {
  record: string,
  remark: string
}

interface IState {
  visible: boolean;
}

class SequentialEditForm extends Component<IProp, IState> {
  constructor(props: IProp) {
    super(props);
    this.state = {visible: false};
  }

  close = () => this.setState({visible: false});

  render() {
    return <>
      <a onClick={() => this.setState({visible: true})}>{this.props.children}</a>
      <Modal
        title={`修改表单：${this.props.record}`}
        width={800}
        visible={this.state.visible}
        onCancel={() => this.close()}
        onOk={() => this.close()}>
        <ProForm<{ name: string, remark: string }>>
          <ProFormText
            width="md"
            name="name"
            label="名称"
            initialValue={this.props.record}
            tooltip="最长为 64 位，用于标定的唯一id"
            placeholder="请输入名称"/>
          <ProFormTextArea
            name="remark"
            label="备注"
            placeholder="请输入备注"
            initialValue={this.props.remark}/>
        </ProForm>
        <SequentialLayerTable/>
      </Modal>
    </>;
  }
}

export default SequentialEditForm;
