import React, { useState, useEffect } from 'react';
import { Empty } from 'antd'
import { Pie, Line } from '@ant-design/plots';
import axios from 'axios'

import Header from '@/components/Header'
import Heading from '@/components/Heading'
// import ProductAdmin from '@/components/ProductManagementPage/ProductAdmin'
import Router from 'next/router'


const StatisticalManagementPage = () => {
    let [listTotalProduct, settotalProduct] = useState([]);
    let [listTotalUser, settotalUser] = useState([]);
    let [listTotalOrderPerDay, settotalOrderPerDay] = useState([]);
    let [listTotalRevenuePerDay, settotalRevenuePerDay] = useState([]);

    useEffect(() => {
        const refreshTotalProduct = async () => {
            const result = await axios.get('http://localhost:8080/api/product/totalProduct')
            settotalProduct(result.data.totalProducts)
        }
        refreshTotalProduct();

        const refreshTotalUser = async () => {
            const result = await axios.get('http://localhost:8080/api/customer/totalUser')
            settotalUser(result.data.totalUser)
        }
        refreshTotalUser();

        const refreshTotalOrderPerDay = async () => {
            const result = await axios.get('http://localhost:8080/api/order/totalOrderPerDay')
            settotalOrderPerDay(result.data.totalOrdersPerDay)
        }
        refreshTotalOrderPerDay();
        const refreshTotalRevenuePerDay = async () => {
            const result = await axios.get('http://localhost:8080/api/order/totalRevenuePerDay')
            settotalRevenuePerDay(result.data.totalRevenuePerDay)
        }
        refreshTotalRevenuePerDay();
    }, []);
      
    const chartTotalProduct = () => {
        const config = {
            data: [
              { type: 'Sản phẩm', value: listTotalProduct },
            ],
            angleField: 'value',
            colorField: '#4699CD',
            innerRadius: 0.6,
            annotations: [
              {
                type: 'text',
                style: {
                  text: 'Tât cả sản phẩm',
                  x: '50%',
                  y: '50%',
                  textAlign: 'center',
                  fontSize: 15,
                  fontStyle: 'bold',
                },
              },
            ],
        };
        return config;
    }
    const chartTotalUser = () => {
        const config = {
            data: [
              { type: 'Khách hàng', value: listTotalUser },
            ],
            angleField: 'value',
            colorField: '#B12A0C',
            innerRadius: 0.6,
            annotations: [
              {
                type: 'text',
                style: {
                  text: 'Tât cả khách hàng',
                  x: '50%',
                  y: '50%',
                  textAlign: 'center',
                  fontSize: 15,
                  fontStyle: 'bold',
                },
              },
            ],
        };
        return config;
    }
    const chartTotalPrice = () => {
        const data = Object.keys(listTotalOrderPerDay).map(date => ({
            date,
            value: listTotalOrderPerDay[date]
        }));
        const config = {
            data,
            xField: 'date',
            yField: 'value', 
            point: {
                shapeField: 'square',
                sizeField: 4,
              },
              interaction: {
                tooltip: {
                  marker: false,
                },
              },
              style: {
                lineWidth: 2,
              },
        };
        return config;
    }
    const chartTotalRevenuePerDay = () => {
        const data = Object.keys(listTotalRevenuePerDay).map(date => ({
            date,
            value: listTotalRevenuePerDay[date]
        }));
        const config = {
            data,
            xField: 'date',
            yField: 'value', 
            point: {
                shapeField: 'square',
                sizeField: 4,
              },
              interaction: {
                tooltip: {
                  marker: false,
                },
              },
              style: {
                lineWidth: 2,
              },
        };
        return config;
    }
   

    return (
        <div className="product-manager">
            <Header title="Thống Kê" />
            <div className="wrapper manager-box">
                <div className="row">
                    <div className="col-6" style={{ height: '200px' }}>
                        <Heading title="Tổng sản phẩm" />
                        <Pie {...chartTotalProduct()} />
                    </div>
                    <div className="col-6" style={{ height: '200px' }}>
                        <Heading title="Tổng Khách hàng" />
                        <Pie {...chartTotalUser()} />
                    </div>
                    <div className="col-6 pt-5"  style={{ height: '300px' }}>
                        <Heading title="Đơn Hàng  theo ngày" />
                        <Line {...chartTotalPrice()} />
                    </div>
                    <div className="col-6 pt-5"  style={{ height: '300px' }}>
                        <Heading title="Tổng tiền theo ngày" />
                        <Line {...chartTotalRevenuePerDay()} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatisticalManagementPage