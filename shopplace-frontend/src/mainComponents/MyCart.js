import React, { useEffect, useState } from 'react'
import MyCartsItem from '../mainComponentsItem/MyCartsItem'
import Navbar from './navbar'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../Loading';
import { store } from '../redux/store';


export default function MyCart() {

    const [loading, setLoading] = useState(false);
    const [cartProducts, setCartProduct] = useState([])


    useEffect(() => {
        const savedProducts = JSON.parse(
            localStorage.getItem('MyCart'))
        if (savedProducts) {
            setCartProduct(savedProducts);
        }
    }, [])

    console.log(cartProducts);

    return (
        <div className='MyCartDiv'>
            <Navbar />
            <div className='MyCartPage'>
                <div className='MyCartList'>
                    {/* {cartProducts[0] ? (
                        cartProducts?.map((item) => (
                            <MyCartsItem key={item._id} item={item} />
                        ))
                    ) : (

                        <p>Sepet boş</p>
                    )

                    } */}

                </div>
            </div>
        </div>
    )
}
