import React, { useState } from 'react';
import { Button, Dropdown, Menu } from 'antd';

const SortBar = ({ onSort }) => {
    const [selected, setSelected] = useState("Mới Nhất");

    const handleSortSelect = (value) => {
        setSelected(value);
        onSort(value); // Gọi hàm onSort khi chọn loại sắp xếp
    };

    const menu = (
        <Menu onClick={(e) => handleSortSelect(e.key)}>
            <Menu.Item key="Liên Quan">Liên Quan</Menu.Item>
            <Menu.Item key="Mới Nhất">Mới Nhất</Menu.Item>
            <Menu.Item key="Bán Chạy">Bán Chạy</Menu.Item>
            <Menu.Item key="Giá Tăng Dần">Giá Tăng Dần</Menu.Item>
            <Menu.Item key="Giá Giảm Dần">Giá Giảm Dần</Menu.Item>
        </Menu>
    );

    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <span>Sắp xếp theo:</span>
            <Dropdown overlay={menu}>
                <Button>
                    {selected} <span style={{ marginLeft: 4 }}>&#9662;</span>
                </Button>
            </Dropdown>
        </div>
    );
};

export default SortBar;
