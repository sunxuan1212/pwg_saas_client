import React, {useState} from 'react';
import Page_01 from './component/Page_01';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, Modal } from 'antd';
import {
  PlusOutlined
} from '@ant-design/icons';
import ProductForm from './component/ProductForm';
import ProductCard from './component/ProductCard';
import Loading from '../../utils/component/Loading';


const GET_PRODUCTS_QUERY = gql`
  query products($filter: JSONObject) {
    products(filter: $filter) {
      _id
      createdAt
      updatedAt
      name
      description
      variants
      published
    }
  }
`;

const Products = (props) => {
  const [ productFormModal, setProductFormModal ] = useState(false);
  const [ selectedProduct, setSelectedProduct ] = useState(null);
  const [ modalFooter, setModalFooter ] = useState([]);

  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {

    },
    onError: (error) => {
      console.log("products error", error)

    },
    onCompleted: (result) => {
      
    }
  });

  const handleProductFormModalOpen = () => {
    setProductFormModal(true);
  }
  const handleProductFormModalClose = () => {
    setProductFormModal(false);
  }

  const handleOnClickProduct = (product) => {
    handleProductFormModalOpen();
    setSelectedProduct(product)
  }

  const getProducts = (dataInput) => {
    let result = [];
    dataInput.products.map((aProduct, index)=>{
      result.push(
        <li key={index} className="products-card-item" onClick={()=>{handleOnClickProduct(aProduct)}}>
          <ProductCard product={aProduct}/>
        </li>
      )
    })
    return result;
  }

  let modalProps = {}
  if (modalFooter) {
    modalProps['footer'] = modalFooter;
  }

  return (
    <Page_01
      title={"Products"}
      extra={[
        <Button key="create" type="primary" icon={<PlusOutlined />} onClick={()=>{handleOnClickProduct(null)}} />
      ]}
    >
      <ul className="products-container">
        {
          loading ? <Loading/> 
          : (error ? "Error" 
            : (data.products.length > 0 ? getProducts(data) : "No data"))
        }
      </ul>
      <Modal
        title={selectedProduct ? selectedProduct.name : "New Product"}
        width={'95%'}
        visible={productFormModal}
        onCancel={handleProductFormModalClose}
        destroyOnClose
        wrapClassName={'products-modalWrapper'}
        //bodyStyle={{paddingLeft:'0'}} //for left tab
        style={{overflow:"hidden"}}
        //bodyStyle={{paddingTop:'0'}}
        {...modalProps}
      >
        <ProductForm
          // product props
          product={selectedProduct} 
          refetch={refetch}

          // modal props
          modalVisible={productFormModal}
          onCancel={handleProductFormModalClose}
          setModalFooter={setModalFooter}
        />
      </Modal>
    </Page_01>
  )
}

export default Products;
