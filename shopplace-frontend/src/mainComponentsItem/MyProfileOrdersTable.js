import React from 'react'

export default function MyProfileOrdersTable(props) {

    const { ordersReceived } = props;

    const totalAmount = ordersReceived.reduce((total, ordersReceived) => total + ordersReceived.ShippingProducts.sumCartPrice, 0);


    return (
        <div>
            <table className='MyProfileOrdersTable'>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Product Type</th>
                        <th>Product Name</th>
                        <th>Total Piece</th>
                        <th>Shipping Address</th>
                        <th>Product Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        ordersReceived?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.ProductCustomer}</td>
                                <td>{item.ShippingProducts.product.productType}</td>
                                <td>{item.ShippingProducts.product.productName}</td>
                                <td>{item.ShippingProducts.quantity}</td>
                                <td>{item.ShippingAdresscustomer}</td>
                                <td>{item.ShippingProducts.sumCartPrice}</td>
                            </tr>
                        ))
                    }
                    <tr>
                        <td>
                            Total Earning:
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
