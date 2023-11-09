import React, { useEffect } from 'react'
import { notification } from 'antd';

import 'antd/dist/reset.css';
import { axiosInstance } from '../axios.util';

export default function MyProfileOrdersPlacedTable(props) {

    const { ordersPlaced, setOrdersPlaced } = props;

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


    const handleCancelOrderClick = async (orderId, itemId) => {
        if (itemId) {
            try {
                const { data } = await axiosInstance.delete(`/Main/MyOrder/Delete?order=${orderId}&item=${itemId}`);
                showNotification('success', data.message)
                
                setOrdersPlaced(prevOrders => {
                    const updatedOrders = prevOrders.map(order => {
                        if (order._id === orderId) {
                            return {
                                ...order,
                                orderProducts: order.orderProducts.filter(item => item.product._id !== itemId),
                            };
                        }
                        return order;
                    });
                    return updatedOrders;
                });
            } catch (error) {
                showNotification('error', error.response.data.error)
            } 
        }
    }

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
                        <th>The Cancel Product</th>
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
                                    <td><button onClick={() => handleCancelOrderClick(order._id, item.product._id)} className='CancelOrderButton'>X</button></td>
                                </tr>
                            ))
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
