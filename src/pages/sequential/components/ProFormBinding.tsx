import { ProFormDependency, ProFormGroup, ProFormSwitch, ProFormText } from "@ant-design/pro-components";
import { Component } from "react";

interface IProp {
  datum: {
    name: string,
    isBinding: boolean,
    value: any
  },
  type: string,
}

class ProFormBinding extends Component <IProp> {
  constructor(props: IProp) {
    super(props);
  }

  render() {
    return <ProFormGroup label={`${this.props.datum.name} - ${this.props.type}`}>
      <ProFormSwitch checkedChildren="绑定" unCheckedChildren="默认"
                     name={`${this.props.datum.name}bindingMode`}
                     initialValue={this.props.datum.isBinding}/>
      <ProFormDependency name={[`${this.props.datum.name}bindingMode`]}>
        {(switchData) => {
          let mode = false;
          for (let key in switchData)
            mode = switchData[key];
          return mode
            ? <ProFormText
              name={`${this.props.datum.name}binding`}
              placeholder={"请输入绑定参数名"}
              rules={[{ required: true }]}
              initialValue={this.props.datum.isBinding ? this.props.datum.value : undefined}/>
            : this.props.children;
        }}
      </ProFormDependency>
    </ProFormGroup>;
  }
}


export default ProFormBinding;
