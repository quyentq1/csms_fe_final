import React, { useState, useEffect } from 'react';
import { Empty } from 'antd';
import axios from 'axios';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

import Header from '@/components/Header';
import Heading from '@/components/Heading';
import ProductAdmin from '@/components/ProductManagementPage/ProductAdmin';
import Router from 'next/router';

const ProductManagementPage = () => {
  const [listProductVariant, setListProductVariant] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getListProductVariant = async () => {
      try {
        const result = await axios.get('http://103.221.221.195:8080/api/product/admin/list');
        setListProductVariant(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    getListProductVariant();
  }, []);

  const refreshProductVariantTable = async () => {
    const result = await axios.get('http://103.221.221.195:8080/api/product/admin/list');
    setListProductVariant(result.data);
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
    let sortedData = [...listProductVariant];

    if (searchQuery) {
      sortedData = sortedData.filter((item) =>
        item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
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
      <Header title="Quản lý sản phẩm" />
      <div className="wrapper manager-box">
        <div className="to-add-product-page">
          <button onClick={() => Router.push('/product/create')} className="to-add-product-page-btn">
            Thêm sản phẩm
          </button>
        </div>
        <Heading title="Tất cả sản phẩm" />
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="wrapper-product-admin table-responsive">
          <table className="table product-admin w-100">
            <thead className="w-100 align-middle text-center">
              <tr className="fs-6 w-100">
                <th
                  title="Tên sản phẩm"
                  className="name col-infor-product"
                  onClick={() => handleSort('product_name')}
                >
                  Sản phẩm
                  {sortColumn === 'product_name' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th
                  title="Giá sản phẩm"
                  className="col-price"
                  onClick={() => handleSort('price')}
                >
                  Giá
                  {sortColumn === 'price' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th
                  title="Tồn kho"
                  className="col-quantity"
                  onClick={() => handleSort('quantity')}
                >
                  Tồn kho
                  {sortColumn === 'quantity' && (
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
                  onClick={() => handleSort('state')}
                >
                  Trạng thái
                  {sortColumn === 'state' && (
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
                <ProductAdmin
                  key={index}
                  product_id={productVariant.product_id}
                  product_variant_id={productVariant.product_variant_id}
                  product_name={productVariant.product_name}
                  product_image={productVariant.product_image}
                  colour_name={productVariant.colour_name}
                  size_name={productVariant.size_name}
                  price={productVariant.price}
                  quantity={productVariant.quantity}
                  state={productVariant.state}
                  created_at={productVariant.created_at}
                  refreshProductVariantTable={refreshProductVariantTable}
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

export default ProductManagementPage;