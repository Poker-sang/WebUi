import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components';
import { Button, message, Modal } from 'antd';
import { Link, useNavigate } from 'umi';
import Path from '@/utils/Path';
import Api from '@/utils/Api';
import React, { useRef } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';

type SequentialInfo = {
  key: number;
  name: string;
  layers: number;
  usedCount: number;
  createTime: number;
  remark: string;
};

const SequentialManager: React.FC = () => {
  const navigate = useNavigate();
  const ref = useRef<ActionType>();
  return (
    <PageContainer>
      <ProTable<SequentialInfo>
        columns={[
          {
            title: '序列名称',
            width: 100,
            key: 'name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
          },
          {
            title: '层数',
            width: 80,
            key: 'layers',
            dataIndex: 'layers',
            align: 'right',
            sorter: (a, b) => a.layers - b.layers,
          },
          {
            title: '使用数',
            width: 80,
            key: 'usedCount',
            dataIndex: 'usedCount',
            align: 'right',
            sorter: (a, b) => a.usedCount - b.usedCount,
          },
          {
            title: '创建时间',
            width: 100,
            key: 'createTime',
            dataIndex: 'createTime',
            valueType: 'date',
            sorter: (a, b) => a.createTime - b.createTime,
          },
          {
            title: '备注',
            key: 'remark',
            dataIndex: 'remark',
            ellipsis: true,
            copyable: true,
          },
          {
            title: '操作',
            width: 180,
            key: 'option',
            valueType: 'option',
            render: (_, record) => [
              <Link
                key="edit"
                state={{ remark: record.remark }}
                to={Path.SequentialEdit(record.name)}
              >
                编辑
              </Link>,
              <a
                key="delete"
                onClick={async () => {
                  Modal.confirm({
                    title: '删除',
                    icon: <ExclamationCircleOutlined />,
                    content: `确认删除${record.name}层吗？此操作不可逆`,
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    onOk: async () => {
                      const response = await Api.SequentialDelete<boolean>(
                        'Sequential/Delete',
                        {
                          name: record.name,
                        },
                      );
                      if (response) message.success(`删除${record.name}成功`);
                      else
                        message.error(`删除${record.name}失败，请刷新后重试`);
                      ref.current?.reload();
                    },
                  });
                }}
              >
                {' '}
                删除{' '}
              </a>,
              <TableDropdown
                key="actionGroup"
                menus={[
                  { key: 'copy', name: '复制' },
                  { key: 'delete', name: '删除（假）' },
                ]}
              />,
            ],
          },
        ]}
        request={async () => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const response = await Api.SequentialGet<SequentialInfo[]>(
            'Sequential/All',
          );
          return {
            data: response,
            success: true,
          };
        }}
        rowKey="key"
        pagination={{ showQuickJumper: true }}
        search={{ optionRender: false, collapsed: false }}
        dateFormatter="string"
        headerTitle="表格标题"
        actionRef={ref}
        toolBarRender={() => [
          <Button key="showLog">查看日志</Button>,
          <Button key="output">导出数据</Button>,
          <ModalForm<{
            name: string;
            remark: string;
          }>
            key="form"
            title="输入层名称"
            trigger={<Button type="primary">新建序列</Button>}
            onFinish={async (values) => {
              const response = await Api.SequentialPut<boolean>(
                'Sequential/Create',
                {
                  name: values.name,
                  remark: values.remark,
                },
              );
              if (response) navigate(Path.SequentialEdit(values.name));
              else
                message.error(`新建失败，可能已经存在名为${values.name}的层`);
              return response;
            }}
          >
            <ProFormText
              name="name"
              label="名称"
              tooltip="最长为 32 位，用于标定的唯一id"
              placeholder="请输入名称"
              rules={[{ required: true }]}
            />
            <ProFormTextArea
              name="remark"
              label="备注"
              placeholder="请输入备注"
            />
          </ModalForm>,
        ]}
      />
    </PageContainer>
  );
};

export default SequentialManager;
