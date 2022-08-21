import {
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormGroup,
  ProFormSelect,
  ProFormSwitch
} from "@ant-design/pro-components";
import { Component } from "react";
import { request } from "umi";
import { message } from "antd";


interface IState {
  dataSource: DataType[],
}

interface DataType {
  name: string,
  type: string,
  value: any
}

class LayerEditForm extends Component<any, IState> {
  params = new URL(location.toString()).searchParams;
  name = this.params.get("name");
  index = parseInt(this.params.get("index")!);

  constructor(props: any) {
    super(props);
    this.state = { dataSource: [] };
  }

  async componentDidMount() {
    if (this.name === null)
      return;
    const response: DataType[] = await request("/server/api/Sequential/Layers/Edit",
      {
        method: "post",
        params: {
          sequentialName: this.name,
          index: this.index
        }
      });
    this.setState({ dataSource: response });
  }

  render() {
    return <ProForm
      title={this.name ?? undefined}
      autoFocusFirstInput
      onFinish={async (values) => {
        console.log(values);
        message.success("提交成功");
        return true;
      }}>
      {this.state.dataSource.map((datum, index) => {
        switch (datum.type) {
          case "Double":
            return <ProFormGroup key={index} label={`${datum.name}-小数`}>
              <ProFormDigit name={datum.name} width="sm" min={0} fieldProps={{ precision: 10 }}
                            initialValue={datum.value} rules={[{ required: true }]}/>
            </ProFormGroup>;
          case "Int64":
            return <ProFormGroup key={index} label={`${datum.name}-整数`}>
              <ProFormDigit name={datum.name} width="sm" min={0} fieldProps={{ precision: 0 }}
                            initialValue={datum.value} rules={[{ required: true }]}/>
            </ProFormGroup>;
          case "Rect":
            return <ProFormGroup key={index} label={`${datum.name}-两个整数`}>
              <ProFormDigit name={`${datum.name}1`} width="xs" min={0} fieldProps={{ precision: 0 }}
                            initialValue={datum.value[0]} rules={[{ required: true }]}/>
              <ProFormDigit name={`${datum.name}2`} width="xs" min={0} fieldProps={{ precision: 0 }}
                            initialValue={datum.value[1]} rules={[{ required: true }]}/>
            </ProFormGroup>;
          case "PaddingModes":
            return <ProFormGroup key={index} label={`${datum.name}-枚举`}>
              <ProFormSelect
                name={datum.name}
                valueEnum={{
                  0: "Zeros",
                  1: "Reflect",
                  2: "Replicate",
                  3: "Circular",
                  4: "Constant"
                }}
                placeholder="Please select a country"
                rules={[{ required: true }]}
                initialValue={datum.value.toString()}/>
            </ProFormGroup>;
          case "PaddingType":
            let isRect = true;
            if (typeof datum.value === "number")
              isRect = false;
            return <ProFormGroup key={index} label={`${datum.name}-两个整数或枚举`}>
              <ProFormSwitch name={`${datum.name}mode`} initialValue={isRect}/>
              <ProFormDependency name={[`${datum.name}mode`]}>
                {(data) => {
                  let mode = false;
                  for (let key in data)
                    mode = data[key];
                  return mode
                    ? <ProFormGroup>
                      <ProFormDigit
                        name={`${datum.name}rect1`}
                        width="xs"
                        min={0}
                        fieldProps={{ precision: 0 }}
                        initialValue={isRect ? datum.value[0] : 0}
                        rules={[{ required: true }]}/>
                      <ProFormDigit
                        name={`${datum.name}rect2`}
                        width="xs"
                        min={0}
                        fieldProps={{ precision: 0 }}
                        initialValue={isRect ? datum.value[1] : 0}
                        rules={[{ required: true }]}/>
                    </ProFormGroup>
                    : <ProFormSelect
                      name={`${datum.name}enum`}
                      valueEnum={{
                        0: "Valid",
                        1: "Same"
                      }}
                      rules={[{ required: true }]}
                      initialValue={isRect ? "0" : datum.value.toString()}/>;
                }}
              </ProFormDependency>
            </ProFormGroup>;
          default:
            break;
        }
      })
      }
    </ProForm>;
  }
}

export default LayerEditForm;


