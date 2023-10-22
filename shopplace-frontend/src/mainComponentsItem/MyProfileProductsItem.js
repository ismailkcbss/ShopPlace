import React from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function MyProfileProductsItem(props) {

    const { productItem } = props;
    const history = useHistory();

    const handleMyProfileProductClick = () => {
        if(productItem.productType === 'Clothes'){
            history.push(`/ClothesProductViewer/${productItem._id}`)
        }
        else if (productItem.productType === 'Shoes'){
            history.push(`/ShoesProductViewer/${productItem._id}`)
        }
    }

    return (
        <div className='MyProfileProductsItemDiv' onClick={handleMyProfileProductClick}>
            <div className='MyProfileProductsItemImg'>
                <img src={productItem.productImage[0]} alt='ProductImg' />
            </div>
            <div className='MyProfileProductsItemDesc'>
                <p className='MyProfileProductsItemHeader'><span>Product name:</span> {productItem.productName}</p>
                <p className='MyProfileProductsItemPrice'><span>Product price:</span> ₺ {productItem.productPrice}</p>
            </div>
        </div>
    )
}
