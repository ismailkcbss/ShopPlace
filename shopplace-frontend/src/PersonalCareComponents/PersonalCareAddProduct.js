import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { axiosInstance } from '../axios.util';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Radio, Space, Spin } from 'antd';



export default function PersonalCareAddProduct() {

  const { id } = useParams();

  const initialForm = {
    productType: "PersonalCare",
    productGender: "",
    productName: "",
    productBrand: "",
    productPrice: "",
    productPiece: "",
    productDescription: "",
    productColor: "",
    productCategory: "",
    productTypeofSmell: "",
    productVolume: "",
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
        const { data } = await axiosInstance.get(`/Product/Seller/PersonalCare/${id}`)
        setForm({
          productType: data.personalCareProduct.productType,
          productGender: data.personalCareProduct.productGender,
          productName: data.personalCareProduct.productName,
          productBrand: data.personalCareProduct.productBrand,
          productPrice: data.personalCareProduct.productPrice,
          productPiece: data.personalCareProduct.productPiece,
          productDescription: data.personalCareProduct.productDescription,
          productColor: data.personalCareProduct.productColor,
          productCategory: data.personalCareProduct.productCategory,
          productTypeofSmell: data.personalCareProduct.productTypeofSmell,
          productVolume: (data.personalCareProduct.productVolume).toString(),
        })
        setPrevImage(data.personalCareProduct.productImage)
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
      const { data } = await axiosInstance.post(`/Product/Seller/PersonalCare/${id}`, {
        productType: form.productType,
        productGender: form.productGender,
        productName: form.productName,
        productBrand: form.productBrand,
        productPrice: Number(form.productPrice),
        productPiece: Number(form.productPiece),
        productDescription: form.productDescription,
        productColor: form.productColor,
        productCategory: form.productCategory,
        productTypeofSmell: form.productTypeofSmell,
        productVolume: Number(form.productVolume),
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
      const { data } = await axiosInstance.post(`/Product/PersonalCare`, {
        productType: form.productType,
        productGender: form.productGender,
        productName: form.productName,
        productBrand: form.productBrand,
        productPrice: Number(form.productPrice),
        productPiece: Number(form.productPiece),
        productDescription: form.productDescription,
        productColor: form.productColor,
        productCategory: form.productCategory,
        productTypeofSmell: form.productTypeofSmell,
        productVolume: Number(form.productVolume),
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
    <div className='PersonalCareAddProductDiv'>
      <div className='PersonalCareAddProductPage'>
        <form className='PersonalCareAddProductForm'>
          <span className='FormHeader'>Product Type</span>
          <input
            type='text'
            value={form.productType}
            className='PersonalCareAddProductInput'
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
            className='PersonalCareAddProductInput'
            value={form.productName}
            onChange={(e) => handleTextChange(e.target.value, "productName")}
          />
          <span className='FormHeader'>Product Brand</span>
          <input
            type='text'
            className='PersonalCareAddProductInput'
            value={form.productBrand}
            onChange={(e) => handleTextChange(e.target.value, "productBrand")}
          />
          <span className='FormHeader'>Product Price</span>
          <input
            type='number'
            className='PersonalCareAddProductInput'
            value={form.productPrice}
            onChange={(e) => handleTextChange(e.target.value, "productPrice")}
          />
          <span className='FormHeader'>Product Piece</span>
          <input
            type='number'
            className='PersonalCareAddProductInput'
            value={form.productPiece}
            onChange={(e) => handleTextChange(e.target.value, "productPiece")}
          />
          <span className='FormHeader'>Product Description</span>
          <textarea
            className='PersonalCareAddProductTextarea'
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
            <Radio value="Perfume">Perfume</Radio>
            <Radio value="Shampoo">Shampoo</Radio>
            <Radio value="Deodorant">Deodorant</Radio>
            <Radio value="Skin Cream">Skin Cream</Radio>
          </Radio.Group>
          <span className='FormHeader'>Product Type of Smell</span>
          <Radio.Group value={form.productTypeofSmell} onChange={(e) => handleTextChange(e.target.value, "productTypeofSmell")}>
            <Space direction="vertical">
              <Radio value="Minty">Minty</Radio>
              <Radio value="Woody">Woody</Radio>
              <Radio value="Lemon">Lemon</Radio>
              <Radio value="Nature">Nature</Radio>
            </Space>
          </Radio.Group>
          <span className='FormHeader'>Product Volume</span>
          <Radio.Group value={form.productVolume} onChange={(e) => handleTextChange(e.target.value, "productVolume")}>
            <Space direction="vertical">
              <Radio value="200">200</Radio>
              <Radio value="250">250</Radio>
              <Radio value="300">300</Radio>
              <Radio value="350">350</Radio>
              <Radio value="500">500</Radio>
            </Space>
          </Radio.Group>
          <span className='FormHeader'>Product Image</span>
          <input
            type='file'
            onChange={ImageStringArrText}
            multiple
            className='PersonalCareAddProductFileInput'
          />
          {
            isWaitClick ? (
              <button className='PersonalCareAddProductButtonDisable' disabled>
                <Spin />  Saving...
              </button>
            ) : (
              <button className='PersonalCareAddProductButton' onClick={saveButtonClick}>Save</button>
            )
          }
        </form>
      </div>
    </div>
  )
}
