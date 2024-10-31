import React, { useState, useEffect } from 'react';
import { Empty } from 'antd';
import axios from 'axios';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

import Header from '@/components/Header';
import Heading from '@/components/Heading';
import CouponAdmin from '@/components/CouponManagementPage/CouponAdmin';
import Router from 'next/router';

const CouponManagementPage = () => {
  const [listCoupon, setlistCoupon] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getlistCoupon = async () => {
      try {
        const result = await axios.get('http://localhost:8080/api/coupon/admin/list');
        setlistCoupon(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    getlistCoupon();
  }, []);

  const refreshCouponTable = async () => {
    const result = await axios.get('http://localhost:8080/api/coupon/admin/list');
    setlistCoupon(result.data);
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
    let sortedData = [...listCoupon];

    if (searchQuery) {
      sortedData = sortedData.filter((item) =>
        item.code.toLowerCase().includes(searchQuery.toLowerCase())
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
      <Header title="Quản lý mã giảm giá" />
      <div className="wrapper manager-box">
        <div className="to-add-product-page">
          <button onClick={() => Router.push('/coupon/create')} className="to-add-product-page-btn">
            Thêm mã giảm giá
          </button>
        </div>
        <Heading title="Tất cả mã giảm giá" />
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm mã giảm giá..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="wrapper-product-admin table-responsive">
          <table className="table product-admin w-100">
            <thead className="w-100 align-middle text-center">
              <tr className="fs-6 w-100">
                <th
                  title="Tên mã giảm giá"
                  className="name col-infor-product"
                  onClick={() => handleSort('code')}
                >
                  mã giảm giá
                  {sortColumn === 'code' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th
                  title="Tiền"
                  className="col-money"
                  onClick={() => handleSort('money')}
                >
                  Giá
                  {sortColumn === 'money' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th
                  title="Thời gian tạo"
                  className="col-createAt"
                  onClick={() => handleSort('created_at')}
                >
                  Ngày tạo
                  {sortColumn === 'created_at' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th
                  title="Trạng thái"
                  onClick={() => handleSort('status')}
                >
                  Trạng thái
                  {sortColumn === 'status' && (
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
            sortAndFilterData().map((productVariant, index) => {
              return (
                <CouponAdmin
                  key={index}
                  id={productVariant.id}
                  code={productVariant.code}
                  money={productVariant.money}
                  status={productVariant.status}
                  created_at={productVariant.created_at}
                  refreshCouponTable={refreshCouponTable}
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

export default CouponManagementPage;