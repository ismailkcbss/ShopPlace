import React from 'react'

export default function MyProfileOrdersPlacedTable(props) {

    const { ordersPlaced } = props;

    console.log(ordersPlaced);
    return (
        <div>
            <table className='MyProfileOrdersPlacedTable'>
                <thead>
                    <tr>
                        <th>Product Type</th>
                        <th>Product Name</th>
                        <th>Total Piece</th>
                        <th>Product Total Amount</th>
                        <th>The given order address</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        ordersPlaced?.map((order) => (
                            order.orderProducts.map((item, productIndex) => (
                                <tr key={`${order._id}-${productIndex}`}>
                                    <td>{item.product.productType}</td>
                                    <td>{item.product.productName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.sumCartPrice}</td>
                                    <td>{order.shippingAdress}</td>
                                </tr>
                            ))
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
