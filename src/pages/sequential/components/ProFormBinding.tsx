import {
  ProFormDependency,
  ProFormGroup,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import React, { ReactNode } from 'react';

interface IProp {
  datum: {
    name: string;
    isBinding: boolean;
    value: any;
  };
  type: string;
  children: ReactNode;
}

function ProFormBinding(props: IProp) {
  return (
    <ProFormGroup label={`${props.datum.name} - ${props.type}`}>
      <ProFormSwitch
        checkedChildren="绑定"
        unCheckedChildren="默认"
        name={`${props.datum.name}*bindingMode`}
        initialValue={props.datum.isBinding}
      />
      <ProFormDependency name={[`${props.datum.name}*bindingMode`]}>
        {(switchData) => {
          let mode = false;
          for (let key in switchData)
            if (switchData.hasOwnProperty(key)) {
              mode = switchData[key];
              break;
            }
          return mode ? (
            <ProFormText
              name={`${props.datum.name}$binding`}
              placeholder={'请输入绑定参数名'}
              rules={[{ required: true }]}
              initialValue={
                props.datum.isBinding ? props.datum.value : undefined
              }
            />
          ) : (
            props.children
          );
        }}
      </ProFormDependency>
    </ProFormGroup>
  );
}

export default ProFormBinding;
