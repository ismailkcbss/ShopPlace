import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from './navbar';
import { axiosInstance } from '../axios.util';
import MyProfileProductsItem from '../mainComponentsItem/MyProfileProductsItem';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, notification } from 'antd';
import MyProfileOrdersTable from '../mainComponentsItem/MyProfileOrdersTable';
import MyProfileInfoTable from '../mainComponentsItem/MyProfileInfoTable';
import MyProfileOrdersPlacedTable from '../mainComponentsItem/MyProfileOrdersPlacedTable';
import Loading from '../Loading';


const items = [
  {
    label: <a href="/ClothesAddProduct">Add clothes product</a>,
    key: '0',
  },
  {
    label: <a href="/ShoesAddProduct">Add shoes product</a>,
    key: '1',
  },
  {
    label: <a href="/ElectronicAddProduct">Add electronic product</a>,
    key: '2',
  },
  {
    label: <a href="/BagAddProduct">Add Bag product</a>,
    key: '3',
  },
  {
    label: <a href="/PersonalCareAddProduct">Add Personal Care product</a>,
    key: '4',
  },
];

export default function MyProfile() {

  const userData = useSelector((state) => state.user);
  const [productsData, setProductsData] = useState([])
  const [ordersReceived, setOrdersReceived] = useState([])
  const [ordersPlaced, setOrdersPlaced] = useState([])
  const [loading, setLoading] = useState(false);

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



  const getAllProducts = async () => {
    if (userData.user.seller) {
      try {
        const { data } = await axiosInstance.get(`/Main/Seller/Products`)
        setProductsData(data.allProducts)
        setLoading(true)
      } catch (error) {
        showNotification('error', error.response.data.error)
      }
    }
  }

  const getAllOrdersReceived = async () => {
    if (userData.user.seller) {
      try {
        const { data } = await axiosInstance.get(`/Main/MyOrder/Seller`)
        setOrdersReceived(data.product)
        setLoading(true)
      } catch (error) {
        showNotification('error', error.response.data.error)
      }
    }
  }

  const getAllOrdersPlaced = async () => {
    if (!userData.user.seller) {
      try {
        const { data } = await axiosInstance.get(`/Main/MyOrder/Customer`)
        setOrdersPlaced(data.ordersPlaced)
        setLoading(true)
      } catch (error) {
        showNotification('error', error.response.data.error)
      }
    }
  }


  useEffect(() => {
    getAllProducts();
    getAllOrdersReceived();
    getAllOrdersPlaced();
  }, [userData.user])


  return (
    <div className='MyProfileDiv'>
      <Navbar />
      <div className='MyProfilePage'>
        {userData.user.seller ? (
          <div className='MyProfileSellerDiv'>
            <div className='MyProfileSellerHeader'>
              <div className='MyProfileSellerHeaderImg'>
                <img src={userData.user.image} alt='profileimg' />
              </div>
              <div className='MyProfileSellerHeaderProfileInfo'>
                <MyProfileInfoTable userData={userData} /></div>
            </div>
            <div className='MyProfileSellerProductsDiv'>
              <Dropdown
                menu={{
                  items,
                }}
                trigger={['click']}
              >
                <button onClick={(e) => e.preventDefault()} className='MyProfileSellerProductsDivButton'>
                  <Space>
                    Add Product
                    <DownOutlined />
                  </Space>
                </button>
              </Dropdown>
            </div>
            {
              loading ? (
                <div className='MyProfileSellerMain'>
                  <div>
                    <span style={{ width: "100%", fontSize: "2rem", display: "flex", justifyContent: "center", marginBottom: "2rem" }}>My Products</span>
                    
                    {productsData[0]?(
                    <div className='MyProfileSellerMainProduct'>
                    {
                      productsData?.map((productItem) => (
                        <MyProfileProductsItem key={productItem._id} productItem={productItem} />
                      ))
                    }
                  </div>
                    ):(
                      <p style={{ width: "100%", fontSize: "1.4rem", display: "flex", justifyContent: "center", alignItems: "center", margin: "10rem 0 10rem 0",color:"rgb(192, 192, 192)" }}>You haven't created a product yet. Click the button and create a product now.</p>
                    )
                  }

                  </div>
                  <span style={{ width: "100%", fontSize: "2rem", display: "flex", justifyContent: "center", margin: "2rem 0 2rem 0" }}>Orders Received</span>
                  {
                    ordersReceived.length > 0 ? (
                      <div>
                        <MyProfileOrdersTable ordersReceived={ordersReceived} />
                      </div>
                    ) : (
                      <p style={{ width: "100%", fontSize: "1.4rem", display: "flex", justifyContent: "center", alignItems: "center", margin: "10rem 0 10rem 0",color:"rgb(192, 192, 192)" }}>There is no order received yet.</p>
                    )
                  }
                </div>
              ) : (
                <Loading />
              )
            }
          </div>
        ) : (
          <div className='MyProfileCustomerDiv'>
            <div className='MyProfileCustomerHeader'>
              <div className='MyProfileCustomerHeaderImg'>
                <img src={userData.user.image} alt='profileimg' />
              </div>
              <div className='MyProfileCustomerHeaderProfileInfo'>
                <MyProfileInfoTable userData={userData} /></div>
            </div>

            {
              loading ? (
                <div className='MyProfileCustomerMain'>
                  <span style={{ width: "100%", fontSize: "2rem", display: "flex", justifyContent: "center", marginBottom: "2rem 0 2rem 0" }}>My Orders</span>
                  {
                    ordersPlaced.length > 0 ? (
                      <div>
                        <MyProfileOrdersPlacedTable ordersPlaced={ordersPlaced} setOrdersPlaced={setOrdersPlaced}/>
                      </div>
                    ) : (
                      <p style={{ width: "100%", fontSize: "1.4rem", display: "flex", justifyContent: "center", alignItems: "center", margin: "10rem 0 10rem 0",color:"rgb(192, 192, 192)" }}>You haven't bought a product yet.</p>
                    )
                  }
                </div>
              ) : (
                <Loading />
              )
            }


          </div>
        )}

      </div>
    </div>
  )
}
