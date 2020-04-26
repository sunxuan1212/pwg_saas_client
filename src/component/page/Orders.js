import React from 'react';
import { Tabs, Table, Button } from 'antd';
import { format } from 'date-fns';

import Page_01 from './component/Page_01';

const { TabPane } = Tabs;

const Orders = (props) => {

  const orderTableCol = [
    {
      title: "No.",
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => {
        return `${index + 1}.`;
      }
    },
    {
      title: "订单编号",
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text, record) => {
        return (
          <a style={{whiteSpace:"pre-wrap", textDecoration:"underline"}}>{text}</a>
        )
      }
    },
    {
      title: "订购日期",
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      sorter: (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated),
      render: (text, record) => {
        let dateTime = format(new Date(text), "MM/dd/yyyy hh:mm:ss aa")
        return dateTime;
      }
    },
    {
      title: "收货人",
      dataIndex: 'receiverName',
      key: 'receiverName',
      sorter: (a, b) => a.receiverName - b.receiverName
    },
    {
      title: "总计",
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total
    },
    {
      title: "付款状态",
      dataIndex: 'paid',
      key: 'paid',
      render: (text, record) => {
        return (<Button type={`${text ? "primary" : "danger"}`} >{text ? "已付款" : "未付款"}</Button>)
      }
    },
    {
      title: "货物状态",
      dataIndex: 'sentOut',
      key: 'sentOut',
      //width: 200,
      render: (text, record) => {
        return 'haha'
      }
    },
    {
      title: "",
      dataIndex: 'key',
      key: 'key',
      render: (text, record) => {
        return (<Button type="danger" icon="delete">Cancel</Button>)
      } 
    }
  ]

  let emptyTablePlaceholder = (
      <div>空空如也</div>
  )

  return (
    <Page_01
      title={"Orders"}
      //extra={[
      //  <Button key="create" type="primary" icon={<PlusOutlined />} />
      //]}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="New Orders" key="1">
          <Table
            columns={orderTableCol} 
            dataSource={[]} 
            pagination={false}
            size="small"
            //scroll={{x: scrollXValue, y: scrollYValue}}
            footer={null}
            //locale={{emptyText:emptyTablePlaceholder}}
          />
        </TabPane>
        <TabPane tab="Paid Orders" key="2">
          Tab 2
        </TabPane>
        <TabPane tab="Completed Orders" key="3">
          Tab 3
        </TabPane>
      </Tabs>
    </Page_01>
  )
}

export default Orders;