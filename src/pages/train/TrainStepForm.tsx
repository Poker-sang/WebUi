import React, { Component } from "react";
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm
} from "@ant-design/pro-components";
import { Button, message } from "antd";

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};


class TrainStepForm extends Component {
  render() {
    return <ProCard>
      <StepsForm
        onFinish={async (values) => {
          console.log(values);
          message.success("提交成功");
        }}
        formProps={{validateMessages: {required: "此项为必填项"}}}
        submitter={{
          render: (props) => {
            switch (props.step) {
              case 0:
                return <Button type="primary" onClick={() => props.onSubmit?.()}>
                  下一步
                </Button>;
              case 1:
                return [
                  <Button key="pre" onClick={() => props.onPre?.()}>
                    上一步
                  </Button>,
                  <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                    下一步
                  </Button>
                ];
              case 2:
                return [
                  <Button key="gotoTwo" onClick={() => props.onPre?.()}>
                    上一步
                  </Button>,
                  <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                    完成
                  </Button>
                ];
              case 3:
                return undefined;
            }
          }
        }}>

        {/*<{ dataset: number, net: number }>*/}
        <StepsForm.StepForm
          name="basic-options"
          title="基础内容">
          <ProFormSelect
            label="数据集"
            name="dataset"
            options={[
              {value: 1, label: "VOC12"}
            ]}
            rules={[{required: true}]}/>
          <ProFormSelect
            label="网络"
            name="net"
            options={[
              {value: 1, label: "MobileNet"},
              {value: 2, label: "策略二"}
            ]}
            rules={[{required: true}]}/>
        </StepsForm.StepForm>
        {/*<{
         name: string,
         remark: string,
         batch_size: number,
         epoch: number,
         learning_rate: number
         }>*/}
        <StepsForm.StepForm
          name="net_parameter"
          title="网络参数">
          <ProFormText
            name="name"
            label="训练标题"
            tooltip="最长为 64 位，用于标定的唯一id"
            placeholder="请输入名称"
            rules={[{required: true}]}/>
          <ProFormTextArea name="remark" label="备注" placeholder="请输入备注"/>
          <ProForm.Group>
            <ProFormDigit
              label="批大小"
              min={1}
              width="sm"
              placeholder="Batch Size"
              name="batch_size"
              rules={[{required: true}]}
              fieldProps={{precision: 0}}/>
            <ProFormDigit
              label="迭代次数"
              placeholder="Epoch"
              min={1}
              width="sm"
              name="epoch"
              rules={[{required: true}]}
              fieldProps={{precision: 0}}/>
            <ProFormDigit
              label="学习率"
              width="sm"
              min={0}
              placeholder="Learning Rate"
              name="learning_rate"
              rules={[{required: true}]}/>
          </ProForm.Group>
        </StepsForm.StepForm>
        {/*<{ datetime: string,
         priority: string[],
         device: string,
         strategy: number }>*/}
        <StepsForm.StepForm
          name="checkbox"
          title="设置参数">
          <ProFormDateTimePicker
            name="datetime"
            label="训练开始时间"
            rules={[{required: true}]}/>
          <ProFormCheckbox.Group
            name="priority"
            label="优先度"
            options={["结构迁移", "全量迁移", "增量迁移", "全量校验"]}/>
          <ProFormRadio.Group
            name="device"
            label="部署设备"
            radioType="button"
            initialValue="CUDA"
            options={["CUDA", "CPU"]}
            rules={[{required: true}]}/>
          <ProFormSelect
            label="部署分组策略"
            name="strategy"
            initialValue={1}
            options={[
              {value: 1, label: "策略一"},
              {value: 2, label: "策略二"}
            ]}
            rules={[{required: true}]}/>
        </StepsForm.StepForm>
      </StepsForm>
    </ProCard>;
  }
}

export default TrainStepForm;
