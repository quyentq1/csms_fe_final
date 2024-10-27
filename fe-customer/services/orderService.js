import axiosClient from './axiosClient';
import axiosJWT from './axiosJWT';

const orderService = {

    getOrderHistory: async () => {
        return await axiosJWT.get('/order/customer/list');
    },

    getNotification: async () => {
        return await axiosJWT.get('/order/customer/notification');
    },

    getDetail: async (orderId) => {
        return await axiosJWT.get(`/order/detail/${orderId}`);
    },

    placeOrder: async (data) => {
        return await axiosJWT.post('/order/create', data);
    },

    cancelOrder: async (orderId) => {
        return await axiosClient.put(`/order/change-status/${orderId}/5`);
    },

    checkDiscount: async (data) => {
        return await axiosJWT.get(`/order/checkdiscount/${data}`);
    },

};

export default orderService;
