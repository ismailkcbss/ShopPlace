import React, { useEffect, useState } from 'react'
import Navbar from './navbar'
import CategoryListItem from '../mainComponentsItem/CategoryListItem'
import Loading from '../Loading'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { axiosInstance } from '../axios.util'
import ProductCard from './ProductCard'

export default function CategoryList() {

  const { productType } = useParams();

  const [categoryAllProduct, setCategoryAllProduct] = useState([])
  const [loading, setLoading] = useState(false);

  const GetCategoryAllProducts = async () => {
    if (productType) {
      try {
        const { data } = await axiosInstance.get(`/Product/${productType}`)
        setCategoryAllProduct(data.allData)
        setLoading(true);
      } catch (error) {
        alert('Not found category list')
      }
    }
  }

  useEffect(() => {
    GetCategoryAllProducts();
  }, [productType])


  return (
    <div className='CategoryListPageDiv'>
      <Navbar />
      <div className='CategoryListPage'>
        <div className='CatagoryDiv'>
          <CategoryListItem />
        </div>
        <div className='ProductDiv'>
          {loading ? (
            categoryAllProduct?.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))
          ) : (
            <Loading />
          )
          }
        </div>
      </div>
    </div>
  )
}
