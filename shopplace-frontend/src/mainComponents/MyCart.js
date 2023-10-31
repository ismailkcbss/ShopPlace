import React, { useEffect, useState } from 'react'
import MyCartsItem from '../mainComponentsItem/MyCartsItem'
import Navbar from './navbar'
import * as storage from '../storage.helper'
import { useSelector } from 'react-redux'
import Loading from '../Loading'
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
                                    cartProducts?.map((Pitem) => (
                                        <MyCartsItem key={Pitem.product._id} Pitem={Pitem} setCartProduct={setCartProduct} />
                                    ))

                                ) : (
                                    <p style={{ textAlign: "center" }}>Sepet boş</p>
                                )
                                }
                            </div>
                            < div style={{ width: "100%", height: "auto", margin: "1rem 0 1rem 0", textAlign: "center" }}>
                                <button
                                    onClick={() => history.push('/PayPage')}
                                    className='MyCartListButton'
                                >Confirm the cart</button>
                            </div>
                        </div>
                    ) : (
                        <Loading />
                    )
                }

            </div>
        </div >
    )
}
