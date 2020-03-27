import React from 'react';
import { PageHeader, Button } from 'antd';

const Page_01 = (props) => {
  const {children, ...rest} = props;
  return (
    <div id="page_01">
      <PageHeader
        {...rest}
      >
        {props.children}
      </PageHeader>
      
    </div>
  )
}

export default Page_01;