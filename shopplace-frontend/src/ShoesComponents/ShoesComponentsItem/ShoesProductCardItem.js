import React, { useEffect, useState } from 'react'
import Loading from '../../Loading'
import ShoesProductItemPageImageList from './ShoesProductItemPageImageList'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../axios.util';
import Navbar from '../../mainComponents/navbar';
import { Radio } from 'antd';
import * as storage from '../../storage.helper'
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';



export default function ShoesProductCardItem() {

  const { id } = useParams();
  const initialSize = {
    productSize: ""
  }

  const history = useHistory();

  const isAuthUser = useSelector((state) => state.user)

  const [productSizeState, setProductSizeState] = useState({ ...initialSize })
  const [productData, setProductData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(1);
  const [buttonCheck, setbuttonCheck] = useState(false)


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

  const handleProductSizeTextChange = (value, key) => {
    setProductSizeState({
      ...productSizeState,
      [key]: value
    })
  }

  const handleAdetSayacClick = (count) => {
    if (count.id === 'plus' && quantity > 0 && quantity < productData.shoesProduct.productPiece) {
      setQuantity(quantity + 1)
    }
    else if (count.id === 'minus' && quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  function getCart() {
    const cartJSON = storage.getValueByKey(`${isAuthUser.user.username}cart`);
    return cartJSON ? JSON.parse(cartJSON) : [];
  }

  const MyCartButton = async () => {
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




  useEffect(() => {
    GetProductItem();
  }, [id])

  useEffect(() => {
    MyCartButton();
  }, [GetProductItem])

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
                {productData.shoesProduct.productName.toUpperCase()}
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Product Feature:</span>
              <div className='ShoesItemFeature'>
                <p className='ShoesItemFeatureP'>
                  <span>Price:</span> <span>{productData.shoesProduct.productPrice}</span>
                </p>
                <p className='ShoesItemFeatureP'>
                  <span>Shoes Type:</span><span>{productData.shoesProduct.productType}</span>
                </p>
                <p className='ShoesItemFeatureP'>
                  <span>Color:</span> <span>{productData.shoesProduct.productColor}</span>
                </p>
                <p className='ShoesItemFeatureP'>
                  <span>Model:</span> <span>{productData.shoesProduct.productModel}</span>
                </p>
                <p className='ShoesItemFeatureP'>
                  <span>Piece:</span> <span>{productData.shoesProduct.productPiece}</span>
                </p>
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Product Description:</span>
              <div className='ShoesItemFeatureDesc'>{productData.shoesProduct.productDescription}</div>

              <div>
                <div className='ShoesItemFeatureDescSize'>
                  <span style={{ fontSize: "1.4rem", fontWeight: "bold", marginRight: "2rem" }}>
                    Shoes Number:
                  </span>
                  <Radio.Group buttonStyle="solid" defaultValue='XXL' onChange={(e) => handleProductSizeTextChange(e.target.value, "productNumber")} value={productSizeState.productNumber} style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                    <Radio.Button value="40">40</Radio.Button>
                    <Radio.Button value="41">41</Radio.Button>
                    <Radio.Button value="42">42</Radio.Button>
                    <Radio.Button value="43">43</Radio.Button>
                    <Radio.Button value="44">44</Radio.Button>
                    <Radio.Button value="45">45</Radio.Button>
                  </Radio.Group>
                </div>
                <span>Adet</span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    id='plus'
                    name={productData.shoesProduct._id}
                    className='MyCartCardButtonPlusMinIcon'
                    onClick={() => handleAdetSayacClick(document.getElementById('plus'))}
                  ><PlusCircleOutlined /></button>
                  <span style={{ fontSize: "1.2rem", color: "rgba(82, 82, 82, 0.664)" }}>{quantity}</span>
                  <button
                    id='minus'
                    name={productData.shoesProduct._id}
                    className='MyCartCardButtonPlusMinIcon'
                    onClick={() => handleAdetSayacClick(document.getElementById('minus'))}
                  ><MinusCircleOutlined /></button>
                </div>
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
