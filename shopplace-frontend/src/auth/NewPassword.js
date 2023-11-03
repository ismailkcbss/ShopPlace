import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { axiosInstance } from '../axios.util';
import * as storage from '../storage.helper'
import { Spin } from 'antd';


export default function NewPassword() {

    const initialForm = {
        newPassword: "",
        newPassword1: "",
    }
    const history = useHistory();
    const [form, setForm] = useState({ ...initialForm });
    const [isWaitClick, setIsWaitClick] = useState(false);


    const email = storage.GetCookie('passPres')

    const handleTextChange = (value, key) => {
        setForm({
            ...form,
            [key]: value
        })
    }


    const ClickNewPassword = async (e) => {
        e.preventDefault();
       
        if (isWaitClick) {
            return;
        }

        if (form.newPassword.trim() === "" || form.newPassword1.trim() === "") {
            alert("Please enter a new password");
            return;
        }
        setIsWaitClick(true);
        if (form.newPassword === form.newPassword1) {
            try {
                const { data } = await axiosInstance.post(`/User/NewPasswordReset/${email}`, {
                    newPassword: form.newPassword,
                })
                alert('The old password was successfully reset')
                storage.RemoveCookie('passPres')
                history.push('/Login')
            } catch (error) {
                alert(error.response.data.error);
                console.log(error);
            } finally {
                setIsWaitClick(false);
                setForm({
                    ...initialForm,
                });
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
                    <span className='FormHeader'>Re-enter new password</span>
                    <input
                        type='password'
                        className='NewPasswordInput'
                        value={form.newPassword1}
                        onChange={(e) => handleTextChange(e.target.value, "newPassword1")}
                    />
                    {
                        isWaitClick ? (
                            <button className='NewPasswordButtonDisable' disabled>
                                <Spin />  Saving...
                            </button>
                        ) : (
                            <button
                                className='NewPasswordButton'
                                onClick={ClickNewPassword}
                            >
                                Save
                            </button>
                        )
                    }
                </form>
            </div>
        </div>
    )
}
