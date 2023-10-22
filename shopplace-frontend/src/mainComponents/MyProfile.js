import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from './navbar';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { axiosInstance } from '../axios.util';
import MyProfileProductsItem from '../mainComponentsItem/MyProfileProductsItem';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

const items = [
  {
    label: <a href="/ClothesAddProduct">Add clothes product</a>,
    key: '0',
  },
  {
    label: <a href="/ShoesAddProduct">Add shoes product</a>,
    key: '1',
  },
];

export default function MyProfile() {

  const userData = useSelector((state) => state.user);
  const history = useHistory();
  const [productsData, setProductsData] = useState([])


  const getAllProducts = async () => {
    if (userData.user.seller) {
      try {
        const { data } = await axiosInstance.get(`/Product/Seller/Clothes`)
        setProductsData(data.allProducts)
      } catch (error) {
        alert('Not find all products')
      }
    }
  }

  useEffect(() => {
    getAllProducts();
  }, [userData.user.seller])


  return (
    <div className='MyProfileDiv'>
      <Navbar />
      <div className='MyProfilePage'>
        {userData.user.seller ? (
          <div className='MyProfileSellerDiv'>
            <div>
              <div className='MyProfileSellerHeader'>
                <h2>Welcome! {userData.user.username}</h2>
                <Dropdown
                  menu={{
                    items,
                  }}
                  trigger={['click']}
                >
                  <button onClick={(e) => e.preventDefault()}  className='MyProfileSellerHeaderButton'>
                    <Space>
                      Add Product
                      <DownOutlined />
                    </Space>
                  </button>
                </Dropdown>
              </div>
              <span style={{ fontSize: "2rem", margin: "3rem 0 3rem 0", borderBottom: ".1rem solid rgba(190, 190, 190, 0.705)" }}>My Products</span>
              <div className='MyProfileSellerBody'>
                {
                  productsData?.map((productItem) => (
                    <MyProfileProductsItem key={productItem._id} productItem={productItem} />
                  ))
                }
              </div>
            </div>
          </div>
        ) : (
          <div className='MyProfileNotSellerDiv'>

          </div>
        )

        }
      </div>
    </div>
  )
}
