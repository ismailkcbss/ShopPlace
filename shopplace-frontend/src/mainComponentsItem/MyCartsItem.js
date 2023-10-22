import React, { useEffect, useState } from 'react'
import { DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';


export default function MyCartsItem(props) {
    const [productCartPiece, setProductCartPiece] = useState(1);

    const { item } = props;

    const dispatch = useDispatch();

    const handleDeleteClick = (id) => {
        //dispatch(productActions.remove({ id }))
    }

    const handleAdetSayacClick = (count) => {
        if (count.id === 'plus' && productCartPiece > 0 && productCartPiece < item.productPiece) {
            setProductCartPiece(productCartPiece + 1)
        }
        else if (count.id === 'minus' && productCartPiece > 1) {
            setProductCartPiece(productCartPiece - 1)
        }
    }




    return (
        <div className='MyCartCard'>
            <div className='MyCartCardImage'>
                <img src={item.productImage[0]} alt='MyCartImage' />
            </div>
            <div className='MyCartCardInfo'>
                <div className='MyCartCardInfoData'>
                    <p>
                        <span>Ürün Adı:</span> {item.productName}
                    </p>
                    <p>
                        <span> Maximum Alınabilecek Adet:</span> {item.productPiece}
                    </p>
                    <p>
                        <span> Ürün Toplam Fiyat:</span> {item.productPrice * productCartPiece}
                    </p>
                </div>
                <div className='MyCartCardButton'>
                    <div>
                        <button
                            onClick={() => handleDeleteClick(item._id)}
                            className='MyCartCardButtonDeleteIcon'
                        >
                            <DeleteOutlined />
                        </button>
                        <p>Ürünü sil</p>
                        <div>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <button
                            id='plus'
                            name={item._id}
                            className='MyCartCardButtonPlusMinIcon'
                            onClick={() => handleAdetSayacClick(document.getElementById('plus'))}
                        ><PlusCircleOutlined /></button>
                        <span style={{ fontSize: "1.2rem", color: "rgba(82, 82, 82, 0.664)" }}>{productCartPiece}</span>
                        <button
                            id='minus'
                            name={item._id}
                            className='MyCartCardButtonPlusMinIcon'
                            onClick={() => handleAdetSayacClick(document.getElementById('minus'))}
                        ><MinusCircleOutlined /></button>
                    </div>
                </div>
            </div>
        </div >
    )
}
