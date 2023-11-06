import React, { useEffect, useState } from 'react'
import Loading from '../../Loading'
import ShoesProductItemPageImageList from './ShoesProductItemPageImageList'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../axios.util';
import Navbar from '../../mainComponents/navbar';
import { Radio } from 'antd';
import * as storage from '../../storage.helper'
import { PlusCircleOutlined, MinusCircleOutlined, HeartTwoTone } from '@ant-design/icons';
import 'antd/dist/reset.css';



export default function ShoesProductCardItem() {

  const { id } = useParams();
  const history = useHistory();
  const isAuthUser = useSelector((state) => state.user)

  const [productData, setProductData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(1);
  const [buttonCheck, setbuttonCheck] = useState(false)
  const [favoriteButtonCheck, setfavoriteButtonCheck] = useState(false)
  const [favoritesList, setFavoritesList] = useState([]);

  const GetProductItem = async () => {
    if (id) {
      try {
        const { data } = await axiosInstance.get(`/Product/Single/Shoes/${id}`)
        setProductData(data)
        setLoading(true)
      } catch (error) {
        alert("error")
      }
    }
  }
  const GetAllFavoritesProduct = async () => {
    if (isAuthUser.isAuth) {
      try {
        const { data } = await axiosInstance.get(`/Main/Favorite/Products`)
        setFavoritesList(data.favoriteProducts);
      } catch (error) {
        console.log(error);
        alert(error.response.data.error)
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
      let sumCartPrice = (productData.shoesProduct.productPrice * quantity)
      const existingProductIndex = cart.findIndex(item => item.product._id === productData.shoesProduct._id);
      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity = quantity;
        cart[existingProductIndex].sumCartPrice = sumCartPrice;
      } else {
        cart.push({ product: productData.shoesProduct, quantity, sumCartPrice });
      }
      storage.setKeyWithValue(`${isAuthUser.user.username}` + `cart`, JSON.stringify(cart));
      setbuttonCheck(true);
    } else {
      history.push('/Login');
    }
  }

  const handleClickAddFavorite = async () => {
    if(isAuthUser.isAuth){
      try {
        const { data } = await axiosInstance.post(`/Main/Favorite/Add`, {
          productId: id,
          productType: productData.shoesProduct.productType,
        })
        setfavoriteButtonCheck(true)
      } catch (error) {
        alert(error.response.data.error)
      }
    }else{
      history.push('/Login');
    }
  }

  const handleClickDeleteFavorite = async () => {
    if(isAuthUser.isAuth){
      try {
        const { data } = await axiosInstance.delete(`/Main/Favorite/Products/${id}`)
        //alert(data.message)
        setfavoriteButtonCheck(false)
      } catch (error) {
        alert(error.response.data.error)
      }
    }else{
      history.push('/Login');
    }
  }

  const MyCartButtonControl = async () => {
    if (id) {
      let productCheck = await getCart();
      const existingProductIndex = productCheck.some(item => item.product?._id === productData?.shoesProduct?._id);
      if (existingProductIndex) {
        setbuttonCheck(true);
      } else {
        setbuttonCheck(false);
      }
    }
  }

  const MyFavoriteButtonControl = async () => {
    if (id) {
      const existingProductIndex = favoritesList.some(item => item._id === productData?.shoesProduct?._id);
      if (existingProductIndex) {
        setfavoriteButtonCheck(true);
      } else {
        setfavoriteButtonCheck(false);
      }
    }
  }

  const handleAdetSayacClick = (count) => {
    if (count.id === 'plus' && quantity > 0 && quantity < productData.shoesProduct.productPiece) {
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
  }, [isAuthUser, favoriteButtonCheck])

  useEffect(() => {
    MyCartButtonControl();
  }, [GetProductItem])


  useEffect(() => {
    MyFavoriteButtonControl();
  }, [GetAllFavoritesProduct])

  return (
    <div className='ShoesProductViewerDiv'>
      <Navbar />
      {loading ? (
        <div className='ShoesProductViewerPage'>
          <div className='ShoesProductViewerPageImage'>
            <ShoesProductItemPageImageList productData={productData.shoesProduct} />
          </div>
          {productData && (
            <div className='ShoesProductViewerPageBody'>
              <div className='ShoesProductViewerPageBodyHeader'>
                <span style={{ color: "skyblue", fontSize: "1.7rem" }}>{productData.shoesProduct.productBrand.toUpperCase()}</span> {productData.shoesProduct.productName.toUpperCase()}
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Product Feature:</span>
              <div className='ShoesItemFeature'>
                <p className='ShoesItemFeatureP'>
                  <span>Gender:</span> <span>{productData.shoesProduct.productGender}</span>
                </p>
                <p className='ShoesItemFeatureP'>
                  <span>Shoes Type:</span><span>{productData.shoesProduct.productCategory}</span>
                </p>
                <p className='ShoesItemFeatureP'>
                  <span>Model:</span> <span>{productData.shoesProduct.productModel}</span>
                </p>
                <p className='ShoesItemFeatureP'>
                  <span>Color:</span> <span>{productData.shoesProduct.productNumber}</span>
                </p>
                <p className='ShoesItemFeatureP'>
                  <span>Shoes Number:</span> <span>{productData.shoesProduct.productColor}</span>
                </p>
                <p className='ShoesItemFeatureP'>
                  <span>Unit Price:</span> <span>{productData.shoesProduct.productPrice}</span>
                </p>
                <p className='ShoesItemFeatureP'>
                  <span>Max Piece:</span><span>{productData.shoesProduct.productPiece}</span>
                </p>
                <p className='ShoesItemFeatureDesc'>
                  <span>Product Description:</span> <span>{productData.shoesProduct.productDescription}</span>
                </p>
              </div>
              <div>
                <div className='ShoesItemFeatureDescSize'>
                  <span style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.6rem", fontWeight: "bold", color: "rgba(89, 98, 128, 0.699)" }}>Piece</span>
                  <div style={{ width: "100%", height: "auto", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "2rem" }}>
                    <button
                      id='minus'
                      name={productData.shoesProduct._id}
                      className='ProductCardItemPlusMinIconButton'
                      onClick={() => handleAdetSayacClick(document.getElementById('minus'))}
                    ><MinusCircleOutlined /></button>
                    <span style={{ fontSize: "1.2rem", color: "rgba(82, 82, 82, 0.664)" }}>{quantity}</span>
                    <button
                      id='plus'
                      name={productData.shoesProduct._id}
                      className='ProductCardItemPlusMinIconButton'
                      onClick={() => handleAdetSayacClick(document.getElementById('plus'))}
                    >< PlusCircleOutlined /></button>
                  </div>
                  <div style={{ width: "100%", height: "auto", display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                    {
                      buttonCheck ? (
                        <button
                          className='ClothesItemFeatureButton'
                          onClick={() => history.push('/MyCart')}
                        >Go to cart</button>
                      ) : (
                        <button
                          className='ClothesItemFeatureButton'
                          onClick={() => handleClickCart()}
                        >Add to cart</button>
                      )
                    }
                    {
                      favoriteButtonCheck ? (
                        <button
                          className='ClothesItemFavoriteButtonLast'
                          onClick={handleClickDeleteFavorite}
                        ><HeartTwoTone className='FavoriteIcon' /> </button>
                      ) : (
                        <button
                          className='ClothesItemFavoriteButtonFirst'
                          onClick={handleClickAddFavorite}
                        >
                          <HeartTwoTone className='FavoriteIcon' />
                        </button>
                      )
                    }
                  </div>

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
