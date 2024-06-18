import { useEffect, useState } from 'react';

import SentientImage1 from '@src/assets/images/pages/service/financing/Frame1.png';
import SentientImage2 from '@src/assets/images/pages/service/financing/Frame2.png';
import Image from 'next/image';
import PageLayout from '../../../../src/layouts/PageLayout';
// **  Custom Components

const Financing = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <PageLayout>
    <div className="w-100 pageTop">
      <div className="w-100 header-image financingpage-image m-0 p-0 d-sm-flex d-none align-items-center">
        <div className="col-lg-7 col-12 px-md-5 px-3 m-0 p-0">
          <h1 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Financing
          </h1>
        </div>
      </div>
      {/* mobile */}
      <div className="w-100 header-image financingpage-mobileimage m-0 p-0 d-sm-none d-flex align-items-center">
        <div className="col-lg-7 col-12 px-md-5 px-3 m-0 p-0">
          <h1 className="sentient-subtitle" style={{ color: '#FFFFFF' }}>
            Financing
          </h1>
        </div>
      </div>
      <div className="w-100" />
      <div className="row col-12 m-0 p-0 py-sm-5 py-2" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="col-lg-6 col-12 px-md-5 px-3 m-0 p-0">
          <h3 className="col-sm-11 col-12 sentient-contenttitle m-0 p-0">
            Assured Financial™  is the first and only transparent medical-aesthetic finance company dedicated to delivering rapid and reasonable finance solutions.
          </h3>
        </div>
        <div className="col-lg-6 col-12 px-md-5 px-3 pt-lg-0 pt-5 m-0 p-0">
          <p className="sentient-contenttitle" style={{ fontSize: '24px', fontWeight: '400' }}>
            Simple. Honest. Effective. Fast. Cooperative.
            <br />
            <br />
            Assured Financial redefines medical-aesthetic financing with unparalleled support, options, flexibility, and integrity.
          </p>
          <div className="row col-12 pt-2 m-0 p-0 ">
            <div className="col-xl-6 col-12 m-0 p-0">
              <a href="http://www.assuredfinancial.co/ " className="navbar-brand d-flex" onClick={() => window.scrollTo(0, 0)} target="_blank" rel="noreferrer">
                <p className="sentient-button sentient-footer px-3 p-2" style={{ fontSize: '16px' }}>Contact Assured Financial</p>
              </a>
            </div>

            <div className="col-xl-6 col-12 m-0 d-flex align-items-center align-itmes-center">
              <p className="sentient-content " style={{ fontWeight: '700' }}>You can also call us at 800. 316.1942</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-100" />
      <div className="row col-12 m-0 p-0 py-lg-5 py-3" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="col-lg-6 col-12 px-md-5 px-3 d-flex justify-content-center align-items-center m-0 p-0">
          <div className="m-0 p-0">
            <Image
              className="w-100"
              src={SentientImage1}
              alt=""
            />
          </div>
        </div>
        <div className="col-lg-6 col-12 px-md-5 px-3 d-flex justify-content-center flex-column m-0 p-0">
          <div className="m-0 p-0 pt-lg-0 pt-3">
            <p className=" sentient-dmmono col-10 p-0 text-left d-sm-flex d-none">
              Assured Financial Benefits
            </p>
            <hr className="sentient-underline d-sm-flex d-none" />
            <ul className="sentient-content m-0 p-0 px-3 py-2" style={{ lineHeight: '1.5' }}>
              <li>Hassle Free online applications and documents</li>
              <li>Soft credit checks - No impact on your credit score</li>
              <li>No Simple Interest - Lowest rates</li>
              <li>Straightforward early buyout options</li>
              <li>Complete financing for equipment, installation, training, and service plans</li>
              <li>All credit profiles considered, including new businesses</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row col-12 m-0 p-0 py-lg-5 py-3" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="col-lg-6 col-12 py-sm-0 py-2 px-2 d-sm-none d-flex justify-content-center align-items-center m-0 p-0">
          <div className="m-0 p-0">
            <Image
              className="w-100"
              src={SentientImage2}
              alt=""
            />
          </div>
        </div>
        <div className="col-lg-6 col-12 px-md-5 px-3 d-flex justify-content-center flex-column m-0 p-0">
          <div className="m-0 p-0">
            <p className=" sentient-content col-12 p-0 text-left">
              Financing can set up your business for success or become an obstacle to growth. The difference lies in the financing solution itself and how it is packaged and presented to you. With Assured Financial there are no surprises.
              <br />
              <br />
              Use financing to your advantage by allowing for maximum cash flow and reserves. Assured Financial allows you the freedom, confidence, trust, and foresight to make business decisions that are right for you.
              <br />
              <br />
              Assured Financial can support you in any manufacturer purchase, whether from LaserTrader or any other company, used or new. Partner with Assured Financial for all your device finance solutions, and enjoy the benefits of collaborating with a trusted source.
            </p>
          </div>
        </div>
        <div className="col-lg-6 col-12 px-2 d-sm-flex d-none justify-content-center align-items-center m-0 p-0">
          <div className="m-0 p-0">
            <Image
              className="w-100"
              src={SentientImage2}
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="row col-12 d-flex justify-content-center py-sm-5 py-2 p-0 m-0" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="px-2 d-flex justify-content-center m-0 p-0">
          <p className="sentient-contenttitle text-center" style={{ color: '#4DAC00' }}>
            Get in touch with our Assured Financial team today
          </p>
        </div>
        <div className="w-100" />
        <div className="px-3 d-flex justify-content-center py-3 m-0 p-0">
          <a href="http://www.assuredfinancial.co/ " className="navbar-brand d-flex" onClick={() => window.scrollTo(0, 0)} target="_blank" rel="noreferrer">
            <p className="sentient-button sentient-footer text-center px-3 p-2" style={{ fontSize: '16px' }}>Contact Assured Financial</p>
          </a>
        </div>
      </div>
    </div>
    </PageLayout>
  );
};

export default Financing;
