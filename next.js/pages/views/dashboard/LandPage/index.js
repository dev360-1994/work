/* eslint-disable @next/next/no-img-element */
import rightArrow from '@src/assets/images/pages/landing/right-arrow.png';
import LaserTraderBuy from '@src/assets/images/pages/landing/Alma Soprano Ice 2.png';
import LaserTraderSell from '@src/assets/images/pages/landing/Sentient Sundance 2023.png';

import { useEffect, useState } from 'react';
import { Fade } from 'react-slideshow-image';

import 'react-slideshow-image/dist/styles.css';

import '@fontsource/dm-mono'; // Defaults to weight 400
import '@fontsource/dm-mono/400.css'; // Specify weight
import '@fontsource/dm-mono/400-italic.css'; // Specify weight and style

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import Image from 'next/image';
import Link from 'next/link';
import { getHotDeal, getRecents } from '@src/api/buy.action';
import PageLayout from '@src/layouts/PageLayout';


// const LandPage = ({ hotDeal, daily }) => {
const LandPage = ({ hotDeal, daily }) => {
  const [imageData, setImageData] = useState([]);
  const [hotDealData, setHotDealData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
 
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
      slidesToSlide: 2, // optional, default to 1.
      partialVisibilityGutter: 30,
    },
    mobile: {
      breakpoint: { max: 576, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  const responsive1 = {
    desktop: {
      breakpoint: { max: 3000, min: 1200 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
      partialVisibilityGutter: 40,
    },
    tablet: {
      breakpoint: { max: 1200, min: 576 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
      partialVisibilityGutter: 30,
    },
    mobile: {
      breakpoint: { max: 576, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      const hotDeal = await getHotDeal() || [];
      if(hotDeal?.length > 0){
        const length = hotDeal?.length > 6 ? 6 : hotDeal?.length;
        setImageData(hotDeal?.slice(0, length) || []);
      }      
      // --------------------
      const daily = await getRecents() || []; 
      if(daily?.length > 0){
        const lengthrecent = daily?.length > 6 ? 6 : daily?.length;
        setDailyData(daily?.slice(0, lengthrecent) || []);
      }     
    };
    fetchData();
  }, [hotDeal, daily]);

  const mainslide1 = () => (
    <>
      <div
        className="w-100 background-image buy-image m-0 p-0 d-sm-flex d-none align-items-center"
      >
        <div className="col-lg-7 col-12 px-sm-5 px-3 m-0 p-0">
          <h1 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Buy Pre-Owned Devices
          </h1>
          <h2 className="col-sm-10 col-12 sentient-content mt-sm-3 p-0" style={{ color: '#FFFFFF', fontSize: '24px' }}>
            Our Sentient Assured™ certification combines the savings of buying used with the benefits of buying new. Buy Sentient Assured™ or directly from our open market.
          </h2>
        </div>
      </div>

      <div
        className="w-100 background-image buy-mobileimage m-0 p-0 d-sm-none d-flex align-items-center"
      >
        <div className="col-12 px-3 m-0 p-0">
          <h2 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Buy Pre-Owned Devices
          </h2>
          <h3 className="col-12 sentient-content p-0" style={{ color: '#FFFFFF' }}>
            Our Sentient Assured™ certification combines the savings of buying used with the benefits of buying new. Buy Sentient Assured™ or directly from our open market.
          </h3>
        </div>
      </div>
    </>
  );

  const mainslide2 = () => (
    <>
      <div
        className="w-100 background-image sell-image m-0 p-0 d-sm-flex d-none align-items-center"
      >

        <div className="col-lg-6 col-12 px-sm-5 px-3">
          <h2 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Sell Your Device
          </h2>
          <h3 className="col-11 sentient-content mt-sm-3 mt-1 p-0" style={{ color: '#FFFFFF', fontSize: '24px' }}>
            Sell directly on the open market or let us maximize the value of your device by selling with the Sentient Assured™ certification.
          </h3>
        </div>
      </div>

      <div
        className="w-100 background-image sell-mobileimage m-0 p-0 d-sm-none d-flex align-items-center"
      >

        <div className="col-lg-6 col-12 px-sm-5 px-3">
          <h2 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Sell Your Device
          </h2>
          <h3 className="col-11 sentient-content mt-sm-3 mt-1 p-0" style={{ color: '#FFFFFF' }}>
            Sell directly on the open market or let us maximize the value of your device by selling with the Sentient Assured™ certification.
          </h3>
        </div>
      </div>

    </>
  );

  const mainslide3 = () => (
    <>
      <div
        className="w-100 background-image buyparts-image d-sm-flex d-none align-items-center"
      >
        <div className="col-lg-6 col-12 px-sm-5 px-3">
          <h2 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Buy Parts
          </h2>
          <h3 className="col-11 sentient-content mt-sm-3 mt-1 p-0 " style={{ color: '#FFFFFF', fontSize: '24px' }}>
            Shop our parts store for replacements and additions for a variety of devices.
          </h3>
        </div>
      </div>

      <div
        className="w-100 background-image buyparts-mobileimage d-sm-none d-flex align-items-center"
      >
        <div className="col-lg-6 col-12 px-sm-5 px-3">
          <h2 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Buy Parts
          </h2>
          <h3 className="col-11 sentient-content mt-sm-3 mt-1 p-0 " style={{ color: '#FFFFFF' }}>
            Shop our parts store for replacements and additions for a variety of devices.
          </h3>
        </div>
      </div>

    </>
  );

  const mainslide4 = () => (
    <>
      <div
        className="w-100 background-image service-image d-sm-flex d-none align-items-center"
      >
        <div className="col-lg-6 col-12 px-sm-5 px-3">
          <h2 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Services
          </h2>
          <h3 className="col-11 sentient-content mt-sm-3 mt-1 p-0" style={{ color: '#FFFFFF', fontSize: '24px' }}>
            We offer world-class device repair, financing at attractive terms, clinical training, and a practice development program to ensure success with your device.
          </h3>
        </div>
      </div>

      <div
        className="w-100 background-image service-mobileimage d-sm-none d-flex align-items-center"
      >
        <div className="col-lg-6 col-12 px-sm-5 px-3">
          <h2 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Services
          </h2>
          <h3 className="col-11 sentient-content mt-sm-3 mt-1 p-0" style={{ color: '#FFFFFF' }}>
            We offer world-class device repair, financing at attractive terms, clinical training, and a practice development program to ensure success with your device.
          </h3>
        </div>
      </div>
    </>
  );

  const slide1 = () => (
    <>
      <div className="row col-12 m-0 p-0">
        <div className="col-12">
          <div className="row px-md-5 px-3 mt-sm-3 mt-1">
            <h3 className="sentient-contenttitle slide-font text-center" style={{ color: 'white' }}>
              “I’ve worked with Ryan Haller and Sentient for over 25 years and they’ve helped me out whether I needed to purchase a used laser or sell devices I wasn’t using anymore. Very honest and excellent service.”
            </h3>
            <div className="w-100" />
            <br />
            <div className="w-100">
              <p className="sentient-dmmono text-center" style={{ color: 'white' }}>
                Brian Zelicson, MD, Founder & CEO Zel Skin & Laser Specialists
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const slide2 = () => (
    <>
      <div className="row col-12 m-0 p-0">
        <div className="col-12">
          <div className="row px-md-5 px-3 mt-sm-3 mt-1">
            <h3 className="sentient-contenttitle slide-font text-center" style={{ color: 'white' }}>
              “I sold an Alma Harmony XL Pro that was basically new through Sentient. Ryan Haller was great every step of the way. Very easy process. They also fixed my Cutera Enlighten and provided a much more reasonably priced warranty compared to the factory warranty.”
            </h3>
            <div className="w-100" />
            <br />
            <div className="w-100">
              <p className="sentient-dmmono text-center" style={{ color: 'white' }}>
                Darin Jackson, MD, Medical Director, Prestige Medical Rejuvenation Center
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const slide3 = () => (
    <>
      <div className="row col-12 m-0 p-0">
        <div className="col-12">
          <div className="row px-md-5 px-3 mt-sm-3 mt-1">
            <h3 className="sentient-contenttitle slide-font text-center" style={{ color: 'white' }}>
              “The Lightsheer arrived today. The device was perfect and the work you did on it was impressive and very effective. Dr. Liskanich tested the device on one of my staff members and could immediately tell that it was “like new” compared to its previous performance.. I can’t tell you how much I appreciate the work you and your team did to restore the device!”
            </h3>
            <div className="w-100" />
            <br />
            <div className="w-100">
              <p className="sentient-dmmono text-center" style={{ color: 'white' }}>
                Jay Williams, Area Practice Manager, West Dermatology
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const slide4 = () => (
    <>
      <div className="row col-12 m-0 p-0">
        <div className="col-12">
          <div className="row px-md-5 px-3 mt-sm-3 mt-1">
            <h3 className="sentient-contenttitle slide-font text-center" style={{ color: 'white' }}>
              “We have used the services of Sentient® to both refurbish lasers we own as well as purchase a newer model of a laserwe had . The service and support has been first class.”
            </h3>
            <div className="w-100" />
            <br />
            <div className="w-100">
              <p className="sentient-dmmono text-center" style={{ color: 'white' }}>
                Dr. Gregory Lynam, Richmond Surgical Arts
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const carouselItems = imageData.length > 0 && imageData.map((item, index) => (
    item.productImage && (
      <div className="col-12 mb-sm-3 mb-1" key={index}>
        <div className="sentient-pan" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            className="w-100 product-height"
            src={`${process.env.APP_SERVER_URL}/uploads/products/${item?.productImage}`}
            style={{
              objectFit: 'cover',
              borderRadius: '16px',
            }}
            alt={item.productImage}
            title={item.productImage}
          />
        </div>
        <div className="d-flex justify-content-start flex-column mt-2 p-0">
          <h2 className="sentient-contenttitle mb-1" style={{ wordBreak: 'break-word' }}>
            {item.productCompany}
            -
            {item.productModel}
          </h2>
          <p className="sentient-content">{item.description}</p>
        </div>
      </div>
    )
  ));

  const carouselItems1 = [
    <div className="m-0 p-0" key="item-1">
      {slide1()}
    </div>,
    <div className="m-0 p-0" key="item-2">
      {slide2()}
    </div>,
    <div className="m-0 p-0" key="item-3">
      {slide3()}
    </div>,
    <div className="m-0 p-0" key="item-4">
      {slide4()}
    </div>,
  ];

  return (
    <PageLayout>
      <div className="pageTop">
        <div className="slide-container " style={{ position: 'relative', zIndex: '0' }}>
          <Fade duration={4000} transitionDuration={1000}>
            <Link href="/products" passHref>
              <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => window.scrollTo(0, 0)}>
                {mainslide1()}
              </div>
            </Link>
            <Link href="/sell" passHref>
              <div style={{ position: 'relative', cursor: 'pointer'  }} onClick={() => window.scrollTo(0, 0)}>
                {mainslide2()}
              </div>
            </Link>
            <a href="http://shopsentientlasers.com/" target="_blank" rel="noreferrer" className="navbar-brand">
              {mainslide3()}
            </a>
            <Link href="/service" passHref>
              <div style={{ position: 'relative', cursor: 'pointer'  }} onClick={() => window.scrollTo(0, 0)}>
                {mainslide4()}
              </div>
            </Link>
          </Fade>
        </div>

        <div className="row px-sm-5 px-3 py-5 m-0 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="row w-100 m-0 p-0 pt-sm-2 mt-1">
            <div className="col-lg-4 col-12 pb-sm-3 mb-1">
              <div className="m-0 p-0 productText-height">
                <div className="sentient-subtitle text-center pb-1" style={{ color: '#4DAC00' }}>Hot Deals</div>
                <div className="sentient-content text-center pb-2">Our most popular deals</div>
              </div>
              <div className="sentient-pan d-flex flex-column" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Link href="/product-hotdeal" passHref className="navbar-brand m-0 p-0" onClick={() => window.scrollTo(0, 0)}>
                  <img
                    className="w-100 product-height p-1"
                    src={`${process.env.APP_SERVER_URL}/uploads/products/${imageData ? imageData[0]?.productImage : ''}`}
                    style={{
                      objectFit: 'scale-down',
                      borderRadius: '16px',
                      cursor: 'pointer',
                    }}
                    alt={imageData ? imageData[0]?.productImage : ''}
                    title={imageData ? imageData[0]?.productImage : ''}
                  />
                </Link>
              </div>
            </div>

            <div className="col-lg-4 col-12 mb-sm-3 mb-1">
              <div className="m-0 p-0 productText-height">
                <div className="sentient-subtitle text-center pb-1" style={{ color: '#4DAC00' }}>Daily Arrivals</div>
                <div className="sentient-content text-center pb-2">The latest inventory</div>
              </div>
              <div className="sentient-pan d-flex flex-column" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Link href="/product-daily" passHref className="navbar-brand m-0 p-0" onClick={() => window.scrollTo(0, 0)}>
                  <img
                    className="w-100 product-height p-1"
                    src={`${process.env.APP_SERVER_URL}/uploads/products/${dailyData ? dailyData[0]?.productImage : ''}`}
                    style={{
                      objectFit: 'scale-down',
                      borderRadius: '16px',
                      cursor: 'pointer',
                    }}
                    alt={dailyData ? dailyData[0]?.productImage : ''}
                    title={dailyData ? dailyData[0]?.productImage : ''}
                  />
                </Link>
              </div>
            </div>

            <div className="col-lg-4 col-12 mb-sm-3 mb-1">
              <div className="m-0 p-0 productText-height">
                <div className="sentient-subtitle text-center pb-1" style={{ color: '#4DAC00' }}>All Inventory</div>
                <div className="sentient-content text-center pb-2">Shop our full catalogue</div>
              </div>
              <div className="sentient-pan d-flex flex-column" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Link href="/products" passHref className="navbar-brand m-0 p-0" onClick={() => window.scrollTo(0, 0)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    className="w-100 product-height m-0 p-1"
                    src={`${process.env.APP_SERVER_URL}/uploads/products/${imageData ? imageData[1]?.productImage : ''}`}
                    style={{
                      objectFit: 'scale-down',
                      borderRadius: '16px',
                      cursor: 'pointer',
                    }}
                    alt={imageData ? imageData[1]?.productImage : ''}
                    title={imageData ? imageData[1]?.productImage : ''}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row px-sm-5 px-4 col-12 m-0 p-0" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="offset-md-2 col-md-8 col-12 p-0">
            <div className="col-12 mt-md-5 mt-2 m-0 p-0 d-sm-flex d-none">
              <h3 className="sentient-contenttitle text-center">
                LaserTrader by Sentient is the
                <span style={{ color: '#4DAC00' }}> first and only pre-owned device marketplace with certification </span>
                committed to your business success through safety, service, and support.
              </h3>
            </div>
            {/* mobile */}
            <div className="col-12 mt-2 m-0 p-0 d-sm-none d-flex">
              <h3 className="sentient-contenttitle">
                LaserTrader by Sentient is the
                <span style={{ color: '#4DAC00' }}> first and only pre-owned device marketplace with certification </span>
                committed to your business success through safety, service, and support.
              </h3>
            </div>
            <div className="w-100" />
            <br />
            <div className="offset-md-1 col-md-10 col-12 p-0">
              <p className="sentient-content text-center d-sm-flex d-none">
                Engineering. Clinical. Marketing. Practice development. Unmatched technical expertise for component level repair. This proprietary process ensures device stability, assurance, and savings.
              </p>
              {/* mobile */}
              <p className="sentient-content text-left d-sm-none d-flex">
                Engineering. Clinical. Marketing. Practice development. Unmatched technical expertise for component level repair. This proprietary process ensures device stability, assurance, and savings.
              </p>
            </div>
            <div className="w-100" />
            <div className="my-md-5 my-3 d-sm-flex d-none justify-content-center">
              <div className="main-navbar-button d-flex align-items-center justify-content-center mx-2">
                <Link href="/products" passHref>
                  <a className="nav-link d-flex navbar-brand" onClick={() => window.scrollTo(0, 0)}>
                    <p className="page-header-button pt-3" style={{ fontSize: '16px', fontWeight: '700' }}>
                      Buy Now
                    </p>
                  </a>
                </Link>
              </div>
              <div className="mx-5">
                <Link href="/sell" passHref>
                  <a className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
                    <p className="sentient-button sentient-footer p-3" style={{ fontSize: '16px', fontWeight: '700' }}>
                      Sell your device
                    </p>
                  </a>
                </Link>
              </div>
            </div>
            {/* mobile */}
            <div className="my-5 d-sm-none d-flex justify-content-center m-0 p-0">
              <div className="main-navbar-button px-3 d-flex m-0 p-0">
                <Link href="/products" passHref>
                  <a className="nav-link m-0 p-0 navbar-brand" onClick={() => window.scrollTo(0, 0)}>
                    <p className="page-header-button pt-3 m-0 p-0" style={{ fontSize: '16px', fontWeight: '700' }}>
                      Buy Now
                    </p>
                  </a>
                </Link>
              </div>
              <div className="mx-2 m-0 p-0">
                <Link href="/sell" passHref>
                  <a className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
                    <p className="sentient-button sentient-footer text-center p-3" style={{ fontSize: '16px', fontWeight: '700' }}>
                      Sell with LaserTrader
                    </p>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row pt-sm-5 pt-2 col-12 m-0 p-0" style={{ backgroundColor: '#FAF9F6' }}>
          <div className="row col-12 m-0 p-0" >
            <div className="col-lg-6 col-12 px-sm-5 px-3 d-flex justify-content-center">
              <Image src={LaserTraderBuy} alt="sentient device" style={{ position: 'relative', zIndex: '-1'}}/>
            </div>
            <div className="col-lg-6 col-12 px-sm-5 px-3 pt-sm-0 pt-2 d-flex justify-content-center flex-column">
              <h3 className="sentient-contenttitle">
                Buying with LaserTrader
              </h3>
              <br />
              <p className="sentient-content" style={{ marginBottom: '39px' }}>
                LaserTrader by Sentient offers two options for buying used and pre-owned aesthetic devices.
              </p>

              <hr className="sentient-underline" />
              <h4 className="sentient-contenttitle mb-1" style={{ marginTop: '20px', fontSize: '24px', color: '#4DAC00' }}>
                Buy a Sentient Assured device
              </h4>
              <p className="sentient-content">
                When you purchase a pre-owned device from Sentient Assured inventory, you’re buying with guarantees, benefits, and service options not found in the used market. Devices arrive in perfect working condition with included practice development support. We offer optional clinical training, comprehensive and cost-effective service plans—all without recertification fees. LaserTrader by Sentient combines the affordability of buying used with the benefits of buying new.
              </p>
              <p className="sentient-content" style={{ marginBottom: '20px' }}>
                <Link href="/products?type=bluedot" passHref className="navbar-brand align-items-center" onClick={() => window.scrollTo(0, 0)}>
                  <span className="sentient-content" style={{ textDecoration: 'underline', color: '#000000', cursor: 'pointer' }}><b>View the inventory here</b></span>
                </Link>
              </p>

              <hr className="sentient-underline" />
              <h4 className="sentient-contenttitle mb-1" style={{ marginTop: '20px', fontSize: '24px', color: '#4DAC00' }}>
                Buy from our open market
              </h4>
              <p className="sentient-content">
                Purchase directly from a seller on our open marketplace.
              </p>
              <p className="sentient-content" style={{ marginBottom: '36px' }}>
                <Link href="/products" passHref className="navbar-brand align-items-center" onClick={() => window.scrollTo(0, 0)}>
                  <span className="sentient-content" style={{ textDecoration: 'underline', color: '#000000', cursor: 'pointer' }}><b>View the postings here</b></span>
                </Link>
              </p>
            </div>
          </div>

          <div className="row col-12 pt-5 m-0 p-0">
            <div className="px-md-5 px-3 row py-md-5 py-2 col-12 m-0">
              <h3 className="sentient-contenttitle pb-3 m-0 p-0" style={{ marginBottom: '25px' }}>Selling with LaserTrader</h3>
              <div className="row col-12 m-0 p-0 d-flex align-items-center">
                <div className="col-lg-6 col-12 pb-3 m-0 p-0">
                  <div className="w-100" />
                  <p className="sentient-content p-0" style={{ marginBottom: '25px' }}>
                    LaserTrader by Sentient offers three options for selling your used or pre-owned aesthetic devices.
                  </p>

                  <div className="w-100 m-0 p-0" />
                  <div className="col-12 m-0 p-0">
                    <hr className="sentient-underline" style={{ marginBottom: '17px' }} />
                    <Link href="/contact-us?s=1" passHref onClick={() => window.scrollTo(0, 0)}>
                      <h4 className="sentient-contenttitle" style={{ fontSize: '24px', color: '#4DAC00', marginBottom: '17px' }}>Sell to LaserTrader by Sentient</h4>
                    </Link>
                    <p className="sentient-content mb-2">
                      If you’re looking for a quick sale, sell your laser to us! Our state-of-the-art facility houses over 350 lasers, and we purchase new inventory daily. We’ll turn your existing laser into cash with our Sentient Assured certification and sales process.
                    </p>

                    <Link 
                        href="/sell/listdevice" 
                        passHref 
                        className="navbar-brand align-items-center" 
                        style={{ marginBottom: '36px' }}
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <div className="d-flex align-items-center"  style={{ cursor: 'pointer'}}>
                          <span className="sentient-content" style={{ textDecoration: 'underline', color: '#000000' }}><b>Sell your device for cash</b></span>
                          &nbsp;
                          <Image
                            src={rightArrow}
                            width={25}
                            height={25}
                            alt="rightarrow"
                          />
                        </div>                        
                      </Link>
                  </div>

                  <div className="col-12 m-0 p-0">
                    <hr className="sentient-underline" style={{ marginBottom: '17px' }} />
                    <Link href="/sell/listdevice" passHref onClick={() => window.scrollTo(0, 0)}>
                      <h4 className="sentient-contenttitle" style={{ fontSize: '24px', color: '#4DAC00', marginBottom: '17px' }}>Sell on our open market</h4>
                    </Link>
                    <p className="sentient-content mb-2">
                      LaserTrader connects owners and buyers to each other through the largest for sale by owner site in the world. All you need to do is post what you&apos;re selling on TheLaserTrader.com. We&apos;ll handle the rest.
                    </p>
                    <Link href="/sell/lishdevice" 
                      passHref 
                      className="navbar-brand align-items-center" 
                      style={{ marginBottom: '36px' }}
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <div className="d-flex align-items-center" style={{ cursor: 'pointer'}}>
                        <span className="sentient-content" style={{ textDecoration: 'underline', color: '#000000' }}><b>Get started listing your device here</b></span>
                        &nbsp;
                        <Image
                          src={rightArrow}
                          width={25}
                          height={25}
                          alt="rightarrow"
                        />
                      </div>                      
                    </Link>
                  </div>
                </div>

                <div className="col-lg-6 col-12 d-flex justify-content-center align-items-center m-0 p-0">
                  <Image
                    src={LaserTraderSell}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row col-12 d-sm-flex d-none pt-5 m-0 p-0" style={{ backgroundColor: '#4DAC00' }}>
          <Carousel
            className="w-100 m-0 p-0"
            responsive={responsive1}
            swipeable
            arrows={false}
            showDots
            dotListClass="custom-dots custom-dot-list-style"
            ssr
            infinite
            autoPlay
            autoPlaySpeed={8000}
            keyBoardControl
            customTransition="opacity 5s ease-in-out"
            transitionDuration={500}
            containerClass="carousel-container"
            showThumbs
            itemClass="carousel-item-padding-40-px"
            showArrows={false}
          >
            {carouselItems1}
          </Carousel>
        </div>        
        <div className="row col-12 d-sm-none d-flex m-0 p-0" style={{ backgroundColor: '#4DAC00' }}>
          <div className="m-0 p-0" key="item-1">
            <div className="row col-12 m-0 p-0">
              <div className="col-12">
                <div className="row px-3 my-3 mt-1">
                  <h3 className="sentient-contenttitle text-center" style={{ color: 'white', fontSize: '18px' }}>
                    “I’ve worked with Ryan Haller and Sentient for over 25 years and they’ve helped me out whether I needed to purchase a used laser or sell devices I wasn’t using anymore. Very honest and excellent service.”
                  </h3>
                  <div className="w-100" />
                  <br />
                  <div className="w-100">
                    <p className="sentient-dmmono text-center" style={{ color: 'white', fontSize: '16px' }}>
                      Brian Zelicson, MD, Founder & CEO Zel Skin & Laser Specialists
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row py-5 m-0 p-0" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="px-sm-5 px-3 col-lg-5 col-12">
            <h2 className="sentient-title" style={{ color: '#0A2FFF', wordBreak: 'break-word' }}>Questions?</h2>
            <br />
            <p className="sentient-contenttitle mb-2" style={{ fontWeight: '400' }}>
              We want to make sure you’re confident in every decision you make for your business. Get to know LaserTrader a little better with answers to these frequently asked questions.
            </p>
            <div className="w-100" />
          </div>

          <div className="px-sm-5 px-3 col-lg-7 col-12">
            <p className="sentient-dmmono mb-0 d-sm-flex d-none">Frequently Asked Questions</p>
            <hr className="sentient-underline d-sm-flex d-none" />
            <br />
            <p className="sentient-content">
              <strong>How long has LaserTrader by Sentient been in business?</strong>
            </p>
            <p className="sentient-content">
              LaserTrader by Sentient is formerly known as TheLaserTrader.com and has been in business since 2002.
            </p>
            <br />
            <p className="sentient-content">
              <strong>Who can buy a device and legally use it? </strong>
            </p>
            <p className="sentient-content">
              It’s dependent on the state in which you practice. The FDA will classify the majority of Medical / Surgical Lasers as Class IV devices and the majority of the IPL systems as Class II. Based on the FDA classifications each State will determine the rules that govern the use of the system. We suggest you always contact your State Board of Medical Examiners to find out what the most recent or current laws are.
            </p>
            <br />
            <p className="sentient-content">
              <strong>Is buying a used device safe?</strong>
            </p>
            <p className="sentient-content">
              LaserTrader by Sentient and Sentient Assured offer assurances that you wouldn’t normally find on the open market. Additionally, our experienced team is here to help you make the right decision for your business. Reach out with any questions
              {' '}
              <Link href="/contact-us" onClick={() => window.scrollTo(0, 0)} style={{ color: '#000000', textDecoration: 'underline' }}>
                here.
              </Link>
            </p>
          </div>
        </div>
        
      </div>
    </PageLayout>
  );
};

// export async function getServerSideProps() {
//    const hotDeal = await getHotDeal() || [];
//    const daily = await getRecents() || []; 
 
//    return { props: { hotDeal, daily } };
//  }

export default LandPage;