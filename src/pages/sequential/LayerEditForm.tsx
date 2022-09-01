import {
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormGroup,
  ProFormSelect,
  ProFormSwitch
} from "@ant-design/pro-components";
import { Component } from "react";
import { message } from "antd";
import ProFormBinding from "./components/ProFormBinding";
import Api from "@/utils/Api";

interface DataType {
  name: string,
  type: string,
  isBinding: boolean,
  value: any
}

interface ParamType {
  key: number,
  name: string | null,
  type: string | null
}


const intDefaultProps: {
  width: "sm"
  min: number
  fieldProps: { precision: 0 },
  rules: [{ required: true }]
} = {
  width: "sm",
  min: 0,
  fieldProps: { precision: 0 },
  rules: [{ required: true }]
};

class LayerEditForm extends Component<any> {
  name: string;
  index: number;
  dict = new Map<number, string | null>;

  constructor(props: any) {
    super(props);
    this.name = this.props.match.params.name;
    this.index = this.props.match.params.index;
  }

  async componentDidMount() {
    const resTable = await Api.SequentialGet<ParamType[]>("Params", { sequentialName: this.name });
    resTable.unshift({ key: -1, name: "InputChannels", type: "Int64" });
    resTable.unshift({ key: -2, name: null, type: null });
    resTable.map(value => this.dict.set(value.key, value.name));
  }

  render() {
    return <ProForm
      title={this.name ?? undefined}
      autoFocusFirstInput={true}
      onFinish={async values => {
        message.success("提交成功");
        return true;
      }}>
      {this.props.history.location.state.dataSource.map((datum: DataType, index: number) => {
        const initValue = datum.isBinding ? undefined : datum.value;
        if (datum.isBinding)
          datum.value = this.dict.get(datum.value);
        switch (datum.type) {
          case "Boolean":
            return <ProFormBinding key={index} datum={datum} type={"布尔"}>
              <ProFormSwitch name={datum.name} rules={[{ required: true }]} initialValue={initValue}
                             checkedChildren="是" unCheckedChildren="否"/>
            </ProFormBinding>;
          case "Double":
            return <ProFormBinding key={index} datum={datum} type={"小数"}>
              <ProFormDigit name={datum.name} width="sm" min={0} fieldProps={{ precision: 10 }}
                            rules={[{ required: true }]} initialValue={initValue}/>
            </ProFormBinding>;
          case "Int64":
            return <ProFormBinding key={index} datum={datum} type={"整数"}>
              <ProFormDigit name={datum.name} {...intDefaultProps} initialValue={initValue}/>
            </ProFormBinding>;
          case "Rect":
            return <ProFormBinding key={index} datum={datum} type={"两个整数"}>
              <ProFormGroup>
                <ProFormDigit name={`${datum.name}1`} {...intDefaultProps} initialValue={initValue?.[0]}/>
                <ProFormDigit name={`${datum.name}2`} {...intDefaultProps} initialValue={initValue?.[1]}/>
              </ProFormGroup>
            </ProFormBinding>;
          case "PaddingModes":
            return <ProFormBinding key={index} datum={datum} type={"枚举"}>
              <ProFormSelect
                name={datum.name}
                valueEnum={{
                  0: "Zeros",
                  1: "Reflect",
                  2: "Replicate",
                  3: "Circular",
                  4: "Constant"
                }}
                rules={[{ required: true }]}
                initialValue={initValue?.toString()}/>
            </ProFormBinding>;
          case "PaddingType":
            let isRect = true;
            if (typeof datum.value === "number")
              isRect = false;
            return <ProFormBinding key={index} datum={datum} type={"两个整数或枚举"}>
              <ProFormSwitch name={`${datum.name}mode`} initialValue={isRect}
                             checkedChildren="Rect" unCheckedChildren="枚举"/>
              <ProFormDependency name={[`${datum.name}mode`]}>
                {switchData => {
                  let mode = false;
                  for (let key in switchData)
                    mode = switchData[key];
                  return mode
                    ? <ProFormGroup>
                      <ProFormDigit
                        name={`${datum.name}rect1`}
                        {...intDefaultProps}
                        initialValue={isRect ? initValue?.[0] : 0}/>
                      <ProFormDigit
                        name={`${datum.name}rect2`}
                        {...intDefaultProps}
                        initialValue={isRect ? initValue?.[1] : 0}/>
                    </ProFormGroup>
                    : <ProFormSelect
                      name={`${datum.name}enum`}
                      valueEnum={{
                        0: "Valid",
                        1: "Same"
                      }}
                      rules={[{ required: true }]}
                      initialValue={isRect ? undefined : initValue?.toString()}/>;
                }}
              </ProFormDependency>
            </ProFormBinding>;
          default:
            break;
        }
      })}
    </ProForm>;
  }
}

export default LayerEditForm;


