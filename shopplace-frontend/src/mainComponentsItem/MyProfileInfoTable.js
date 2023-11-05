import React from 'react'

export default function MyProfileInfoTable(props) {

    const { userData } = props;
    
    return (
        <div>
            <table className='MyProfileInfoTable'>
                <thead>
                    <tr>
                        <th>Name:</th>
                        <th>Email:</th>
                        <th>Phone:</th>
                        <th>Type of Register:</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        <tr>
                            <td>{userData.user.username}</td>
                            <td>{userData.user.email}</td>
                            <td>{userData.user.phone}</td>
                            <td>{userData.user.seller ? 'Seller' : 'Customer'}</td>
                        </tr>
                    }
                </tbody>
            </table>

        </div>
    )
}
