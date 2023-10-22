import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { axiosInstance } from '../../axios.util';
import Navbar from '../../mainComponents/navbar';
import ProductItemPageImageList from './ClothesProductItemPageImageList';
import { Radio } from 'antd';
import Loading from '../../Loading';

export default function ClothesProductCardItem() {

    
    const { id } = useParams();
    const initialSize = {
        productSize: ""
    }


    const [productSizeState, setProductSizeState] = useState({ ...initialSize })
    const [productData, setProductData] = useState([])
    const [sepet, setSepet] = useState([])
    const [loading, setLoading] = useState(false)

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

    const handleClickSepet = (id) => {
        const newCartProduct = {
            id: id,
            productName: productData.clothesProduct.productName,
            productPrice:productData.clothesProduct.productPrice,
            maximumPurchasableQuantity: productData.clothesProduct.clothesPiece,
        }
        const newCartProducts = [...sepet, newCartProduct];
        
        setSepet(newCartProducts)
    }


    const handleProductSizeTextChange = (value, key) => {
        setProductSizeState({
            ...productSizeState,
            [key]: value
        })
    }

    //Add to cart
    useEffect(() => {
        localStorage.setItem('MyCart', JSON.stringify(sepet))
    }, [sepet])

    useEffect(() => {
        GetProductItem();
    }, [id])

    return (
        <div className='ClothesProductViewerDiv'>
            <Navbar />
            {loading ? (
                <div className='ClothesProductViewerPage'>
                    <div className='ClothesProductViewerPageImage'>
                        <ProductItemPageImageList productData={productData.clothesProduct} />
                    </div>
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
                                <Radio.Group value={productSizeState.productSize} buttonStyle="solid" onChange={(e) => handleProductSizeTextChange(e.target.value, "productSize")} style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                                    <Radio.Button value="XXL">XXL</Radio.Button>
                                    <Radio.Button value="XL">XL</Radio.Button>
                                    <Radio.Button value="L">L</Radio.Button>
                                    <Radio.Button value="M">M</Radio.Button>
                                    <Radio.Button value="S">S</Radio.Button>
                                    <Radio.Button value="XS">XS</Radio.Button>
                                </Radio.Group>
                            </div>
                            <button
                                className='ClothesItemFeatureButton'
                                onClick={() => handleClickSepet(productData.clothesProduct._id)}
                            >Add to cart</button>
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
