import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { axiosInstance } from '../axios.util';
import * as storage from '../storage.helper'
import { Spin, Alert, Space, notification } from 'antd';


export default function NewPassword() {

    const initialForm = {
        newPassword: "",
        newPassword1: "",
    }
    const history = useHistory();
    const [form, setForm] = useState({ ...initialForm });
    const [isWaitClick, setIsWaitClick] = useState(false);
    const [errorState, setErrorState] = useState('');
    const [visible, setVisible] = useState(false);

    const email = storage.GetCookie('passPres')

    const handleTextChange = (value, key) => {
        setForm({
            ...form,
            [key]: value
        })
    }
    const showNotification = (icon, message) => {
        if (icon === 'error') {
            let notificationClass = 'custom-error-notification';
            notification.error({
                message: 'Error',
                description: message,
                placement: 'topRight',
                className: notificationClass,
            });
        } else if (icon === 'success') {
            let notificationClass = 'custom-success-notification';
            notification.success({
                message: 'Success',
                description: `${message}`,
                placement: 'topRight',
                className: notificationClass
            });
        }
    };


    const ClickNewPassword = async (e) => {
        e.preventDefault();

        if (isWaitClick) {
            return;
        }

        if (form.newPassword.trim() === "" || form.newPassword1.trim() === "") {
            setErrorState("Please enter a new password");
            setVisible(true);
            return;
        }
        setIsWaitClick(true);
        if (form.newPassword === form.newPassword1) {
            try {
                const { data } = await axiosInstance.post(`/User/NewPasswordReset/${email}`, {
                    newPassword: form.newPassword,
                })
                storage.RemoveCookie('passPres')
                history.push('/Login')
                showNotification('success', data.message)
            } catch (error) {
                setErrorState(error.response.data.error);
                setVisible(true);
            } finally {
                setIsWaitClick(false);
                setForm({
                    ...initialForm,
                });
                setTimeout(() => {
                    setVisible(false);
                    setErrorState('');
                }, 5000);
            }
        }
    }


    return (
        <div className='NewPasswordDiv'>
            <div className='NewPasswordPage'>
                <h1 className='PageHeader'>New Password</h1>
                <form className='NewPasswordForm'>
                    <Space direction="vertical" style={{ width: '100%', display: visible ? 'block' : 'none' }}>
                        <Alert message={errorState} type="error" showIcon />
                    </Space>
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
