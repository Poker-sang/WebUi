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
      headerTitle="?????????"
      loading={false}
      actionRef={ref}
      dataSource={tableSource}
      columns={[
        {
          title: '??????',
          key: 'sort',
          dataIndex: 'sort',
          width: 60,
          className: 'drag-visible',
          editable: false,
          render: () => <DragHandle />,
        },
        {
          title: '??????',
          width: 50,
          dataIndex: 'sort',
          render: (dom, rowData, index) => (
            <span className="customRender">{index}</span>
          ),
        },
        {
          title: '??????',
          key: 'name',
          width: 150,
          dataIndex: 'name',
          render: (dom, rowData) =>
            rowData.type === 'sequential' ? dom : <strong>{dom}</strong>,
          className: 'drag-visible',
        },
        {
          title: '??????',
          key: 'outputChannels',
          width: 80,
          dataIndex: 'outputChannels',
          render: (dom, rowData) => paramRender(dom, rowData.outputChannels),
        },
        {
          title: '?????????',
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
          title: '????????????',
          key: 'containsParams',
          width: 150,
          dataIndex: 'containsParams',
          render: (dom) => dom?.toString(),
        },
        {
          title: '??????',
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
                ??????
              </Link>
              <a key="copy" onClick={() => {}}>
                ??????
              </a>
              <a
                key="delete"
                onClick={() => {
                  Modal.confirm({
                    title: '??????',
                    icon: <ExclamationCircleOutlined />,
                    content: `???????????????${layer.key}??????${layer.name}????????????????????????`,
                    okText: '???',
                    okType: 'danger',
                    cancelText: '???',
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
                          `?????????${layer.key}??????${layer.name}??????`,
                        );
                      else
                        message.error(
                          `?????????${layer.key}??????${layer.name}???????????????????????????`,
                        );
                      ref.current?.reload();
                    },
                  });
                }}
              >
                ??????
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
            title="???????????????"
            trigger={<Button>????????????</Button>}
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
                checkedChildren="???????????????"
                unCheckedChildren="???????????????"
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
