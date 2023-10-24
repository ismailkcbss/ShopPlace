import React, { useEffect, useState } from 'react'
import * as storage from '../storage.helper';
import { useSelector } from 'react-redux';


export default function PayPage() {

    const isAuthUser = useSelector((state) => state.user)
    const [cartJsonData, setCartJsonData] = useState([])

    function getCart() {
        const cartJSON = storage.getValueByKey(`${isAuthUser.user.username}` + `cart`);
        if (cartJSON) {
            setCartJsonData(JSON.parse(cartJSON))
        } else {
            setCartJsonData([])
        }
    }
    const totalAmount = cartJsonData.reduce((total, cartJsonData) => total + cartJsonData.sumCartPrice, 0); // Sepet fiyat toplamı 

    console.log("data = ",cartJsonData);
    console.log("Toplam = ",totalAmount);


    useEffect(() => {
        getCart();
    }, [isAuthUser])

    return (
        <div className='PayPageDiv'>
            <div className='PayPage'>
                <div className='ProductSummaryDiv'>

                </div>
            </div>
        </div>
    )
}
