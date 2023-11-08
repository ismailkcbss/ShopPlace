import React, { useEffect, useState } from 'react'
import Navbar from './navbar'
import MyFavoritesItem from '../mainComponentsItem/MyFavoritesItem'
import { axiosInstance } from '../axios.util'
import Loading from '../Loading';
import { notification } from 'antd';

export default function MyFavorites() {

    const [favoritesList, setFavoritesList] = useState([]);
    const [loading, setLoading] = useState(false)


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

    const GetAllFavoritesProduct = async () => {
        try {
            const { data } = await axiosInstance.get(`/Main/Favorite/Products`)
            setFavoritesList(data.favoriteProducts);
            setLoading(true);
        } catch (error) {
            showNotification('error', error.response.data.error)

        }
    }


    useEffect(() => {
        GetAllFavoritesProduct();
    }, [])

    return (
        <div className='MyFavoritesDiv'>
            <Navbar />
            <div className='MyFavoritesPage'>
                {
                    favoritesList[0] ? (
                        <div className='ProductDiv'>
                            {loading ? (
                                favoritesList?.map((item) => (
                                    <MyFavoritesItem key={item._id} item={item} />
                                ))
                            ) : (
                                <Loading />
                            )
                            }
                        </div>
                    ) : (
                        <p style={{ width: "100%", height: "80vh", fontSize: "2rem", display: "flex", justifyContent: "center", alignItems: "center" }}>You have no favorite products.</p>
                    )
                }

            </div>
        </div>
    )
}
