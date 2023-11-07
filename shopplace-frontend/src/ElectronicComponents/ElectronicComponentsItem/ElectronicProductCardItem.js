import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { axiosInstance } from '../../axios.util';
import Navbar from '../../mainComponents/navbar';
import ProductItemPageImageList from './ElectronicProductItemPageImageList';
import Loading from '../../Loading';
import * as storage from '../../storage.helper'
import { useSelector } from 'react-redux';
import { PlusCircleOutlined, MinusCircleOutlined, HeartTwoTone } from '@ant-design/icons';
import 'antd/dist/reset.css';



export default function ElectronicProductCardItem() {


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
                const { data } = await axiosInstance.get(`/Product/Single/Electronic/${id}`)
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
            let sumCartPrice = (productData.electronicProduct.productPrice * quantity)
            const existingProductIndex = cart.findIndex(item => item.product._id === productData.electronicProduct._id);
            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity = quantity;
                cart[existingProductIndex].sumCartPrice = sumCartPrice;
            } else {
                cart.push({ product: productData.electronicProduct, quantity, sumCartPrice });
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
                    productType: productData.electronicProduct.productType,
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
            const existingProductIndex = productCheck.some(item => item.product?._id === productData?.electronicProduct?._id);
            if (existingProductIndex) {
                setbuttonCheck(true);
            } else {
                setbuttonCheck(false);
            }
        }
    }

    const MyFavoriteButtonControl = async () => {
        if (isAuthUser.isAuth) {
            const existingProductIndex = favoritesList.some(item => item._id === productData?.electronicProduct?._id);
            if (existingProductIndex) {
                setfavoriteButtonCheck(true);
            } else {
                setfavoriteButtonCheck(false);
            }
        }
    }


    const handleAdetSayacClick = (count) => {
        if (count.id === 'plus' && quantity > 0 && quantity < productData.electronicProduct.productPiece) {
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
        <div className='ElectronicProductViewerDiv'>
            <Navbar />
            {loading ? (
                <div className='ElectronicProductViewerPage'>
                    <div className='ElectronicProductViewerPageImage'>
                        <ProductItemPageImageList productData={productData.electronicProduct} />
                    </div>
                    {productData && (
                        <div className='ElectronicProductViewerPageBody'>
                            <div className='ElectronicProductViewerPageBodyHeader'>
                                <span style={{ color: "skyblue", fontSize: "1.7rem" }}>{productData.electronicProduct.productBrand.toUpperCase()}</span> {productData.electronicProduct.productName.toUpperCase()}
                            </div>
                            <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", color: "rgb(78,78,78)" }}>Product Feature:</span>
                            <div className='ElectronicItemFeature'>
                                <p className='ElectronicItemFeatureP'>
                                    <span>Type:</span> <span>{productData.electronicProduct.productType.toUpperCase()}</span>
                                </p>
                                <p className='ElectronicItemFeatureP'>
                                    <span>Gender:</span> <span>{productData.electronicProduct.productGender.toUpperCase()}</span>
                                </p>
                                <p className='ElectronicItemFeatureP'>
                                    <span>Color:</span> <span>{productData.electronicProduct.productColor}</span>
                                </p>
                                <p className='ElectronicItemFeatureP'>
                                    <span>Category:</span> <span>{productData.electronicProduct.productCategory}</span>
                                </p>
                                <p className='ElectronicItemFeatureP'>
                                    <span>Guarantee Period:</span> <span>{productData.electronicProduct.productGuaranteePeriod}</span>
                                </p>
                                <p className='ElectronicItemFeatureP'>
                                    <span>Unit Price:</span> <span>{productData.electronicProduct.productPrice} TL</span>
                                </p>
                                <p className='ElectronicItemFeatureP'>
                                    <span>Max Piece:</span> <span>{productData.electronicProduct.productPiece}</span>
                                </p>
                                <p className='ElectronicItemFeatureDesc'>
                                    <span>Product Description:</span> <span>{productData.electronicProduct.productDescription}</span>
                                </p>
                            </div>
                            <div>
                                <span style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.6rem", fontWeight: "bold", color: "rgba(89, 98, 128, 0.699)" }}>Piece</span>
                                <div style={{ width: "100%", height: "auto", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "2rem" }}>
                                    <button
                                        id='minus'
                                        name={productData.electronicProduct._id}
                                        className='ProductCardItemPlusMinIconButton'
                                        onClick={() => handleAdetSayacClick(document.getElementById('minus'))}
                                    ><MinusCircleOutlined /></button>
                                    <span style={{ fontSize: "1.2rem", color: "rgba(82, 82, 82, 0.664)" }}>{quantity}</span>
                                    <button
                                        id='plus'
                                        name={productData.electronicProduct._id}
                                        className='ProductCardItemPlusMinIconButton'
                                        onClick={() => handleAdetSayacClick(document.getElementById('plus'))}
                                    >< PlusCircleOutlined /></button>
                                </div>
                                <div style={{ width: "100%", height: "auto", display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                                    {
                                        buttonCheck ? (
                                            <button
                                                className='ElectronicItemFeatureButton'
                                                onClick={() => history.push('/MyCart')}
                                            >Go to cart</button>
                                        ) : (
                                            <button
                                                className='ElectronicItemFeatureButton'
                                                onClick={() => handleClickCart()}
                                            >Add to cart</button>
                                        )
                                    }
                                    {
                                        favoriteButtonCheck ? (
                                            <button
                                                className='ElectronicItemFavoriteButtonLast'
                                                onClick={handleClickDeleteFavorite}
                                            ><HeartTwoTone className='FavoriteIcon' /> </button>
                                        ) : (
                                            <button
                                                className='ElectronicItemFavoriteButtonFirst'
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
