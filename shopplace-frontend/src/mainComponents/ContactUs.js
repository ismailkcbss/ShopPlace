import React, { useState } from 'react'
import { axiosInstance } from '../axios.util'

export default function ContactUs() {
    const initialForm = {
        userName: "",
        email: "",
        phone: "",
        description: ""
    }

    const [form, setForm] = useState({ ...initialForm })

    const handleTextChange = (value, key) => {
        setForm({
            ...form,
            [key]: value,
        })
    }

    const ClickContactUs = async () => {
        if (form.userName.trim() === "" || form.email.trim() === "" || form.phone.trim() === "" || form.description.trim() === "") {
            alert("Please fill in the form")
            return;
        }
        try {
            const { data } = await axiosInstance.post(`/User/ContactUs`, {
                username: form.userName,
                email: form.email,
                phone: form.phone,
                description: form.description
            })
            setTimeout(() => {
                alert("Sent successfully")
                setForm({ ...initialForm })
            }, 5000);
        } catch (error) {
            alert("Try again")
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
                    <button className='ContactUsButton' onClick={ClickContactUs}>Send</button>
                </form>
            </div>
        </div>
    )
}
