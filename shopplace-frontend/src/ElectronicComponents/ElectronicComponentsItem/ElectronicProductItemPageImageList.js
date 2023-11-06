import React from 'react'
import { Carousel } from 'antd';

export default function ElectronicProductItemPageImageList(props) {

  const { productData } = props;
  
  return (
    <div>
      <Carousel effect="fade">
        {
          productData?.productImage.map((image) => (
            <div key={image} className='ElectronicProductViewerPageImage'>
              <img src={image} alt='productImage' />
            </div>
          ))
        }
      </Carousel>
    </div>
  )
}
