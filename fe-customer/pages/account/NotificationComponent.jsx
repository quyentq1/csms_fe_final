import { BellFilled } from '@ant-design/icons';
import { Dropdown, Badge, List, Avatar } from 'antd';
import { useEffect, useState } from 'react';
import { formatTime } from '@/helpers/format';
import Link from 'next/link';
import useCustomerStore from '@/store/customerStore';
import orderService from '@/services/orderService';

const NotificationComponent = () => {
    const customerId = useCustomerStore((state) => state.customerInfor?.customerId);
    const [notificationList, setNotificationList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const getNotificationList = async () => {
            try {
                setLoading(true);
                const result = await orderService.getNotification();
                setNotificationList(result.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        getNotificationList();
    }, [customerId]);

    const handleDropdownClick = (open) => {
        setIsDropdownOpen(open);
    };

    const NotificationListContent = () => (
        <List
            loading={loading}
            style={{ 
                width: 400, // Tăng từ 300px lên 400px
                maxHeight: 500, // Tăng từ 400px lên 500px để hiển thị nhiều nội dung hơn
                overflow: 'auto',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                borderRadius: '4px',
                zIndex: 1000,
                padding: '10px' // Thêm padding để nội dung không sát viền
            }}
            itemLayout="horizontal"
            dataSource={notificationList}
            locale={{ emptyText: 'Không có thông báo' }}
            footer={
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <Link href="/account/notification">Xem tất cả thông báo</Link>
                </div>
            }
            renderItem={(item) => (
                <List.Item style={{ padding: '12px 8px' }}> {/* Thêm padding cho mỗi item */}
                    <List.Item.Meta
                        avatar={<Avatar icon={<BellFilled />} size="large" />} // Tăng kích thước avatar
                        title={
                            <span style={{ 
                                color: '#1890ff',
                                fontSize: '14px', // Tăng kích thước chữ
                                fontWeight: '500' 
                            }}>
                                {item.content}
                            </span>
                        }
                        description={
                            <div>
                                <small style={{ 
                                    color: '#999',
                                    fontSize: '12px' 
                                }}>
                                    {formatTime(item.created_at)}
                                </small>
                            </div>
                        }
                    />
                </List.Item>
            )}
        />
    );

    return (
        <li style={{marginLeft:'-15px'}} className="cart inner-item menu-item fw-bold text-uppercase">
            <Dropdown 
                overlay={<NotificationListContent />}
                placement="bottomRight"
                trigger={['click']}
                arrow
                open={isDropdownOpen}
                onOpenChange={handleDropdownClick}
                overlayStyle={{ zIndex: 1000 }}
            >
                <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    height: '100%',
                    padding: '0 8px'
                }}>
                    <Badge 
                        count={notificationList.length}
                        style={{ 
                            marginRight: '-5px',
                        }}
                        size="small"
                    >
                        <BellFilled style={{ 
                            fontSize: '16px',
                            color: 'inherit'
                        }} />
                    </Badge>
                </span>
            </Dropdown>
        </li>
    );
};

export default NotificationComponent;