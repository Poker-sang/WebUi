import {
  ActionType,
  arrayMoveImmutable,
  ModalForm,
  ProFormDependency,
  ProFormGroup,
  ProFormSelect,
  ProFormSwitch,
  ProTable,
} from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'umi';
import { Button, message, Modal, Space } from 'antd';
import './drag.less';
import { OptParam } from '@/pages/sequential/types/kernel';
import Path from '@/utils/Path';
import { ExclamationCircleOutlined, MenuOutlined } from '@ant-design/icons';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import Api from '@/utils/Api';
import { ParamType } from '@/pages/Sequential/SequentialEdit';
import { useParams } from '@@/exports';

interface DataType {
  key: number;
  type: 'normal' | 'sequential';
  name: string;
  outputChannels: [] | OptParam;
  kernelSize: [] | OptParam;
  stride: [] | OptParam;
}

interface IProp {
  param?: ParamType[];
}

const LayerTable: React.FC<IProp> = (props) => {
  const DragHandle: any = SortableHandle(() => (
    <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
  ));
  const SortableItem: any = SortableElement((props: any) => <tr {...props} />);
  const SortContainer: any = SortableContainer((props: any) => (
    <tbody {...props} />
  ));
  const [tableSource, setTableSource] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<[][]>([]);
  const ref = useRef<ActionType>();
  const params = useParams();
  const sequentialName = params.name;

  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    console.log(oldIndex, newIndex);
    if (oldIndex !== newIndex)
      setTableSource([
        ...arrayMoveImmutable([...tableSource], oldIndex, newIndex).filter(
          (el) => !!el,
        ),
      ]);
  };

  const DraggableContainer = (props: any) => (
    <SortContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = (props: any) => {
    const { ...restProps } = props;
    const key = tableSource.findIndex(
      (x) => x.key === restProps['data-row-key'],
    );
    return <SortableItem index={key} {...restProps} />;
  };

  const paramRender = (dom: React.ReactNode, data: [] | OptParam) =>
    typeof data === 'string' ? (
      <span style={{ color: 'red' }}>{dom}</span>
    ) : (
      dom?.toString()
    );

  useEffect(() => {
    (async () => {
      if (sequentialName === undefined) return;
      const response = await Api.SequentialGet<[][]>('Layers/Edit', {
        sequentialName: sequentialName,
      });
      const response2 = await Api.SequentialGet<DataType[]>('Layers/All', {
        sequentialName: sequentialName,
      });
      setDataSource(response);
      setTableSource(response2);
    })();
  }, [sequentialName]);

  return (
    <ProTable
      rowKey="key"
      headerTitle="包含层"
      loading={false}
      actionRef={ref}
      dataSource={tableSource}
      columns={[
        {
          title: '排序',
          key: 'sort',
          dataIndex: 'sort',
          width: 60,
          className: 'drag-visible',
          editable: false,
          render: () => <DragHandle />,
        },
        {
          title: '序号',
          width: 50,
          dataIndex: 'sort',
          render: (dom, rowData, index) => (
            <span className="customRender">{index}</span>
          ),
        },
        {
          title: '类型',
          key: 'name',
          width: 150,
          dataIndex: 'name',
          render: (dom, rowData) =>
            rowData.type === 'sequential' ? dom : <strong>{dom}</strong>,
          className: 'drag-visible',
        },
        {
          title: '输出',
          key: 'outputChannels',
          width: 80,
          dataIndex: 'outputChannels',
          render: (dom, rowData) => paramRender(dom, rowData.outputChannels),
        },
        {
          title: '卷积核',
          key: 'kernelSize',
          width: 100,
          dataIndex: 'kernelSize',
          render: (dom, rowData) => paramRender(dom, rowData.kernelSize),
        },
        {
          title: 'Stride',
          key: 'stride',
          width: 100,
          dataIndex: 'stride',
          render: (dom, rowData) => paramRender(dom, rowData.stride),
        },
        {
          title: '包含参数',
          key: 'containsParams',
          width: 150,
          dataIndex: 'containsParams',
          render: (dom) => dom?.toString(),
        },
        {
          title: '选项',
          key: 'option',
          dataIndex: 'option',
          render: (dom, layer) => (
            <Space>
              <Link
                key="edit"
                state={{
                  layerType: layer.name,
                  dataSource: dataSource[layer.key],
                  tableSource: props.param,
                }}
                to={Path.LayerEdit(sequentialName, layer.key)}
              >
                编辑
              </Link>
              <a key="copy" onClick={() => {}}>
                复制
              </a>
              <a
                key="delete"
                onClick={() => {
                  Modal.confirm({
                    title: '删除',
                    icon: <ExclamationCircleOutlined />,
                    content: `确认删除第${layer.key}层：${layer.name}吗？此操作不可逆`,
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    onOk: async () => {
                      const response = await Api.SequentialDelete<boolean>(
                        'Layers/Delete',
                        {
                          name: sequentialName,
                          index: layer.key,
                        },
                      );
                      if (response)
                        message.success(
                          `删除第${layer.key}层：${layer.name}成功`,
                        );
                      else
                        message.error(
                          `删除第${layer.key}层：${layer.name}失败，请刷新后重试`,
                        );
                      ref.current?.reload();
                    },
                  });
                }}
              >
                删除
              </a>
            </Space>
          ),
        },
      ]}
      search={false}
      pagination={false}
      toolBarRender={() => {
        return [
          <ModalForm<{
            bindingMode: boolean;
            builtin?: string;
            sequential?: string;
          }>
            key="form"
            title="选择层类型"
            trigger={<Button>添加一行</Button>}
            onFinish={async (values) => {
              const response = await Api.SequentialGet<{
                desc: DataType;
                params: [];
              }>('Layers/Default', {
                layerName: values.bindingMode
                  ? values.builtin
                  : values.sequential,
              });

              response.desc.key =
                tableSource.length === 0
                  ? 0
                  : tableSource[tableSource.length - 1].key + 1;
              const ts = tableSource.concat(response.desc);
              dataSource.push(response.params);
              setTableSource(ts);
              return true;
            }}
          >
            <ProFormGroup>
              <ProFormSwitch
                checkedChildren="自定义序列"
                unCheckedChildren="框架内置层"
                name="bindingMode"
                initialValue={false}
              />
              <ProFormDependency name={['bindingMode']}>
                {(switchData) => {
                  let mode = false;
                  for (let key in switchData)
                    if (switchData.hasOwnProperty(key)) mode = switchData[key];
                  return mode ? (
                    <ProFormSelect
                      name="builtin"
                      width="md"
                      rules={[{ required: true }]}
                      request={async () =>
                        await Api.SequentialGet('Sequential/List')
                      }
                    />
                  ) : (
                    <ProFormSelect
                      name="sequential"
                      width="md"
                      rules={[{ required: true }]}
                      request={async () =>
                        await Api.SequentialGet('Layers/List')
                      }
                    />
                  );
                }}
              </ProFormDependency>
            </ProFormGroup>
          </ModalForm>,
        ];
      }}
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
    ></ProTable>
  );
};

export default LayerTable;
