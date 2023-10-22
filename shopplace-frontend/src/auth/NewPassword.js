import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { axiosInstance } from '../axios.util';

export default function NewPassword() {

    const initialForm = {
        newPassword: "",
        newPassword1: "",
    }
    const history = useHistory();

    const [form, setForm] = useState({ ...initialForm });

    const handleTextChange = (value, key) => {
        setForm({
            ...form,
            [key]: value
        })
    }

    const ClickNewPassword = async (e) => {
        if (form.newPassword.trim() === "" || form.newPassword1.trim() === "") {
            alert("Please enter a new password");
            return;
        }
        if (form.newPassword === form.newPassword1) {
            try {
                const { data } = await axiosInstance.post(`/User/NewPassword`, {
                    password: form.newPassword,
                })
                history.push('/Login')
            } catch (error) {
                alert("Try again");
            }
        }
    }


    return (
        <div className='NewPasswordDiv'>
            <div className='NewPasswordPage'>
                <h1 className='PageHeader'>New Password</h1>
                <form className='NewPasswordForm'>
                    <span className='FormHeader'>New Password</span>
                    <input
                        type='password'
                        className='NewPasswordInput'
                        value={form.newPassword}
                        onChange={(e) => handleTextChange(e.target.value, "newPassword")}
                    />
                    <span className='FormHeader'>Re-enter password</span>
                    <input
                        type='password'
                        className='NewPasswordInput'
                        value={form.newPassword1}
                        onChange={(e) => handleTextChange(e.target.value, "newPassword1")}
                    />
                    <button
                        className='NewPasswordButton'
                        onClick={ClickNewPassword}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}
