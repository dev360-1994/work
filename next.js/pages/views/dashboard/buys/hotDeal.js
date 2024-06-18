/* eslint-disable @next/next/no-img-element */
/* eslint-disable quotes */
import { useEffect, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom/cjs/react-router-dom.min';

import '@fontsource/dm-mono'; // Defaults to weight 400
import '@fontsource/dm-mono/400.css'; // Specify weight
import '@fontsource/dm-mono/400-italic.css'; // Specify weight and style
import BuyDataShow from './TableDataShow';
import { getHotDeal } from '@src/api/buy.action';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import PageLayout from '@src/layouts/PageLayout';
// **  Custom Components

const HotDeal = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.asPath.includes('#')) {
      setTimeout(() => {
        const hash = router.asPath.split('#')[1];
        const element = document.getElementById(hash);

        if (element) {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const elementTop = element.getBoundingClientRect().top + scrollTop;
          const offset = window.innerHeight / 2 - element.offsetHeight / 2;
          const scrollToPosition = elementTop - offset - 132;

          window.scrollTo({
            top: scrollToPosition,
            behavior: 'smooth',
          });
        }
      }, 500); // Wait for 500 milliseconds before scrolling
    }
  }, [router.asPath]);

  const [imageData, setImageData] = useState([]);
  const [showImageData, setShowImageData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getHotDeal() ?? [];
      if(data && data?.length > 0){
        data.sort((a, b) => b.blueDot - a.blueDot);
        const length = Math.min(data?.length, 6);
        setShowImageData(data?.slice(0, length) || []);
        setImageData(data?.slice(length) || []);
      }      
    }
    fetchData();
  }, []);

  return (
    <PageLayout>
    <div className="w-100 pageTop">
      <div className="w-100 header-image buypage-image m-0 p-0 d-sm-flex d-none align-items-center">
        <title>Hot Deals</title>
        <div className="col-lg-7 col-12 px-sm-5 px-3">
          <h1 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Hot Deals
          </h1>
        </div>
      </div>
      {/* mobile */}
      <div className="w-100 header-image buypage-mobileimage m-0 p-0 d-sm-none d-flex align-items-center">
        <div className="col-lg-7 col-12 px-sm-5 px-3">
          <h2 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Hot Deals
          </h2>
        </div>
      </div>

      <div className="row m-0 p-0 col-12 px-md-5 px-3 pt-5" style={{ backgroundColor: '#FFFFFF' }}>
        {showImageData.length > 0 && showImageData.map((item, index) => (
          item.productImage && (
            <div className="col-xl-4 col-lg-6 col-12 mt-1 pb-2" key={index + 1}>
              <div className="sentient-buy-pan p-1 d-flex justify-content-center flex-column">
                <div className="m-0 p-0" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Link href={`/product-details/${item.inventoryId}`} passHref className="navbar-brand m-0 p-0" onClick={() => window.scrollTo(0, 0)}>
                    <img
                      className="product-height w-100"
                      src={`${process.env.APP_SERVER_URL}/uploads/products/${item?.productImage}`}
                      style={{ objectFit: 'contain', width: 'auto', borderRadius: '16px' }}
                      alt={item.productImage}
                      title={item.productImage}
                    />
                  </Link>
                </div>
              </div>
              <div className="w-100" />
              <h3 className="sentient-contenttitle px-3 pt-2 m-0 p-0">
                {item.productCompany}
                -
                {item.productModel}
              </h3>
              <p className="sentient-content px-3 m-0 p-0">
                $
                {item.askingPrice.toLocaleString()}
              </p>
            </div>
          )
        ))}
      </div>
      <div id="tableid" className="row col-12 m-0 p-0 py-5">
        <BuyDataShow tableData={imageData} />
      </div>

      <div className="w-100" />
      <div className="d-flex m-0 p-0 px-md-5 px-3 pb-5">
        <Link href="/products" passHref={true}> 
          <a className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
            <p className="sentient-button sentient-footer p-3" style={{ fontSize: '16px', fontWeight: '700' }}>
              See all  LaserTrader invetory
            </p>
          </a>
        </Link>
      </div>
    </div>
    </PageLayout>
  );
};

export default HotDeal;
