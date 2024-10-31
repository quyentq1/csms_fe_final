import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, InputNumber, Empty } from 'antd'

import Header from '@/components/Header';

import Loading from '@/components/Loading';
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config'

const CreateCouponPage = () => {
    const [code, setCode] = useState('');
    const [money, setMoney] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const createCopon = async () => {
        if (Validate()) {
            try {
                setIsLoading(true)
                let newProduct = {
                    code: code,
                    money: money,
                    status: 0                }
                let result = await axios.post(`${homeAPI}/coupon/create`, newProduct);
                console.log(result.data);
                setIsLoading(false)
                swtoast.success({ text: 'Thêm mã giảm giá thành công!' })
                clearPage()
            } catch (err) {
                console.log(err);
            }
        }
    }

    const Validate = () => {
        if (!code) {
            swtoast.error({ text: 'Mã giảm giá không được bỏ trống' })
            return false
        }
        if (!money) {
            swtoast.error({ text: 'Tiền không được bỏ trống' })
            return false
        }
        return true
    }

    const clearPage = () => {
        setCode('')
        setMoney(0)
        setStatus('')
        setPrice(0)
    }

    return (
        <div className='create-product-page'>
            <Header title="Thêm mã giảm giá" />
            <div className="create-product-form">
                {/* // Input Ten san pham */}
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-code' className="fw-bold">Tên mã giảm giá:</label>
                        <Input
                            id='product-code' placeholder='Nhập tên mã giảm giá'
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-money' className="fw-bold">Giá mã giảm giá:</label>
                        <br />
                        <InputNumber
                            id='product-money' placeholder='Nhập giá mã giảm giá'
                            value={money === 0 ? null : money}
                            style={{ width: '100%' }}
                            onChange={setMoney}
                        />
                    </div>
                </div>
                <div className="btn-box text-left">
                    <button className='text-light bg-dark' onClick={createCopon}>
                        Thêm mã giảm giá
                    </button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div >
    )
}

export default CreateCouponPage