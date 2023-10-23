import React, { useEffect, useState } from 'react'
import MyCartsItem from '../mainComponentsItem/MyCartsItem'
import Navbar from './navbar'
import * as storage from '../storage.helper'


export default function MyCart() {

    const [cartProducts, setCartProduct] = useState([])

    function getCart() {
        const cartJSON = storage.getValueByKey('cart');
        if (cartJSON) {
            setCartProduct(JSON.parse(cartJSON))
        } else {
            setCartProduct([])
        }
    }

    useEffect(() => {
        getCart();
    }, [])


    return (
        <div className='MyCartDiv'>
            <Navbar />
            <div className='MyCartPage'>
                <div className='MyCartList'>
                    {cartProducts[0] ? (
                        cartProducts?.map((Pitem) => (
                            <MyCartsItem key={Pitem.product._id} Pitem={Pitem} setCartProduct={setCartProduct}/>
                        ))
                    ) : (
                        <p>Sepet boş</p>
                    )

                    }

                </div>
            </div>
        </div>
    )
}
