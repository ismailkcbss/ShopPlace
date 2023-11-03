import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { axiosInstance } from '../axios.util';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Radio, Space, Spin } from 'antd';
export default function ClothesAddProduct() {

    const { id } = useParams();

    const initialForm = {
        productType: "Clothes",
        productGender: "",
        productName: "",
        productBrand:"",
        productPrice: "",
        productPiece: "",
        productDescription: "",
        productSize: "",
        productPattern: "",
        productCollerType: "",
        productColor: "",
        productMaterial: "",
        productHeight: "",
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
            console.log(error);
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
            alert('User not found');
        }
    }



    const getSingleProduct = async () => {
        if (id) {
            try {
                const { data } = await axiosInstance.get(`/Product/Seller/Clothes/${id}`)
                setForm({
                    productType: data.clothesProduct.productType,
                    productGender: data.clothesProduct.productGender,
                    productName: data.clothesProduct.productName,
                    productBrand:data.clothesProduct.productBrand,
                    productPrice: data.clothesProduct.productPrice,
                    productPiece: data.clothesProduct.productPiece,
                    productDescription: data.clothesProduct.productDescription,
                    productSize: data.clothesProduct.productSize,
                    productPattern: data.clothesProduct.productPattern,
                    productCollerType: data.clothesProduct.productCollerType,
                    productColor: data.clothesProduct.productColor,
                    productMaterial: data.clothesProduct.productMaterial,
                    productHeight: data.clothesProduct.productHeight
                })
                setPrevImage(data.clothesProduct.productImage)
            } catch (error) {
                alert(error.response.data.error);
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
            const { data } = await axiosInstance.post(`/Product/Seller/Clothes/${id}`, {
                productType: form.productType,
                productGender: form.productGender,
                productName: form.productName,
                productBrand:form.productBrand,
                productPrice: Number(form.productPrice),
                productPiece: Number(form.productPiece),
                productDescription: form.productDescription,
                productSize: form.productSize,
                productPattern: form.productPattern,
                productCollerType: form.productCollerType,
                productColor: form.productColor,
                productMaterial: form.productMaterial,
                productHeight: form.productHeight,
                productImage: imageURL.length === 0 ? (prevImage) : (imageURL)
            })
            history.push('/MyProfile');
        } catch (error) {
            alert(error.response.data.error);
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
            const { data } = await axiosInstance.post(`/Product/Clothes`, {
                productType: form.productType,
                productGender: form.productGender,
                productName: form.productName,
                productBrand:form.productBrand,
                productPrice: Number(form.productPrice),
                productPiece: Number(form.productPiece),
                productDescription: form.productDescription,
                productSize: form.productSize,
                productPattern: form.productPattern,
                productCollerType: form.productCollerType,
                productColor: form.productColor,
                productMaterial: form.productMaterial,
                productHeight: form.productHeight,
                productImage: (imageURL).join(',')
            })
            history.push('/MyProfile');
        } catch (error) {
            console.log(error);
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
        <div className='ClothesAddProductDiv'>
            <div className='ClothesAddProductPage'>
                <form className='ClothesAddProductForm'>
                    <span className='FormHeader'>Product Type</span>
                    <input
                        type='text'
                        value={form.productType}
                        className='ClothesAddProductInput'
                        disabled
                    />
                    <span className='FormHeader'>Gender</span>
                    <Radio.Group size='large' className='abc' onChange={(e) => handleTextChange(e.target.value, "productGender")} value={form.productGender}>
                        <Space direction="vertical">
                            <Radio value="Male">Male </Radio>
                            <Radio value="Female">Female</Radio>
                            <Radio value="Unisex">Unisex</Radio>
                        </Space>
                    </Radio.Group>
                    <span className='FormHeader'>Product Name</span>
                    <input
                        type='text'
                        className='ClothesAddProductInput'
                        value={form.productName}
                        onChange={(e) => handleTextChange(e.target.value, "productName")}
                    />                    
                    <span className='FormHeader'>Product Brand</span>
                    <input
                        type='text'
                        className='ClothesAddProductInput'
                        value={form.productBrand}
                        onChange={(e) => handleTextChange(e.target.value, "productBrand")}
                    />
                    <span className='FormHeader'>Product Price</span>
                    <input
                        type='number'
                        className='ClothesAddProductInput'
                        value={form.productPrice}
                        onChange={(e) => handleTextChange(e.target.value, "productPrice")}
                    />
                    <span className='FormHeader'>Product Piece</span>
                    <input
                        type='number'
                        className='ClothesAddProductInput'
                        value={form.productPiece}
                        onChange={(e) => handleTextChange(e.target.value, "productPiece")}
                    />
                    <span className='FormHeader'>Product Description</span>
                    <textarea
                        className='ClothesAddProductTextarea'
                        value={form.productDescription}
                        onChange={(e) => handleTextChange(e.target.value, "productDescription")}
                        required
                    />
                    <span className='FormHeader'>Product Size</span>
                    <Radio.Group value={form.productSize} onChange={(e) => handleTextChange(e.target.value, "productSize")} style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <Radio value="XXL">XXL</Radio>
                        <Radio value="XL">XL</Radio>
                        <Radio value="L">L</Radio>
                        <Radio value="M">M</Radio>
                        <Radio value="S">S</Radio>
                        <Radio value="XS">XS</Radio>
                    </Radio.Group>
                    <span className='FormHeader'>Product Pattern</span>
                    <Radio.Group value={form.productPattern} onChange={(e) => handleTextChange(e.target.value, "productPattern")}>
                        <Space direction="vertical">
                            <Radio value="Big Size">Big Size</Radio>
                            <Radio value="Comfort">Comfort</Radio>
                            <Radio value="Oversize">Oversize</Radio>
                            <Radio value="Slim">Slim</Radio>
                            <Radio value="Standard">Standard</Radio>
                        </Space>
                    </Radio.Group>
                    <span className='FormHeader'>Product Coller Type</span>
                    <Radio.Group value={form.productCollerType} onChange={(e) => handleTextChange(e.target.value, "productCollerType")}>
                        <Space direction="vertical">
                            <Radio value="Bicycle Collar">Bicycle Collar</Radio>
                            <Radio value="Classic">Classic</Radio>
                            <Radio value="Polo Neck">Polo Neck</Radio>
                            <Radio value="V Neck">V Neck</Radio>
                            <Radio value="Zero Collar">Zero Collar</Radio>
                        </Space>
                    </Radio.Group>
                    <span className='FormHeader'>Product Color</span>
                    <Radio.Group value={form.productColor} onChange={(e) => handleTextChange(e.target.value, "productColor")}>
                        <Space direction="vertical">
                            <Radio value="Black">Black</Radio>
                            <Radio value="Red">Red</Radio>
                            <Radio value="Blue">Blue</Radio>
                            <Radio value="Brown">Brown</Radio>
                            <Radio value="Gold">Gold</Radio>
                        </Space>
                    </Radio.Group>
                    <span className='FormHeader'>Product Material</span>
                    <Radio.Group value={form.productMaterial} onChange={(e) => handleTextChange(e.target.value, "productMaterial")} >
                        <Space direction="vertical">
                            <Radio value="Fabric">Fabric</Radio>
                            <Radio value="Cotton">Cotton</Radio>
                            <Radio value="Lycra">Lycra</Radio>
                            <Radio value="Polyester">Polyester</Radio>
                        </Space>
                    </Radio.Group>
                    <span className='FormHeader'>Product Height</span>
                    <Radio.Group value={form.productHeight} onChange={(e) => handleTextChange(e.target.value, "productHeight")}>
                        <Space direction="vertical">
                            <Radio value="Standard">Standard</Radio>
                            <Radio value="Big">Big</Radio>
                            <Radio value="Midi">Midi</Radio>
                            <Radio value="Regular">Regular</Radio>
                            <Radio value="Long">Long</Radio>
                        </Space>
                    </Radio.Group>
                    <span className='FormHeader'>Product Image</span>
                    <input
                        type='file'
                        onChange={ImageStringArrText}
                        multiple
                        className='ClothesAddProductFileInput'
                    />
                    {
                        isWaitClick ? (
                            <button className='ClothesAddProductButtonDisable' disabled>
                                <Spin />  Saving...
                            </button>
                        ) : (
                            <button className='ClothesAddProductButton' onClick={saveButtonClick}>Save</button>
                        )
                    }
                </form>
            </div>
        </div>
    )
}
