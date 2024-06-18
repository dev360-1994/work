import Head from "next/head";
import { useRouter } from 'next/router';

import "../styles/style.scss";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  
  const router = useRouter();

  return (
    <>
      <Head>
        <title>LaserTrader</title>
        <meta name="description" content="ThelaserTrader by Sentient" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <meta property="og:site_name" content="theLaserTrader" />
        <meta property="og:title" content="theLaserTrader" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://www.theLasersTrader.com/" />
        <meta property="og:image" content="https://www.theLasersTrader.com/Hero image.png" />
        <meta property="og:description" content="LaserTrader by Sentient offers three options for selling your used or pre-owned aesthetic devices." />
        
        <link rel='canonical' href='https://www.theLasersTrader.com/' />

        <link rel="icon" href="/theLaserTrader.ico" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/theLaserTrader.ico" />

        {/* <script
        id="fb-pixel"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '7517515614932248');
              fbq('track', 'PageView');
          `,
        }}
/> */}

<script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
             
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':

            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            
            })(window,document,'script','dataLayer','GTM-PZTWN8KG') 
            `,
          }}
        />
         <noscript
            dangerouslySetInnerHTML=
            {{
              __html: `iframe src=https://www.googletagmanager.com/ns.html?id=GTM-PZTWN8KG

          height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
         {/* <noscript
            dangerouslySetInnerHTML=
            {{
              __html: `<img height="1" width="1" style="display:none"
              src="https://www.facebook.com/tr?id=7517515614932248&ev=PageView&noscript=1"
              />`,
            }}
          />  */}

      </Head>
      <Component {...pageProps} />
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    </>
  );
}

export default MyApp;
