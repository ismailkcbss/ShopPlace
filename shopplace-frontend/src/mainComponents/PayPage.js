import React, { useEffect, useState } from 'react'
import * as storage from '../storage.helper';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../axios.util';
import Loading from '../Loading'
import PayPageItem from '../mainComponentsItem/PayPageItem';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Navbar from './navbar';
import { Spin } from 'antd';

export default function PayPage() {

    const initialForm = {
        shippingAdress: "",
        cardName: "",
        cardNumber: "",
        cardDate: "",
        cardCvv: "",
    }
    const isAuthUser = useSelector((state) => state.user)
    const history = useHistory();

    const [cartJsonData, setCartJsonData] = useState([])
    const [form, setForm] = useState({ ...initialForm });
    const [isWaitClick, setIsWaitClick] = useState(false);


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
console.log(cartJsonData);
    const totalAmount = cartJsonData.reduce((total, cartJsonData) => total + cartJsonData.sumCartPrice, 0); // cart price sum 

    const PlaceOrderClick = async (e) => {
        e.preventDefault();

        if (isWaitClick) {
            return;
        }
        setIsWaitClick(true);
        try {
            const { data } = await axiosInstance.post(`/Main/MyOrder`, {
                productSumPrice: totalAmount,
                shippingAdress: form.shippingAdress
            })
            history.push('/')
            storage.setKeyWithValue(`${isAuthUser.user.username}cart`, "");
        } catch (error) {
            alert(error.message);
        } finally {
            setIsWaitClick(false);
            setForm({
                ...initialForm,
            });
        }
    }

    useEffect(() => {
        getCart();
    }, [isAuthUser])

    return (
        <div className='PayPageDiv'>
            <Navbar />
            <div className='PayPage'>
                <div className='ProductSummaryDiv'>
                    <div className='PayPageProductBrief'>
                        {Loading ? (
                            <PayPageItem item={cartJsonData} totalAmount={totalAmount} />
                        ) : (
                            <loading />
                        )
                        }
                    </div>
                    <div className='PayPageFormDiv'>
                        <form className='PayPageForm'>
                            <span className='FormHeader'>Shipping Address</span>
                            <textarea
                                value={form.shippingAdress}
                                onChange={(e) => handleTextChange(e.target.value, "shippingAdress")}
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
                                min={0}
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
                                min={0}
                                className='PayPageInput'
                                required
                                value={form.cardCvv}
                                onChange={(e) => handleTextChange(e.target.value, "cardCvv")}
                            />
                            {
                                isWaitClick ? (
                                    <button className='PayPageButtonDisable' disabled>
                                        <Spin />  Waiting...
                                    </button>
                                ) : (
                                    <button
                                        onClick={PlaceOrderClick}
                                        className='PayPageButton'
                                    >Complete the payment</button>
                                )
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
