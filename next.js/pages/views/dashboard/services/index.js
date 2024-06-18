import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import '@fontsource/dm-mono'; // Defaults to weight 400
import '@fontsource/dm-mono/400.css'; // Specify weight
import '@fontsource/dm-mono/400-italic.css'; // Specify weight and style
import Link from 'next/link';
import PageLayout from '../../../../src/layouts/PageLayout';

// **  Custom Components

const Service = () => {
  const location = useRouter();

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
      }, 500);
    }
  }, [location]);

  return (
    <PageLayout>
    <div className="w-100 pageTop">
      <title>Service</title>
      <div className="w-100 header-image servicepage-image m-0 p-0 d-sm-flex d-none align-items-center">
        <div className="col-lg-7 col-12 px-md-5 px-3">
          <h1 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Services
          </h1>
        </div>
      </div>
      {/* mobile */}
      <div className="w-100 header-image servicepage-mobileimage m-0 p-0 d-sm-none d-flex align-items-center">
        <div className="col-lg-7 col-12 px-sm-5 px-3">
          <h2 className="sentient-subtitle" style={{ color: '#FFFFFF' }}>
            Services
          </h2>
        </div>
      </div>

      <div className="w-100" />
      <div className="row col-12 py-sm-5 py-3 main-submenupos m-0 p-0" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="px-md-5 px-3 mt-1">
          <div className="col-12 sentient-dmmono p-0 d-sm-flex d-none">
            What we do at LaserTrader
          </div>

          <hr className="sentient-underline d-sm-flex d-none" />
          <div className="row col-12 m-0 p-0">
            <div className="col-lg-4 py-3 p-0">
              {/* <Link href="/service/repair" onClick={() => { window.scrollTo(0, 0); }}> */}
              <h3 className="sentient-contenttitle d-sm-flex d-none">
                Repair
              </h3>
              {/* mobile */}
              <h3 className="sentient-contenttitle d-sm-none d-flex">
                Repair your aesthetic device
              </h3>
              {/* </Link> */}
            </div>
            <div className="col-lg-8 col-12 py-sm-3 m-0 p-0">
              <div className="sentient-content" style={{ lineHeight: '140%' }}>
                When it comes to keeping your aesthetic devices in perfect working condition, LaserTrader by Sentient is the team you can trust to do it all and do it well.
                <br />
                <br />
                <ul className="m-0 p-0 px-3">
                  <li> Own a model no longer serviced by the OEM? We’ve got you covered.</li>
                  <li> Experiencing repeated device failure? We’ve got you covered.</li>
                  <li> Noticing diminished clinical efficacy? We’ve got you covered.</li>
                </ul>
                <br />
                Affordable, professional, and quality service that extends the life of your device, eliminates device downtime, and maintains profit margins.
                <br />
                <br />
                Protect your device and wallet even more with a 3 or 5 year Sentient Assured Protection Plan.
                <br />
                <br />
                <Link href="/service/repair" passHref onClick={() => window.scrollTo(0, 0)}>
                  <p className="sentient p-0" style={{ color: '#4DAC00', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}>Learn more</p>
                </Link>
                <Link href="/service/maintenance" passHref onClick={() => window.scrollTo(0, 0)}>
                  <p className="sentient p-0" style={{ color: '#4DAC00', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}>Contact us for repair</p>
                </Link>
              </div>
            </div>
          </div>

          <hr className="sentient-underline d-sm-flex d-none" />
          <div className="row col-12 m-0 p-0">
            <div className="col-lg-4 py-3 p-0">
              {/* <Link href="/service/financing" onClick={() => { window.scrollTo(0, 0); }}> */}
              <h3 className="sentient-contenttitle">
                Financing
              </h3>
              {/* </Link> */}
            </div>
            <div className="col-lg-8 col-12 py-sm-3 p-0">
              <div className="sentient-content" style={{ lineHeight: '140%' }}>
                LaserTrader by Sentient™ offers trade-in value for any of our Sentient Assured™ devices.
                <br />
                <br />
                In need of a finance solution that includes a loan? Assured Financial™ by Sentient® helps your practice scale and prosper. We offer quick approvals, flexible terms and rates—as low as 0% for up to 24 months—and we consider all credit profiles. Whether a large and established brand or small and local start up, Assured Financial works with you at every stage of your business.
                <br />
                <br />
                <Link href="/service/financing" passHref onClick={() => window.scrollTo(0, 0)}>
                  <p className="sentient-content p-0" style={{ color: '#4DAC00', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}>Learn more</p>
                </Link>
                <a href="http://Assuredfinancial.co/" onClick={() => window.scrollTo(0, 0)} target="_blank" rel="noreferrer">
                  <p className="sentient-content p-0" style={{ color: '#4DAC00', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}>Apply for financing</p>
                </a>
              </div>
            </div>
          </div>

          <hr className="sentient-underline d-sm-flex d-none" />
          <div className="row col-12 m-0 p-0">
            <div className="col-lg-4 py-3 p-0">
              {/* <Link href="/service/clinical-training" onClick={() => { window.scrollTo(0, 0); }}> */}
              <h3 className="sentient-contenttitle">
                Clinical Training
              </h3>
              {/* </Link> */}
            </div>
            <div className="col-lg-8 col-12 py-sm-3 p-0">
              <div className="sentient-content" style={{ lineHeight: '140%' }}>
                Not experienced with the pre-owned technology you’re purchasing from LaserTrader by Sentient? We offer world-class clinical training with the most experienced trainers in the industry, either virtually or in-person. Our clinical education covers both basic and advanced protocols, empowering you to confidently use your devices.
                <br />
                <br />
                <Link href="/service/clinical-training" passHref onClick={() => { window.scrollTo(0, 0); }}>
                  <p className="sentient-content p-0" style={{ color: '#4DAC00', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}>Learn more</p>
                </Link>
                <Link href="/service/training-inquiry" passHref onClick={() => window.scrollTo(0, 0)}>
                  <p className="sentient-content p-0" style={{ color: '#4DAC00', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}>Schedule clinical training</p>
                </Link>
              </div>
            </div>
          </div>

          <hr className="sentient-underline d-sm-flex d-none" />
          <div className="row col-12 m-0 p-0">
            <div className="col-lg-4 py-3 p-0">
              {/* <Link href="/service/practice-development" onClick={() => { window.scrollTo(0, 0); }}> */}
              <h3 className="sentient-contenttitle">
                Practice Development
              </h3>
              {/* </Link> */}
            </div>
            <div className="col-lg-8 col-12 py-sm-3 p-0">
              <div className="sentient-content" style={{ lineHeight: '140%' }}>
                LaserTrader by Sentient is invested in the success of our customers. We’re more than just aesthetic device brokers—we want to partner with you and help grow your business, with expert guidance and a breadth of aesthetic industry experience.
                <br />
                <br />
                Our Assured Development team meets with you and evaluates your practice needs, offering personalized advice and solutions. We also offer a wide range of resources and customizable tools on our provider portal to support you in your growth and expansion.
                <br />
                <br />
                <Link href="/service/practice-development" passHref onClick={() => { window.scrollTo(0, 0); }}>
                  <p className="sentient-content p-0" style={{ color: '#4DAC00', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}>Learn more</p>
                </Link>
                <a
                  className="sentient-content p-0 navbar-brand"
                  href="mailto:assureddevelopment@sentientlasers.com"
                  style={{ textDecoration: 'underline', color: '#4DAC00', whiteSpace: 'break-spaces' }}
                >
                  <b> Contact our Practice Development team.</b>
                </a>
              </div>
            </div>
          </div>

          <hr className="sentient-underline d-sm-flex d-none" />
          <div className="row col-12 m-0 p-0">
            <div className="col-lg-4 py-3 p-0">
              {/* <Link href="/service/practice-development" onClick={() => { window.scrollTo(0, 0); }}> */}
              <h3 className="sentient-contenttitle">
                Device Certification
              </h3>
              {/* </Link> */}
            </div>
            <div className="col-lg-8 col-12 py-sm-3 p-0">
              <div className="sentient-content" style={{ lineHeight: '140%' }}>
                When selling, Assured certification is one of the best ways to ensure you receive the most value for your system. This 20-point inspection process confirms your system is up to the manufacturer’s specifications, allowing you to sell your used aesthetic laser at a higher price point than a typical pre-owned system.
                <br />
                <br />
                <Link href="/about#devicecertification" passHref onClick={() => { window.scrollTo(0, 0); }}>
                  <p className="sentient-content p-0" style={{ color: '#4DAC00', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}>Learn more</p>
                </Link>
                <Link href="/service/assuredcertification" passHref onClick={() => { window.scrollTo(0, 0); }}>
                  <p className="sentient-content p-0" style={{ color: '#4DAC00', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}>Contact us to certify your aesthetic device</p>
                </Link>
              </div>
            </div>
          </div>

          <hr className="sentient-underline d-sm-flex d-none" />
          <div className="row col-12 m-0 p-0">
            <div className="col-lg-4 py-3 p-0">
              {/* <Link href="/service/practice-development" onClick={() => { window.scrollTo(0, 0); }}> */}
              <h3 className="sentient-contenttitle">
                Warranty
              </h3>
              {/* </Link> */}
            </div>
            <div className="col-lg-8 col-12 py-sm-3 p-0">
              <div className="sentient-content" style={{ lineHeight: '140%' }}>
                Sentient Assured devices sold by LaserTrader come with a standard 30 day warranty.
                <br />
                <br />
                Ensure the performance of your device even further with ar 1, 3, or 5 year Sentient Assured Protection Plan (SAPP) with coverage on all warranty parts and labor and a multitude of savings and benefits.
                <br />
                <br />
                <Link href="/service/repair#protectionPlans" passHref onClick={() => { window.scrollTo(0, 0); }}>
                  <p className="sentient-content p-0" style={{ color: '#4DAC00', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}>Learn more</p>
                </Link>
                <Link href="/service/warranty" passHref onClick={() => { window.scrollTo(0, 0); }}>
                  <p className="sentient-content p-0" style={{ color: '#4DAC00', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}>Contact our team about extended warranties</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageLayout>
  );
};

export default Service;
