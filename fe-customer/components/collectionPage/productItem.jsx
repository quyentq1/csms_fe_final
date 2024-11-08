import { StarFilled, HeartOutlined, HeartFilled, ShareAltOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useState, useEffect } from 'react';
import { Modal, Button, message } from 'antd';
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon
} from 'react-share';

import { formatRate } from '@/helpers/format';
import Cookies from 'js-cookie';

const styles = {
    productItem: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    productThumbnails: {
        position: 'relative',
        width: '70%', // Thay đổi từ 100% sang 70%
        paddingTop: '70%', // Giữ tỷ lệ khung hình vuông
        overflow: 'hidden',
        margin: '0 auto', // Căn giữa thumbnail
    },
    thumbnailContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '15px', // Thêm padding phía trên
    },
    image: {
        objectFit: 'cover',
    },
    inforProduct: {
        padding: '15px 0',
        textAlign: 'center',
    },
    productName: {
        fontSize: '16px',
        fontWeight: '500',
        marginBottom: '8px',
        color: '#333',
        textDecoration: 'none',
        display: 'block',
    },
    price: {
        fontSize: '18px',
        color: '#ff4d4f',
        fontWeight: 'bold',
        margin: '0',
    },
    rateBox: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        right: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1,
    },
    sizeBox: {
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        right: '10px',
        display: 'flex',
        gap: '5px',
    },
    sizeItem: {
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
    }
};

const ProductItem = (props) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
    const { updateWishlist } = props;

    useEffect(() => {
        const wishlist = Cookies.get('wishlist') ? JSON.parse(Cookies.get('wishlist')) : [];
        const productInWishlist = wishlist.some(product => product.id === props.product_id);
        setIsInWishlist(productInWishlist);
    }, [props.product_id]);

    const handleWishlistClick = (event) => {
        event.preventDefault();
        let wishlist = Cookies.get('wishlist') ? JSON.parse(Cookies.get('wishlist')) : [];
        const index = wishlist.findIndex(product => product.id === props.product_id);
        if (index > -1) {
            wishlist.splice(index, 1);
            setIsInWishlist(false);
        } else {
            wishlist.push({ id: props.product_id, ...props });
            setIsInWishlist(true);
        }
        Cookies.set('wishlist', JSON.stringify(wishlist), { expires: 7 });
        updateWishlist(props);
    };

    const handleShareClick = (event) => {
        event.preventDefault();
        setIsShareModalVisible(true);
    };

    const handleModalClose = () => {
        setIsShareModalVisible(false);
    };

    const handleCopyLink = () => {
        const link = `${window.location.origin}/product/${props.product_id}?colour=${props.colour_id}`;
        navigator.clipboard.writeText(link);
        message.success('Link copied to clipboard!');
    };

    const shareIconStyle = {
        cursor: 'pointer',
        fontSize: '20px',
        marginLeft: '10px',
        color: '#fff',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '5px',
        borderRadius: '50%',
    };

    const modalStyle = {
        borderRadius: '8px',
        overflow: 'hidden',
    };

    const shareButtonsStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '25px',
        marginBottom: '20px',
    };

    const copyLinkStyle = {
        display: 'flex',
        gap: '10px',
    };

    const linkInputStyle = {
        flexGrow: 1,
        border: '1px solid #d9d9d9',
        borderRadius: '4px 0 0 4px',
        padding: '8px 12px',
    };

    const copyButtonStyle = {
        borderRadius: '0 4px 4px 0',
    };

    return (
        <div style={styles.productItem}>
            <Link
                href={{
                    pathname: `/product/${props.product_id}`,
                    query: { colour: props.colour_id }
                }}
            >
                <div style={styles.thumbnailContainer}>
                <div style={styles.productThumbnails}>
                    <Image
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                        src={props.img}
                        fill
                        alt={props.name}
                        priority
                    />
                    <div style={styles.rateBox}>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.8)', padding: '4px 8px', borderRadius: '4px' }}>
                            <span>{formatRate(props.rating)}</span>
                            <StarFilled style={{ color: '#fadb14', marginLeft: '4px' }} />
                            <span style={{ marginLeft: '4px', color: '#666' }}>
                                ({props.feedback_quantity})
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {isInWishlist ? (
                                <HeartFilled
                                    onClick={(event) => handleWishlistClick(event)}
                                    style={{ ...shareIconStyle, color: '#ff4d4f' }}
                                />
                            ) : (
                                <HeartOutlined
                                    onClick={(event) => handleWishlistClick(event)}
                                    style={shareIconStyle}
                                />
                            )}
                            <ShareAltOutlined
                                onClick={handleShareClick}
                                style={shareIconStyle}
                            />
                        </div>
                    </div>
                    <div style={styles.sizeBox}>
                        {props.sizes.map((item, index) => (
                            <span style={styles.sizeItem} key={index}>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
                </div>
            </Link>
            <div style={styles.inforProduct}>
                <Link
                    href={{
                        pathname: `/product/${props.product_id}`,
                        query: { colour: props.colour_id }
                    }}
                >
                    <h6 style={styles.productName}>{props.name}</h6>
                </Link>
                <p style={styles.price}>{props.price}đ</p>
            </div>

            <Modal
                title="Share this product"
                open={isShareModalVisible}
                onCancel={handleModalClose}
                footer={null}
                style={modalStyle}
            >
                <div style={shareButtonsStyle}>
                    <FacebookShareButton url={`${window.location.origin}/product/${props.product_id}?colour=${props.colour_id}`}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={`${window.location.origin}/product/${props.product_id}?colour=${props.colour_id}`}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <LinkedinShareButton url={`${window.location.origin}/product/${props.product_id}?colour=${props.colour_id}`}>
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                </div>
                <div style={copyLinkStyle}>
                    <input
                        style={linkInputStyle}
                        type="text"
                        value={`${window.location.origin}/product/${props.product_id}?colour=${props.colour_id}`}
                        readOnly
                    />
                    <Button
                        style={copyButtonStyle}
                        type="primary"
                        onClick={handleCopyLink}
                    >
                        Copy Link
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default memo(ProductItem);