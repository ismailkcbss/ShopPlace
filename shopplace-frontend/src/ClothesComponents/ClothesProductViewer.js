import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { axiosInstance } from '../axios.util';
import Navbar from '../mainComponents/navbar';
import ClothesProductItemPageImageList from './ClothesComponentsItem/ClothesProductItemPageImageList';
import Loading from '../Loading';
import { notification } from 'antd';

export default function ClothesProductViewer() {

    const { id } = useParams();

    const history = useHistory();

    const [productData, setProductData] = useState([])
    const [loading, setLoading] = useState(false)
    const [isWaitDelClick, setIsWaitDelClick] = useState(false)

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
                const { data } = await axiosInstance.get(`/Product/Seller/Clothes/${id}`)
                setProductData(data)
                setLoading(true)
            } catch (error) {
                showNotification('error', error.response.data.error)
            }
        }
    }

    const handleClickProductEdit = () => {
        history.push(`/ClothesAddProduct/${productData.clothesProduct._id}`)
    }

    const handleClickProductDelete = async () => {
        if (isWaitDelClick) {
            return;
        }
        setIsWaitDelClick(true)
        try {
            const { data } = await axiosInstance.delete(`/Product/Seller/Clothes/${productData.clothesProduct._id}`)
            history.push('/MyProfile')
            showNotification('success', data.message)
        } catch (error) {
            showNotification('error', error.response.data.error)
        } finally {
            setIsWaitDelClick(false);
        }
    }

    useEffect(() => {
        GetProductItem();
    }, [id])

    return (
        <div className='ClothesProductViewerDiv'>
            <Navbar />
            {loading ? (
                <div className='ClothesProductViewerPage'>
                    <div className='ClothesProductViewerPageImage'>
                        <ClothesProductItemPageImageList productData={productData.clothesProduct} />
                    </div>
                    {productData && (
                        <div className='ClothesProductViewerPageBody'>
                            <div className='ClothesProductViewerPageBodyHeader'>
                                {productData.clothesProduct.productName.toUpperCase()}
                            </div>
                            <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Product Feature:</span>
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
                            <div style={{ display: "flex" }}>
                                <button
                                    className='ClothesItemFeatureButton'
                                    onClick={handleClickProductEdit}
                                >Edit</button>
                                {
                                    isWaitDelClick ? (
                                        <button
                                            className='ProductViewerDisable'
                                            disabled
                                        >Waiting...</button>
                                    ) : (
                                        <button
                                            className='ClothesItemFeatureButton'
                                            onClick={handleClickProductDelete}
                                        >Delete</button>
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
