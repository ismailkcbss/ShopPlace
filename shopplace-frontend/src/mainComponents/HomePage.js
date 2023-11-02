import React, { useEffect, useState } from 'react'
import Navbar from './navbar'
import CategoryListItem from '../mainComponentsItem/CategoryListItem'
import ProductCard from './ProductCard'
import { axiosInstance } from '../axios.util'
import Loading from '../Loading'

export default function HomePage() {

  const [allProduct, setAllProduct] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")


  function handleKeyPress(event) {
    if (event.key === "Enter") {
      GetAllProduct()
    }
  }

  const GetAllProduct = async () => {
    try {
      const { data } = await axiosInstance.get(`/Main/Home?search=${search}`)
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
              allProduct[0]? (
                <div className='ProductDivItems'>
                  {
                    loading ? (
                      allProduct?.map((item) => (
                        <ProductCard key={item._id} item={item} />
                      ))
                    ) : (
                      <Loading />
                    )
                  }
                </div>

              ) : (
                <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                  <p style={{fontSize:"1.8rem",fontWeight:"700", color:"grey"}}>No matching product found! </p>
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
