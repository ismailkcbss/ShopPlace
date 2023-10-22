import React from 'react'
import Navbar from './navbar'
import MyFavoritesItem from '../mainComponentsItem/MyFavoritesItem'


export default function MyFavorites() {

    return (
        <div className='MyFavoritesDiv'>
            <Navbar />
            <div className='MyFavoritesPage'>
                <div className='MyFavoritesCardList'>
                    <MyFavoritesItem/>
                </div>
            </div>
        </div>
    )
}
