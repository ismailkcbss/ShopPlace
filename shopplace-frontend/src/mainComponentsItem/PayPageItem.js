import React from 'react'

export default function PayPageItem(props) {

    const { item, totalAmount } = props;


    return (
        <div className='PayPageItemDiv'>
            <table className='PayPageItemTable'>
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Type</th>
                        <th>Product Name</th>
                        <th>Total Piece</th>
                        <th>Product Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        item?.map((product) => (
                            <tr key={product.product._id}>
                                <td><img src={product.product.productImage[0]} alt='productimg' /></td>
                                <td>{product.product.productType}</td>
                                <td>{product.product.productName}</td>
                                <td>{product.quantity}</td>
                                <td>{product.sumCartPrice}</td>
                            </tr>
                        ))
                    }
                    <tr style={{height:"5rem"}}>
                        <td>
                            Total Amount:
                        </td>
                        <td>
                            {totalAmount}
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>
    )
}
