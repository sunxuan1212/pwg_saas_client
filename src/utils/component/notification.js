import React from 'react';
import { notification, Alert } from 'antd';

export const showMessage = ({ type, message, description })=>{
  let options = {};
  if(type ==="error"){
    options = {
      duration: 6
    }
  }
  notification[type]({
    //message: (<Alert message={message} type={type} />),
    message: message,
    //description: description,
    //className: `notification-${type}`,
    //...options
  });
}