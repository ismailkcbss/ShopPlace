import React, { useEffect, useState } from 'react'
import Navbar from './navbar'
import CategoryListItem from '../mainComponentsItem/CategoryListItem'
import ProductCard from './ProductCard'
import { axiosInstance } from '../axios.util'
import Loading from '../Loading'
import { notification } from 'antd';


export default function HomePage() {

  const [allProduct, setAllProduct] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")


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
      showNotification('error', error.response.data.error)
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
