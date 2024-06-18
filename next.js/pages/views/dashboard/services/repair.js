import { useEffect, useState } from 'react';

import AssuedProtection from '@src/assets/images/pages/repair/AssuedProtection.png';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import PageLayout from '../../../../src/layouts/PageLayout';
// **  Custom Components

const Repair = () => {
  const location = useRouter();

  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
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
  }, [location]);

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
      <div className="w-100 header-image repairpage-image m-0 p-0 d-sm-flex d-none align-items-center">
        <div className="col-lg-7 col-12 px-md-5 px-3">
          <h1 className="sentient-title" style={{ color: 'white' }}>
            Repair
          </h1>
        </div>
      </div>
      {/* mobile */}
      <div className="w-100 header-image repairpage-mobileimage m-0 p-0 d-sm-none d-flex align-items-center">
        <div className="col-12 px-3">
          <h1 className="sentient-subtitle" style={{ color: 'white' }}>
            Repair
          </h1>
        </div>
      </div>
      <div className="w-100" />

      <div className="row w-100 py-md-5 py-2 m-0" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="col-lg-6 col-12 px-md-5 px-3 m-0 p-0">
          <p className="sentient-contenttitle">
            At LaserTrader by Sentient, we offer a complete range of repair services designed to address the diverse needs of our clients in the aesthetic device industry.
          </p>
        </div>
        <div className="col-lg-6 col-12 px-md-5 px-3 pt-sm-0 pt-2 m-0 p-0">
          <p className="sentient-contenttitle " style={{ fontWeight: '400', fontSize: '24px' }}>
            Our highly skilled and certified technicians utilize their extensive knowledge and experience to provide prompt, efficient, cost-effective and reliable solutions for all types of aesthetic technologies, ensuring your business continues operating smoothly with minimal device downtime.
          </p>
          <div className="m-0 p-0 pt-3 ">
            <Link href="/service/maintenance" passHref>
              <a className="navbar-brand d-flex justify-content-start" onClick={() => window.scrollTo(0, 0)}>
                <p className="sentient-button sentient-footer  px-4 p-2" style={{ fontSize: '16px' }}>
                  Contact us to learn more
                </p>
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="row col-12 px-md-5 px-3 py-md-5 py-2 m-0 p-0" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="col-12 sentient-dmmono p-0 pb-2 d-sm-flex d-none">
          LaserTrader Repair Services
        </div>
        <hr className="col-12 m-0 p-0 mt-1 sentient-underline d-sm-flex d-none" />

        <div className="offset-xl-2 col-xl-10 col-12 mt-3 p-0">
          <div className="row col-12 m-0 p-0">
            <div className="col-lg-4 py-3 p-0">
              <h3 className="sentient-contenttitle">
                Preventive Maintenance
              </h3>
            </div>
            <div className="col-lg-8 col-12 py-sm-3 p-0">
              <p className="sentient-content">
                To prolong the lifespan of your laser equipment and maintain optimal performance, we offer preventive maintenance services, including regular inspections, cleaning, and replacement of worn components. You can reduce the risk of unexpected equipment failure and costly downtime by scheduling routine maintenance.
              </p>
            </div>
          </div>
        </div>

        <hr className="col-12 m-0 p-0 sentient-underline d-sm-flex d-none" />
        <div className="offset-xl-2 col-xl-10 col-12 mt-3 p-0">
          <div className="row col-12 m-0 p-0">
            <div className="col-lg-4 col-12 py-3 p-0">
              <h3 className="sentient-contenttitle">
                Diagnostics & Troubleshooting
              </h3>
            </div>
            <div className="col-lg-8 col-12 py-sm-3 p-0">
              <p className="sentient-content">
                Our technicians are experts at identifying the root cause of device and equipment issues, whether they involve software, electrical, or mechanical components. By conducting thorough diagnostics and troubleshooting, we can pinpoint the source of the problem and recommend appropriate corrective measures.
              </p>
            </div>
          </div>
        </div>

        <hr className="col-12 m-0 p-0 sentient-underline d-sm-flex d-none" />
        <div className="offset-xl-2 col-xl-10 col-12 mt-3 p-0">
          <div className="row col-12 m-0 p-0">
            <div className="col-lg-4 py-3 p-0">
              <h3 className="sentient-contenttitle">
                Component-Level Repairs
              </h3>
            </div>
            <div className="col-lg-8 col-12 py-sm-4 p-0">
              <p className="sentient-content">
                We specialize in component-level repairs, including replacing faulty or damaged parts, repairing circuit boards, and re-calibrating laser systems. Our technicians use state-of-the-art tools and equipment to restore your laser devices to optimal performance levels.
              </p>
            </div>
          </div>
        </div>

        <hr className="col-12 m-0 p-0 sentient-underline d-sm-flex d-none" />
        <div className="offset-xl-2 col-xl-10 col-12 mt-3 p-0">
          <div className="row col-12 m-0 p-0">
            <div className="col-lg-4 py-3 p-0">
              <h3 className="sentient-contenttitle">
                System Upgrades & Refurbishment
              </h3>
            </div>
            <div className="col-lg-8 col-12 py-sm-3  p-0">
              <p className="sentient-content">
                To enhance the performance and functionality of your laser equipment, we offer system upgrades and refurbishment services. These may include software updates, hardware upgrades, or the integration of new features to improve the efficiency and versatility of your devices.
              </p>
            </div>
          </div>
        </div>

        <hr className="col-12 m-0 p-0 sentient-underline d-sm-flex d-none" />
        <div className="offset-xl-2 col-xl-10 col-12 mt-3 p-0">
          <div className="row col-12 m-0 p-0">
            <div className="col-lg-4 py-3 p-0">
              <h3 className="sentient-contenttitle">
                Emergency Repairs
              </h3>
            </div>
            <div className="col-lg-8 col-12 py-sm-3 p-0">
              <p className="sentient-content">
                Our emergency repair services are designed to provide prompt and practical solutions in case of a critical equipment failure. Our technicians diagnose and resolve the issue quickly, minimizing downtime and ensuring your business operations remain uninterrupted.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row col-12 px-lg-5 px-3 pt-sm-5 pt-2 m-0 p-0" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="row col-12 pb-2 m-0 p-0">
          <div className="col-xl-9 col-12 py-2 m-0 p-0">
            <p className="sentient-subtitle d-sm-flex d-none ">
              Why choose LaserTrader by Sentient for your laser repair needs?
            </p>
            {/* mobile */}
            <p className="sentient-contenttitle d-sm-none d-flex">
              Why choose LaserTrader by Sentient for your laser repair needs?
            </p>
          </div>
          <div className="w-100 mb-2" />
          <div className="col-lg-4 col-12 pb-2 m-0 p-0">
            <div className="sentient-repaire-pan sentient-general-pan py-1 d-flex justify-content-center flex-column align-items-center">
              <h3 className="sentient-contenttitle p-1 text-center" style={{ color: '#4DAC00' }}>
                Expertise
              </h3>
              <p className="sentient-content px-3 text-center">
                Our team of certified technicians has extensive experience in aesthetic device repair, ensuring that your equipment is in safe hands.
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-12 pb-2 px-lg-3 m-0 p-0">
            <div className="sentient-repaire-pan sentient-general-pan py-1 d-flex justify-content-center flex-column align-items-center">
              <h3 className="sentient-contenttitle p-1 text-center" style={{ color: '#4DAC00' }}>
                Quality Service
              </h3>
              <p className="sentient-content px-3 text-center">
                We are committed to providing top-of-the-line repair services, adhering to the highest industry standards, and using only original or approved replacement parts.
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-12 pb-2 m-0 p-0">
            <div className="sentient-repaire-pan sentient-general-pan py-1 d-flex justify-content-center flex-column align-items-center">
              <h3 className="sentient-contenttitle p-1 text-center" style={{ color: '#4DAC00' }}>
                Rapid Response
              </h3>
              <p className="sentient-content px-3 text-center">
                We know the importance of minimizing downtime in the aesthetic care industry and strive to provide prompt and efficient solutions to address your repair needs.
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-12 pb-2 m-0 p-0">
            <div className="sentient-repaire-pan sentient-general-pan py-1 d-flex justify-content-center flex-column align-items-center">
              <h3 className="sentient-contenttitle p-1 text-center" style={{ color: '#4DAC00' }}>
                Transparent Pricing
              </h3>
              <p className="sentient-content px-3 text-center">
                We offer fair and competitive pricing for our repair services, with no hidden fees or surprises, allowing you to make informed decisions for your business.
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-12 pb-2 px-lg-3 m-0 p-0">
            <div className="sentient-repaire-pan sentient-general-pan py-1 d-flex justify-content-center flex-column align-items-center">
              <h3 className="sentient-contenttitle p-1 text-center" style={{ color: '#4DAC00' }}>
                Customer Support
              </h3>
              <p className="sentient-content px-3 text-center">
                Our dedicated customer support team is available to assist you with any questions or concerns that may arise during the repair process, ensuring a seamless and hassle-free experience.
              </p>
            </div>
          </div>
        </div>

        <div id="protectionPlans" className="row col-12 py-lg-5 py-3 m-0 p-0">
          <div className="col-lg-9 col-12 m-0 p-0">
            <p className="sentient-subtitle d-sm-flex d-none">
              Protect your device and your wallet with Sentient Assured Protection Plans
            </p>
            {/* mobile */}
            <p className="sentient-contenttitle d-sm-none d-flex">
              Protect your device and your wallet with Sentient Assured Protection Plans
            </p>
          </div>
          <div className="w-100" />
          <div className="col-lg-6 col-12 d-sm-none d-flex flex-column align-items-center">
            <div className="d-flex m-0 p-0">
              <Image
                className="w-100"
                src={AssuedProtection}
                alt=""
              />
            </div>
          </div>
          <div className="col-lg-6 col-12 p-0 m-0">
            <p className="sentient-contenttitle text-left py-3 " style={{ fontWeight: '400', fontSize: '24px' }}>
              The 1, 3- or 5-year Sentient Assured Protection plans offer the most affordable, hassle-free assurance of operational efficiency for your device. Save 40-70% on service plans as compared to OEM pricing.
            </p>
            <p className="sentient-content text-left">
              <b>1,3- OR 5-Year Sentient Assured Protection Plan (SAPP) Benefits:</b>
            </p>
            <ul className="sentient-content m-0 p-0 px-3" style={{ lineHeight: '2' }}>
              <li>Coverage options up to 5-Years on all warranty parts & labor</li>
              <li>Onsite preventative maintenance (PM) at beginning of each contract year (value $4,500/year/device)</li>
              <li>20% off additional repairs (eg, if you drop and break a piece)</li>
              <li>20% off user-replaceable consumables that can be supplied by Sentient Lasers</li>
              <li>Onsite service performed at your location when possible</li>
              <li>Monthly payment plan</li>
            </ul>

            <div className="w-100" />
            <div className="row col-12 pt-md-3 pt-1 pb-md-5 pb-3 p-0 m-0">
              <div className="m-0 p-0">
                <Link href="/service/warranty" passHref>
                  <a className="navbar-brand d-flex justify-content-start" onClick={() => window.scrollTo(0, 0)}>
                    <p className="sentient-button sentient-footer px-3 p-3">
                      Protect your device today
                    </p>
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-12 d-sm-flex d-none flex-column align-items-center">
            <div className="d-flex m-0 p-0">
              <Image
                className="w-100"
                src={AssuedProtection}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row col-12 m-0 p-0" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="offset-md-1 col-md-10 col-12">
          <div className="col-12 mt-md-5 mt-3">
            <h3 className="sentient-contenttitle text-center" style={{ color: '#4DAC00' }}>
              For expert repair services tailored to meet the needs of your aesthetic business, trust LaserTrader by Sentient.
            </h3>
          </div>
          <div className="w-100" />
          <br />
          <div className="col-12 m-0 p-0">
            <p className="sentient-content text-center d-sm-flex d-none align-items-center justify-content-center" style={{ fontSize: '24px' }}>
              <b>Contact us today to learn how we can help keep your equipment running at peak performance.</b>
            </p>
            {/* mobile */}
            <p className="sentient-content text-center d-sm-none d-flex">
              Contact us today to learn how we can help keep your equipment running at peak performance.
            </p>
          </div>
          <div className="w-100" />
          <div className="row col-12 mt-md-5 mt-3 mb-lg-5 mb-2 p-0 m-0 d-flex justify-content-center">
            <div className="m-0 p-0">
              <Link href="/service/maintenance" passHref>
                <a className="navbar-brand d-flex justify-content-center" onClick={() => window.scrollTo(0, 0)}>
                  <p className="sentient-button sentient-footer px-3 p-2">
                    Contact us today
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

export default Repair;
