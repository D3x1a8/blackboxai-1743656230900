import { DefaultSeo } from 'next-seo';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo
        title="Yaalgo - AI-Powered E-commerce Automation"
        description="Connect suppliers and sellers with automated product listing, order fulfillment, and payment processing."
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://yaalgo.com',
          site_name: 'Yaalgo',
          images: [
            {
              url: 'https://yaalgo.com/images/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'Yaalgo E-commerce Platform',
            }
          ]
        }}
        twitter={{
          handle: '@yaalgo',
          site: '@yaalgo',
          cardType: 'summary_large_image',
        }}
      />
      <Head>
        <link rel="canonical" href="https://yaalgo.com" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;