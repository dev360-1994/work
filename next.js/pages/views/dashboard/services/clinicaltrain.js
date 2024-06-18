import { useEffect, useState } from 'react';
import SentientImage1 from '@src/assets/images/pages/service/clinical/Sentient1.png';
import SentientImage2 from '@src/assets/images/pages/service/clinical/Sentient2.png';
import Link from 'next/link';
import Image from 'next/image';
import PageLayout from '@src/layouts/PageLayout';
// **  Custom Components

const ClinicalTrain = () => {
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
      <div className="w-100 header-image clinicalpage-image m-0 p-0 d-sm-flex d-none align-items-center">
        <div className="col-lg-7 col-12 px-md-5 px-3 m-0 p-0">
          <h1 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Clinical Training
          </h1>
        </div>
      </div>
      {/* mobile */}
      <div className="w-100 header-image clinicalpage-mobileimage m-0 p-0 d-sm-none d-flex align-items-center">
        <div className="col-lg-7 col-12 px-md-5 px-3 m-0 p-0">
          <h1 className="sentient-subtitle" style={{ color: '#FFFFFF' }}>
            Clinical Training
          </h1>
        </div>
      </div>
      <div className="w-100" />
      <div className="row col-12 m-0 p-0 py-sm-5 py-3" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="col-lg-6 col-12 px-md-5 px-3 m-0 p-0">
          <h3 className="col-sm-11 col-12 sentient-contenttitle m-0 p-0">
            Sentient has the first and only clinical team qualified to provide paramount training and continued clinical support for our proprietary technologies and aesthetic devices from all major manufacturers.
          </h3>
        </div>
        <div className="col-lg-6 col-12 px-md-5 px-3 pt-lg-0 pt-5 m-0 p-0">
          <p className="sentient-contenttitle" style={{ fontSize: '24px', fontWeight: '400' }}>
            Education. Commitment. Expertise. Advocacy. Results.
            <br />
            <br />
            We’re dedicated to the giving you the knowledge that facilitates safe and effective outcomes through
            higher learning.
          </p>
          <div className="m-0 p-0 pt-3 ">
            <Link href="/service/training-inquiry" passHref>
              <a className="navbar-brand d-flex" onClick={() => window.scrollTo(0, 0)}>
                <p className="sentient-button sentient-footer text-center p-3" style={{ fontSize: '16px' }}>
                  Schedule clinical training
                </p>
              </a> 
            </Link>
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
              Clinical Training Offerings
            </p>
            <hr className="sentient-underline d-sm-flex d-none" />
            <ul className="sentient-content m-0 p-0 px-3 py-2" style={{ lineHeight: '1.5' }}>
              <li>Device specific education</li>
              <li>General laser theory</li>
              <li>Continued learning</li>
              <li>Facilitating provider networking</li>
              <li>On-going clinical support for the life of your device</li>
              <li>Assistance with patient management</li>
              <li>Guidance with clinical expansion</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row col-12 m-0 p-0 py-lg-5 py-3" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="col-lg-6 col-12 py-sm-0 py-3 px-3 d-sm-none d-flex justify-content-center align-items-center m-0 p-0">
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
              Clinical confidence is key to providing excellent treatment experiences and results. Earn the trust of your patients, earn their word-of-mouth endorsements by delivering peak patient satisfaction, and market yourself with stellar in-house  before and afters.
              <br />
              <br />
              Our trainers are experienced providers and skilled teachers, educating you and your staff in a way that inspires maximum engagement and retention. Achieve ideal outcomes, avoid complications, and enjoy confidence while treating any patient type and aesthetic concern.
            </p>
          </div>
        </div>
        <div className="col-lg-6 col-12 px-3 d-sm-flex d-none justify-content-center align-items-center m-0 p-0">
          <div className="m-0 p-0">
            <Image
              className="w-100"
              src={SentientImage2}
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="row col-12 d-flex justify-content-center py-sm-5 py-3 p-0 m-0" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="px-3 d-flex justify-content-center m-0 p-0">
          <p className="sentient-contenttitle text-center" style={{ color: '#4DAC00' }}>
            Schedule your clinical training with us today
          </p>
        </div>
        <div className="w-100" />
        <div className="px-3 d-flex justify-content-center align-items-center flex-column pt-3 m-0 p-0">
          <div>
            <p className="sentient-contenttitle" style={{ fontSize: '24px' }}>Starting at $1500</p>
          </div>

          <Link href="/service/training-inquiry" passHref={true}>
            <a className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
              <p className="sentient-button sentient-footer text-center p-3" style={{ fontSize: '16px' }}>
                Schedule clinical training
              </p>
            </a>
          </Link>
        </div>
      </div>
    </div>
    </PageLayout>
  );
};

export default ClinicalTrain;
