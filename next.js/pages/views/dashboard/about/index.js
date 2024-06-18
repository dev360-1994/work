import rightArrow from '@src/assets/images/pages/landing/right-arrow.png';
import Alma from '@src/assets/images/pages/about/AlmaSoprano.png';
import BTL from '@src/assets/images/pages/about/BTLEmsella.png';
import SentientAssured from '@src/assets/images/pages/about/SentientAssured.png';
import SentientSundance from '@src/assets/images/pages/about/Laser Trader Header.png';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import '@fontsource/dm-mono'; // Defaults to weight 400
import '@fontsource/dm-mono/400.css'; // Specify weight
import '@fontsource/dm-mono/400-italic.css'; // Specify weight and style
import Link from 'next/link';
import Image from 'next/image';
import PageLayout from '@src/layouts/PageLayout';

const About = () => {
  const router = useRouter();

  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (router.hash) {
      setTimeout(() => {
        const element = document.querySelector(router.hash);
        if (element) {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const elementTop = element.getBoundingClientRect().top + scrollTop;
          const offset = window.innerHeight / 2 - element.offsetHeight / 2;
          const scrollToPosition = elementTop - offset - 250;

          window.scrollTo({
            top: scrollToPosition,
            behavior: 'smooth',
          });
        }
      }, 500);
    }
  }, [router]);

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
    <div className="pageTop">
      <div className="w-100 header-image about-image m-0 p-0 d-sm-flex d-none align-items-center">
        <div className="col-lg-7 col-12 px-sm-5 px-2">
          <h1 className="sentient-title" style={{ color: '#FFFFFF' }}>
            About us
          </h1>
        </div>
      </div>
      {/* mobile */}
      <div className="w-100 header-image about-mobileimage m-0 p-0 d-sm-none d-flex align-items-center">
        <div className="col-lg-7 col-12 px-sm-5 px-2">
          <h2 className="sentient-title" style={{ color: '#FFFFFF' }}>
            About us
          </h2>
        </div>
      </div>

      <div className="row col-12 m-0 p-0" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="row col-12 m-0 p-0">
          <div className="col-lg-6 col-12 mt-md-5 mt-3 px-sm-5 px-3 m-0 p-0 d-flex align-items-center justify-content-center flex-column">
            <div className="m-0 p-0 pt-3">
              <h3 className="sentient-contenttitle text-left">
                The LaserTrader.com Legacy
              </h3>
              <br />
              <p className="sentient-content text-left">
                The LaserTrader.com has been an established online marketplace for buying and selling pre-owned aesthetic devices since 2002. Acquired by Sentient in 2018, LaserTrader by Sentient maintains the legacy of connecting sellers directly with buyers and has expanded its services and reach—we now offer pre-owned devices with all the perks and none of the deceptive practices typical of original equipment manufacturers (OEMs).
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-12 px-sm-3 mt-md-5 mt-3 m-0 p-0 d-flex justify-content-center align-items-center">
            <div className="d-flex">
              <Image
                className="w-100"
                src={Alma}
                alt=""
              />
            </div>
            <div className="d-flex">
              <Image
                className="w-100"
                src={BTL}
                alt=""
              />
            </div>
          </div>
        </div>

        <div className="row col-12 pt-md-5 pt-3 pb-3 m-0 p-0">
          <div className="col-lg-6 col-12 px-3 m-0 p-0 d-flex justify-content-center align-items-center">
            <div className="">
              <Image
                className="w-100 p-sm-5"
                src={SentientAssured}
                alt=""
              />
            </div>
          </div>
          <div id="buysentientassured" className="col-lg-6 col-12 px-sm-5 px-3 p-0 m-0 d-flex align-items-center justify-content-center flex-column">
            <div className="m-0 p-0">
              <h3 className="sentient-contenttitle text-left">
                Buying Sentient Assured®
              </h3>
              <br />
              <p className="sentient-content text-left">
                Buying new can can be expensive and add stressful monthly payments. Buying pre-owned from the open market can be unreliable and leave you without service or support. Buying a Sentient Assured device combines the benefits of buying pre-owned with the advantages of buying new.
                <br />
                <br />
                Search for devices with the Assured certification on our open market platform, or purchase Assured + devices directly from the LaserTrader to benefit from post-sale support. Consult with our team to find the device that best fits your wants and needs. We serve our clients without brand allegiance.
                <br />
                <br />
                <Link 
                  href="/products?type=bluedot" 
                  passHref 
                  className="navbar-brand align-items-center" 
                  style={{ color: '#000000' }} onClick={() => window.scrollTo(0, 0)}
                >
                  <div className="d-flex align-items-end" style={{ cursor: 'pointer'}}>
                    <span className="sentient-content" style={{ fontWeight: '700', whiteSpace: 'break-spaces', textDecoration: 'underline', wordBreak: 'break-word' }}>
                      Check out all our Sentient Assured and
                      <br />
                      LaserTrader Certified inventory by clicking here&nbsp;
                    </span>
                    <Image src={rightArrow} width={25} height={25} alt="rightarrow" />                    
                  </div>                  
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row col-12 py-sm-5 py-3 m-0 p-0" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="row col-12 px-md-3 px-2 m-0 p-0">
          <div className="col-lg-4 col-12 m-0 ">
            <h4 className="sentient-subtitle text-center pb-1" style={{ wordBreak: 'break-word'}}>Our offerings</h4>
            <br />
            <p className="sentient-content text-center mb-5" style={{ fontSize: '24px', fontWeight: '700' }}>
              Field Service and Repair
              <br />
              <br />
              Financing
              <br />
              <br />
              Clinical Training
              <br />
              <br />
              Practice Development
              <br />
              <br />
              30 Day Warranty
              <br />
              <br />
              Protection Plans
              <br />
              <br />
              Professional Installation
            </p>
          </div>
          <div className="col-lg-4 col-12 pb-1">
            <Link href="/products" passHref>
              <a className="nav-link d-flex justify-content-center" onClick={() => window.scrollTo(0, 0)}>
                <p className="sentient-gradientgreenbtn px-3 p-1 d-flex" style={{ cursor: 'pointer', fontSize: '24px', color: '#FFF' }}>
                  Assured Devices
                </p>
              </a>
            </Link>
            <br />
            <p className="sentient-contenttitle mb-5 text-center" style={{ fontSize: '24px', color: '#4DAC00' }}>
              Available
              <br />
              <br />
              Available
              <br />
              <br />
              Available
              <br />
              <br />
              N/A
              <br />
              <br />
              N/A
              <br />
              <br />
              Available
              <br />
              <br />
              Available
            </p>
          </div>
          <div className="col-lg-4 col-12 pb-sm-5 pb-3 m-0 p-0">
            <Link href="/products?type=bluedot" passHref>
              <a className="nav-link d-flex justify-content-center" onClick={() => window.scrollTo(0, 0)}>
                <p className="sentient-gradientbluebtn px-3 p-1 d-flex" style={{ cursor: 'pointer', fontSize: '24px', color: '#FFF' }}>
                  Assured+ Devices
                </p>
              </a>
            </Link>
            <br />
            <p className="sentient-contenttitle mb-2 text-center" style={{ color: '#0A2FFF', fontSize: '24px' }}>
              Available
              <br />
              <br />
              Available
              <br />
              <br />
              Available
              <br />
              <br />
              Include
              <br />
              <br />
              Include
              <br />
              <br />
              Available
              <br />
              <br />
              Available
            </p>
          </div>
        </div>

        <div id="devicecertification" className="row py-md-5 py-3 col-12 px-sm-5 px-3 m-0 p-0" style={{ backgroundColor: '#FAF9F6' }}>
          <h3 className="sentient-subtitle col-md-10 col-12 mb-3 d-sm-flex d-none p-0">What’s included in the Sentient Assured Certification? The 20-point inspection</h3>
          {/* mobile */}
          <h3 className="sentient-contenttitle col-md-10 col-12 mb-3 d-sm-none d-flex p-0">What’s included in the Sentient Assured Certification? The 20-point inspection</h3>
          <div className="w-100" />

          <div className="col-lg-4 col-12 m-0 p-0">
            <hr className="sentient-underline mb-2" />
            <h4 className="sentient-contenttitle pt-3 " style={{ fontSize: '24px', color: '#0A2FFF' }}>Cleaning & Refurbishing</h4>
            <br />
            <p className="sentient-content mb-2">
              Clean all dust from the interior of the machine
              <br />
              <br />
              Clean or replace air filters
              <br />
              <br />
              Flush and refill the coolant system
              <br />
              <br />
              Replace water filters and de-ionizing cartridges
              <br />
              <br />
              Replace any damaged optics with OEM or equivalent parts
              Clean all laser and delivery system optics
              <br />
              <br />
              Refurbish laser cavity components as needed to meet manufacturer energy specifications
              <br />
              <br />
              Refurbish handpieces and reset pulse counters
            </p>
          </div>
          <div className="col-lg-4 col-12 px-lg-3 m-0 p-0">
            <hr className="sentient-underline mb-2" />
            <h4 className="sentient-contenttitle pt-3 " style={{ fontSize: '24px', color: '#0A2FFF' }}>Testing & Calibration</h4>
            <br />
            <p className="sentient-content mb-2">
              Test and calibrate all power supplies
              <br />
              <br />
              Align laser to articulated arm or fiber optic delivery systems
              <br />
              <br />
              Calibrate output energy using OEM specific procedures and test equipment
              <br />
              <br />
              Document Proof of Calibration for machineand handpieces
              <br />
              <br />
              Calibrate Touch Screens
              <br />
              <br />
              Ensure exterior of the machine is in good mechanical and cosmetic condition
              <br />
              <br />
              Run device for a minimum of 24 hours for final testing after all refurbishment is completed
              <br />
              <br />
              Produce photo and video documentation of the device in operation
            </p>
          </div>
          <div className="col-lg-4 col-12 m-0 p-0">
            <hr className="sentient-underline mb-2" />
            <h4 className="sentient-contenttitle pt-3" style={{ fontSize: '24px', color: '#0A2FFF' }}>Shipping & Support</h4>
            <br />
            <p className="sentient-content mb-2">
              Drain all water from the device and handpieces to prevent freezing during shipping
              <br />
              <br />
              Provide refill kit and support numbers for a refill of the device upon delivery
              <br />
              <br />
              Professionally package, crate, and ship device and all accessories
              <br />
              <br />
              Follow up with support for setup and installation of equipment
            </p>
          </div>

          <div className="w-100" />
          <div className="row col-12 pt-md-5 pt-3 p-0 m-0 d-flex justify-content-center">
            <div className="m-0 p-0">
              <Link href="/service/assuredcertification" passHref>
                <a className="navbar-brand d-flex justify-content-center" onClick={() => window.scrollTo(0, 0)}>
                  <p className="sentient-button sentient-footer px-4 p-2">
                    Certify Now
                  </p>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row px-sm-5 px-3 py-sm-3 py-2 col-12 m-0 p-0" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="row col-12 m-0 p-0">
          <div className="col-lg-6 col-12 p-0 m-0 d-flex align-items-center justify-content-center flex-column">
            <div className="m-0 p-0">
              <h3 className="sentient-subtitle text-left" style={{ color: '#4DAC00' }}>
                Sell Your Device
              </h3>
              <br />
              <p className="sentient-content text-left">
                LaserTrader by Sentient purchases aesthetic devices for cash, promising a hassle-free transaction handled by the LaserTrader team. If you want to handle the process on your own, LaserTrader operates an open market platform to list your device.
                <br />
                <br />
                Additionally, the Assured certification is often selected by sellers on our open market to instill confidence in buyers and increase the value of their device.
                <br />
                <br />
                <Link href="/contact-us?s=1" passHref >
                  <a className="navbar-brand align-items-center pt-2 d-flex justify-content-center" style={{ color: '#000000' }} onClick={() => window.scrollTo(0, 0)}>
                    <span className="sentient-button sentient-footer px-4 p-2" style={{ fontWeight: '700', whiteSpace: 'break-spaces' }}>
                      Sell Now
                    </span>
                  </a>                  
                </Link>
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-12 px-sm-3 px-2 p-0 m-0 d-flex align-items-center justify-content-center flex-column">
            <Image
              className="w-100 px-sm-3"
              src={SentientSundance}
              alt=""
            />
          </div>
        </div>

        <div className="d-flex justify-content-center flex-column pt-sm-5 pt-3">
          <div className="col-12 mt-md-3 mt-2 m-0 p-0">
            <h3 className="sentient-contenttitle text-center">
              Looking to manage the process on your own?
            </h3>
          </div>
          <div className="w-100" />
          <br />
          <div className="col-12 m-0 p-0">
            <p className="sentient-content text-center" style={{ fontSize: '20px' }}>
              We also empower providers to buy and sell between themselves on our open market platform.
            </p>
          </div>
          <div className="w-100" />
          <div className="row col-12 pt-md-3 pt-1 pb-md-5 pb-3 p-0 m-0 d-flex justify-content-center">
            <div className="m-0 p-0">
              <Link href="/sell/listdevice" passHref >
                <a className="navbar-brand d-flex justify-content-center" onClick={() => window.scrollTo(0, 0)}>
                  <p className="sentient-button sentient-footer px-3 p-2">
                    List Now
                  </p>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
    </PageLayout>
  );
};

export default About;
