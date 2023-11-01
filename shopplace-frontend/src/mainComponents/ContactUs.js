import React, { useState } from 'react'
import { axiosInstance } from '../axios.util'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { Spin } from 'antd';


export default function ContactUs() {
    const initialForm = {
        userName: "",
        email: "",
        phone: "",
        description: ""
    }

    const [form, setForm] = useState({ ...initialForm })
    const [isWaitClick, setIsWaitClick] = useState(false);

    const history = useHistory();

    const handleTextChange = (value, key) => {
        setForm({
            ...form,
            [key]: value,
        })
    }

    const ClickContactUs = async (e) => {
        e.preventDefault();
        
        if (isWaitClick) {
            return;
        }

        if (form.userName.trim() === "" || form.email.trim() === "" || form.phone.trim() === "" || form.description.trim() === "") {
            alert("Please fill in the form")
            return;
        }
        setIsWaitClick(true);
        try {
            const { data } = await axiosInstance.post(`/Main/ContactUs`, {
                username: form.userName,
                email: form.email,
                phone: form.phone,
                description: form.description
            })
            history.push('/')
        } catch (error) {
            alert("Try again")
        } finally {
            setIsWaitClick(false);
            setForm({
                ...initialForm,
            });
        }
    }

    return (
        <div className='ContactUsDiv'>
            <div className='ContactUsPage'>
                <h1 className='PageHeader'>Contact Us</h1>
                <form className='ContactUsForm'>
                    <span className='FormHeader'>Username</span>
                    <input
                        type='text'
                        className='ContactUsInput'
                        required
                        value={form.userName}
                        onChange={(e) => handleTextChange(e.target.value, "userName")}
                    />
                    <span className='FormHeader'>Email adress</span>
                    <input
                        type='text'
                        className='ContactUsInput'
                        required
                        value={form.email}
                        onChange={(e) => handleTextChange(e.target.value, "email")}
                    />
                    <span className='FormHeader'>Phone</span>
                    <input
                        type='number'
                        className='ContactUsInput'
                        required
                        value={form.phone}
                        onChange={(e) => handleTextChange(e.target.value, "phone")}
                    />
                    <span className='FormHeader'>Explanation</span>
                    <textarea
                        className='ContactUsTextarea'
                        value={form.description}
                        onChange={(e) => handleTextChange(e.target.value, "description")}
                        required
                    />
                    {
                        isWaitClick ? (
                            <button className='ContactUsButtonDisable' disabled>
                                <Spin />  Sending...
                            </button>
                        ) : (
                            <button className='ContactUsButton' onClick={ClickContactUs}>Send</button>
                        )
                    }
                </form>
            </div>
        </div>
    )
}
