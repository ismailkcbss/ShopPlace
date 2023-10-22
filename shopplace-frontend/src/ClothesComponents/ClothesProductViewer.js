import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { axiosInstance } from '../axios.util';
import Navbar from '../mainComponents/navbar';
import ClothesProductItemPageImageList from './ClothesComponentsItem/ClothesProductItemPageImageList';
import Loading from '../Loading';

export default function ClothesProductViewer() {

    const { id } = useParams();

    const history = useHistory();

    const [productData, setProductData] = useState([])
    const [loading, setLoading] = useState(false)

    const GetProductItem = async () => {
        if (id) {
            try {
                const { data } = await axiosInstance.get(`/Product/Seller/Clothes/${id}`)
                setProductData(data)
                setLoading(true)
            } catch (error) {
                alert("error")
            }
        }
    }

    const handleClickProductEdit = () => {
        history.push(`/ClothesAddProduct/${productData.clothesProduct._id}`)
    }

    const handleClickProductDelete = async () => {
        try {
            const { data } = await axiosInstance.delete(`/Product/Seller/Clothes/${productData.clothesProduct._id}`)
            alert('Success')
            history.push('/MyProfile')
        } catch (error) {
            alert('product delete error')
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
                    <div className='ClothesProductViewerPageBody'>
                        <div className='ClothesProductViewerPageBodyHeader'>
                            <span onClick={() => history.push('/')} className='ProductSeller'>{productData.user.username.toUpperCase()}</span> {productData.clothesProduct.productName.toUpperCase()}
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
                        <div style={{ display: "flex" }}>
                            <button
                                className='ClothesItemFeatureButton'
                                onClick={handleClickProductEdit}
                            >Düzenle</button>
                            <button
                                className='ClothesItemFeatureButton'
                                onClick={handleClickProductDelete}
                            >Sil</button>
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
