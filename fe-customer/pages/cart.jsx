import { swtoast } from '@/mixins/swal.mixin';
import queries from '@/queries';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { Button, Radio } from 'antd';
import CartItem from '@/components/cartPage/cartItem';
import CustomerInforForm from '@/components/cartPage/customerInforForm';
import { formatPrice } from '@/helpers/format';
import orderService from '@/services/orderService';
import useCartStore from '@/store/cartStore';
import { useRouter } from 'next/router';
import InputField from '@/components/inputField';
import { useForm } from 'react-hook-form';

const CartPage = () => {
    const router = useRouter();
    const productList = useCartStore((state) => state.productList);
    const productQuantity = productList.length;
    const clearCart = useCartStore((state) => state.clearCart);

    const { isError, error, data } = useQuery({
        ...queries.customer.infor(),
        staleTime: 5 * 60 * 1000
    });
    if (isError) {
        console.log(error);
        router.push('/404');
    }
    const [shippingcost, setShippingCost] = useState('J&T expreess');

    const handleShippingCostChange = (e) => {
        setShippingCost(e.target.value);
    };

    const customerInfor = data?.data && {
        email: data.data?.email,
        customerName: data.data?.customer_name,
        phoneNumber: data.data?.phone_number,
        address: data.data?.address,
        payment_method: data.data?.payment_method,
        statusPayment: 'Process',
    };

    const [moneydiscount, setMoneyDiscount] = useState(0);

    const totalPrice = useMemo(() => {
        return productList.reduce((accumulator, product) => accumulator + product.totalValue, 0);
    }, [productList]);

    // const deliveryCharges = useMemo(() => {
    //     return totalPrice > 300000 ? 0 : (shippingcost === 'J&T expreess' ? 35000 : 25000);
    // }, [totalPrice, shippingcost]);
    const deliveryCharges = useMemo(() => {
    const shippingFee = shippingcost === 'J&T expreess' ? 35000 : 25000;
    return {
        price: totalPrice > 300000 ? 0 : shippingFee,
        originalPrice: shippingFee,
        isDiscounted: totalPrice > 300000
    };
}, [totalPrice, shippingcost]);
    const finalTotal = totalPrice + deliveryCharges.price - moneydiscount;

    const { control, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        const codediscount = data.codediscount;
        if(codediscount !== undefined){
            try {
                const result = await orderService.checkDiscount(codediscount);
                console.log('dis ', result)
                if(result.data.status === 0){
                    swtoast.error({
                        text: result.data.message
                    });
                }else{
                    setMoneyDiscount(result.data.money)
                    swtoast.success({ text: result.data.message });
                }
            } catch (err) {
                console.log(err);
                swtoast.error({
                    text: 'Có lỗi khi tạo đơn hàng vui lòng thử lại!'
                });
            }
        }else{
            swtoast.error({
                text: 'Vui lòng nhập mã giảm giá!'
            });
        }
    };


    const handlePlaceOrder = useCallback(async (values) => {
        if (productList.length) {
            try {
                const orderItems = productList.map((product) => {
                    return {
                        product_variant_id: product.productVariantId,
                        quantity: product.quantity
                    };
                });
                const order = {
                    customer_name: values.customerName,
                    email: values.email,
                    phone_number: values.phoneNumber,
                    address: values.address,
                    order_items: orderItems,
                    payment_method: values.payment_method,
                    statusPayment: 'Process',
                    shipping: shippingcost,
                    delivery_charges: deliveryCharges.price,
                };
                await orderService.placeOrder(order);
                clearCart();
                swtoast.success({ text: 'Đặt hàng thành công' });
            } catch (err) {
                console.log(err);
                swtoast.error({
                    text: 'Có lỗi khi tạo đơn hàng vui lòng thử lại!'
                });
            }
        } else {
            swtoast.error({
                text: 'Chưa có sản phẩm trong giỏ hàng. Vui lòng thêm sản phẩm vào giỏ hàng.'
            });
        }
    }, [clearCart, productList, shippingcost, deliveryCharges]);

    const handlePlaceOrderPaypal = useCallback(async (values, details, data) => {
        if (productList.length) {
            try {
                const orderItems = productList.map((product) => {
                    return {
                        product_variant_id: product.productVariantId,
                        quantity: product.quantity
                    };
                });
                const order = {
                    customer_name: values.customerName,
                    email: values.email,
                    phone_number: values.phoneNumber,
                    address: values.address,
                    order_items: orderItems,
                    payment_method: values.payment_method,
                    statusPayment: 'Done', // Done đã thanh toán
                    shipping: shippingcost,
                    delivery_charges: deliveryCharges.price,
                };
                await orderService.placeOrder(order);
                clearCart();
                swtoast.success({ text: 'Thanh toán Paypal thành công' });
            } catch (err) {
                console.log(err);
                swtoast.error({
                    text: 'Có lỗi khi tạo đơn hàng vui lòng thử lại!'
                });
            }
        } else {
            swtoast.error({
                text: 'Chưa có sản phẩm trong giỏ hàng. Vui lòng thêm sản phẩm vào giỏ hàng.'
            });
        }
    }, [clearCart, productList, shippingcost, deliveryCharges])
    return (
        <div className="cart-page container pb-4">
            <div className="row">
                <div className="col-7 cart-left-section">
                    {
                        customerInfor &&
                        <CustomerInforForm
                            email={customerInfor.email}
                            customerName={customerInfor.customerName}
                            phoneNumber={customerInfor.phoneNumber}
                            address={customerInfor.address}
                            payment_method={customerInfor.payment_method}
                            handlePlaceOrder={handlePlaceOrder}
                            handlePlaceOrderPaypal={handlePlaceOrderPaypal}
                            amount={finalTotal}
                        />
                    }
                </div>
                <div className="col-5 cart-right-section">
                    <div className="title">Giỏ hàng</div>
                    <div className="cart-section">
                        {productList.length > 0 ? (
                            productList &&
                            productList.map((product, index) => {
                                return (
                                    <CartItem
                                        key={index}
                                        productVariantId={product.productVariantId}
                                        name={product.name}
                                        image={product.image}
                                        colour={product.colour}
                                        size={product.size}
                                        quantity={product.quantity}
                                        totalValue={formatPrice(product.totalValue)}
                                    />
                                );
                            })
                        ) : (
                            <p className="text-center">Chưa có sản phẩm nào trong giỏ hàng</p>
                        )}
                    </div>
                    <div className="shipping">
                        <div className="title">Đơn vị vận chuyển</div>
                        <div>
                            <label
                                htmlFor="cod"
                                className="shipping-item w-100 border-radius d-flex align-items-center justify-content-start"
                            >
                                <div className="shipping-item-radio">
                                    <Radio
                                        name='shipping_cost'
                                        value="J&T expreess"
                                        checked={shippingcost === 'J&T expreess'}
                                        onChange={handleShippingCostChange}
                                    />
                                </div>
                                <div className="shipping-item-name">
                                    <p className="">J&T expreess (Giao hàng nhanh)</p>
                                </div>
                            </label>
                        </div>
                        <div>
                            <label
                                htmlFor="paypal"
                                className="shipping-item w-100 border-radius d-flex align-items-center justify-content-start"
                            >
                                <div className="shipping-item-radio">
                                    <Radio
                                        name='shipping_cost'
                                        value="Viettel"
                                        checked={shippingcost === 'Viettel'}
                                        onChange={handleShippingCostChange}
                                    />
                                </div>
                                <div className="shipping-item-name">
                                    <p className="">Viettel (Giao hàng chậm)</p>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="discount">
                        <div className="title">Mã giảm giá</div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                                <div className="row-12 mb-3">
                                    <InputField name='codediscount' control={control} placeholder={'Mã ưu đãi'} />
                                </div>
                                <div className="row-12 mb-3">
                                    <Button type="submit" htmlType="button" onClick={handleSubmit(onSubmit)}>Áp dụng</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="row pricing-info">
                        <div className="pricing-info-item position-relative d-flex justify-content-between">
                            <p>Tạm tính</p>
                            <p>{formatPrice(totalPrice)}đ</p>
                        </div>
                        <div className="pricing-info-item d-flex justify-content-between">
                            <p>Phí giao hàng</p>
                            {deliveryCharges.isDiscounted ? (
    <div>
        <span style={{ textDecoration: 'line-through', color: '#FF0000' }}>{formatPrice(deliveryCharges.originalPrice)}đ</span>
        <span style={{ color: '#00FF00' }}> → 0đ</span>
    </div>
) : (
    <span>{formatPrice(deliveryCharges.price)}đ</span>
)}
                            {/* <p>{formatPrice(deliveryCharges)}đ</p> */}
                        </div>
                        {moneydiscount > 0 ? (
                            <div className="pricing-info-item d-flex justify-content-between">
                                <p>Mã giảm giá</p>
                                <p>{formatPrice(moneydiscount)}đ</p>
                            </div>
                        ): ('') }
                        <div className="pricing-info-item final-total-box position-relative d-flex justify-content-between">
                            <p className="fw-bold">Tổng</p>
                            <p className="fw-bold" style={{ fontSize: '20px' }}>
                                {formatPrice(finalTotal)}đ
                            </p>
                        </div>
                    </div>                 
                </div>
            </div>
        </div>
    );
};

CartPage.isAuth = true;

export default CartPage;
