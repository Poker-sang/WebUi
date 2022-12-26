import {
  PageContainer,
  ProForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { message, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import LayerTable from './components/LayerTable';
import Api from '@/utils/Api';
import { useLocation, useParams } from '@@/exports';

export interface ParamType {
  key: number;
  name: string;
  type: string;
  remark: string | null;
  default: string | null;
}

const SequentialEdit: React.FC = () => {
  const params = useParams();
  const [tableSource, setTableSource] = useState<ParamType[]>([]);
  let name = params.name;
  const { state }: any = useLocation();
  const { remark }: { remark: string } = state;

  useEffect(() => {
    (async () => {
      if (name === undefined) return;
      const resTable = await Api.SequentialGet<ParamType[]>(
        'Sequential/Params',
        {
          sequentialName: name,
        },
      );
      resTable.unshift({
        key: -1,
        name: 'InputChannels',
        type: 'Int64',
        remark: null,
        default: null,
      });

      setTableSource(resTable);
    })();
  }, [name]);

  return (
    <PageContainer header={{ title: `序列编辑：${name}` }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <ProForm<{ name: string; remark: string }>
          onFinish={async (value) => {
            const response = await Api.SequentialDelete<boolean>(
              'Sequential/Delete',
              {
                oldName: name,
                newName: value.name,
                remark: value.remark,
              },
            );

            if (response) message.success(`更改${name}成功`);
            else message.error(`更改${name}失败，请刷新后重试`);

            name = value.name;
          }}
        >
          <ProFormText
            name="name"
            label="名称"
            initialValue={name}
            tooltip="最长为 32 位，用于标定的唯一id"
            placeholder="请输入名称"
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name="remark"
            label="备注"
            placeholder="请输入备注"
            initialValue={remark}
          />
        </ProForm>
        <Table
          title={() => '参数列表'}
          dataSource={tableSource}
          columns={[
            {
              title: '$',
              width: 30,
              dataIndex: 'key',
              key: 'key',
              render: (dom) => (dom === -1 ? '*' : dom?.toString()),
            },
            {
              title: '名称',
              width: 150,
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '类型',
              width: 50,
              dataIndex: 'type',
              key: 'type',
            },
            {
              title: '注释',
              dataIndex: 'remark',
              key: 'remark',
            },
            {
              title: '默认值',
              width: 100,
              dataIndex: 'default',
              key: 'default',
              render: (dom) => dom?.toString(),
            },
          ]}
          pagination={false}
          size="small"
          rowKey="key"
        />
        <LayerTable param={tableSource} />
      </Space>
    </PageContainer>
  );
};

export default SequentialEdit;
