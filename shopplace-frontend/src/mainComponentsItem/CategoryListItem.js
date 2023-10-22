import React from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

export default function CategoryListItem(props) {

    const history = useHistory();

    const handleClick = (params) => {
       history.push(`/CategoryList/${params.id}`)
    }

    return (
        <div className='CategoryListDiv'>
            <ul className='CategoryListMainUl'>
                <li className='CategoryListMainLi'>
                    <button
                        id='Clothes'
                        onClick={() =>handleClick(document.getElementById('Clothes')) }
                        className='CategoryListMainButton'
                    >Clothes</button>
                </li>
                <li className='CategoryListMainLi'>
                    <button
                        id='Shoes'
                        onClick={() =>handleClick(document.getElementById('Shoes'))}
                        className='CategoryListMainButton'
                    >Shoes</button>
                </li>
                <li className='CategoryListMainLi'>
                    <button
                        id='Bag'
                        onClick={() =>handleClick(document.getElementById('Bag'))}
                        className='CategoryListMainButton'
                    >Bag</button>
                </li>
                <li className='CategoryListMainLi'>
                    <button
                        id='Personal Care'
                        onClick={() =>handleClick(document.getElementById('Personal Care'))}
                        className='CategoryListMainButton'
                    >Personal Care</button>
                </li>
                <li className='CategoryListMainLi'>
                    <button
                        id='Watch and Accessory'
                        onClick={() =>handleClick(document.getElementById('Watch and Accessory'))}
                        className='CategoryListMainButton'
                    >Watch and Accessory</button>
                </li>
                


            </ul>
        </div>
    )
}
