import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { axiosInstance } from '../../axios.util';
import Navbar from '../../mainComponents/navbar';
import ProductItemPageImageList from './ClothesProductItemPageImageList';
import Loading from '../../Loading';
import * as storage from '../../storage.helper'
import { useSelector } from 'react-redux';
import { PlusCircleOutlined, MinusCircleOutlined, HeartTwoTone } from '@ant-design/icons';
import { notification } from 'antd';
import 'antd/dist/reset.css';

export default function ClothesProductCardItem() {


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
                const { data } = await axiosInstance.get(`/Product/Single/Clothes/${id}`)
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
            let sumCartPrice = (productData.clothesProduct.productPrice * quantity)
            const existingProductIndex = cart.findIndex(item => item.product._id === productData.clothesProduct._id);
            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity = quantity;
                cart[existingProductIndex].sumCartPrice = sumCartPrice;
            } else {
                cart.push({ product: productData.clothesProduct, quantity, sumCartPrice });
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
                    productType: productData.clothesProduct.productType,
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
            const existingProductIndex = productCheck.some(item => item.product?._id === productData?.clothesProduct?._id);
            if (existingProductIndex) {
                setbuttonCheck(true);
            } else {
                setbuttonCheck(false);
            }
        }
    }

    const MyFavoriteButtonControl = async () => {
        if (isAuthUser.isAuth) {
            const existingProductIndex = favoritesList.some(item => item._id === productData?.clothesProduct?._id);
            if (existingProductIndex) {
                setfavoriteButtonCheck(true);
            } else {
                setfavoriteButtonCheck(false);
            }
        }
    }


    const handleAdetSayacClick = (count) => {
        if (count.id === 'plus' && quantity > 0 && quantity < productData.clothesProduct.productPiece) {
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
                                <span style={{ color: "skyblue", fontSize: "1.7rem" }}>{productData.clothesProduct.productBrand.toUpperCase()}</span> {productData.clothesProduct.productName.toUpperCase()}
                            </div>
                            <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", color: "rgb(78,78,78)" }}>Product Feature:</span>
                            <div className='ClothesItemFeature'>
                                <p className='ClothesItemFeatureP'>
                                    <span>Type:</span> <span>{productData.clothesProduct.productType.toUpperCase()}</span>
                                </p>
                                <p className='ClothesItemFeatureP'>
                                    <span>Gender:</span> <span>{productData.clothesProduct.productGender.toUpperCase()}</span>
                                </p>
                                <p className='ClothesItemFeatureP'>
                                    <span>Collar Type:</span> <span>{productData.clothesProduct.productCollerType}</span>
                                </p>
                                <p className='ClothesItemFeatureP'>
                                    <span>Color:</span> <span>{productData.clothesProduct.productColor}</span>
                                </p>
                                <p className='ClothesItemFeatureP'>
                                    <span>Pattern:</span> <span>{productData.clothesProduct.productPattern}</span>
                                </p>
                                <p className='ClothesItemFeatureP'>
                                    <span>Materyal:</span> <span>{productData.clothesProduct.productMaterial}</span>
                                </p>
                                <p className='ClothesItemFeatureP'>
                                    <span>height:</span> <span>{productData.clothesProduct.productHeight}</span>
                                </p>
                                <p className='ClothesItemFeatureP'>
                                    <span>Size:</span> <span>{productData.clothesProduct.productSize}</span>
                                </p>
                                <p className='ClothesItemFeatureP'>
                                    <span>Unit Price:</span> <span>{productData.clothesProduct.productPrice} TL</span>
                                </p>
                                <p className='ClothesItemFeatureP'>
                                    <span>Max Piece:</span> <span>{productData.clothesProduct.productPiece}</span>
                                </p>
                                <p className='ClothesItemFeatureDesc'>
                                    <span>Product Description:</span> <span>{productData.clothesProduct.productDescription}</span>
                                </p>
                            </div>
                            <div>
                                <span style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.6rem", fontWeight: "bold", color: "rgba(89, 98, 128, 0.699)" }}>Piece</span>
                                <div style={{ width: "100%", height: "auto", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "2rem" }}>
                                    <button
                                        id='minus'
                                        name={productData.clothesProduct._id}
                                        className='ProductCardItemPlusMinIconButton'
                                        onClick={() => handleAdetSayacClick(document.getElementById('minus'))}
                                    ><MinusCircleOutlined /></button>
                                    <span style={{ fontSize: "1.2rem", color: "rgba(82, 82, 82, 0.664)" }}>{quantity}</span>
                                    <button
                                        id='plus'
                                        name={productData.clothesProduct._id}
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
                    )}

                </div>
            ) : (
                <Loading />
            )

            }

        </div>
    )
}
