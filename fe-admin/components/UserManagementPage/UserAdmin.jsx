import React, { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { swalert, swtoast } from "@/mixins/swal.mixin";
import { FaTrash } from "react-icons/fa"

const UserAdmin = (props) => {
    const addPointToPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const handleDelete = async () => {
        swalert
            .fire({
                title: "Xóa User",
                icon: "warning",
                text: "Bạn muốn xóa User này?",
                showCloseButton: true,
                showCancelButton: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete('https://www.backend.csms.io.vn/api/user/delete',
                            { data: { customer_info_id: [props.customer_info_id] } })
                        props.refreshUserTable()
                        swtoast.success({
                            text: 'Xóa User thành công!'
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
        <tr className="text-center">
            <td className='col-infor-product'>
                <p className="name" title={props.customer_name}>
                    {props.customer_name}
                </p>
            </td>
            <td className="col-phone">
                <p>{props.phone_number}</p>
            </td>
            <td className="col-address">
                <p>{props.address}</p>
            </td>
            <td className="text-danger fw-bold col-point">
                <p className='d-flex align-items-center justify-content-center'>
                    {addPointToPrice(props.point)}
                </p>
            </td>
            <td className="col-action manipulation">
                <Link href={`/user/update/${props.customer_info_id}`}>
                    Chỉnh sửa
                </Link>
                <br />
                <FaTrash 
                    style={{ cursor: "pointer" }} 
                    title='Xóa' 
                    className="text-danger" 
                    onClick={() => handleDelete()} 
                />
            </td>
        </tr>
    )
}

export default UserAdmin