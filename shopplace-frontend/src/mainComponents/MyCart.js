import React, { useEffect, useState } from 'react'
import MyCartsItem from '../mainComponentsItem/MyCartsItem'
import Navbar from './navbar'
import * as storage from '../storage.helper'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'


export default function MyCart() {

    const history = useHistory();

    const [cartProducts, setCartProduct] = useState(null)
    const userCart = useSelector((state) => state.user.user)
    const [loading, setLoading] = useState(false)


    function getCart() {
        const cartJSON = storage.getValueByKey(`${userCart.username}cart`);
        if (cartJSON) {
            setCartProduct(JSON.parse(cartJSON))
            setLoading(true);
        } else {
            setCartProduct([])
        }
    }

    useEffect(() => {
        getCart();
    }, [userCart])


    return (
        <div className='MyCartDiv'>
            <Navbar />
            <div className='MyCartPage'>
                {
                    loading ? (
                        <div className='MyCartListDiv'>
                            <div className='MyCartList'>
                                {cartProducts[0] ? (
                                    <div>
                                        {cartProducts?.map((Pitem) => (
                                            <MyCartsItem key={Pitem.product._id} Pitem={Pitem} setCartProduct={setCartProduct} />
                                        ))}
                                        < div style={{ width: "100%", height: "auto", margin: "1rem 0 1rem 0", textAlign: "center" }}>
                                            <button
                                                onClick={() => history.push('/PayPage')}
                                                className='MyCartListButton'
                                            >Confirm the cart</button>
                                        </div>
                                    </div>

                                ) : (
                                    <p style={{width:"100%",height:"80vh",fontSize:"2rem", display:"flex",justifyContent:"center",alignItems:"center"}}>The cart is empty</p>
                                )
                                }
                            </div>

                        </div>
                    ) : (
                        <p style={{width:"100%",height:"80vh",fontSize:"2rem", display:"flex",justifyContent:"center",alignItems:"center"}}>The cart is empty</p>
                    )
                }

            </div>
        </div >
    )
}
