import React from 'react'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

export default function ProductCard(props) {
  
    const { item } = props;
    const userRole = useSelector((state) => state.user.user)

    console.log("redux userid = ",userRole._id);
    console.log("ürün userid = ",item.productOwner);

    const history = useHistory()

    const ClickProduct = () => {
        if (userRole.seller) {
            if(userRole._id === item.productOwner){
                if (item.productType === "Clothes") {
                    history.push(`/ClothesProductViewer/${item._id}`)
                }
                else if(item.productType === "Shoes") {
                    history.push(`/ShoesProductViewer/${item._id}`)
                }
            }else{
                if (item.productType === "Clothes") {
                    history.push(`/ClothesProductCardItem/${item._id}`)
                }
                else if(item.productType === "Shoes") {
                    history.push(`/ShoesProductCardItem/${item._id}`)
                }
            }
        } else {
            if (item.productType === "Clothes") {
                history.push(`/ClothesProductCardItem/${item._id}`)
            }
            else if(item.productType === "Shoes") {
                history.push(`/ShoesProductCardItem/${item._id}`)
            }
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
