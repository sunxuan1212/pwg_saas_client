import React, {useState, useEffect} from 'react';
import { Form, Upload, Input, Button, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from "@apollo/react-hooks";

import Page_01 from './component/Page_01';
import qiniuAPI from '../../utils/qiniuAPI';
import { useConfigCache, setConfigCache } from '../../utils/Constants';
import { showMessage } from '../../utils/component/notification';

const UPDATE_CONFIG_QUERY = gql`
  mutation updateConfig($config: JSONObject, $configId: String!) {
    updateConfig(config: $config, configId: $configId) {
      success
      message
      data
    }
  }
`;

const Configuration = (props) => {
  const configCache = useConfigCache();
  const [ form ] = Form.useForm();
  const [ fileList, setFileList ] = useState([]);

  const fileLimit = 1;

  const [ updateConfig ] = useMutation(UPDATE_CONFIG_QUERY,{
    onCompleted: (result) => {
      console.log('UPDATE_CONFIG_QUERY',result.updateConfig.data.value);
      setConfigCache(result.updateConfig.data.value)
      showMessage({type: 'success', message: 'Success: Configuration Updated'})
    },
    onError: (error) => {
      console.log('UPDATE_CONFIG_QUERY err',error)
      showMessage({type: 'success', message: 'Error: Error while updating Configuration'})

    }
  })

  useEffect(()=>{
    if (configCache != null) {
      if (configCache.paymentQRImage && configCache.paymentQRImage != '') {
        setFileList([{
          uid: configCache.paymentQRImage,
          url: configCache.imageSrc + configCache.paymentQRImage,
          thumbUrl: configCache.imageSrc + configCache.paymentQRImage
        }])
      }

      form.setFieldsValue({
        notice: configCache.profile.notice,
        delivery: configCache.delivery
      })
    }
  },[configCache]);

  // const props2 = {
  //   listType: 'picture',
  //   defaultFileList: [...fileList],
  //   className: 'upload-list-inline',
  // };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  
  const handleFileListChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  };

  const handleSubmit = async (values) => {
    console.log('handleSubmit',values)
    console.log('filelist',fileList)

    let setter = {
      'profile.notice': values.notice,
      'delivery': values.delivery
    }

    let paymentQRChanged = false;
    let currentPaymentQRImage = configCache.paymentQRImage;
    let paymentQRImageResult = "";
    if (fileList.length > 0) {
      if (fileList[0].originFileObj && currentPaymentQRImage != fileList[0].name) {
        let imageNameSplited = fileList[0].name.split('.');
        let newImageName = `saas_payment_${new Date().getTime()}_${imageNameSplited[imageNameSplited.length - 2]}.${imageNameSplited[imageNameSplited.length - 1]}`;
        paymentQRImageResult = newImageName;
        paymentQRChanged = true;
      }
    }
    else {
      if (currentPaymentQRImage != "") {
        paymentQRImageResult = "";
        paymentQRChanged = true;
      }
    }

    if (configCache && configCache.configId) {
      if (paymentQRChanged) {
        setter['paymentQRImage'] = paymentQRImageResult;

        const QiniuAPI = await qiniuAPI();

        if (paymentQRImageResult != "") {
          let newFileObject = {...fileList[0], name: paymentQRImageResult}
          await QiniuAPI.upload(newFileObject)
          if (currentPaymentQRImage != "") {
            await QiniuAPI.batchDelete([configCache.paymentQRImage])
          }
        }
        else {
          if (currentPaymentQRImage != "") {
            await QiniuAPI.batchDelete([configCache.paymentQRImage])
          }
        }
      }
      updateConfig({
        variables: {
          config: setter,
          configId: configCache.configId
        }
      })
    }



  }

  let deliveryConfig = {
    'type': 'static',
    
  }
  return (
    <Page_01
      title={"Configuration"}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item label="Notice" name="notice">
          <Input.TextArea/>
        </Form.Item>
        <Form.Item label="Delivery Fee (Static)" name="delivery">
          <InputNumber/>
        </Form.Item>
        <Form.Item label="Payment QR" name="paymentQRImage">
          {/* <ImgCrop rotate> */}
            <Upload
              accept="image/*"
              beforeUpload={ (file) => {
                console.log("beforeUpload",file)
                return false;
              }}
              //multiple={true}
              listType="picture-card"
              fileList={fileList}
              onChange={handleFileListChange}
              customRequest={()=>{
                console.log('haha')
              }}
            >
              {fileList.length < fileLimit ? uploadButton : null}
            </Upload>
          {/* </ImgCrop> */}
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={()=>{form.submit()}}>Save</Button>
        </Form.Item>
      </Form>
    </Page_01>
  )
}

export default Configuration;