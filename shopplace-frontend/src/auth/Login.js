import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { axiosInstance, setApiToken } from '../axios.util';
import { userActions } from '../redux/slice/userSlice';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import * as storage from '../storage.helper';
import { Spin, Alert, Space } from 'antd';


export default function Login() {

    const initialForm = {
        email: "",
        password: "",
    }
    const dispatch = useDispatch();
    const history = useHistory();

    const [form, setForm] = useState({ ...initialForm })
    const [isWaitClick, setIsWaitClick] = useState(false);
    const [errorState, setErrorState] = useState('');
    const [visible, setVisible] = useState(false);



    const handleTextChange = (value, key) => {
        setForm({
            ...form,
            [key]: value
        })
    }

    const ClickLogin = async (e) => {
        e.preventDefault();
        if (isWaitClick) {
            return;
        }
        if (form.email.trim() === "" || form.password.trim() === "") {
            setErrorState("Please enter your information");
            setVisible(true);
            return;
        }
        setIsWaitClick(true);
        try {
            const { data } = await axiosInstance.post(`/User/Login`, {
                email: form.email,
                password: form.password
            })
            storage.setKeyWithValue('userdt', data.token)
            setApiToken(data.token)
            dispatch(userActions.login(data));
            history.push('/');
        } catch (error) {
            setErrorState(error.response.data.error);
            setVisible(true);
        } finally {
            setIsWaitClick(false);
            setForm({ ...initialForm, });
            setTimeout(() => {
                setVisible(false);
                setErrorState('');
            }, 5000);
        };
    }



    return (
        <div className='LoginDiv'>
            <div className='LoginPage'>
                <h1 className='PageHeader'>Login</h1>
                <form className='LoginForm'>
                    <Space direction="vertical" style={{ width: '100%', display: visible ? 'block' : 'none' }}>
                        <Alert message={errorState} type="error" showIcon />
                    </Space>
                    <span className='FormHeader'>Email adress</span>
                    <input
                        type='email'
                        className='LoginInput'
                        value={form.email}
                        onChange={(e) => handleTextChange(e.target.value, "email")}
                    />
                    <span className='FormHeader'>Password</span>
                    <input
                        type='password'
                        className='LoginInput'
                        value={form.password}
                        onChange={(e) => handleTextChange(e.target.value, "password")}
                    />
                    {
                        isWaitClick ? (
                            <button className='LoginButtonDisable' disabled>
                                <Spin />  Login...
                            </button>
                        ) : (
                            <button className='LoginButton' onClick={ClickLogin}>
                                Login
                            </button>
                        )
                    }
                    <div className='LoginFooter'>
                        <span>Forgot your password? <button className='LoginFotButton' onClick={() => history.push('/ForgotPassword')}>Click here</button></span>
                        <span>Don't have an account? <button className='LoginFotButton' onClick={() => history.push('/Register')}>Click here</button></span>
                    </div>
                </form>
            </div>
        </div>
    )
}
