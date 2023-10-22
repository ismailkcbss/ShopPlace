import React from 'react'

export default function MyFavoritesItem(props) {

  const { productItem } = props;

  return (
    <div className='MyFavoritesItemDiv'>
      {/* <div className='MyFavoritesItemImg'>
        <img src={productItem.productImage[0]} alt='ProductImg' />
      </div>
      <div className='MyFavoritesItemDesc'>
        <p className='MyFavoritesItemHeader'><span>Product name:</span> {productItem.productName}</p>
        <p className='MyFavoritesItemPrice'><span>Product price:</span> ₺ {productItem.productPrice}</p>
      </div> */}
    </div>
  )
}
