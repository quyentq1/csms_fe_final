import React, { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { swalert, swtoast } from "@/mixins/swal.mixin";
import { FaTrash, FaPencilAlt } from "react-icons/fa"
import { Switch } from 'antd';
import Swal from "sweetalert2";

const CouponAdmin = (props) => {

    const addPointToPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    const convertTime = (created_at) => {
        const date = new Date(created_at);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // tháng (giá trị từ 0 đến 11, nên cộng thêm 1)
        const day = date.getDate(); // ngày trong tháng
        const hours = date.getHours(); // giờ
        const minutes = date.getMinutes(); // phút
        const seconds = date.getSeconds(); // giây
        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;
        return (
            <>
                {formattedDate} <br /> {formattedTime}
            </>
        )
    }

    const [disabledInputState, setDisabledInputState] = useState(false);

    const handleUpdateState = async (state) => {
        if (state) {
            try {
                setDisabledInputState(true)
                await axios.put('https://www.backend.csms.io.vn/api/coupon/on',
                    { id: [props.id] })
                setDisabledInputState(false)
                props.refreshCouponTable()
            } catch (e) {
                console.log(e)
                props.refreshCouponTable()
                setDisabledInputState(false)
                swtoast.error({ text: 'Xảy ra lỗi khi mở bán vui lòng thử lại!' })
            }
        } else {
            try {
                setDisabledInputState(true)
                await axios.put('https://www.backend.csms.io.vn/api/coupon/off',
                    { id: [props.id] })
                setDisabledInputState(false)
                props.refreshCouponTable()
            } catch (e) {
                console.log(e)
                props.refreshCouponTable()
                setDisabledInputState(false)
                swtoast.error({ text: 'Xảy ra lỗi khi tắt sản phẩm vui lòng thử lại!' })
            }
        }
    };

    const handleDelete = async () => {
        swalert
            .fire({
                title: "Xóa Coupon",
                icon: "warning",
                text: "Bạn muốn xóa Coupon này?",
                showCloseButton: true,
                showCancelButton: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete('https://www.backend.csms.io.vn/api/coupon/delete',
                            { data: { id: [props.id] } })
                        props.refreshCouponTable()
                        swtoast.success({
                            text: 'Xóa Coupon thành công!'
                        })
                    } catch (err) {
                        console.log(err)
                        swtoast.error({
                            text: 'Xảy ra lỗi khi xóa Coupon vui lòng thử lại!'
                        })
                    }
                }
            })
    }

    return (
        <div className="table-responsive">
            <table className="table align-middle product-admin w-100">
                <tbody className='w-100 text-center'>
                    <tr className="w-100">
                        <td className='col-infor-product'>
                            <p className="name">
                                {props.code}
                            </p>
                        </td>
                        <td className="text-danger fw-bold col-price">
                            <p className='d-flex align-items-center justify-content-center'>
                                {addPointToPrice(props.money)}
                            </p>
                        </td>
                        <td className="col-createAt">
                            <p>{convertTime(props.created_at)}</p>
                        </td>
                        <td className="text-danger fw-bold col-state">
                            <Switch checked={props.status} onChange={handleUpdateState} disabled={disabledInputState} />
                        </td>
                        <td className="col-action manipulation">
                            <Link href={`/coupon/update/${props.id}`}>
                                Chỉnh sửa
                            </Link>
                            <br />
                            <FaTrash style={{ cursor: "pointer" }} title='Xóa' className="text-danger" onClick={() => handleDelete()} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default CouponAdmin