import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { axiosInstance } from '../axios.util';
import Navbar from '../mainComponents/navbar';
import BagProductItemPageImageList from './BagComponentsItem/BagProductItemPageImageList';
import Loading from '../Loading';

export default function BagProductViewer() {

    const { id } = useParams();

    const history = useHistory();

    const [productData, setProductData] = useState([])
    const [loading, setLoading] = useState(false)
    const [isWaitDelClick, setIsWaitDelClick] = useState(false)


    const GetProductItem = async () => {
        if (id) {
            try {
                const { data } = await axiosInstance.get(`/Product/Seller/Bag/${id}`)
                setProductData(data)
                setLoading(true)
            } catch (error) {
                alert(error.response.data.error)
            }
        }
    }

    const handleClickProductEdit = () => {
        history.push(`/BagAddProduct/${productData.bagProduct._id}`)
    }

    const handleClickProductDelete = async () => {
        if (isWaitDelClick) {
            return;
        }
        setIsWaitDelClick(true);
        try {
            const { data } = await axiosInstance.delete(`/Product/Seller/Bag/${productData.bagProduct._id}`)
            history.push('/MyProfile')
        } catch (error) {
            alert(error.response.data.error)
        } finally {
            setIsWaitDelClick(false);
        }
    }

    useEffect(() => {
        GetProductItem();
    }, [id])



    return (
        <div className='BagProductViewerDiv'>
            <Navbar />
            {loading ? (
                <div className='BagProductViewerPage'>
                    <div className='BagProductViewerPageImage'>
                        <BagProductItemPageImageList productData={productData.bagProduct} />
                    </div>
                    {productData && (
                        <div className='BagProductViewerPageBody'>
                            <div className='BagProductViewerPageBodyHeader'>
                                {productData.bagProduct.productName.toUpperCase()}
                            </div>
                            <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Product Feature:</span>
                            <div className='BagItemFeature'>
                                <p className='BagItemFeatureP'>
                                    <span>Type:</span> <span>{productData.bagProduct.productType.toUpperCase()}</span>
                                </p>
                                <p className='BagItemFeatureP'>
                                    <span>Gender:</span> <span>{productData.bagProduct.productGender.toUpperCase()}</span>
                                </p>
                                <p className='BagItemFeatureP'>
                                    <span>Category:</span> <span>{productData.bagProduct.productCategory}</span>
                                </p>
                                <p className='BagItemFeatureP'>
                                    <span>Color:</span> <span>{productData.bagProduct.productColor}</span>
                                </p>
                                <p className='BagItemFeatureP'>
                                    <span>Bag Pattern:</span> <span>{productData.bagProduct.productBagPattern}</span>
                                </p>
                                <p className='BagItemFeatureP'>
                                    <span>Bag Environment:</span> <span>{productData.bagProduct.productBagEnvironment}</span>
                                </p>
                                <p className='BagItemFeatureP'>
                                    <span>Bag Size:</span> <span>{productData.bagProduct.productBagSize}</span>
                                </p>
                                <p className='BagItemFeatureP'>
                                    <span>Unit Price:</span> <span>{productData.bagProduct.productPrice} TL</span>
                                </p>
                                <p className='BagItemFeatureP'>
                                    <span>Max Piece:</span> <span>{productData.bagProduct.productPiece}</span>
                                </p>
                                <p className='BagItemFeatureDesc'>
                                    <span>Product Description:</span> <span>{productData.bagProduct.productDescription}</span>
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
