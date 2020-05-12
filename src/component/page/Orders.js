import React, {useState} from 'react';
import { Tabs, Table, Button, Input, Popconfirm } from 'antd';
import { format } from 'date-fns';
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { CheckOutlined } from '@ant-design/icons';

import Page_01 from './component/Page_01';
import OrderInfo from './component/OrderInfo';

const { TabPane } = Tabs;
const { Search } = Input;

const GET_ORDERS_QUERY = gql`
  query orders($filter: JSONObject) {
    orders(filter: $filter) {
      _id
      createdAt
      updatedAt
      items
      total
      customer
      paid
      sentOut
      trackingNum
    }
  }
`;

const UPDATE_ORDER_PAYMENT_QUERY = gql`
  mutation updateOrderPayment($_id: String!, $paid: Boolean!) {
    updateOrderPayment(_id: $_id, paid: $paid) {
      success
      message
      data
    }
  }
`;

const UPDATE_ORDER_DELIVERY_QUERY = gql`
  mutation updateOrderDelivery($_id: String!, $trackingNum: String) {
    updateOrderDelivery(_id: $_id, trackingNum: $trackingNum) {
      success
      message
      data
    }
  }
`;

const CANCEL_ORDER_QUERY = gql`
  mutation cancelOrder($_id: String!) {
    cancelOrder(_id: $_id) {
      success
      message
      data
    }
  }
`;
const Orders = (props) => {

  const [ orderModalDisplay, setOrderModalDisplay ] = useState(false);
  const [ selectedOrder, setSelectedOrder ] = useState(null);

  const { data, loading, error, refetch: refetchOrders } = useQuery(GET_ORDERS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: {
        sorter: {
          createdAt: 'desc'
        }
      }
    },
    onError: (error) => {
      console.log("products error", error)

    },
    onCompleted: (result) => {
      
    }
  });

  const [ updateOrderPayment , updateOrderPaymentResult ] = useMutation(UPDATE_ORDER_PAYMENT_QUERY,{
    onCompleted: (result) => {
      refetchOrders()
    }
  })

  const [ updateOrderDelivery , updateOrderDeliveryResult ] = useMutation(UPDATE_ORDER_DELIVERY_QUERY,{
    onCompleted: (result) => {
      refetchOrders()
    }
  })

  const [ cancelOrder , cancelOrderResult ] = useMutation(CANCEL_ORDER_QUERY,{
    onCompleted: (result) => {
      refetchOrders()
    }
  })

  const handleOrderModalDisplayOpen = (selectedOrder) => {
    setOrderModalDisplay(true);
    setSelectedOrder(selectedOrder)
  }
  const handleOrderModalDisplayClose = () => {
    setOrderModalDisplay(false);
  }

  const defaultColumns = [
    {
      title: "No.",
      dataIndex: 'index',
      key: 'index',
      width: 75,
      render: (text, record, index) => {
        return `${index + 1}.`;
      }
    },
    {
      title: "订购日期",
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text, record) => {
        let dateTime = format(new Date(text), "MM/dd/yyyy hh:mm:ss aa")
        return dateTime;
      }
    },
    {
      title: "订单编号",
      dataIndex: '_id',
      key: '_id',
      render: (text, record) => {
        return (
          <a style={{whiteSpace:"pre-wrap", textDecoration:"underline"}} onClick={()=>{handleOrderModalDisplayOpen(record)}}>{record._id.toUpperCase()}</a>
        )
      }
    },
    {
      title: "收货人",
      dataIndex: 'customer',
      key: 'customer',
      sorter: (a, b) => a.name - b.name,
      render: (text, record) => {
        return text.name;
      }
    },
    {
      title: "总计",
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total
    }
  ]

  // {
  //   title: "货物状态",
  //   dataIndex: 'sentOut',
  //   key: 'sentOut',
  //   //width: 200,
  //   render: (text, record) => {
  //     return 'haha'
  //   }
  // },

  let emptyTablePlaceholder = (
      <div>空空如也</div>
  )

  const getColumnsByTable = () => {
    
    let tableCol1 = [...defaultColumns, ...[
      {
        title: "付款状态",
        dataIndex: 'paid',
        key: 'paid',
        render: (text, record) => {
          const handleUpdatePayment = () => {
            updateOrderPayment({
              variables: {
                _id: record._id,
                paid: !record.paid
              }
            })
          }
          return (<Button size="small" type={`${text ? "primary" : "danger"}`} onClick={handleUpdatePayment}>{text ? "已付款" : "未付款"}</Button>)
        }
      },
      {
        title: "",
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          const handleCancelOrder = () => {
            cancelOrder({
              variables: {
                _id: record._id
              }
            })
          }
          return (
            <Popconfirm title="Sure to delete?" onConfirm={handleCancelOrder}>
              {/* <div style={{width: '100%', textAlign: 'center', cursor: 'pointer'}}>取消</div> */}
          <Button type="danger" size="small">取消</Button>

          {/* <Button type="danger" size="small" onClick={handleCancelOrder}>取消</Button> */}
            </Popconfirm>
          )
        } 
      }
    ]];
    
    let tableCol2 = [...defaultColumns, ...[
      {
        title: "付款状态",
        dataIndex: 'paid',
        key: 'paid',
        render: (text, record) => {
          const handleUpdatePayment = () => {
            updateOrderPayment({
              variables: {
                _id: record._id,
                paid: !record.paid
              }
            })
          }
          return (<Button type={`${text ? "primary" : "danger"}`} size="small" onClick={handleUpdatePayment}>{text ? "已付款" : "未付款"}</Button>)
        }
      },
      {
        title: "Tracking No.",
        dataIndex: 'trackingNum',
        key: 'trackingNum',
        width: 200,
        render: (text, record) => {
          let result = null;
          if (record.sentOut && text) {
            result = (
              <div>{text}</div>
            )
          }
          else {
            const handleUpdateDelivery = (value) => {
              updateOrderDelivery({
                variables: {
                  _id: record._id,
                  trackingNum: value
                }
              })
            }
            result = (
              <Search
                placeholder="Enter tracking no."
                enterButton={(<CheckOutlined />)}
                size="small"
                onSearch={handleUpdateDelivery}
              />
            )
          }
          return result;
        } 
      }
    ]]

    let tableCol3 = [...defaultColumns, ...[
      {
        title: "Last Updated",
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
        render: (text, record) => {
          let dateTime = format(new Date(text), "MM/dd/yyyy hh:mm:ss aa")
          return dateTime;
        }
      },
      {
        title: "Tracking No.",
        dataIndex: 'trackingNum',
        key: 'trackingNum',
        render: (text, record) => {
          return text
        } 
      }
    ]]

    return {
      newOrders: tableCol1,
      paidOrders: tableCol2,
      completedOrders: tableCol3
    }
  }

  const getFilteredOrders = () => {
    let allOrders = data ? data.orders : [];
    let orderList1 = [];
    let orderList2 = [];
    let orderList3 = [];
    allOrders.map((anOrder)=>{
      if (!anOrder.paid && !anOrder.sentOut) {
        orderList1.push(anOrder);
      }
      else if (anOrder.paid && !anOrder.sentOut) {
        orderList2.push(anOrder);
      }
      else if (anOrder.paid && anOrder.sentOut) {
        orderList3.push(anOrder);
      }
    });
    return {
      newOrders: orderList1,
      paidOrders: orderList2,
      completedOrders: orderList3
    }
  }

  let filteredColumns = getColumnsByTable();
  let filteredOrders = getFilteredOrders();

  const colWidth = 100;
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
            rowKey={'_id'}
            columns={filteredColumns.newOrders} 
            dataSource={filteredOrders.newOrders} 
            pagination={false}
            size="small"
            scroll={{x: filteredColumns.newOrders.length * colWidth}}
            footer={null}
            //locale={{emptyText:emptyTablePlaceholder}}
          />
        </TabPane>
        <TabPane tab="Paid Orders" key="2">
          <Table
            rowKey={'_id'}
            columns={filteredColumns.paidOrders} 
            dataSource={filteredOrders.paidOrders} 
            pagination={false}
            size="small"
            scroll={{x: filteredColumns.paidOrders.length * colWidth}}
            footer={null}
            //locale={{emptyText:emptyTablePlaceholder}}
          />
        </TabPane>
        <TabPane tab="Completed Orders" key="3">
          <Table
            rowKey={'_id'}
            columns={filteredColumns.completedOrders} 
            dataSource={filteredOrders.completedOrders} 
            pagination={false}
            size="small"
            scroll={{x: filteredColumns.completedOrders.length * colWidth}}
            footer={null}
            //locale={{emptyText:emptyTablePlaceholder}}
          />
        </TabPane>
      </Tabs>
      <OrderInfo
        order={selectedOrder}
        visible={orderModalDisplay}
        closeModal={handleOrderModalDisplayClose}
      />
    </Page_01>
  )
}

export default Orders;