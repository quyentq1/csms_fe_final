import InputField from '@/components/inputField';
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from 'antd';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

const CustomerInforForm = ({ email = '', customerName = '', phoneNumber = '', address = '', point='', handleUpdateCustomerInfor }) => {
    const schema = object({
        customerName: string()
            .trim()
            .required('Vui lòng nhập Họ và tên của bạn')
            .max(255, 'Họ và tên không được vượt quá 255 ký tự'),
        phoneNumber: string()
            .trim()
            .required('Vui lòng nhập Số điện thoại của bạn')
            .matches(/^\d{10}$/, 'Số điện thoại không hợp lệ'),
        address: string()
            .trim()
            .required('Vui lòng nhập Địa chỉ của bạn')
            .max(255, 'Địa chỉ không được vượt quá 255 ký tự'),
    });
    const { control, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: {
            email,
            customerName,
            phoneNumber,
            address,
            point
        },
        resolver: yupResolver(schema),
    });

    return (
        <form className="infor-tab" onSubmit={handleSubmit(handleUpdateCustomerInfor)}>
            <div className="title">Account information</div>
            <div className="infor-tab-item col-12 row d-flex align-items-center">
                <div className="col-3">FullName</div>
                <div className="col-7">
                    <div className="mb-3"><InputField name='customerName' control={control} placeholder={'your fullname'} /></div>
                </div>
            </div>
            <div className="infor-tab-item col-12 row d-flex align-items-center">
                <div className="col-3">Email</div>
                <div className="col-7">
                    <div className="mb-3"><InputField name='email' control={control} disabled placeholder={'email'} /></div>
                </div>
            </div>
            <div className="infor-tab-item col-12 row d-flex align-items-center">
                <div className="col-3">Phone Number</div>
                <div className="col-7">
                    <div className="mb-3"><InputField name='phoneNumber' control={control} placeholder={'your phone'} /></div>
                </div>
            </div>
            <div className="infor-tab-item col-12 row d-flex align-items-center">
                <div className="col-3">Address</div>
                <div className="col-7">
                    <div className="mb-3"><InputField name='address' control={control} placeholder={'Address (Example: 112/12 3/2 Hoa Quy, Da Nang City)'} /></div>
                </div>
            </div>
            <div className="infor-tab-item col-12 row d-flex align-items-center">
                <div className="col-3">Loyalty Points</div>
                <div className="col-7">
                    <div className="mb-3"><InputField name='point' disabled control={control} /></div>
                </div>
            </div>
            <div className="infor-tab-item col-12 row d-flex align-items-center">
                <div className="col-3">
                    <div className={'btn-container' + (isSubmitting ? ' btn-loading' : '')}>
                        <Button htmlType='submit' loading={isSubmitting}>
                            {!isSubmitting && 'Update account'}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default memo(CustomerInforForm);
