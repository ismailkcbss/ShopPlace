import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { axiosInstance } from '../axios.util';
import Navbar from '../mainComponents/navbar';
import PersonalCareProductItemPageImageList from './PersonalCareComponentsItem/PersonalCareProductItemPageImageList';
import Loading from '../Loading';
import { notification } from 'antd';


export default function PersonalCareProductViewer() {

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
                const { data } = await axiosInstance.get(`/Product/Seller/PersonalCare/${id}`)
                setProductData(data)
                setLoading(true)
            } catch (error) {
                showNotification('error', error.response.data.error)

            }
        }
    }

    const handleClickProductEdit = () => {
        history.push(`/PersonalCareAddProduct/${productData.personalCareProduct._id}`)
    }

    const handleClickProductDelete = async () => {
        if (isWaitDelClick) {
            return;
        }
        setIsWaitDelClick(true)
        try {
            const { data } = await axiosInstance.delete(`/Product/Seller/PersonalCare/${productData.personalCareProduct._id}`)
            history.push('/MyProfile')
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
        <div className='PersonalCareProductViewerDiv'>
            <Navbar />
            {loading ? (
                <div className='PersonalCareProductViewerPage'>
                    <div className='PersonalCareProductViewerPageImage'>
                        <PersonalCareProductItemPageImageList productData={productData.personalCareProduct} />
                    </div>
                    {productData && (
                        <div className='PersonalCareProductViewerPageBody'>
                            <div className='PersonalCareProductViewerPageBodyHeader'>
                                {productData.personalCareProduct.productName.toUpperCase()}
                            </div>
                            <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Product Feature:</span>
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
                            </div><div style={{ display: "flex" }}>
                                <button
                                    className='PersonalCareItemFeatureButton'
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
