import React, { useEffect, useState } from 'react'
import Loading from '../../Loading'
import ShoesProductItemPageImageList from './ShoesProductItemPageImageList'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../axios.util';
import Navbar from '../../mainComponents/navbar';
import { Radio } from 'antd';
import * as storage from '../../storage.helper'

export default function ShoesProductCardItem() {

  const { id } = useParams();
  const initialSize = {
    productSize: ""
  }

  const history = useHistory();

  const isAuthUser = useSelector((state) => state.user)

  const [productSizeState, setProductSizeState] = useState({ ...initialSize })
  const [productData, setProductData] = useState([])
  const [loading, setLoading] = useState(false)

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

  const handleClickCart = (productID) => {
    if (isAuthUser.isAuth) {
      const cart = getCart() || [];
      if (!cart.includes(productID)) {
        cart.push(productID);
      }
      storage.setKeyWithValue(`${isAuthUser.user.username}` + `cart`, JSON.stringify(cart));
    } else {
      history.push('/Login');
    }
  }

  function getCart() {
    const cartJSON = storage.getValueByKey(`${isAuthUser.user.username}` + `cart`);
    return cartJSON ? JSON.parse(cartJSON) : [];
  }

  const handleProductSizeTextChange = (value, key) => {
    setProductSizeState({
      ...productSizeState,
      [key]: value
    })
  }

  useEffect(() => {
    GetProductItem();
  }, [id])


  return (
    <div className='ShoesProductViewerDiv'>
      <Navbar />
      {loading ? (
        <div className='ShoesProductViewerPage'>
          <div className='ShoesProductViewerPageImage'>
            <ShoesProductItemPageImageList productData={productData.shoesProduct} />
          </div>
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
              <button
                className='ShoesItemFeatureButton'
                onClick={() => handleClickCart(productData.shoesProduct)}
              >Add to cart</button>
            </div>

          </div>
        </div>
      ) : (
        <Loading />
      )
      }
    </div>
  )
}
