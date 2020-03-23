import React from 'react';
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Form, Input, Button, Checkbox } from 'antd';
import { useHistory } from "react-router-dom";

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
  let routeHistory = useHistory();
  const [login] = useMutation(LOGIN_MUTATION,{
    onCompleted: (result)=>{
      if (result && result.login && result.login.success) {
        let redirectPath = '/';
        if (routeHistory.location.state && routeHistory.location.state.from) {
          redirectPath = routeHistory.location.state.from.pathname
        }
        routeHistory.push(redirectPath)
      }
    } 
  });


  const onFinish = values => {
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
          label="Username"
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
          label="Password"
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
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;