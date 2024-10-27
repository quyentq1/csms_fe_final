import { useQuery } from '@tanstack/react-query';
import { Empty } from 'antd';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

import ProductItem from '@/components/collectionPage/productItem';

const WishlistPage = () => {
    const router = useRouter();
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const savedWishlist = Cookies.get('wishlist') ? JSON.parse(Cookies.get('wishlist')) : [];
        setWishlist(savedWishlist);
    }, []);

    const updateWishlist = (product) => {
        let updatedWishlist = [...wishlist];
        const index = updatedWishlist.findIndex(item => item.id === product.product_id);
        if (index > -1) {
            updatedWishlist.splice(index, 1);
        } else {
            updatedWishlist.push({ id: product.product_id, ...product });
        }
        Cookies.set('wishlist', JSON.stringify(updatedWishlist), { expires: 7 });
        setWishlist(updatedWishlist);
    };

    return (
        <div className="product-page container pt-4">
            <div className="product-list row">
            {wishlist.length > 0 ? (
                    wishlist.map((product, index) => {
                        return (
                            <ProductItem
                                key={product.product_id}
                                product_id={product.product_id}
                                name={product.name}
                                img={product.img}
                                price={product.price}
                                colour_id={product.colour_id}
                                sizes={product.sizes}
                                rating={product.rating}
                                feedback_quantity={product.feedback_quantity}
                                isInWishlist={true}
                                updateWishlist={updateWishlist}
                            />
                        );
                    })
                ) : (
                    <div className="d-flex" style={{ width: '100%', height: '400px' }}>
                        <Empty style={{ margin: 'auto' }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
