import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { axiosInstance } from '../../axios.util';
import Navbar from '../../mainComponents/navbar';
import ProductItemPageImageList from './BagProductItemPageImageList';
import Loading from '../../Loading';
import * as storage from '../../storage.helper'
import { useSelector } from 'react-redux';
import { PlusCircleOutlined, MinusCircleOutlined, HeartTwoTone } from '@ant-design/icons';
import 'antd/dist/reset.css';

export default function BagProductCardItem() {

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
        const { data } = await axiosInstance.get(`/Product/Single/Bag/${id}`)
        setProductData(data)
        setLoading(true)
      } catch (error) {
        alert(error.response.data.error)
      }
    }
  }
  const GetAllFavoritesProduct = async () => {
    if (isAuthUser.isAuth) {
      try {
        const { data } = await axiosInstance.get(`/Main/Favorite/Products`)
        setFavoritesList(data.favoriteProducts);
      } catch (error) {
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
      let sumCartPrice = (productData.bagProduct.productPrice * quantity)
      const existingProductIndex = cart.findIndex(item => item.product._id === productData.bagProduct._id);
      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity = quantity;
        cart[existingProductIndex].sumCartPrice = sumCartPrice;
      } else {
        cart.push({ product: productData.bagProduct, quantity, sumCartPrice });
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
          productType: productData.bagProduct.productType,
        })
        setfavoriteButtonCheck(true)
      } catch (error) {
        alert(error.response.data.error)
      }
    } else {
      history.push('/Login');
    }
  }

  const handleClickDeleteFavorite = async () => {
    if (isAuthUser.isAuth) {
      try {
        const { data } = await axiosInstance.delete(`/Main/Favorite/Products/${id}`)
        //alert(data.message)
        setfavoriteButtonCheck(false)
      } catch (error) {
        alert(error.response.data.error)
      }
    }
  }

  const MyCartButtonControl = async () => {
    if (id) {
      let productCheck = await getCart();
      const existingProductIndex = productCheck.some(item => item.product?._id === productData?.bagProduct?._id);
      if (existingProductIndex) {
        setbuttonCheck(true);
      } else {
        setbuttonCheck(false);
      }
    }
  }

  const MyFavoriteButtonControl = async () => {
    if (isAuthUser.isAuth) {
      const existingProductIndex = favoritesList.some(item => item._id === productData?.bagProduct?._id);
      if (existingProductIndex) {
        setfavoriteButtonCheck(true);
      } else {
        setfavoriteButtonCheck(false);
      }
    }
  }


  const handleAdetSayacClick = (count) => {
    if (count.id === 'plus' && quantity > 0 && quantity < productData.bagProduct.productPiece) {
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
    <div className='BagProductViewerDiv'>
      <Navbar />
      {loading ? (
        <div className='BagProductViewerPage'>
          <div className='BagProductViewerPageImage'>
            <ProductItemPageImageList productData={productData.bagProduct} />
          </div>
          {productData && (
            <div className='BagProductViewerPageBody'>
              <div className='BagProductViewerPageBodyHeader'>
                <span style={{ color: "skyblue", fontSize: "1.7rem" }}>{productData.bagProduct.productBrand.toUpperCase()}</span> {productData.bagProduct.productName.toUpperCase()}
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", color: "rgb(78,78,78)" }}>Product Feature:</span>
              <div className='BagProductItemFeature'>
                <p className='BagItemFeatureP'>
                  <span>Type:</span> <span>{productData.bagProduct.productType.toUpperCase()}</span>
                </p>
                <p className='BagItemFeatureP'>
                  <span>Gender:</span> <span>{productData.bagProduct.productGender.toUpperCase()}</span>
                </p>
                <p className='BagItemFeatureP'>
                  <span>Category:</span> <span>{productData.bagProduct.productCategory}</span>
                </p>
                <p className='BagItemFeatureP'>
                  <span>Color:</span> <span>{productData.bagProduct.productColor}</span>
                </p>
                <p className='BagItemFeatureP'>
                  <span>Bag Pattern:</span> <span>{productData.bagProduct.productBagPattern}</span>
                </p>
                <p className='BagItemFeatureP'>
                  <span>Bag Environment:</span> <span>{productData.bagProduct.productBagEnvironment}</span>
                </p>
                <p className='BagItemFeatureP'>
                  <span>Bag Size:</span> <span>{productData.bagProduct.productBagSize}</span>
                </p>
                <p className='BagItemFeatureP'>
                  <span>Unit Price:</span> <span>{productData.bagProduct.productPrice} TL</span>
                </p>
                <p className='BagItemFeatureP'>
                  <span>Max Piece:</span> <span>{productData.bagProduct.productPiece}</span>
                </p>
                <p className='BagItemFeatureDesc'>
                  <span>Product Description:</span> <span>{productData.bagProduct.productDescription}</span>
                </p>
              </div>
              <div>
                <span style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.6rem", fontWeight: "bold", color: "rgba(89, 98, 128, 0.699)" }}>Piece</span>
                <div style={{ width: "100%", height: "auto", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "2rem" }}>
                  <button
                    id='minus'
                    name={productData.bagProduct._id}
                    className='ProductCardItemPlusMinIconButton'
                    onClick={() => handleAdetSayacClick(document.getElementById('minus'))}
                  ><MinusCircleOutlined /></button>
                  <span style={{ fontSize: "1.2rem", color: "rgba(82, 82, 82, 0.664)" }}>{quantity}</span>
                  <button
                    id='plus'
                    name={productData.bagProduct._id}
                    className='ProductCardItemPlusMinIconButton'
                    onClick={() => handleAdetSayacClick(document.getElementById('plus'))}
                  >< PlusCircleOutlined /></button>
                </div>
                <div style={{ width: "100%", height: "auto", display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                  {
                    buttonCheck ? (
                      <button
                        className='BagItemFeatureButton'
                        onClick={() => history.push('/MyCart')}
                      >Go to cart</button>
                    ) : (
                      <button
                        className='BagItemFeatureButton'
                        onClick={() => handleClickCart()}
                      >Add to cart</button>
                    )
                  }
                  {
                    favoriteButtonCheck ? (
                      <button
                        className='BagItemFavoriteButtonLast'
                        onClick={handleClickDeleteFavorite}
                      ><HeartTwoTone className='FavoriteIcon' /> </button>
                    ) : (
                      <button
                        className='BagItemFavoriteButtonFirst'
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
