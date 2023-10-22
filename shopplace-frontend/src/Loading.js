import React from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export default function Loading() {
    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: "20rem",
                color: "rgb(134, 156, 175)"
            }}
            spin
        />
    );
    return (
        <div style={{ zIndex: 999, fontSize: "20rem", position: "absolute", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh", backgroundColor: "rgba(247, 247, 247, 0.158)" }}>
            <Spin indicator={antIcon} />
        </div>
    )

}
