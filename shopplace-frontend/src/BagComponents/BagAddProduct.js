import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { axiosInstance } from '../axios.util';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Radio, Space, Spin, notification } from 'antd';


export default function BagAddProduct() {

  const { id } = useParams();

  const initialForm = {
    productType: "Bag",
    productGender: "",
    productName: "",
    productBrand: "",
    productPrice: "",
    productPiece: "",
    productDescription: "",
    productColor: "",
    productCategory: "",
    productBagPattern: "",
    productBagEnvironment: "",
    productBagSize: "",
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
      showNotification('error', "Cannot process the product")
    } finally {
      setIsWaitClick(false);
    }
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




  const userMe = async () => {
    try {
      const { data } = await axiosInstance.get(`/User/UserMe`)
      setUserData(data.user);
    } catch (error) {
      showNotification('error', "Not Found user")
    }
  }



  const getSingleProduct = async () => {
    if (id) {
      try {
        const { data } = await axiosInstance.get(`/Product/Seller/Bag/${id}`)
        setForm({
          productType: data.bagProduct.productType,
          productGender: data.bagProduct.productGender,
          productName: data.bagProduct.productName,
          productBrand: data.bagProduct.productBrand,
          productPrice: data.bagProduct.productPrice,
          productPiece: data.bagProduct.productPiece,
          productDescription: data.bagProduct.productDescription,
          productColor: data.bagProduct.productColor,
          productCategory: data.bagProduct.productCategory,
          productBagPattern: data.bagProduct.productBagPattern,
          productBagEnvironment: data.bagProduct.productBagEnvironment,
          productBagSize: data.bagProduct.productBagSize,
        })
        setPrevImage(data.bagProduct.productImage)
        showNotification('success', data.message)
      } catch (error) {
        showNotification('error', error.response.data.error)
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
      const { data } = await axiosInstance.post(`/Product/Seller/Bag/${id}`, {
        productType: form.productType,
        productGender: form.productGender,
        productName: form.productName,
        productBrand: form.productBrand,
        productPrice: Number(form.productPrice),
        productPiece: Number(form.productPiece),
        productDescription: form.productDescription,
        productColor: form.productColor,
        productCategory: form.productCategory,
        productBagPattern: form.productBagPattern,
        productBagEnvironment: form.productBagEnvironment,
        productBagSize: form.productBagSize,
        productImage: imageURL.length === 0 ? (prevImage) : (imageURL)
      })
      history.push('/MyProfile');
      showNotification('success', data.message)
    } catch (error) {
      showNotification('error', error.response.data.error)
    }
  }


  const ClickNewProduct = async () => {
    if (form.productName.trim() === ""
      || form.productBrand.trim() === ""
      || form.productPrice.trim() === ""
      || form.productPiece.trim() === ""
      || form.productDescription.trim() === "") {
        showNotification('error', "Please enter a product information")
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
      const { data } = await axiosInstance.post(`/Product/Bag`, {
        productType: form.productType,
        productGender: form.productGender,
        productName: form.productName,
        productBrand: form.productBrand,
        productPrice: Number(form.productPrice),
        productPiece: Number(form.productPiece),
        productDescription: form.productDescription,
        productColor: form.productColor,
        productCategory: form.productCategory,
        productBagPattern: form.productBagPattern,
        productBagEnvironment: form.productBagEnvironment,
        productBagSize: form.productBagSize,
        productImage: (imageURL).join(',')
      })
      history.push('/MyProfile');
      showNotification('success', data.message)

    } catch (error) {
      showNotification('error', error.response.data.error)
    } finally {
      setForm({ ...initialForm })
    }
  }


  useEffect(() => {
    userMe();
    getSingleProduct();
  }, [])




  return (
    <div className='BagAddProductDiv'>
      <div className='BagAddProductPage'>
        <form className='BagAddProductForm'>
          <span className='FormHeader'>Product Type</span>
          <input
            type='text'
            value={form.productType}
            className='BagAddProductInput'
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
            className='BagAddProductInput'
            value={form.productName}
            onChange={(e) => handleTextChange(e.target.value, "productName")}
          />
          <span className='FormHeader'>Product Brand</span>
          <input
            type='text'
            className='BagAddProductInput'
            value={form.productBrand}
            onChange={(e) => handleTextChange(e.target.value, "productBrand")}
          />
          <span className='FormHeader'>Product Price</span>
          <input
            type='number'
            className='BagAddProductInput'
            value={form.productPrice}
            onChange={(e) => handleTextChange(e.target.value, "productPrice")}
          />
          <span className='FormHeader'>Product Piece</span>
          <input
            type='number'
            className='BagAddProductInput'
            value={form.productPiece}
            onChange={(e) => handleTextChange(e.target.value, "productPiece")}
          />
          <span className='FormHeader'>Product Description</span>
          <textarea
            className='BagAddProductTextarea'
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
            <Radio value="School">School Bag</Radio>
            <Radio value="Daily">Daily Bag</Radio>
            <Radio value="Fanny Pack">Fanny Pack</Radio>
            <Radio value="Sports">Sports Bag</Radio>
            <Radio value="Suitcase">Suitcase Bag</Radio>
          </Radio.Group>
          <span className='FormHeader'>Product Bag Pattern</span>
          <Radio.Group value={form.productBagPattern} onChange={(e) => handleTextChange(e.target.value, "productBagPattern")}>
            <Space direction="vertical">
              <Radio value="Flat">Flat</Radio>
              <Radio value="Patterned">Patterned</Radio>
              <Radio value="Checkered">Checkered</Radio>
            </Space>
          </Radio.Group>
          <span className='FormHeader'>Product Bag Environment</span>
          <Radio.Group value={form.productBagEnvironment} onChange={(e) => handleTextChange(e.target.value, "productBagEnvironment")}>
            <Space direction="vertical">
              <Radio value="Outdoor">Outdoor</Radio>
              <Radio value="School">School</Radio>
              <Radio value="Sports">Sports</Radio>
              <Radio value="Daily">Daily</Radio>
            </Space>
          </Radio.Group>
          <span className='FormHeader'>Product Bag Size</span>
          <Radio.Group value={form.productBagSize} onChange={(e) => handleTextChange(e.target.value, "productBagSize")} >
            <Space direction="vertical">
              <Radio value="Big">Big</Radio>
              <Radio value="Middle">Middle</Radio>
              <Radio value="Small">Small</Radio>
            </Space>
          </Radio.Group>
          <span className='FormHeader'>Product Image</span>
          <input
            type='file'
            onChange={ImageStringArrText}
            multiple
            className='BagAddProductFileInput'
          />
          {
            isWaitClick ? (
              <button className='BagAddProductButtonDisable' disabled>
                <Spin />  Saving...
              </button>
            ) : (
              <button className='BagAddProductButton' onClick={saveButtonClick}>Save</button>
            )
          }
        </form>
      </div>
    </div>
  )
}
