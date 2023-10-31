import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { axiosInstance } from '../../axios.util';
import Navbar from '../../mainComponents/navbar';
import ProductItemPageImageList from './ClothesProductItemPageImageList';
import { Radio } from 'antd';
import Loading from '../../Loading';
import * as storage from '../../storage.helper'
import { useSelector } from 'react-redux';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';


export default function ClothesProductCardItem() {


    const { id } = useParams();

    const initialForm = {
        productSize: "",
    }

    const history = useHistory();

    const isAuthUser = useSelector((state) => state.user)

    const [form, setForm] = useState({ ...initialForm })
    const [productData, setProductData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [quantity, setQuantity] = useState(1);
    const [buttonCheck, setbuttonCheck] = useState(false)


    const GetProductItem = async () => {
        if (id) {
            try {
                const { data } = await axiosInstance.get(`/Product/Single/Clothes/${id}`)
                setProductData(data)
                setLoading(true)
            } catch (error) {
                alert("error")
            }
        }
    }
    const handleProductSizeTextChange = (value, key) => {
        setForm({
            ...form,
            [key]: value
        })
    }


    const handleAdetSayacClick = (count) => {
        if (count.id === 'plus' && quantity > 0 && quantity < productData.clothesProduct.productPiece) {
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
            const existingProductIndex = productCheck.some(item => item.product?._id === productData?.clothesProduct?._id);
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
            let sumCartPrice = (productData.clothesProduct.productPrice * quantity)
            const existingProductIndex = cart.findIndex(item => item.product._id === productData.clothesProduct._id);
            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity = quantity;
                cart[existingProductIndex].sumCartPrice = sumCartPrice;
            } else {
                cart.push({ product: productData.clothesProduct, quantity, sumCartPrice });
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
        <div className='ClothesProductViewerDiv'>
            <Navbar />
            {loading ? (
                <div className='ClothesProductViewerPage'>
                    <div className='ClothesProductViewerPageImage'>
                        <ProductItemPageImageList productData={productData.clothesProduct} />
                    </div>
                    {productData && (
                        <div className='ClothesProductViewerPageBody'>
                            <div className='ClothesProductViewerPageBodyHeader'>
                                {productData.clothesProduct.productName.toUpperCase()}
                            </div>
                            <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Product Feature:</span>
                            <div className='ClothesItemFeature'>
                                <p className='ClothesItemFeatureP'>
                                    <span>Pattern:</span> <span>{productData.clothesProduct.productPattern}</span>
                                </p>
                                <p className='ClothesItemFeatureP'>
                                    <span>Collar Type:</span> <span>{productData.clothesProduct.productCollerType}</span>
                                </p>
                                <p className='ClothesItemFeatureP'>
                                    <span>Color:</span> <span>{productData.clothesProduct.productColor}</span>
                                </p>
                                <p className='ClothesItemFeatureP'>
                                    <span>Materyal:</span> <span>{productData.clothesProduct.productMaterial}</span>
                                </p>

                                <p className='ClothesItemFeatureP'>
                                    <span>Package Contents:</span> <span>{productData.clothesProduct.productPackageContent}</span>
                                </p>
                                <p className='ClothesItemFeatureP'>
                                    <span>height:</span> <span>{productData.clothesProduct.productHeight}</span>
                                </p>
                            </div>
                            <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Product Description:</span>
                            <div className='ClothesItemFeatureDesc'>{productData.clothesProduct.productDescription}</div>
                            <div>
                                <div className='ClothesItemFeatureDescSize'>
                                    <span style={{ fontSize: "1.4rem", fontWeight: "bold", marginRight: "2rem" }}>
                                        Beden:
                                    </span>
                                    <Radio.Group value={form.productSize} buttonStyle="solid" onChange={(e) => handleProductSizeTextChange(e.target.value, "productSize")} style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                                        <Radio.Button value="XXL">XXL</Radio.Button>
                                        <Radio.Button value="XL">XL</Radio.Button>
                                        <Radio.Button value="L">L</Radio.Button>
                                        <Radio.Button value="M">M</Radio.Button>
                                        <Radio.Button value="S">S</Radio.Button>
                                        <Radio.Button value="XS">XS</Radio.Button>
                                    </Radio.Group>
                                </div>
                                <span>Adet</span>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <button
                                        id='plus'
                                        name={productData.clothesProduct._id}
                                        className='MyCartCardButtonPlusMinIcon'
                                        onClick={() => handleAdetSayacClick(document.getElementById('plus'))}
                                    ><PlusCircleOutlined /></button>
                                    <span style={{ fontSize: "1.2rem", color: "rgba(82, 82, 82, 0.664)" }}>{quantity}</span>
                                    <button
                                        id='minus'
                                        name={productData.clothesProduct._id}
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
