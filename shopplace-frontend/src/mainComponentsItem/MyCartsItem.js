import React, { useEffect, useState } from 'react'
import { DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import * as storage from '../storage.helper'
import { useSelector } from 'react-redux';


export default function MyCartsItem(props) {

    const { Pitem, setCartProduct } = props;

    const userCart = useSelector((state) => state.user.user)

    const product = Pitem.product;
    const quantity = Pitem.quantity;

    const [productCartQuentity, setProductCartQuentity] = useState(quantity);

    function getCart() {
        const cartJSON = storage.getValueByKey(`${userCart.username}` + `cart`);
        return cartJSON ? JSON.parse(cartJSON) : [];
    }

    const handleDeleteClick = (productID) => {
        const cart = getCart() || [];
        const updatedCart = cart.filter(item => item.product._id !== productID);
        storage.setKeyWithValue(`${userCart.username}` + `cart`, JSON.stringify(updatedCart));
        setCartProduct(updatedCart)
    }


    const handleAdetSayacClick = (pID, action) => {
        if (action === 'plus' && productCartQuentity > 0 && productCartQuentity < product.productPiece) {
            setProductCartQuentity(productCartQuentity + 1)
            updateQuantityInCartByProductID(pID, productCartQuentity + 1)
        }
        else if (action === 'minus' && productCartQuentity > 1) {
            setProductCartQuentity(productCartQuentity - 1)
            updateQuantityInCartByProductID(pID, productCartQuentity - 1)
        }
    }

    function updateQuantityInCartByProductID(pID, setProductCartQuentity) {
        const cart = getCart() || [];
        const updatedCart = cart.map(item => {
            if (item.product._id === pID) {
                item.quantity = setProductCartQuentity;
                item.sumCartPrice = (setProductCartQuentity * product.productPrice)
            }
            return item;
        });
        storage.setKeyWithValue(`${userCart.username}` + `cart`, JSON.stringify(updatedCart));
    }

    return (
        <div className='MyCartCard'>
            <div className='MyCartCardImage'>
                <img src={product.productImage[0]} alt='MyCartImage' />
            </div>
            <div className='MyCartCardInfo'>
                <div className='MyCartCardInfoData'>
                    <p>
                        <span> Product Name:</span> {product.productName}
                    </p>
                    <p>
                        <span> Product Type:</span> {product.productType}
                    </p>
                    <p>
                        <span> Maximum Quantity:</span> {product.productPiece}
                    </p>
                    <p>
                        <span> Product Total Amount:</span> {product.productPrice * productCartQuentity}
                    </p>
                </div>
                <div className='MyCartCardButton'>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                        <button
                            onClick={() => handleDeleteClick(product._id)}
                            className='MyCartCardButtonDeleteIcon'
                        >
                            <DeleteOutlined />
                        </button>
                        <p>Delete Product</p>
                        <div>
                        </div>
                    </div>

                    <div style={{ display: "flex",flexDirection:"column", alignItems: "center" }}>
                        <span>Piece</span>
                        <div>
                            <button
                                id='plus'
                                name={product._id}
                                className='MyCartCardButtonPlusMinIcon'
                                onClick={() => handleAdetSayacClick(product._id, 'plus')}
                            ><PlusCircleOutlined /></button>
                            <span style={{ fontSize: "1.2rem", color: "rgba(82, 82, 82, 0.664)" }}>{productCartQuentity}</span>
                            <button
                                id='minus'
                                name={product._id}
                                className='MyCartCardButtonPlusMinIcon'
                                onClick={() => handleAdetSayacClick(product._id, 'minus')}
                            ><MinusCircleOutlined /></button>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    )
}
