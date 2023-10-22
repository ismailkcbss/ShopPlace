import React, { useEffect, useState } from 'react'
import Navbar from './navbar'
import CategoryListItem from '../mainComponentsItem/CategoryListItem'
import ProductCard from './ProductCard'
import { axiosInstance } from '../axios.util'
import Loading from '../Loading'

export default function HomePage() {

  const [allProduct, setAllProduct] = useState([])
  const [loading, setLoading] = useState(false)

  const GetAllProduct = async () => {
    try {
      const { data } = await axiosInstance.get(`/Main/Home`)
      setAllProduct(data.allProducts);
      setLoading(true)
    } catch (error) {
      alert("All product not found")
    }
  }

  useEffect(() => {
    GetAllProduct();
  }, [])

  return (
    <div className='HomePageDiv'>
      <Navbar />
      <div className='ContentDiv'>
        <div className='CatagoryDiv'>
          <CategoryListItem />
        </div>
        <div className='ProductDiv'>
          {loading ? (
            allProduct?.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))
          ) : (
            <Loading />
          )
          }

        </div>
        <div className='FilterDiv'>

        </div>
      </div>
    </div>
  )
}
