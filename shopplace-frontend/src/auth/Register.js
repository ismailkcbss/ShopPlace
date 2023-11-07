import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { axiosInstance } from '../axios.util';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Spin, Alert, Space } from 'antd';

export default function Register() {

    const initialForm = {
        userName: "",
        email: "",
        password: "",
        phone: "",
        sellerCheck: false
    }
    const history = useHistory();

    const [form, setForm] = useState({ ...initialForm });
    const [image, setImage] = useState(null);
    const [isWaitClick, setIsWaitClick] = useState(false);
    const [errorState, setErrorState] = useState('');
    const [visible, setVisible] = useState(false);


    const handleTextChange = (value, key) => {
        setForm({
            ...form,
            [key]: value
        })
    }


    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const ClickRegister = async (e) => {
        e.preventDefault();

        if (isWaitClick) {
            return;
        }

        if (form.userName.trim() === "" || form.email.trim() === "" || form.password.trim() === "" || form.phone.trim() === "") {
            alert("Please enter information")
            return;
        }
        setIsWaitClick(true);
        const imageRef = ref(storage, uuidv4());
        try {
            await uploadBytes(imageRef, image);
            const result = await getDownloadURL(imageRef);
            const { data } = await axiosInstance.post(`/User/Register`, {
                username: form.userName,
                email: form.email,
                password: form.password,
                phone: form.phone,
                image: result,
                seller: form.sellerCheck
            })
            history.push('/Login')
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

    return (
        <div className='RegisterDiv'>
            <div className='RegisterPage'>
                <h1 className='PageHeader'>Register</h1>
                <form className='RegisterForm'>
                    <Space direction="vertical" style={{ width: '100%', display: visible ? 'block' : 'none' }}>
                        <Alert message={errorState} type="error" showIcon />
                    </Space>
                    <span className='FormHeader'>Username</span>
                    <input
                        type='text'
                        className='RegisterInput'
                        value={form.userName}
                        onChange={(e) => handleTextChange(e.target.value, "userName")}
                    />
                    <span className='FormHeader'>Email adress</span>
                    <input
                        type='text'
                        className='RegisterInput'
                        value={form.email}
                        onChange={(e) => handleTextChange(e.target.value, "email")}
                    />
                    <span className='FormHeader'>Password</span>
                    <input
                        type='password'
                        className='RegisterInput'
                        value={form.password}
                        onChange={(e) => handleTextChange(e.target.value, "password")}
                    />
                    <span className='FormHeader'>Phone</span>
                    <input
                        type='number'
                        className='RegisterInput'
                        value={form.phone}
                        onChange={(e) => handleTextChange(e.target.value, "phone")}
                    />
                    <span className='FormHeader'>Upload image file</span>
                    <input
                        type='file'
                        onChange={handleImageChange}
                        className='RegisterFileInput'
                    />
                    <span className='FormHeader'>I want to create a seller account</span>
                    <input
                        type='checkbox'
                        style={{ margin: "1rem 0 2rem 0", width: "1.4rem", height: "1.4rem" }}
                        value={form.sellerCheck}
                        onChange={(e) => handleTextChange(e.target.checked, "sellerCheck")}
                    />
                    {
                        isWaitClick ? (
                            <button className='RegisterButtonDisable' disabled>
                                <Spin />  Registering...
                            </button>
                        ) : (
                            <button className='RegisterButton' onClick={ClickRegister}>
                                Register
                            </button>
                        )
                    }
                </form>
            </div>
        </div>
    )
}
