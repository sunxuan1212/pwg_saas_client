import React, {useState, useEffect} from 'react';
import { Button, Form, Input, Upload, Modal, Switch, Collapse } from 'antd';
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { PlusOutlined } from '@ant-design/icons';
import gql from "graphql-tag";

import confirmation from '../../../utils/component/confirmation';
import InventoryFormTable from './InventoryFormTable';
import qiniuAPI from '../../../utils/qiniuAPI';

const { Panel } = Collapse;

const READ_PRODUCT_INVENTORY_QUERY = gql`
  query inventory($filter: JSONObject) {
    inventory(filter: $filter) {
      _id
      createdAt
      updatedAt
      price
      stock
      variants
      published
      productId
    }
  }
`;

const BULK_UPDATE_INVENTORY_QUERY = gql`
  mutation bulkUpdateInventory($inventory: [JSONObject!]) {
    bulkUpdateInventory(inventory: $inventory) {
      success
      message
      data
    }
  }
`;

const CREATE_NEW_PRODUCT_QUERY = gql`
  mutation createProduct($product: JSONObject!) {
    createProduct(product: $product) {
      success
      message
      data
    }
  }
`;

const DELETE_PRODUCT_QUERY = gql`
  mutation deleteProduct($_id: String!) {
    deleteProduct(_id: $_id) {
      success
      message
      data
    }
  }
`;

const UPDATE_PRODUCT_QUERY = gql`
  mutation updateProduct($product: JSONObject!) {
    updateProduct(product: $product) {
      success
      message
      data
    }
  }
`;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const ProductForm = (props) => {
  const {product = null, refetch, ...modalProps} = props;
  const fileLimit = 4;
  const QiniuAPI = qiniuAPI();

  const [ form ] = Form.useForm();
  const [ fileList, setFileList ] = useState([]);
  const [ previewVisible, setPreviewVisible ] = useState(false);
  const [ previewImage, setPreviewImage ] = useState('');

  // inventory
  const [ inventoryData, setInventoryData ] = useState([]);
  const [ productVariants, setProductVariants ] = useState({'sku': 'SKU'});

  useEffect(() => {
    if (product && modalProps.modalVisible) {
      form.setFieldsValue(product);
      if (product.variants) {
        setProductVariants(product.variants)
      }

      readInventory({
        variables: {
          filter: {
            filter: { productId: product._id }
          }
        }
      })
    }
    else {
      form.resetFields();
    }
    modalProps.setModalFooter(getModalFooter());

  }, [product, modalProps.modalVisible]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const handleFileListChange = ({ fileList, ...rest }) => {
    console.log("handleFileListChange",rest)
    console.log("handleFileListChange,fileList",fileList)
    let result = fileList;
    if (fileList.length > fileLimit) {
      result = fileList.slice(0, fileLimit-1);
    }
    setFileList(result)
  };

  const handlePreviewClose = () => {
    setPreviewVisible(false);
  }

  const handlePreviewOpen = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewVisible(true);
    setPreviewImage(file.url || file.preview);
  };

  const [readInventory, { loading: loadingInventory, data: dataInventory }] = useLazyQuery(READ_PRODUCT_INVENTORY_QUERY,{
    fetchPolicy: "cache-and-network",
    onCompleted: (result) => {
      console.log("readInventory result",result)
      if (result && result.inventory) {
        let flattenedInventory = [];
        result.inventory.map((anInventory,index)=>{
          const { variants, ...restInventory } = anInventory;
          let newInventory = {...restInventory, ...variants, key: restInventory._id};
          flattenedInventory.push(newInventory);
        })
        console.log('flattenedInventory',flattenedInventory)
        setInventoryData(flattenedInventory);
      }

    }
  })

  const [bulkUpdateInventory] = useMutation(BULK_UPDATE_INVENTORY_QUERY,{
    onCompleted: (result) => {
      console.log("bulkUpdateInventory result",result)
    }
  })

  const [createProduct, {loading, error}] = useMutation(CREATE_NEW_PRODUCT_QUERY,{
    onCompleted: (result) => {
      console.log("createProduct result",result)
      modalProps.onCancel();
      refetch();
    }
  })
  const [deleteProduct] = useMutation(DELETE_PRODUCT_QUERY,{
    onCompleted: (result) => {
      console.log("deleteProduct result",result)
      modalProps.onCancel();
      refetch();
    }
  })
  const [updateProduct, {updateLoading, updateError}] = useMutation(UPDATE_PRODUCT_QUERY,{
    onCompleted: (result) => {
      console.log("updateProduct result",result)
      modalProps.onCancel();
      refetch();
    }
  })

  const onFinish = (values) => {
    console.log("onFinish", values)
    let finalProductValue = {...values, variants: productVariants}
    if (!product) {
      createProduct({
        variables: {
          product: finalProductValue
        }
      })
    }
    else {

      updateProduct({
        variables: {
          product: {...finalProductValue, _id: product._id}
        }
      })

      console.log("inventoryData",inventoryData)
      let newInventory = [...inventoryData];
      newInventory = newInventory.map((anInventory)=>{
        const { key, ...restInventory} = anInventory;
        //delete anInventory.key;
        let variantObj = {}
        Object.keys(productVariants).map((aKey)=>{
          if (restInventory.hasOwnProperty(aKey)) {
            variantObj[aKey] = restInventory[aKey];
            delete restInventory[aKey];
          }
        });
        restInventory['variants'] = variantObj;
        return restInventory;
      });
      console.log("newInventory",newInventory)
      let deletedInventory = []
      if (dataInventory && dataInventory.inventory) {
        dataInventory.inventory.map((anInventory)=>{
          let foundInventory = newInventory.map((aNewInventory)=>{return aNewInventory._id}).indexOf(anInventory._id);
          if (foundInventory < 0) {
            deletedInventory.push({...anInventory, deleted: true});
          }
        })
      } 

      bulkUpdateInventory(
        {
          variables: {
            inventory: newInventory.concat(deletedInventory)
          }
        }
      )

    }
  }

  const onDeleteProduct = () => {
    confirmation('confirm',"Confirm delete?",()=>{
      deleteProduct({variables:{_id: product._id}})
    })
  }

  const getModalFooter = () => {
    const modalFooter = [
      <Button key={'cancel'} onClick={modalProps.onCancel}>
        Cancel
      </Button>,
      <Button key={'submit'} type="primary" onClick={()=>{form.submit()}}>
        {product ? "Save" : "Save"}
      </Button>
    ]
  
    if (product) {
      modalFooter.unshift(
        <Button key={'delete'} type="danger" onClick={onDeleteProduct}>
          Delete
        </Button>
      )
    }
    return modalFooter;
  }

  // const QiniuAPI = qiniuAPI();

  return (
    <div id="productForm">
      <Button onClick={()=>{
        console.log('fileList',fileList)
        QiniuAPI.upload(fileList[0].originFileObj)
        {/* console.log('QiniuAPI',QiniuAPI) */}
        {/* QiniuAPI.upload() */}
        }}>
        upload test
      </Button>
      <Collapse 
        defaultActiveKey={['1','2']} 
        //bordered={false}
        expandIconPosition="right"
      >
        <Panel header="Product Information" key="1">
          <Form 
            name="complex-form" 
            form={form} 
            onFinish={onFinish} 
            labelCol={{ span: 5 }} 
            wrapperCol={{ span: 16 }} 
          >
            <Form.Item name={'name'} label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={'description'} label="Description">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name={'published'} label="Published" valuePropName="checked">
              <Switch checkedChildren="On" unCheckedChildren="Off" />
            </Form.Item>

            <Form.Item name={'images'} label="Images">
              <React.Fragment>
                <Upload
                  accept="image/*"
                  beforeUpload={ (file) => {
                    console.log("beforeUpload", file)
                    return false;
                  }}
                  listType="picture-card"
                  multiple={true}
                  fileList={fileList}
                  onPreview={handlePreviewOpen}
                  onChange={handleFileListChange}
                >
                  {fileList.length < fileLimit ? uploadButton : null}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={handlePreviewClose}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </React.Fragment>
            </Form.Item>
          </Form> 

        </Panel>
        {
          product ? (
            <Panel header="Pricing & Variants" key="2">
              <InventoryFormTable
                productId={product._id}
                inventoryData={inventoryData}
                setInventoryData={setInventoryData}
                productVariants={productVariants}
                setProductVariants={setProductVariants}
              />
            </Panel>
          ) : null
        }
      </Collapse>
    </div>
  )
}

export default ProductForm;