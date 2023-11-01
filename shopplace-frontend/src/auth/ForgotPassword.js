import React, { useState } from 'react'
import { axiosInstance } from '../axios.util'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { Spin } from 'antd';


export default function ForgotPassword() {

    const initialForm = {
        email: "",
    }
    const history = useHistory();

    const [form, setForm] = useState({ ...initialForm })
    const [isWaitClick, setIsWaitClick] = useState(false);


    const handleTextChange = (value, key) => {
        setForm({
            ...form,
            [key]: value
        })
    }
    const ClickForgotPassword = async (e) => {
        e.preventDefault();

        if (isWaitClick) {
            return;
        }

        if (form.email.trim() === "") {
            alert("Please enter your email")
            return;
        }

        setIsWaitClick(true);
        try {
            const { data } = await axiosInstance.post(`/User/ForgotPasswordSendMail`, {
                email: form.email
            })
            history.push('/Login');
        } catch (error) {
            alert('Please check the e-mail address')
        } finally {
            setIsWaitClick(false);
            setForm({
                ...initialForm,
            });
        }
    }

    return (
        <div className='ForgotPasswordDiv'>
            <div className='ForgotPasswordPage'>
                <h1 className='PageHeader'>Enter your email and we'll send you a link to reset your password.</h1>
                <form className='ForgotPasswordForm'>
                    <span className='FormHeader'>Email adress</span>
                    <input
                        type='email'
                        className='ForgotPasswordInput'
                        value={form.email}
                        onChange={(e) => handleTextChange(e.target.value, "email")}
                    />
                    {
                        isWaitClick ? (
                            <button className='ForgotPasswordButtonDisable' disabled>
                                <Spin />  Sending...
                            </button>
                        ) : (
                            <button
                                className='ForgotPasswordButton'
                                onClick={ClickForgotPassword}
                            >
                                Send
                            </button>
                        )
                    }
                </form>
            </div>
        </div>
    )
}
