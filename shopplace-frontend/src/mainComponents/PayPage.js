import React, { useEffect, useState } from 'react'
import * as storage from '../storage.helper';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../axios.util';
import { DatePicker, Space } from 'antd';
import moment from 'moment';

export default function PayPage() {

    const initialform = {
        shippingAdress: "",
        cardName: "",
        cardNumber: "",
        cardDate: "",
        cardCvv: "",
    }
    const isAuthUser = useSelector((state) => state.user)


    const [cartJsonData, setCartJsonData] = useState([])
    const [form, setForm] = useState({ ...initialform });


    const handleTextChange = (value, key) => {
        setForm({
            ...form,
            [key]: value
        })
    }

    function getCart() {
        const cartJSON = storage.getValueByKey(`${isAuthUser.user.username}cart`);
        if (cartJSON) {
            setCartJsonData(JSON.parse(cartJSON))
        } else {
            setCartJsonData([])
        }
    }
    const totalAmount = cartJsonData.reduce((total, cartJsonData) => total + cartJsonData.sumCartPrice, 0); // cart price sum 


    const PlaceOrderClick = async () => {
        try {
            const { data } = await axiosInstance.post(`/Main/MyOrder`, {
                productSumPrice: totalAmount,
                shippingAdress: form.shippingAdress
            })
        } catch (error) {
            alert(error.message);
        }
    }

    useEffect(() => {
        getCart();
    }, [isAuthUser])

    return (
        <div className='PayPageDiv'>
            <div className='PayPage'>
                <div className='ProductSummaryDiv'>
                    <div className=''>
                        <form className='PayPageForm'>
                            <span className='FormHeader'>Shipping Address</span>
                            <textarea
                                value={form.shippingAdress}
                                onChange={(e) => handleTextChange(e.target.value, "shippingAdress")}
                                placeholder="Controlled autosize"
                                className='PayPageTextarea'
                            />
                            <span className='FormHeader'>Name of the Cardholder</span>
                            <input
                                type='text'
                                className='PayPageInput'
                                required
                                value={form.cardName}
                                onChange={(e) => handleTextChange(e.target.value, "cardName")}
                            />
                            <span className='FormHeader'>Card Number</span>
                            <input
                                type='number'
                                className='PayPageInput'
                                required
                                value={form.cardNumber}
                                onChange={(e) => handleTextChange(e.target.value, "cardNumber")}
                            />
                            <span className='FormHeader'>Card Date</span>
                            <input
                                type='month'
                                value={form.cardDate || ''}
                                onChange={(e) => handleTextChange(e.target.value, "cardDate")}
                                className='PayPageInputDate'
                            />
                            <span className='FormHeader'>Card CVV</span>
                            <input
                                type='number'
                                className='PayPageInput'
                                required
                                value={form.cardCvv}
                                onChange={(e) => handleTextChange(e.target.value, "cardCvv")}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
