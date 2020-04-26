import React from 'react';
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Form, Input, Button, Checkbox } from 'antd';
import { useHistory } from "react-router-dom";

import Loading from '../../utils/component/Loading';

const LOGIN_MUTATION = gql`
    mutation login($user: JSONObject) {
      login(user: $user) {
        success
        message
        data
      }
    }
`;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const Login = (props) => {
  const apolloClient = useApolloClient();
  let routeHistory = useHistory();
  const [login, {loading}] = useMutation(LOGIN_MUTATION,{
    onCompleted: (result)=>{
      console.log("logged in",result);
      if (result && result.login && result.login.success) {
        console.log("logged in",result.login);
        let redirectPath = '/';
        // if (routeHistory.location.state && routeHistory.location.state.from) {
        //   redirectPath = routeHistory.location.state.from.pathname
        // }
        apolloClient.writeData({ data: { user: result.login } })
        routeHistory.push(redirectPath)
      }
    } 
  });

  const onFinish = values => {
    console.log("on submit login")
    login({
      variables: { user: values }
    });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div id="page_login">
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="账号"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            登入
          </Button>
        </Form.Item>
      </Form>
      {
        loading ? <Loading/> : null
      }
    </div>
  );
}

export default Login;