import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { axiosInstance } from '../../axios.util';
import Navbar from '../../mainComponents/navbar';
import ProductItemPageImageList from './PersonalCareProductItemPageImageList';
import Loading from '../../Loading';
import * as storage from '../../storage.helper'
import { useSelector } from 'react-redux';
import { PlusCircleOutlined, MinusCircleOutlined, HeartTwoTone } from '@ant-design/icons';
import { notification } from 'antd';
import 'antd/dist/reset.css';


export default function PersonalCareProductCardItem() {


  const { id } = useParams();
  const history = useHistory();
  const isAuthUser = useSelector((state) => state.user)

  const [productData, setProductData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(1);
  const [buttonCheck, setbuttonCheck] = useState(false)
  const [favoriteButtonCheck, setfavoriteButtonCheck] = useState(false)
  const [favoritesList, setFavoritesList] = useState([]);

  
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

  const GetProductItem = async () => {
    if (id) {
      try {
        const { data } = await axiosInstance.get(`/Product/Single/PersonalCare/${id}`)
        setProductData(data)
        setLoading(true)
      } catch (error) {
        showNotification('error', error.response.data.error)

      }
    }
  }
  const GetAllFavoritesProduct = async () => {
    if (isAuthUser.isAuth) {
      try {
        const { data } = await axiosInstance.get(`/Main/Favorite/Products`)
        setFavoritesList(data.favoriteProducts);
      } catch (error) {
        showNotification('error', error.response.data.error)

      }
    }
  }

  function getCart() {
    const cartJSON = storage.getValueByKey(`${isAuthUser.user.username}cart`);
    return cartJSON ? JSON.parse(cartJSON) : [];
  }

  const handleClickCart = () => {
    if (isAuthUser.isAuth) {
      const cart = getCart() || [];
      let sumCartPrice = (productData.personalCareProduct.productPrice * quantity)
      const existingProductIndex = cart.findIndex(item => item.product._id === productData.personalCareProduct._id);
      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity = quantity;
        cart[existingProductIndex].sumCartPrice = sumCartPrice;
      } else {
        cart.push({ product: productData.personalCareProduct, quantity, sumCartPrice });
      }
      storage.setKeyWithValue(`${isAuthUser.user.username}cart`, JSON.stringify(cart));
      setbuttonCheck(true);
    } else {
      history.push('/Login');
    }
  }
  const handleClickAddFavorite = async () => {
    if (isAuthUser.isAuth) {
      try {
        const { data } = await axiosInstance.post(`/Main/Favorite/Add`, {
          productId: id,
          productType: productData.personalCareProduct.productType,
        })
        setfavoriteButtonCheck(true)
      } catch (error) {
        showNotification('error', error.response.data.error)

      }
    } else {
      history.push('/Login');
    }
  }

  const handleClickDeleteFavorite = async () => {
    if (isAuthUser.isAuth) {
      try {
        const { data } = await axiosInstance.delete(`/Main/Favorite/Products/${id}`)
        setfavoriteButtonCheck(false)
      } catch (error) {
        showNotification('error', error.response.data.error)

      }
    }
  }

  const MyCartButtonControl = async () => {
    if (id) {
      let productCheck = await getCart();
      const existingProductIndex = productCheck.some(item => item.product?._id === productData?.personalCareProduct?._id);
      if (existingProductIndex) {
        setbuttonCheck(true);
      } else {
        setbuttonCheck(false);
      }
    }
  }

  const MyFavoriteButtonControl = async () => {
    if (isAuthUser.isAuth) {
      const existingProductIndex = favoritesList.some(item => item._id === productData?.personalCareProduct?._id);
      if (existingProductIndex) {
        setfavoriteButtonCheck(true);
      } else {
        setfavoriteButtonCheck(false);
      }
    }
  }


  const handleAdetSayacClick = (count) => {
    if (count.id === 'plus' && quantity > 0 && quantity < productData.personalCareProduct.productPiece) {
      setQuantity(quantity + 1)
    }
    else if (count.id === 'minus' && quantity > 1) {
      setQuantity(quantity - 1)
    }
  }


  useEffect(() => {
    GetProductItem();
  }, [id])

  useEffect(() => {
    GetAllFavoritesProduct();
  }, [isAuthUser.isAuth, favoriteButtonCheck])

  useEffect(() => {
    MyCartButtonControl();
  }, [GetProductItem])

  useEffect(() => {
    MyFavoriteButtonControl();
  }, [GetAllFavoritesProduct])



  return (
    <div className='PersonalCareProductViewerDiv'>
      <Navbar />
      {loading ? (
        <div className='PersonalCareProductViewerPage'>
          <div className='PersonalCareProductViewerPageImage'>
            <ProductItemPageImageList productData={productData.personalCareProduct} />
          </div>
          {productData && (
            <div className='PersonalCareProductViewerPageBody'>
              <div className='PersonalCareProductViewerPageBodyHeader'>
                <span style={{ color: "skyblue", fontSize: "1.7rem" }}>{productData.personalCareProduct.productBrand.toUpperCase()}</span> {productData.personalCareProduct.productName.toUpperCase()}
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", color: "rgb(78,78,78)" }}>Product Feature:</span>
              <div className='PersonalCareItemFeature'>
                <p className='PersonalCareItemFeatureP'>
                  <span>Type:</span> <span>{productData.personalCareProduct.productType.toUpperCase()}</span>
                </p>
                <p className='PersonalCareItemFeatureP'>
                  <span>Gender:</span> <span>{productData.personalCareProduct.productGender.toUpperCase()}</span>
                </p>
                <p className='PersonalCareItemFeatureP'>
                  <span>Category:</span> <span>{productData.personalCareProduct.productCategory}</span>
                </p>
                <p className='PersonalCareItemFeatureP'>
                  <span>Color:</span> <span>{productData.personalCareProduct.productColor}</span>
                </p>
                <p className='PersonalCareItemFeatureP'>
                  <span>Type of Smell:</span> <span>{productData.personalCareProduct.productTypeofSmell}</span>
                </p>
                <p className='PersonalCareItemFeatureP'>
                  <span>Volume:</span> <span>{productData.personalCareProduct.productVolume} ml</span>
                </p>
                <p className='PersonalCareItemFeatureP'>
                  <span>Unit Price:</span> <span>{productData.personalCareProduct.productPrice} TL</span>
                </p>
                <p className='PersonalCareItemFeatureP'>
                  <span>Max Piece:</span> <span>{productData.personalCareProduct.productPiece}</span>
                </p>
                <p className='PersonalCareItemFeatureDesc'>
                  <span>Product Description:</span> <span>{productData.personalCareProduct.productDescription}</span>
                </p>
              </div>
              <div>
                <span style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.6rem", fontWeight: "bold", color: "rgba(89, 98, 128, 0.699)" }}>Piece</span>
                <div style={{ width: "100%", height: "auto", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "2rem" }}>
                  <button
                    id='minus'
                    name={productData.personalCareProduct._id}
                    className='ProductCardItemPlusMinIconButton'
                    onClick={() => handleAdetSayacClick(document.getElementById('minus'))}
                  ><MinusCircleOutlined /></button>
                  <span style={{ fontSize: "1.2rem", color: "rgba(82, 82, 82, 0.664)" }}>{quantity}</span>
                  <button
                    id='plus'
                    name={productData.personalCareProduct._id}
                    className='ProductCardItemPlusMinIconButton'
                    onClick={() => handleAdetSayacClick(document.getElementById('plus'))}
                  >< PlusCircleOutlined /></button>
                </div>
                <div style={{ width: "100%", height: "auto", display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                  {
                    buttonCheck ? (
                      <button
                        className='PersonalCareItemFeatureButton'
                        onClick={() => history.push('/MyCart')}
                      >Go to cart</button>
                    ) : (
                      <button
                        className='PersonalCareItemFeatureButton'
                        onClick={() => handleClickCart()}
                      >Add to cart</button>
                    )
                  }
                  {
                    favoriteButtonCheck ? (
                      <button
                        className='PersonalCareItemFavoriteButtonLast'
                        onClick={handleClickDeleteFavorite}
                      ><HeartTwoTone className='FavoriteIcon' /> </button>
                    ) : (
                      <button
                        className='PersonalCareItemFavoriteButtonFirst'
                        onClick={handleClickAddFavorite}
                      >
                        <HeartTwoTone className='FavoriteIcon' />
                      </button>
                    )
                  }
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        <Loading />
      )
      }
    </div>
  )
}
