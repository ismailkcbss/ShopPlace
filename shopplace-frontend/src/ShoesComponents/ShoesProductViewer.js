import React, { useEffect, useState } from 'react'
import Loading from '../Loading'
import Navbar from '../mainComponents/navbar'
import { axiosInstance } from '../axios.util'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import ShoesProductItemPageImageList from './ShoesComponentsItem/ShoesProductItemPageImageList';

export default function ShoesProductViewer() {

    const { id } = useParams();
    const history = useHistory();

    const [productData, setProductData] = useState([])
    const [loading, setLoading] = useState(false)
    const [isWaitDelClick, setIsWaitDelClick] = useState(false)


    const GetShoesProduct = async () => {
        if (id) {
            try {
                const { data } = await axiosInstance.get(`/Product/Seller/Shoes/${id}`)
                setProductData(data)
                setLoading(true)
            } catch (error) {
                alert(error.response.data.error)
            }
        }
    }

    const handleClickProductEdit = () => {
        history.push(`/ShoesAddProduct/${productData.shoesProduct._id}`)
    }

    const handleClickProductDelete = async () => {
        if (isWaitDelClick) {
            return;
        }
        setIsWaitDelClick(true)
        try {
            const { data } = await axiosInstance.delete(`/Product/Seller/Shoes/${productData.shoesProduct._id}`)
            history.push('/MyProfile')
        } catch (error) {
            alert(error.response.data.error)
        } finally {
            setIsWaitDelClick(false);
        }
    }

    useEffect(() => {
        GetShoesProduct();
    }, [id])


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
                                    <span>Type:</span> <span>{productData.shoesProduct.productType}</span>
                                </p>
                                <p className='ShoesItemFeatureP'>
                                    <span>Gender:</span> <span>{productData.shoesProduct.productGender}</span>
                                </p>
                                <p className='ShoesItemFeatureP'>
                                    <span>Shoes Category:</span><span>{productData.shoesProduct.productCategory}</span>
                                </p>
                                <p className='ShoesItemFeatureP'>
                                    <span>Model:</span> <span>{productData.shoesProduct.productModel}</span>
                                </p>
                                <p className='ShoesItemFeatureP'>
                                    <span>Color:</span> <span>{productData.shoesProduct.productNumber}</span>
                                </p>
                                <p className='ShoesItemFeatureP'>
                                    <span>Shoes Number:</span> <span>{productData.shoesProduct.productColor}</span>
                                </p>
                                <p className='ShoesItemFeatureP'>
                                    <span>Unit Price:</span> <span>{productData.shoesProduct.productPrice}</span>
                                </p>
                                <p className='ShoesItemFeatureP'>
                                    <span>Max Piece:</span><span>{productData.shoesProduct.productPiece}</span>
                                </p>
                                <p className='ShoesItemFeatureDesc'>
                                    <span>Product Description:</span> <span>{productData.shoesProduct.productDescription}</span>
                                </p>
                            </div>
                            <div style={{ display: "flex" }}>
                                <button
                                    className='ShoesItemFeatureButton'
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
