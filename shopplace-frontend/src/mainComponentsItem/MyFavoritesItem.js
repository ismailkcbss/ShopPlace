import React from 'react'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function MyFavoritesItem(props) {

  const { item } = props;

  const userRole = useSelector((state) => state.user.user)

  const history = useHistory()

  const ClickProduct = () => {
    if (userRole.seller) {
      if (userRole._id === item.productOwner) {
        history.push(`/${item.productType}` + `ProductViewer/${item._id}`)
      } else {
        history.push(`/${item.productType}` + `ProductCardItem/${item._id}`)
      }
    } else {
      history.push(`/${item.productType}` + `ProductCardItem/${item._id}`)
    }
  }

  return (
    <div className='ProductCardDiv' onClick={ClickProduct}>
      <div className='ProductCardImg'>
        <img src={item.productImage[0]} alt='ProductImg' />
      </div>
      <div className='ProductCardDesc'>
        <p className='ProductCardTitle'><span>Product name:</span> {item.productName}</p>
        <p className='ProductCardPrice'><span>Product price:</span> ₺ {item.productPrice}</p>
      </div>
    </div>
  )
}
