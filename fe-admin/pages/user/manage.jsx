import React, { useState, useEffect } from 'react';
import { Empty } from 'antd';
import axios from 'axios';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

import Header from '@/components/Header';
import Heading from '@/components/Heading';
import UserAdmin from '@/components/UserManagementPage/UserAdmin';
import Router from 'next/router';

const UserManagementPage = () => {
  const [listUser, setlistUser] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getlistUser = async () => {
      try {
        const result = await axios.get('http://localhost:8080/api/user/admin/list');
        setlistUser(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    getlistUser();
  }, []);

  const refreshUserTable = async () => {
    const result = await axios.get('http://localhost:8080/api/user/admin/list');
    setlistUser(result.data);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortAndFilterData = () => {
    let sortedData = [...listUser];

    if (searchQuery) {
      sortedData = sortedData.filter((item) =>
        item.customer_info_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortColumn) {
      sortedData.sort((a, b) => {
        if (sortColumn === 'created_at') {
          return sortDirection === 'asc'
            ? new Date(a[sortColumn]) - new Date(b[sortColumn])
            : new Date(b[sortColumn]) - new Date(a[sortColumn]);
        } else if (typeof a[sortColumn] === 'string') {
          return sortDirection === 'asc'
            ? a[sortColumn].localeCompare(b[sortColumn])
            : b[sortColumn].localeCompare(a[sortColumn]);
        } else {
          if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
          if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        }
      });
    }

    return sortedData;
  };

  return (
    <div className="product-manager">
      <Header title="Quản lý khách hàng" />
      <div className="wrapper manager-box">
        <Heading title="Tất cả khách hàng" />
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="wrapper-product-admin table-responsive">
          <table className="table product-admin w-100">
            <thead className="w-100 align-middle text-center">
              <tr className="fs-6 w-100">
                <th
                  title="Tên khách hàng"
                  className="name col-infor-product"
                  onClick={() => handleSort('customer_name')}
                >
                  Tên khách hàng
                  {sortColumn === 'customer_name' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th
                  title="Tiền"
                  className="col-money"
                  onClick={() => handleSort('phone_number')}
                >
                  Số điện thoại
                  {sortColumn === 'phone_number' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th
                  title="Địa chỉ"
                  className="col-address"
                  onClick={() => handleSort('address')}
                >
                  Địa chỉ
                  {sortColumn === 'address' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th
                  title="Điểm"
                  onClick={() => handleSort('point')}
                >
                  Điểm
                  {sortColumn === 'point' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th title="Thao tác" className="col-action manipulation">
                  Thao tác
                </th>
              </tr>
            </thead>
          </table>
          {sortAndFilterData().length ? (
            sortAndFilterData().map((item, index) => {
              return (
                <UserAdmin
                  key={index}
                  customer_info_id={item.customer_info_id}
                  customer_name={item.customer_name}
                  phone_number={item.phone_number}
                  address={item.address}
                  point={item.point}
                  refreshUserTable={refreshUserTable}
                />
              );
            })
          ) : (
            <table
              className="table w-100 table-hover align-middle table-bordered"
              style={{ height: '400px' }}
            >
              <tbody>
                <tr>
                  <td colSpan={6}>
                    <Empty />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;