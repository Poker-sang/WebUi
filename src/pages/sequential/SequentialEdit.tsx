import {
  PageContainer,
  ProForm,
  ProFormInstance,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Col, Row, Space, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import SequentialLayerTable from './components/SequentialLayerTable';
import Api from '@/utils/Api';
import { useParams } from '@@/exports';

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
  const name = params.name;
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    (async () => {
      if (name === undefined) return;
      const resForm = await Api.SequentialGet<string>('Find/Metadata', {
        sequentialName: name,
        metadataName: 'Remark',
      });
      const resTable = await Api.SequentialGet<ParamType[]>('Params', {
        sequentialName: name,
      });
      resTable.unshift({
        key: -1,
        name: 'InputChannels',
        type: 'Int64',
        remark: null,
        default: null,
      });

      setTableSource(resTable);
      formRef.current?.setFieldValue('remark', resForm);
    })();
  }, [name]);

  return (
    <PageContainer header={{ title: '网络训练' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Row gutter={32}>
          <Col span={12}>
            <ProForm<{ name: string; remark: string }> formRef={formRef}>
              <ProFormText
                name="name"
                label="名称"
                initialValue={name}
                tooltip="最长为 32 位，用于标定的唯一id"
                placeholder="请输入名称"
              />
              <ProFormTextArea
                name="remark"
                label="备注"
                placeholder="请输入备注"
              />
            </ProForm>
          </Col>
          <Col span={12}>
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
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '类型',
                  dataIndex: 'type',
                  key: 'type',
                },
                {
                  title: '默认值',
                  dataIndex: 'default',
                  key: 'default',
                  render: (dom) => dom?.toString(),
                },
              ]}
              pagination={false}
              size="small"
              rowKey="key"
            />
          </Col>
        </Row>
        <SequentialLayerTable sequentialName={name} param={tableSource} />
      </Space>
    </PageContainer>
  );
};

export default SequentialEdit;
