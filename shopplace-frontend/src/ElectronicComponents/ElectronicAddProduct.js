import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { axiosInstance } from '../axios.util';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Radio, Space, Spin } from 'antd';


export default function ElectronicAddProduct() {

  const { id } = useParams();

  const initialForm = {
    productType: "Electronic",
    productGender: "",
    productName: "",
    productBrand: "",
    productPrice: "",
    productPiece: "",
    productDescription: "",
    productColor: "",
    productCategory: "",
    productGuaranteePeriod: "",
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
        const { data } = await axiosInstance.get(`/Product/Seller/Electronic/${id}`)
        setForm({
          productType: data.electronicProduct.productType,
          productGender: data.electronicProduct.productGender,
          productName: data.electronicProduct.productName,
          productBrand: data.electronicProduct.productBrand,
          productPrice: data.electronicProduct.productPrice,
          productPiece: data.electronicProduct.productPiece,
          productDescription: data.electronicProduct.productDescription,
          productColor: data.electronicProduct.productColor,
          productCategory: data.electronicProduct.productCategory,
          productGuaranteePeriod: data.electronicProduct.productGuaranteePeriod,
        })
        setPrevImage(data.electronicProduct.productImage)
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
      const { data } = await axiosInstance.post(`/Product/Seller/Electronic/${id}`, {
        productType: form.productType,
        productGender: form.productGender,
        productName: form.productName,
        productBrand: form.productBrand,
        productPrice: Number(form.productPrice),
        productPiece: Number(form.productPiece),
        productDescription: form.productDescription,
        productColor: form.productColor,
        productCategory: form.productCategory,
        productGuaranteePeriod: Number(form.productGuaranteePeriod),
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
      const { data } = await axiosInstance.post(`/Product/Electronic`, {
        productType: form.productType,
        productGender: form.productGender,
        productName: form.productName,
        productBrand: form.productBrand,
        productPrice: Number(form.productPrice),
        productPiece: Number(form.productPiece),
        productDescription: form.productDescription,
        productColor: form.productColor,
        productCategory: form.productCategory,
        productGuaranteePeriod: Number(form.productGuaranteePeriod),
        productImage: (imageURL).join(',')
      })
      history.push('/MyProfile');
    } catch (error) {
      alert(error.response.data.error)
    } finally {
      setForm({ ...initialForm })
    }

  }


  useEffect(() => {
    userMe();
    getSingleProduct();
  }, [])

  return (
    <div className='ElectronicAddProductDiv'>
      <div className='ElectronicAddProductPage'>
        <form className='ElectronicAddProductForm'>
          <span className='FormHeader'>Product Type</span>
          <input
            type='text'
            value={form.productType}
            className='ElectronicAddProductInput'
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
            className='ElectronicAddProductInput'
            value={form.productName}
            onChange={(e) => handleTextChange(e.target.value, "productName")}
          />
          <span className='FormHeader'>Product Brand</span>
          <input
            type='text'
            className='ElectronicAddProductInput'
            value={form.productBrand}
            onChange={(e) => handleTextChange(e.target.value, "productBrand")}
          />
          <span className='FormHeader'>Product Price</span>
          <input
            type='number'
            className='ElectronicAddProductInput'
            value={form.productPrice}
            onChange={(e) => handleTextChange(e.target.value, "productPrice")}
          />
          <span className='FormHeader'>Product Piece</span>
          <input
            type='number'
            className='ElectronicAddProductInput'
            value={form.productPiece}
            onChange={(e) => handleTextChange(e.target.value, "productPiece")}
          />
          <span className='FormHeader'>Product Description</span>
          <textarea
            className='ElectronicAddProductTextarea'
            value={form.productDescription}
            onChange={(e) => handleTextChange(e.target.value, "productDescription")}
            required
          />
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
          <span className='FormHeader'>Product Category</span>
          <Radio.Group value={form.productCategory} onChange={(e) => handleTextChange(e.target.value, "productCategory")} style={{ display: "flex", justifyContent: "space-evenly" }}>
            <Radio value="Phone">Phone</Radio>
            <Radio value="Laptop">Laptop</Radio>
            <Radio value="Smart Watch">Smart Watch</Radio>
            <Radio value="Shaver">Shaver</Radio>
          </Radio.Group>
          <span className='FormHeader'>Product Guarantee Period</span>
          <Radio.Group value={form.productGuaranteePeriod} onChange={(e) => handleTextChange(e.target.value, "productGuaranteePeriod")}>
            <Space direction="vertical">
              <Radio value="1">1</Radio>
              <Radio value="2">2</Radio>
              <Radio value="3">3</Radio>
              <Radio value="4">4</Radio>
              <Radio value="5">5</Radio>
            </Space>
          </Radio.Group>
          <span className='FormHeader'>Product Image</span>
          <input
            type='file'
            onChange={ImageStringArrText}
            multiple
            className='ElectronicAddProductFileInput'
          />
          {
            isWaitClick ? (
              <button className='ElectronicAddProductButtonDisable' disabled>
                <Spin />  Saving...
              </button>
            ) : (
              <button className='ElectronicAddProductButton' onClick={saveButtonClick}>Save</button>
            )
          }
        </form>
      </div>
    </div>
  )
}
