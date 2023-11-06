import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { axiosInstance } from '../axios.util';
import Navbar from '../mainComponents/navbar';
import ElectronicProductItemPageImageList from './ElectronicComponentsItem/ElectronicProductItemPageImageList';
import Loading from '../Loading';


export default function ElectronicProductViewer() {

    const { id } = useParams();

    const history = useHistory();

    const [productData, setProductData] = useState([])
    const [loading, setLoading] = useState(false)

    const GetProductItem = async () => {
        if (id) {
            try {
                const { data } = await axiosInstance.get(`/Product/Seller/Electronic/${id}`)
                setProductData(data)
                setLoading(true)
            } catch (error) {
                alert(error.response.data.error)
            }
        }
    }

    const handleClickProductEdit = () => {
        history.push(`/ElectronicAddProduct/${productData.electronicProduct._id}`)
    }

    const handleClickProductDelete = async () => {
        try {
            const { data } = await axiosInstance.delete(`/Product/Seller/Electronic/${productData.electronicProduct._id}`)
            alert(data.message)
            history.push('/MyProfile')
        } catch (error) {
            alert(error.response.data.error)
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
                                <button
                                    className='ElectronicItemFeatureButton'
                                    onClick={handleClickProductDelete}
                                >Delete</button>
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
