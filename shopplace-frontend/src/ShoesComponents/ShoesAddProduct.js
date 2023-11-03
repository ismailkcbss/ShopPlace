import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { axiosInstance } from '../axios.util';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Radio, Space, Spin } from 'antd';

export default function ShoesAddProduct() {

    const { id } = useParams();

    const initialForm = {
        productType: "Shoes",
        productGender: "",
        productName: "",
        productBrand: "",
        productPrice: "",
        productPiece: "",
        productDescription: "",
        productNumber: "",
        productTypeOf: "",
        productColor: "",
        productModel: "",
    }
    
    const history = useHistory();
    const [form, setForm] = useState({ ...initialForm });
    const [image, setImage] = useState([]);
    const [prevImage, setPrevImage] = useState([])
    const [userData, setUserData] = useState("")
    const [isWaitClick, setIsWaitClick] = useState(false);


    const handleTextChange = (value, key) => {
        setForm({
            ...form,
            [key]: value
        })
    }
    const ImageStringArrText = (e) => {
        for (let i = 0; i < e.target.files.length; i++) {
            const newImage = e.target.files[i];
            setImage((prevState) => [...prevState, newImage]);
        }
    }

    const saveButtonClick = async (e) => {
        e.preventDefault();

        if (isWaitClick) {
            return;
        }

        setIsWaitClick(true);
        try {
            if (id) {
                await ClickUpdateProduct();
            } else {
                await ClickNewProduct();
            }
        } catch (error) {
            alert("Cannot process the product");
        } finally {
            setIsWaitClick(false);
        }
    }

    const userMe = async () => {
        try {
            const { data } = await axiosInstance.get(`/User/UserMe`)
            setUserData(data.user);
        } catch (error) {
            alert("Not Found user");
        }
    }

    const getSingleProduct = async () => {
        if (id) {
            try {
                const { data } = await axiosInstance.get(`/Product/Seller/Shoes/${id}`)
                setForm({
                    productType: data.shoesProduct.productType,
                    productGender: data.shoesProduct.productGender,
                    productName: data.shoesProduct.productName,
                    productBrand: data.shoesProduct.productBrand,
                    productPrice: data.shoesProduct.productPrice,
                    productPiece: data.shoesProduct.productPiece,
                    productDescription: data.shoesProduct.productDescription,
                    productNumber: (data.shoesProduct.productNumber).toString(),
                    productTypeOf: data.shoesProduct.productTypeOf,
                    productColor: data.shoesProduct.productColor,
                    productModel: data.shoesProduct.productModel,
                })
                setPrevImage(data.shoesProduct.productImage)
            } catch (error) {
                alert("Not Found product");
            }
        }
    }
    const ClickUpdateProduct = async () => {
        try {
            let imageRef = [];
            let imageURL = [];
            if (image) {
                for (let i = 0; i < image.length; i++) {
                    imageRef = ref(storage, `${userData.username}/${uuidv4()}`);
                    await uploadBytes(imageRef, image[i]);
                    const result = await getDownloadURL(imageRef);
                    imageURL.push(result)
                }
            }
            const { data } = await axiosInstance.post(`/Product/Seller/Shoes/${id}`, {
                productType: form.productType,
                productGender: form.productGender,
                productName: form.productName,
                productBrand: form.productBrand,
                productPrice: Number(form.productPrice),
                productPiece: Number(form.productPiece),
                productDescription: form.productDescription,
                productNumber: Number(form.productNumber),
                productTypeOf: form.productTypeOf,
                productColor: form.productColor,
                productModel: form.productModel,
                productImage: imageURL.length === 0 ? (prevImage) : (imageURL)
            })
            history.push('/MyProfile');
        } catch (error) {
            alert("Product is not updated");
        }
    }

    const ClickNewProduct = async () => {
        if (form.productName.trim() === ""
            || form.productBrand.trim() === ""
            || form.productPrice.trim() === ""
            || form.productPiece.trim() === ""
            || form.productDescription.trim() === "") {
            alert("Please enter a product information")
            return;
        }

        try {
            let imageRef = [];
            let imageURL = [];

            for (let i = 0; i < image.length; i++) {
                imageRef = ref(storage, `${userData.username}/${uuidv4()}`);
                await uploadBytes(imageRef, image[i]);
                const result = await getDownloadURL(imageRef);
                imageURL.push(result)
            }
            const { data } = await axiosInstance.post(`/Product/Shoes`, {
                productType: form.productType,
                productGender: form.productGender,
                productName: form.productName,
                productBrand: form.productBrand,
                productPrice: Number(form.productPrice),
                productPiece: Number(form.productPiece),
                productDescription: form.productDescription,
                productNumber: Number(form.productNumber),
                productTypeOf: form.productTypeOf,
                productColor: form.productColor,
                productModel: form.productModel,
                productImage: (imageURL).join(',')
            })
            history.push('/MyProfile');
        } catch (error) {
            alert(error.response.data.error)
        }
        setForm({
            ...initialForm
        })
    }


    useEffect(() => {
        getSingleProduct();
        userMe();
    }, [])


    return (
        <div className='ShoesAddProductDiv'>
            <div className='ShoesAddProductPage'>
                <form className='ShoesAddProductForm'>
                    <span className='FormHeader'>Product Type</span>
                    <input
                        type='text'
                        value={form.productType}
                        className='ShoesAddProductInput'
                        disabled
                    />
                    <span className='FormHeader'>Gender</span>
                    <Radio.Group onChange={(e) => handleTextChange(e.target.value, "productGender")} value={form.productGender}>
                        <Space direction="vertical">
                            <Radio value="Male">Male </Radio>
                            <Radio value="Female">Female</Radio>
                            <Radio value="Unisex">Unisex</Radio>
                        </Space>
                    </Radio.Group>
                    <span className='FormHeader'>Shoe Name</span>
                    <input
                        type='text'
                        className='ShoesAddProductInput'
                        value={form.productName}
                        onChange={(e) => handleTextChange(e.target.value, "productName")}
                        required
                    />
                    <span className='FormHeader'>Product Brand</span>
                    <input
                        type='text'
                        className='ShoesAddProductInput'
                        value={form.productBrand}
                        onChange={(e) => handleTextChange(e.target.value, "productBrand")}
                        required
                    />
                    <span className='FormHeader'>Shoe Price</span>
                    <input
                        type='number'
                        className='ShoesAddProductInput'
                        value={form.productPrice}
                        onChange={(e) => handleTextChange(e.target.value, "productPrice")}
                        required
                    />

                    <span className='FormHeader'>Shoe Piece</span>
                    <input
                        type='number'
                        className='ShoesAddProductInput'
                        value={form.productPiece}
                        onChange={(e) => handleTextChange(e.target.value, "productPiece")}
                        required
                    />

                    <span className='FormHeader'>Shoe Description</span>
                    <textarea
                        className='ShoesAddProductTextarea'
                        value={form.productDescription}
                        onChange={(e) => handleTextChange(e.target.value, "productDescription")}
                        required
                    />

                    <span className='FormHeader'>Shoe Number</span>
                    <Radio.Group onChange={(e) => handleTextChange(e.target.value, "productNumber")} value={form.productNumber} style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <Radio value="40">40</Radio>
                        <Radio value="41">41</Radio>
                        <Radio value="42">42</Radio>
                        <Radio value="43">43</Radio>
                        <Radio value="44">44</Radio>
                        <Radio value="45">45</Radio>
                    </Radio.Group>

                    <span className='FormHeader'>Type of Shoe</span>
                    <Radio.Group onChange={(e) => handleTextChange(e.target.value, "productTypeOf")} value={form.productTypeOf}>
                        <Space direction="vertical">
                            <Radio value="Flip-Flops">Flip-Flops </Radio>
                            <Radio value="Ballet Shoes">Ballet Shoes</Radio>
                            <Radio value="Football Shoes">Football Shoes</Radio>
                            <Radio value="Slipper">Slipper</Radio>
                            <Radio value="Sports Shoes">Sports Shoes</Radio>
                        </Space>
                    </Radio.Group>

                    <span className='FormHeader'>Shoe Color</span>
                    <Radio.Group onChange={(e) => handleTextChange(e.target.value, "productColor")} value={form.productColor}>
                        <Space direction="vertical">
                            <Radio value="Black">Black</Radio>
                            <Radio value="White">White</Radio>
                            <Radio value="Grey">Grey</Radio>
                            <Radio value="Brown">Brown</Radio>
                            <Radio value="Red">Red</Radio>
                        </Space>
                    </Radio.Group>

                    <span className='FormHeader'>Shoe Model</span>
                    <Radio.Group onChange={(e) => handleTextChange(e.target.value, "productModel")} value={form.productModel}>
                        <Space direction="vertical">
                            <Radio value="Laced">Laced</Radio>
                            <Radio value="Easy to Wears">Easy to Wear</Radio>
                            <Radio value="Velcro shoes">Velcro shoes</Radio>
                        </Space>
                    </Radio.Group>
                    <span className='FormHeader'>Shoes Image</span>
                    <input
                        type='file'
                        onChange={ImageStringArrText}
                        multiple
                        className='ShoesAddProductFileInput'
                    />
                    {
                        isWaitClick ? (
                            <button className='ShoesAddProductButtonDisable' disabled>
                                <Spin />  Saving...
                            </button>
                        ) : (
                            <button className='ShoesAddProductButton' onClick={saveButtonClick}>Save</button>

                        )
                    }
                </form>
            </div>
        </div>
    )
}
