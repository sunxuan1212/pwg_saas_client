import React from 'react';
import { Tag, Tooltip, Typography } from 'antd';
import * as Constants from '../../../utils/Constants';

const { Paragraph } = Typography;

const ProductCard = (props) => {
  const { product } = props;

  const getProductImages = () => {
    let srcResult = Constants.defaultImage;
    if (product.images && product.images.length > 0) {
      
    }
    return {
      backgroundImage: `url(${srcResult})`
    }
  }


  return (
    <div className="productCard-container">
      <div className="productCard-media" style={getProductImages()}></div>
      <div className="productCard-info">
        
        <div className="productCard-status">
          <Tooltip title={product.name}>
            <div className="productCard-title">{product.name}</div>
          </Tooltip>
          {
            product.published ? <Tag color="green">On</Tag> : <Tag color="red">Off</Tag>
          }
        </div>
      </div>
    </div>
  );
}

export default ProductCard;