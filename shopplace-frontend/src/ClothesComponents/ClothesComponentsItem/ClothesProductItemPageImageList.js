import React from 'react'
import { Carousel } from 'antd';

export default function ClothesProductItemPageImageList(props) {

    const { productData } = props;
    return (
        <div>
            <Carousel effect="fade">
                {
                    productData?.productImage.map((image) => (
                        <div key={image} className='ClothesProductViewerPageImage'>
                            <img src={image} alt='productImage' />
                        </div>
                    ))
                }
            </Carousel>
        </div>
    )
}
