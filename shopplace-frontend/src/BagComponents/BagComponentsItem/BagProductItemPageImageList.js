import React from 'react'
import { Carousel } from 'antd';


export default function BagProductItemPageImageList(props) {

    const { productData } = props;

  return (
    <div>
    <Carousel effect="fade">
        {
            productData?.productImage.map((image) => (
                <div key={image} className='BagProductViewerPageImage'>
                    <img src={image} alt='productImage' />
                </div>
            ))
        }
    </Carousel>
</div>
  )
}
