import React, { useEffect, useState } from 'react'
import Navbar from './navbar'
import MyFavoritesItem from '../mainComponentsItem/MyFavoritesItem'
import { axiosInstance } from '../axios.util'
import Loading from '../Loading';


export default function MyFavorites() {

    const [favoritesList, setFavoritesList] = useState([]);
    const [loading, setLoading] = useState(false)

    const GetAllFavoritesProduct = async () => {
        try {
            const { data } = await axiosInstance.get(`/Main/Favorite/Products`)
            setFavoritesList(data.favoriteProducts);
            setLoading(true);
        } catch (error) {
            alert(error)
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
                        <p style={{width:"100%",height:"80vh",fontSize:"2rem", display:"flex",justifyContent:"center",alignItems:"center"}}>You have no favorite products.</p>
                    )
                }

            </div>
        </div>
    )
}
