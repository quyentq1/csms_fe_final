import Footer from './footer';
import Header from './header';
import Image from 'next/image';

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <main>{children}</main>
            <div id="button-contact-vr" style={{
                position: 'fixed',
                right: '20px',
                bottom: '20px',
                zIndex: 999
            }}>
                <div id="zalo-vr" className="button-contact">
                    <div className="phone-vr">
                        <div className="phone-vr-circle-fill"></div>
                        <div className="phone-vr-img-circle">
                            <a target="_blank" href="https://zalo.me/">
                                <Image src={'/img/footer/zalo.png'} width={100} height={100} alt="Zalo" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <style jsx>{`
            #button-contact-vr {
                transition: all .3s ease;
            }
            #button-contact-vr:hover {
                transform: scale(1.1);
            }
            .phone-vr {
                position: relative;
            }
            .phone-vr-circle-fill {
                width: 65px;
                height: 65px;
                top: -7px;
                left: -7px;
                position: absolute;
                background-color: rgba(0, 123, 255, 0.15); /* Đổi màu xanh lá thành xanh nước biển */
                border-radius: 50%;
                border: 2px solid transparent;
                animation: phone-vr-circle-fill 2.3s infinite ease-in-out;
            }
            .phone-vr-img-circle {
                background-color: #0066ff; /* Đổi màu xanh lá thành xanh nước biển */
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            @keyframes phone-vr-circle-fill {
                0% {
                    transform: rotate(0) scale(1) skew(1deg);
                }
                10% {
                    transform: rotate(-25deg) scale(1) skew(1deg);
                }
                20% {
                    transform: rotate(25deg) scale(1) skew(1deg);
                }
                30% {
                    transform: rotate(-25deg) scale(1) skew(1deg);
                }
                40% {
                    transform: rotate(25deg) scale(1) skew(1deg);
                }
                50% {
                    transform: rotate(0) scale(1) skew(1deg);
                }
                100% {
                    transform: rotate(0) scale(1) skew(1deg);
                }
            }
        `}</style>
        </>
    );
};

export default Layout;