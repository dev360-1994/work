import { useEffect, useState } from 'react';
import SentientImage1 from '@src/assets/images/pages/service/practice/Frame1.png';
import SentientImage2 from '@src/assets/images/pages/service/practice/Frame2.png';
import SentientmobileImage2 from '@src/assets/images/pages/service/practice/Frame2-mobile.png';
import Image from 'next/image';
import PageLayout from '../../../../src/layouts/PageLayout';
// **  Custom Components

const PracticeDevelopment = () => {
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
      <div className="w-100 header-image practicepage-image m-0 p-0 d-sm-flex d-none align-items-center">
        <div className="col-lg-7 col-12 px-md-5 px-3 m-0 p-0">
          <h1 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Practice Development
          </h1>
        </div>
      </div>
      {/* mobile */}
      <div className="w-100 header-image practicepage-mobileimage m-0 p-0 d-sm-none d-flex align-items-center">
        <div className="col-lg-7 col-12 px-md-5 px-3 m-0 p-0">
          <h1 className="sentient-subtitle" style={{ color: '#FFFFFF' }}>
            Practice Development
          </h1>
        </div>
      </div>
      <div className="w-100" />
      <div className="row col-12 m-0 p-0 py-lg-5 py-3" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="col-lg-6 col-12 px-md-5 px-3 m-0 p-0">
          <h3 className="col-sm-11 col-12 sentient-contenttitle m-0 p-0">
            Assured Development is the first and only practice development program for both proprietary and pre-owned devices by Sentient.
          </h3>
        </div>
        <div className="col-lg-6 col-12 px-md-5 px-3 pt-lg-0 pt-3 m-0 p-0">
          <p className="sentient-contenttitle" style={{ fontSize: '24px', fontWeight: '400' }}>
            Communication. Experience. Partnership. Execution. Success.
            <br />
            <br />
            Assured Development invests with our clients by creating a culture of growth and development that fosters innovation, creativity, and return on investment.
          </p>

          <div className="m-0 p-0 pt-3 ">
            <a
              className="sentient-content p-0 navbar-brand"
              href="mailto:assureddevelopment@sentientlasers.com"
              style={{ whiteSpace: 'break-spaces' }}
            >
              <b className="sentient-button sentient-footer text-center p-3"> Contact Assured Development</b>
            </a>
          </div>
        </div>
      </div>

      <div className="w-100" />
      <div className="row col-12 m-0 p-0 py-lg-5 py-2" style={{ backgroundColor: '#FAF9F6' }}>
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
          <div className="m-0 p-0 pt-md-0 pt-3">
            <p className=" sentient-dmmono col-10 p-0 text-left d-sm-flex d-none">
              Assured Development Offerings
            </p>
            <hr className="sentient-underline d-sm-flex d-none" />
            <ul className="sentient-content m-0 p-0 px-3 py-3" style={{ lineHeight: '1.5' }}>
              <li>Consultative listening and applied experience to differentiate your business</li>
              <li>Collaboration for custom solutions driven by success</li>
              <li>Grow with data, market trends and best practices</li>
              <li>Solutions designed to improve patient care, process, and revenue</li>
              <li>Branding partnership</li>
              <li>Invest in strategic relationships for future opportunities</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row col-12 m-0 p-0 py-sm-5 py-1" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="col-lg-6 col-12 py-sm-0 py-3 px-3 d-sm-none d-flex justify-content-center align-items-center m-0 p-0">
          <div className="m-0 p-0 d-sm-flex d-none">
            <Image
              className="w-100"
              src={SentientImage2}
              alt=""
            />
          </div>
          {/* mobile */}
          <div className="m-0 p-0 d-sm-none d-flex">
            <Image
              className="w-100"
              src={SentientmobileImage2}
              alt=""
            />
          </div>
        </div>
        <div className="col-lg-6 col-12 px-md-5 px-3 d-flex justify-content-center flex-column m-0 p-0">
          <div className="m-0 p-0">
            <p className=" sentient-content col-12 p-0 text-left">
              Enlist Assured Development so you can turn your primary focus to the areas of your business that are your expertise. Marketing your business and your treatments can be a full-time job, and more trial and error than progress without support and expert guidance.
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

      <div className="row col-12 d-sm-flex d-none justify-content-center pt-sm-5 pt-2 pb-sm-3 pb-2 p-0 m-0" style={{ backgroundColor: '#4DAC00' }}>
        <div className="px-sm-5 px-2 d-flex justify-content-center flex-column m-0 p-0">
          <p className="sentient-contenttitle text-center" style={{ color: '#FFFFFF' }}>
            “The Assured Development team has been AMAZING! From before I opened the doors of my new private practice to now, they have been by my side. They continue to demonstrate the ability to educate staff, create customized materials, plan events and find new ways to attract patients. They impress me with their new ideas and help implement them with our entire team, while making it fun and am so grateful for all their unwavering support. I have an unbeatable combination—new Sentient technology and devices  and Assured Development. Highly recommend!”
          </p>
          <p className="sentient-dmmono pt-2 text-center" style={{ color: '#FFFFFF' }}>
            Amy Wolthoff, MD, Enlighten Dermatology and Wellness
          </p>
        </div>
      </div>

      <div className="row col-12 d-flex justify-content-center py-sm-5 py-3 p-0 m-0" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="px-sm-5 px-3 d-flex justify-content-center m-0 p-0">
          <p className="sentient-contenttitle text-center" style={{ color: '#4DAC00' }}>
            Get in touch with our Assured Development team today
          </p>
        </div>
        <div className="w-100" />
        <div className="px-sm-5 px-3 d-flex justify-content-center py-3 m-0 p-0">
          <a
            className="sentient-content p-0 navbar-brand"
            href="mailto:assureddevelopment@sentientlasers.com"
            style={{ whiteSpace: 'break-spaces' }}
          >
            <b className="sentient-button sentient-footer text-center p-3"> Contact Assured Development</b>
          </a>
        </div>
      </div>
    </div>
    </PageLayout>
  );
};

export default PracticeDevelopment;
