import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { axiosInstance } from '../axios.util';
import Navbar from '../mainComponents/navbar';
import ElectronicProductItemPageImageList from './ElectronicComponentsItem/ElectronicProductItemPageImageList';
import Loading from '../Loading';
import { notification } from 'antd';

export default function ElectronicProductViewer() {

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
                const { data } = await axiosInstance.get(`/Product/Seller/Electronic/${id}`)
                setProductData(data)
                setLoading(true)
            } catch (error) {
                showNotification('error', error.response.data.error)
            }
        }
    }

    const handleClickProductEdit = () => {
        history.push(`/ElectronicAddProduct/${productData.electronicProduct._id}`)
    }

    const handleClickProductDelete = async () => {
        if (isWaitDelClick) {
            return;
        }
        setIsWaitDelClick(true)
        try {
            const { data } = await axiosInstance.delete(`/Product/Seller/Electronic/${productData.electronicProduct._id}`)
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
        <div className='ElectronicProductViewerDiv'>
            <Navbar />
            {loading ? (
                <div className='ElectronicProductViewerPage'>
                    <div className='ElectronicProductViewerPageImage'>
                        <ElectronicProductItemPageImageList productData={productData.electronicProduct} />
                    </div>
                    {productData && (
                        <div className='ElectronicProductViewerPageBody'>
                            <div className='ElectronicProductViewerPageBodyHeader'>
                                {productData.electronicProduct.productName.toUpperCase()}
                            </div>
                            <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Product Feature:</span>
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
                            </div><div style={{ display: "flex" }}>
                                <button
                                    className='ElectronicItemFeatureButton'
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
