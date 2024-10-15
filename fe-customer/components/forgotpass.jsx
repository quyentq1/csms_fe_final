import { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { FaTimes } from 'react-icons/fa'; // Thêm dòng này
import { swtoast } from '@/mixins/swal.mixin';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'; // Giả sử bạn dùng Yup để validate form
import * as yup from 'yup'; // Giả sử bạn dùng Yup để validate
import InputField from '@/components/inputField';
import customerService from '@/services/customerService';

const ForgotPass = (props) => {
    // Schema dùng để validate email
    const schema = yup.object({
        email: yup
            .string()
            .trim()
            .required('Vui lòng nhập Email của bạn')
            .email('Email không hợp lệ')
    });

    // Sử dụng react-hook-form với yupResolver để validate form
    const { control, handleSubmit, getValues, formState: { isSubmitting } } = useForm({
        defaultValues: { email: '' },
        resolver: yupResolver(schema)
    });

    const [isOtpModalVisible, setIsOtpModalVisible] = useState(false); // Quản lý trạng thái modal OTP
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false); // Quản lý modal mật khẩu mới
    const [otp, setOtp] = useState(''); // Quản lý mã OTP
    const [newPassword, setNewPassword] = useState(''); // Quản lý mật khẩu mới
    const [confirmPassword, setConfirmPassword] = useState(''); // Quản lý xác nhận mật khẩu

    // Hàm xử lý khi người dùng submit form "Quên Mật Khẩu"
    const handleForgotPass = async (values) => {
        try {
            const data = { email: values.email };
            const respond = await customerService.ForgotPass(data);
            if (respond.status === 200) {
                swtoast.success({
                    text: 'Vui lòng kiểm tra email của bạn!',
                });
                setIsOtpModalVisible(true); // Hiển thị modal OTP khi thành công
            }
        } catch (error) {
            swtoast.error({
                text: error.response?.data?.message,
            });
        }
    };

    // Hàm xử lý xác thực OTP
    const handleVerifyOtp = async () => {
        const email = getValues('email'); // Lấy giá trị email từ form
        try {
            const data = { otp, email };
            const response = await customerService.verifyOtp(data);
            if (response.status === 200) {
                swtoast.success({
                    text: 'Xác thực OTP thành công!',
                });
                setIsOtpModalVisible(false); // Đóng modal OTP
                setIsPasswordModalVisible(true); // Hiển thị modal nhập mật khẩu
            }
        } catch (error) {
            swtoast.error({
                text: 'Xác thực OTP thất bại!',
            });
        }
    };

    // Hàm xử lý khi người dùng đổi mật khẩu
    const handleChangePassword = async () => {
        const email = getValues('email'); // Lấy giá trị email từ form
        if (newPassword !== confirmPassword) {
            swtoast.error({ text: 'Mật khẩu không khớp!' });
            return;
        }
        try {
            const data = { email, newPassword }; // Gửi yêu cầu đổi mật khẩu
            const response = await customerService.changePassword(data);
            
            console.log('response changePassword: ', response);
            console.log('Response status: ', response.status);
            console.log('Response data: ', response.data);

            if (response.status === 200) {
                console.log(' dmm')
                swtoast.success({ text: 'Đổi mật khẩu thành công!' });
                setIsPasswordModalVisible(false); // Đóng modal sau khi thành công
                props.toClose();
            }
        } catch (error) {
            console.error('Error occurred: ', error);
            swtoast.error({ text: 'Đổi mật khẩu thất bại!' });
        }
    };

    return (
        <div className="user ForgotPass w-100 position-absolute d-flex" onClick={props.toClose}>
            <div className="user-box position-relative register-box border-radius" onClick={(e) => e.stopPropagation()}>
                <div className="header-form position-absolute" onClick={props.toClose}>
                    <FaTimes />
                </div>
                <form onSubmit={handleSubmit(handleForgotPass)} className="form-user form-ForgotPass">
                    <h3 className="heading text-center">Quên Mật Khẩu</h3>
                    <div className="mb-3">
                        <InputField name='email' control={control} placeholder={'Email'} />
                    </div>
                    <div className={'btn-container' + (isSubmitting ? ' btn-loading' : '')}>
                        <Button htmlType='submit' loading={isSubmitting}>
                            {!isSubmitting && 'Quên Mật Khẩu'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Modal nhập mã OTP */}
            <Modal
                title="Nhập mã OTP"
                visible={isOtpModalVisible}
                onCancel={() => setIsOtpModalVisible(false)}
                onOk={handleVerifyOtp}
            >
                <Input
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
            </Modal>

            {/* Modal nhập mật khẩu mới */}
            <Modal
                title="Nhập mật khẩu mới"
                visible={isPasswordModalVisible}
                onCancel={() => setIsPasswordModalVisible(false)}
                onOk={handleChangePassword}
            >
                <Input.Password
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input.Password
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default ForgotPass;
