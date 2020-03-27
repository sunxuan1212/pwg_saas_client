import React from 'react';
import Page_01 from './Page_01';

const Products = (props) => {

  const test = () => {
    let result = []
    for(let i=0; i< 20; i++) {
      result.push(
<p key={i}>
    productsproductsproductsproductsproducts
    productsproductsproductsproductsproducts
    productsproductsproductsproductsproducts
    productsproductsproductsproductsproducts
    </p>
      )
    }
    return result;
  }
  return (
    <Page_01
      title={"Products"}  
    >
    
    {test()}

    </Page_01>
  )
}

export default Products;