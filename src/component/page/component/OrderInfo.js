import React, { useState, useEffect } from 'react';
import { Modal, Divider, Descriptions, List, Avatar } from 'antd';
import { format } from 'date-fns';

import { getConfig } from '../../../utils/Constants';


const OrderInfo = (props) => {
  const { order, closeModal, visible, ... restProps } = props;
  const [ config, setConfig ] = useState(null);
  useEffect(()=>{
    const runAsyncFunc = async () => {
      setConfig(await getConfig())
    }
    runAsyncFunc()
  },[])

  const orderItems = (item) => {
    console.log('config',config)
    let title = item.product.name;
    let variant = "";
    let variantKeys = Object.keys(item.variant);
    variantKeys.map((aKey, index)=>{
      variant += `${aKey}: ${item.variant[aKey]}${index == variantKeys.length -1 ? "" : ", "}`
    })

    let imageSrc = "";
    if (config && item.product.image) {
      imageSrc = config.imageSrc + item.product.image;
    }
    return (
      <List.Item
        actions={[
          "qty: " + item.qty,
          "price: " + item.price
        ]}
      >
        <List.Item.Meta
          avatar={
            <Avatar shape="square" src={imageSrc} />
          }
          title={title}
          description={variant}
        />
      </List.Item>
    )
  }
  return (
    <Modal
      title={"Order"}
      width={'95%'}
      visible={visible}
      onCancel={closeModal}
      footer={null}
      //destroyOnClose
      wrapClassName={'products-modalWrapper'}
      style={{overflow:"hidden"}}
    >
    {
      order ?
      <React.Fragment>
        <Divider orientation="left">订单</Divider>
        <Descriptions 
            size="small"
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
        >
            <Descriptions.Item label="编号">{order._id}</Descriptions.Item>
            <Descriptions.Item label="订购日期">{format(new Date(order.createdAt), "MM/dd/yyyy hh:mm:ss aa")}</Descriptions.Item>
            <Descriptions.Item label="付款状态">
                {
                  order.paid ? 
                    <span style={{"color":"green"}}>已付款</span> : <span style={{"color":"red"}}>待付款</span>
                }
            </Descriptions.Item>
            <Descriptions.Item label="货物状态">{order.sentOut ? <span style={{"color":"green"}}>已出货 <small> (运单号: {order.trackingNum})</small></span>:<span style={{"color":"red"}}>未出货</span>}</Descriptions.Item>
        </Descriptions>
        <Divider orientation="left">收件人</Divider>
        <Descriptions 
            id="buyerInfoTable"
            size="small"
            bordered
            column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
            <Descriptions.Item label="名字">{order.customer.name}</Descriptions.Item>
            <Descriptions.Item label="电话号码">contact</Descriptions.Item>
            <Descriptions.Item label="收件地址">address</Descriptions.Item>
        </Descriptions>
        <Divider orientation="left">购买列表</Divider> 
        <List
          itemLayout="horizontal"
          dataSource={order.items}
          renderItem={orderItems}
          //bordered
          footer={(
            <div className="orderInfo-item-summary">
              Total: {order.total}
            </div>
          )}
        />
      </React.Fragment>
      : "Not found"
    }
  
    </Modal>
  )
}

export default OrderInfo;