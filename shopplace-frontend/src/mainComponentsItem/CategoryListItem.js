import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

export default function CategoryListItem() {

    const [selectedItem, setSelectedItem] = useState(null);

    const history = useHistory();

    const handleClick = (id) => {
        history.push(`/CategoryList/${id}`);
        setSelectedItem(id);
    };

    const liItems = [
        { id: 'Clothes', text: 'Clothes' },
        { id: 'Shoes', text: 'Shoes' },
        { id: 'Bag', text: 'Bag' },
        { id: 'PersonalCare', text: 'Personal Care' },
        { id: 'Electronic', text: 'Electronic' }
    ];

    return (
        <div className='CategoryListDiv'>
            <ul className='CategoryListMainUl'>
            {liItems.map(item => (
                    <li key={item.id} className='CategoryListMainLi'>
                        <button
                            id={item.id}
                            onClick={() => handleClick(item.id)}
                            className={`CategoryListMainButton ${selectedItem === item.id ? 'selected' : ''}`}
                        >
                            {item.text}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
