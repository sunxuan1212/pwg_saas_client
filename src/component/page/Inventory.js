import React, {useState, useEffect} from 'react';
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, Table, Tag, message } from 'antd';
import {
  PlusOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';

import Page_01 from './component/Page_01';
import Loading from '../../utils/component/Loading';
import ProductForm from './component/ProductForm';
import { useConfigCache } from '../../utils/Constants';


const GET_PRODUCTS_QUERY = gql`
  query products($filter: JSONObject, $configId: String) {
    products(filter: $filter, configId: $configId) {
      _id
      createdAt
      updatedAt
      name
      description
      category
      variants
      published
      images
    }
  }
`;

const READ_PRODUCT_INVENTORY_QUERY = gql`
  query inventory($filter: JSONObject, $configId: String) {
    inventory(filter: $filter, configId: $configId) {
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

const UPDATE_PRODUCT_PUBLISH = gql`
  mutation updateProductPublish($ids: [String!], $published: Boolean!) {
    updateProductPublish(ids: $ids, published: $published) {
      success
      message
      data
    }
  }
`;

const UPDATE_INVENTORY_PUBLISH = gql`
  mutation updateInventoryPublish($ids: [String!], $published: Boolean!) {
    updateInventoryPublish(ids: $ids, published: $published) {
      success
      message
      data
    }
  }
`;

const getAllProductCategory = (products) => {
  let result = [];
  products.map((aProduct)=>{
    if (aProduct.category && aProduct.category.length > 0) {
      aProduct.category.map((aCategory)=>{
        let foundPushedItem = result.find((anItem)=>anItem._id == aCategory._id);
        if (!foundPushedItem) {
          result.push(aCategory);
        }
      })
    }
  });
  return result;
}

const Inventory = (props) => {
  const [ productFormModal, setProductFormModal ] = useState(false);
  const [ selectedProduct, setSelectedProduct ] = useState(null);

  const [ selectedItems, setSelectedItems ] = useState([]);
  const [ displaySelectionPanel, setDisplaySelectionPanel ] = useState(false);

  const configCache = useConfigCache();
  const { data: productsData, loading, error, refetch: refetchProducts } = useQuery(GET_PRODUCTS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      // filter: {
      //   sorter: {
      //     createdAt: 1
      //   }
      // }
      configId: configCache.configId
    },
    onError: (error) => {
      console.log("products error", error)

    },
    onCompleted: (result) => {
      
    }
  });

  const { data: inventoryData, loading: inventoryLoading, error: inventoryError, refetch: refetchInventory } = useQuery(READ_PRODUCT_INVENTORY_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      configId: configCache.configId
    },
    onError: (error) => {
      console.log("inventoryData error", error)
    },
    onCompleted: (result) => {
      // console.log('inventoryData', result)
    }
  });

  const [updateProductPublish] = useMutation(UPDATE_PRODUCT_PUBLISH,{
    onCompleted: (result) => {
      refetchProducts();
    }
  });
  const [updateInventoryPublish] = useMutation(UPDATE_INVENTORY_PUBLISH,{
    onCompleted: (result) => {
      refetchInventory();
    }
  });


  useEffect(()=>{
    if (selectedItems.length > 0) {
      if (!displaySelectionPanel) setDisplaySelectionPanel(true);
    }
    else {
      if (displaySelectionPanel) setDisplaySelectionPanel(false)
    }
  },[selectedItems.length])


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

  const refetchData = () => {
    refetchProducts();
    refetchInventory();
  }


  let columns = [
    {
      title: 'No.',
      dataIndex: 'index',
      width: 75,
      render: (text, record, index) => {
        return index + 1 + '.';
      }
    },
    {
      title: "Created At",
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text, record) => {
        let dateTime = format(new Date(text), "MM/dd/yyyy hh:mm:ss aa")
        return dateTime;
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => {
        let result = record.name ? (<Button type="link" onClick={()=>{handleOnClickProduct(record)}}>{record.name}</Button>) : null;
        if (!result) {
          let newName = "";
          if (record.variants) {
            
            let variantKeys = Object.keys(record.variants);
            variantKeys.map((aKey, index)=>{
              newName += `${record.variants[aKey]} ${index == variantKeys.length - 1 ? "" : "/ "}`
            })
          }
          else {
            newName = "-";
          }
          result = newName;
        }
        return result;
      }
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (text, record) => {
        let result = record.price;
        if (!result) {
          result = '-';
        }
        return result;
      }
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      sorter: (a, b) => {
        if (a.stock && b.stock) {
          return a.stock - b.stock
        }
        return 0;
      },
      render: (text, record) => {
        let result = record.stock;
        if (!result) {
          if (record.children && record.children.length > 0) {
            let sum = 0;
            record.children.map((aChild)=>{sum += aChild.stock});
            result = sum;
          }
          else {
            result = '-';
          }
        }
        return result;
      }
    },
    {
      title: 'Published',
      dataIndex: 'published',
      render: (text, record) => {
        return (
          record.published ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
        )
      } 
    }
  ]

  

  const selectionPanel = () => {
    let inventoryIds = [];
    let productIds = [];
    selectedItems.map((anItem)=>{
      if (anItem.productId && anItem.productId != "") {
        inventoryIds.push(anItem._id)
      }
      else {
        productIds.push(anItem._id)
      }
    });
  
    const updateToPublish = () => {
      if (inventoryIds.length > 0) {
        updateInventoryPublish({
          variables: {
            ids: inventoryIds,
            published: true
          }
        })
      }
      if (productIds.length > 0) {
        updateProductPublish({
          variables: {
            ids: productIds,
            published: true
          }
        })
      }
    }
    const updateToUnpublish = () => {
      if (inventoryIds.length > 0) {
        updateInventoryPublish({
          variables: {
            ids: inventoryIds,
            published: false
          }
        })
      }
      if (productIds.length > 0) {
        updateProductPublish({
          variables: {
            ids: productIds,
            published: false
          }
        })
      }
    }
    return (
      <div style={{display: 'flex'}}>
        <Button type="primary" size="small" onClick={updateToPublish} style={{marginRight: '5px'}} disabled={!displaySelectionPanel}>Publish</Button>
        <Button size="small" onClick={updateToUnpublish} disabled={!displaySelectionPanel}>Unpublish</Button>
      </div>
    )
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedItems(selectedRows);
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      // console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
    },
  };

  const getTableData = () => {
    let result = [];
    if (productsData && inventoryData && !error && !inventoryError) {
      let inventoryWithKey = inventoryData.inventory.map((anInventory)=>{ return {...anInventory, key: anInventory._id} });
      productsData.products.map((aProduct,index)=>{
        let productInventory = inventoryWithKey.filter((anInventory)=>anInventory.productId == aProduct._id);
        aProduct['key'] = aProduct._id;
        if (productInventory.length > 0) {
          aProduct['children'] = productInventory;
        }
        result.push(aProduct)
      });
    }
    return result;
  }

  let hasSelected = selectedItems.length > 0 ? true : false;

  return (
    <Page_01
      title={"Inventory"}
      extra={[
        <Button key="create" type="primary" icon={<PlusOutlined />} onClick={()=>{handleOnClickProduct(null)}} />
      ]}
    >
      <Table 
        columns={columns} 
        rowSelection={rowSelection} 
        dataSource={getTableData()} 
        pagination={false}
        scroll={{x: columns.length * 150}}
        size={'small'}
      />
      <div className={`inventory-selectionPanel ${displaySelectionPanel ? 'open' : 'close'}`}>
        {selectionPanel()}
      </div>

      <ProductForm
        // product props
        product={selectedProduct} 
        categories={productsData && productsData.products ? getAllProductCategory(productsData.products) : []}
        refetch={refetchData}

        // modal props
        modalVisible={productFormModal}
        closeModal={handleProductFormModalClose}
      />
    </Page_01>
  )
}

export default Inventory;
