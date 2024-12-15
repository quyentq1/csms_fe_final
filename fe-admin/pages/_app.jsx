import 'bootstrap/dist/css/bootstrap.css';
import Head from 'next/head';
import 'antd/dist/reset.css';

import '../styles/globals.scss';
import Layout from '@/components/Layout';

const App = ({ Component, pageProps }) => {

    return (
        <Layout>
            <Head>
                <link rel="icon" href="../img/favicon.jpg" />
                <title>Admin DashBoard CSMS</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Component {...pageProps} />
        </Layout>
    );
}

export default App;

