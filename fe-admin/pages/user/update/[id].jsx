import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import { Input, InputNumber, Empty } from 'antd'


import Header from '@/components/Header';
import Loading from '@/components/Loading';
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config'


const UpdateUserPage = () => {
    const { id } = Router.query

    const [customername, setcCustomerName] = useState('');
    const [customerinfoid, setCustomerInfoid] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [point, setPoint] = useState(0);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const getUserDetail = async () => {
            try {
                setIsLoading(true)
                const result = await axios.get(`${homeAPI}/user/admin/detail/${id}`)
                setCustomerInfoid(result.data.customer_info_id)
                setPhone(result.data.phone_number)
                setcCustomerName(result.data.customer_name)
                setAddress(result.data.address)
                setPoint(result.data.point)
                setIsLoading(false)
            } catch (err) {
                console.log(err);
                setIsLoading(false)
                Router.push("/404")
            }
        }
        if (id) getUserDetail()
    }, [id]);



    const refreshPage = async () => {
        if (id) {
            try {
                const result = await axios.get(`${homeAPI}/user/admin/detail/${id}`)
                setPhone(result.data.phone_number)
                setcCustomerName(result.data.customer_name)
                setAddress(result.data.address)
                setPoint(result.data.point)
            } catch (err) {
                console.log(err);
                Router.push("/404")
            }
        }
    }

    const updateCoupon = async () => {
        if (Validate()) {
            try {
                setIsLoading(true)
                let updateCoupon = {
                    customer_info_id: customerinfoid,
                    phone_number: phone,
                    customer_name: customername,
                    address: address,
                    point: point,
                }
                let result = await axios.put(`${homeAPI}/user/update`, updateCoupon);
                console.log(result.data);
                setIsLoading(false)
                swtoast.success({ text: 'Cập nhập sản phẩm thành công!' })
                refreshPage()
            } catch (err) {
                console.log(err);
                setIsLoading(false)
            }
        }
    }

    const Validate = () => {
        if (!customername) {
            swtoast.error({ text: 'Tên khách hàng không được bỏ trống' })
            return false
        }
        return true
    }



    return (
        <div className='update-product-page'>
            <Header title="Cập nhật sản phẩm" />
            <div className="update-product-form">
                {/* // Input Ten san pham */}
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-customername' className="fw-bold">Tên khách hàng:</label>
                        <Input
                            id='product-code' placeholder='Nhập Tên khách hàng'
                            value={customername}
                            onChange={(e) => setcCustomerName(e.target.value)}
                        />
                    </div>
                    <div className="col-6">
                        <label htmlFor='product-money' className="fw-bold">Số điện thoại:</label>
                        <InputNumber
                            id='product-money' placeholder='Nhập Số điện thoại'
                            value={phone === 0 ? null : phone}
                            style={{ width: '100%' }}
                            onChange={setPhone}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-address' className="fw-bold">Địa chỉ:</label>
                        <InputNumber
                            id='product-address' placeholder='Nhập Địa chỉ'
                            value={address === 0 ? null : address}
                            style={{ width: '100%' }}
                            onChange={setAddress}
                        />
                    </div>
                    <div className="col-6">
                        <label htmlFor='product-address' className="fw-bold">Điểm</label>
                        <InputNumber
                            id='product-point' placeholder='Nhập Điểm'
                            value={point === 0 ? null : point}
                            style={{ width: '100%' }}
                            onChange={setPoint}
                        />
                    </div>
                </div>
             
                <div className="btn-box text-left">
                    <button className='text-light bg-dark' onClick={updateCoupon}>
                        Cập nhật
                    </button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>
    )
}

export default UpdateUserPage