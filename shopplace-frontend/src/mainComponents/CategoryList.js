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
  const [search, setSearch] = useState("")

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      GetCategoryAllProducts()
    }
  }

  const GetCategoryAllProducts = async () => {
    if (productType) {
      try {
        const { data } = await axiosInstance.get(`/Product/${productType}?search=${search}`)
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
        <div className='ContentBody' >
          <div className='HeaderSearch'>
            <input
              type='text'
              className='HeaderSearchInput'
              placeholder='Product search...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e)}
            />
          </div>
          <div className='ProductDiv'>
            {
              categoryAllProduct[0] ? (
                <div className='ProductDivItems'>
                  {
                    loading ? (
                      categoryAllProduct?.map((item) => (
                        <ProductCard key={item._id} item={item} />
                      ))
                    ) : (
                      <Loading />
                    )
                  }
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <p style={{ fontSize: "1.8rem", fontWeight: "700", color: "grey" }}>No matching product found! </p>
                </div>
              )
            }
          </div>
        </div>
        <div className='FilterDiv'>

        </div>
      </div>
    </div>
  )
}
