/* eslint-disable @next/next/no-img-element */
import AdobeStock1 from '@src/assets/images/pages/buy/Frame.png';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import '@fontsource/dm-mono'; // Defaults to weight 400
import '@fontsource/dm-mono/400.css'; // Specify weight
import '@fontsource/dm-mono/400-italic.css'; // Specify weight and style

import parse from 'html-react-parser';
import BuyList from './Table';
import { getRecents } from '@src/api/buy.action';

import BuyDataShow from './TableDataShow';
import TableDaily from './TableDaily';
import Link from 'next/link';
import Image from 'next/image';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import PageLayout from '@src/layouts/PageLayout';
// **  Custom Components

const DailyArrivals = () => {
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
      const data = await (getRecents());
      if(data && data?.length > 0){
        data.sort((a, b) => b.blueDot - a.blueDot);
        const length = Math.min(data?.length, 6);
        setShowImageData(data?.slice(0, length) || []);
        setImageData(data?.slice(length) || []);
      }  
    }
    fetchData();
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1200 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
      partialVisibilityGutter: 40,
    },
    tablet: {
      breakpoint: { max: 1200, min: 576 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
      partialVisibilityGutter: 30,
    },
    mobile: {
      breakpoint: { max: 576, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  const carouselItems = showImageData.length > 0 && showImageData.map((item, index) => (
    item.productImage && (
      <div className="col-12 mb-sm-3 px-2 mb-1" key={index}>
        <div className="sentient-pan" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Link href={`/product-details/${item.inventoryId}`} passHref className="navbar-brand m-0 p-0" onClick={() => window.scrollTo(0, 0)}>
            <img
              className="product-height w-100"
              src={`${process.env.APP_SERVER_URL}/uploads/products/${item?.productImage}`}
              style={{ objectFit: 'contain', width: 'auto', borderRadius: '16px', cursor: 'pointer' }}
              alt={item.productImage}
              title={item.productImage}
            />
          </Link>
        </div>
        <div className="w-100" />
        <h3 className="sentient-contenttitle pt-2 m-0 p-0">
          {item.productCompany}
          -
          {item.productModel}
        </h3>
        <p className="sentient-content m-0 p-0">
          $
          {item.askingPrice.toLocaleString()}
        </p>
      </div>
    )
  ));

  return (
    <PageLayout>
    <div className="w-100 pageTop">
      <div className="w-100 header-image buypage-image m-0 p-0 d-sm-flex d-none align-items-center">
        <title>Daily Arrivals</title>
        <div className="col-lg-7 col-12 px-sm-5 px-3">
          <h1 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Daily Arrivals
          </h1>
        </div>
      </div>
      {/* mobile */}
      <div className="w-100 header-image buypage-mobileimage m-0 p-0 d-sm-none d-flex align-items-center">
        <div className="col-lg-7 col-12 px-sm-5 px-3">
          <h1 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Daily Arrivals
          </h1>
        </div>
      </div>

      <div className="row m-0 p-0 col-12 px-md-5 px-3 py-5" style={{ backgroundColor: '#FFFFFF' }}>
        <Carousel
          className="w-100 m-0 p-0"
          responsive={responsive}
          swipeable
          arrows={false}
          showDots
          dotListClass="custom-dots custom-dot-list-style"
          ssr
          infinite
          autoPlay
          autoPlaySpeed={4000}
          keyBoardControl
          customTransition="opacity 5s ease-in-out"
          transitionDuration={500}
          containerClass="carousel-container"
          showThumbs
          itemClass="carousel-item-padding-40-px"
          showArrows={false}
        >
          {carouselItems}
        </Carousel>
      </div>

      <div id="tableid" className="row col-12 m-0 p-0 py-2">
        <TableDaily tableData={imageData} />
      </div>

      <div className="w-100" />
      <div className="d-flex m-0 p-0 px-md-5 px-3 py-5">
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

export default DailyArrivals;
