import {
  PageContainer,
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormGroup,
  ProFormSelect,
  ProFormSwitch,
} from '@ant-design/pro-components';
import React from 'react';
import ProFormBinding from './components/ProFormBinding';
import Api from '@/utils/Api';
import { message } from 'antd';
import { useParams } from '@@/exports';
import { useLocation } from 'umi';
import { ParamType } from './SequentialEdit';

interface DataType {
  name: string;
  type: string;
  isBinding: boolean;
  value: any;
}

const LayerEdit: React.FC = () => {
  const intDefaultProps: {
    width: 'sm';
    min: number;
    fieldProps: { precision: 0 };
    rules: [{ required: true }];
  } = {
    width: 'sm',
    min: 0,
    fieldProps: { precision: 0 },
    rules: [{ required: true }],
  };
  const { state }: any = useLocation();
  const {
    layerType,
    tableSource,
    dataSource,
  }: { layerType: string; tableSource: ParamType[]; dataSource: DataType[] } =
    state;
  const params = useParams();
  const sequentialName = params.name;
  const index = Number(params.index);
  return (
    <PageContainer header={{ title: `层编辑：${sequentialName}.${layerType}` }}>
      <ProForm
        autoFocusFirstInput={true}
        onFinish={async (values) => {
          const obj: { [key: string]: any } = {};
          const getName = (key: string, char: string) =>
            key.substring(0, key.lastIndexOf(char));
          for (const key in values) {
            // Rect等数组
            if (key.includes('&')) {
              const name = getName(key, '&');
              if (obj[name] === undefined) obj[name] = [values[key]];
              else obj[name].push(values[key]);
            }
            // 单个数字之类无需处理的
            else if (key.includes('#')) obj[getName(key, '#')] = values[key];
            // 枚举等需要转数字的
            else if (key.includes('^'))
              obj[getName(key, '^')] = Number(values[key]);
            // 绑定类型
            else if (key.includes('$')) {
              const name = getName(key, '$');
              if (values[key] === 'InputChannels') obj[name] = '*';
              else
                obj[name] = `$${
                  tableSource.find((t) => t.name === values[key])?.key
                }`;
            }
            // 舍弃
            // if (key.includes("*"))
          }
          console.log(obj);
          const rst = await Api.SequentialPut(
            'Layers/Update',
            { name: sequentialName, index: index, type: layerType },
            obj,
          );
          if (rst === null) return true;
          message.error('更新失败，请重试');
          return false;
        }}
      >
        {dataSource.map((datum: DataType, index: number) => {
          if (datum.isBinding)
            datum.value = tableSource.find((t) => t.key === datum.value)?.name;
          const init = datum.isBinding ? undefined : datum.value;
          switch (datum.type) {
            case 'Boolean':
              return (
                <ProFormBinding key={index} datum={datum} type="布尔">
                  <ProFormSwitch
                    name={`${datum.name}#`}
                    rules={[{ required: true }]}
                    initialValue={datum.value}
                    checkedChildren="是"
                    unCheckedChildren="否"
                  />
                </ProFormBinding>
              );
            case 'Double':
              return (
                <ProFormBinding key={index} datum={datum} type="小数">
                  <ProFormDigit
                    name={`${datum.name}#`}
                    width="sm"
                    min={0}
                    fieldProps={{ precision: 10 }}
                    rules={[{ required: true }]}
                    initialValue={init}
                  />
                </ProFormBinding>
              );
            case 'Int64':
              return (
                <ProFormBinding key={index} datum={datum} type="整数">
                  <ProFormDigit
                    name={`${datum.name}#`}
                    {...intDefaultProps}
                    initialValue={init}
                  />
                </ProFormBinding>
              );
            case 'Rect':
              return (
                <ProFormBinding key={index} datum={datum} type="两个整数">
                  <ProFormGroup>
                    <ProFormDigit
                      name={`${datum.name}&1`}
                      {...intDefaultProps}
                      initialValue={init?.[0]}
                    />
                    <ProFormDigit
                      name={`${datum.name}&2`}
                      {...intDefaultProps}
                      initialValue={init?.[1]}
                    />
                  </ProFormGroup>
                </ProFormBinding>
              );
            case 'PaddingModes':
              return (
                <ProFormBinding key={index} datum={datum} type="枚举">
                  <ProFormSelect
                    name={`${datum.name}^`}
                    valueEnum={{
                      0: 'Zeros',
                      1: 'Reflect',
                      2: 'Replicate',
                      3: 'Circular',
                      4: 'Constant',
                    }}
                    rules={[{ required: true }]}
                    initialValue={init?.toString()}
                  />
                </ProFormBinding>
              );
            case 'PaddingType': {
              const isRect = typeof init !== 'number';
              return (
                <ProFormBinding key={index} datum={datum} type="两个整数或枚举">
                  <ProFormSwitch
                    name={`${datum.name}*mode`}
                    initialValue={isRect}
                    checkedChildren="Rect"
                    unCheckedChildren="枚举"
                  />
                  <ProFormDependency name={[`${datum.name}*mode`]}>
                    {(switchData) => {
                      let mode = false;
                      for (let key in switchData)
                        if (switchData.hasOwnProperty(key))
                          mode = switchData[key];
                      return mode ? (
                        <ProFormGroup>
                          <ProFormDigit
                            name={`${datum.name}&rect1`}
                            {...intDefaultProps}
                            initialValue={isRect ? init?.[0] : 0}
                          />
                          <ProFormDigit
                            name={`${datum.name}&rect2`}
                            {...intDefaultProps}
                            initialValue={isRect ? init?.[1] : 0}
                          />
                        </ProFormGroup>
                      ) : (
                        <ProFormSelect
                          name={`${datum.name}^enum`}
                          valueEnum={{
                            0: 'Valid',
                            1: 'Same',
                          }}
                          rules={[{ required: true }]}
                          initialValue={isRect ? undefined : init?.toString()}
                        />
                      );
                    }}
                  </ProFormDependency>
                </ProFormBinding>
              );
            }
            default:
              return undefined;
          }
        })}
      </ProForm>
    </PageContainer>
  );
};

export default LayerEdit;
