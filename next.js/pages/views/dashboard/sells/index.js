import BTL from '@src/assets/images/pages/sell/BTLEmsella.png';
import AdobeStock1 from '@src/assets/images/pages/sell/AdobeStock1.png';
import AdobeStock2 from '@src/assets/images/pages/sell/AdobeStock2.png';

import { useEffect, useState } from 'react';

import '@fontsource/dm-mono'; // Defaults to weight 400
import '@fontsource/dm-mono/400.css'; // Specify weight
import '@fontsource/dm-mono/400-italic.css'; // Specify weight and style
import Link from 'next/link';
import Image from 'next/image';
import PageLayout from '@src/layouts/PageLayout';

// **  Custom Components

const Sell = () => {
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
    <div className="pageTop">
      <div className="w-100 header-image sellpage-image m-0 p-0 d-sm-flex d-none align-items-center">
        <div className="col-lg-7 col-12 px-sm-5 px-3">
          <h1 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Sell
          </h1>
        </div>
      </div>
      {/* mobile */}
      <div className="w-100 header-image sellpage-mobileimage m-0 p-0 d-sm-none d-flex align-items-center">
        <div className="col-lg-7 col-12 px-sm-5 px-3">
          <h2 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Sell
          </h2>
        </div>
      </div>

      <div className="row m-0 p-0 col-12 p-lg-5 p-3" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="col-lg-4 col-12 mt-3 ">
          <Link href="/sell/listdevice" passHref className="" onClick={() => window.scrollTo(0, 0)}>
            <div
              className="sentient-slide-pan sentient-general-pan py-1 d-flex justify-content-center flex-column"
            >
              <h2 className="sentient-contenttitle text-center px-3">
                Sell your device for cash
              </h2>
              <br />
              <p className="sentient-content px-xl-5 px-3 text-center" style={{ wordBreak: 'break-word' }}>
                LaserTrader by Sentient turns your device into cash quickly, without the hassle of looking for a buyer
              </p>
            </div>
          </Link>
        </div>
        <div className="col-lg-4 col-12 mt-3 ">
          <Link href="/sell/listdevice" passHref className="" onClick={() => window.scrollTo(0, 0)}>
            <div className="sentient-slide-pan sentient-general-pan py-1 d-flex justify-content-center flex-column">
              
                <h3 className="sentient-contenttitle text-center px-3">
                  List your device on the open market
                </h3>
                <br />
                <p className="sentient-content px-3 text-center">
                  You can list your device and connect with buyers on our open market platform.
                </p>
            </div>
          </Link>
        </div>
        <div className="col-lg-4 col-12 mt-3 ">
          <Link href="/service/assuredcertification" passHref className="" onClick={() => window.scrollTo(0, 0)}>
            <div className="sentient-slide-pan sentient-general-pan py-1 d-flex justify-content-center flex-column">
              <h3 className="sentient-contenttitle text-center px-3">
                  Interested in making your device more valuable?
                </h3>
                <br />
                <p className="sentient-content px-3 text-center">
                  Contact us to learn more about the Assured certification and how we can help you sell your device.
                </p>
            </div>
          </Link>
        </div>
      </div>
      <div className="row col-12 pt-5 m-0 p-0" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="row col-12 m-0 p-0">
          <div className="col-12 px-md-5 px-3  m-0 p-0">
            <h3 className="sentient-subtitle justify-content-center d-sm-flex d-none">
              Steps to help you sell your aesthetic device
            </h3>
            {/* mobile */}
            <h3 className="sentient-contenttitle justify-content-center d-sm-none d-flex p-0">
              Steps to help you sell your aesthetic device
            </h3>
          </div>
          <div className="col-lg-6 col-12 my-md-5 my-2 px-md-5 px-3 m-0 p-0">
            <div className="d-flex">
              <Image
                className="w-100"
                src={AdobeStock1}
                alt=""
              />
            </div>
          </div>
          <div className="col-lg-6 col-12 py-md-5 py-1 px-md-5 px-3 d-flex align-items-center justify-content-center flex-column">
            <div className="m-0 p-0">
              <h3 className="sentient-contenttitle col-sm-10 col-12 p-0 text-left">
                Determining the Value of Your Aesthetic Device
              </h3>
              <br />
              <p className="sentient-content text-left">
                Before you can sell your aesthetic device, it’s crucial to determine its value, which doesn’t necessarily reflect the amount you paid for it or what you still owe. Various factors can influence the value of your device, including its age, condition, manufacturer, and model. You can begin to learn the market value of similar equipment by researching the open market (Ebay, Craigslist, and Facebook) to get an idea of the price range to expect. Additionally, consider getting an appraisal from a certified professional like The LaserTrader to accurately determine the value of your device.
              </p>
            </div>
          </div>
        </div>

        <div className="row col-12 m-0 p-0">
          <div className="col-lg-6 col-12 my-md-5 my-3 px-md-5 px-3 m-0 p-0 d-sm-none d-flex">
            <div className="col-12 m-0 p-0">
              <Image
                className="w-100"
                src={AdobeStock2}
                alt=""
              />
            </div>
          </div>
          <div className="col-lg-6 col-12 px-md-5 px-3 d-flex justify-content-center flex-column">
            <h3 className="sentient-contenttitle text-left">
              Preparing Your Aesthetic Device for Sale
            </h3>
            <br />
            <p className="sentient-content text-left">
              Once you’ve determined the maximum value of your aesthetic laser, the next step is to prepare it for sale. You’ll need to clean the equipment, ensure all parts are in good condition, and perform any necessary repairs. High-quality photos of the equipment from different angles will showcase its features and condition, helping potential buyers better understand what they’re purchasing and increasing the chances of a successful sale for the highest price.
            </p>
          </div>
          <div className="col-lg-6 col-12 my-md-5 my-3 px-md-5 px-3 m-0 p-0 d-sm-flex d-none">
            <div className="col-12 m-0 p-0">
              <Image
                className="w-100"
                src={AdobeStock2}
                alt=""
              />
            </div>
          </div>
        </div>

        <div className="row col-12 m-0 p-0">
          <div className="col-lg-6 col-12 my-md-5 my-3 px-md-5 px-3">
            <div className="d-flex">
              <Image
                className="w-100"
                src={BTL}
                // style={{ backgroundSize: 'cover', width: 'auto', borderRadius: '16px' }}
                alt=""
              />
            </div>
          </div>
          <div className="col-lg-6 col-12 my-md-5 my-3 px-md-5 px-3 d-flex align-items-center justify-content-center flex-column">
            <div className="">
              <h3 className="sentient-contenttitle col-10 p-0 text-left">
                Finding a Buyer for Your Aesthetic Device
              </h3>
              <br />
              <p className="sentient-content text-left">
                You have an idea of your aesthetic device’s value, and it’s in top condition and ready for sale, now we need to find a buyer. There are various ways to sell your aesthetic device—online marketplaces, auction sites, and equipment brokers. You can even contact industry-specific publications and websites to advertise your device. When you list your device for sale, provide a detailed description, including its features, specifications, and condition, as well as the payment and delivery options available to potential buyers.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="row col-12 m-0 p-0" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="offset-md-1 col-md-10 col-12 ">
          <div className="col-12 mt-md-5 mt-3 m-0 p-0">
            <h3 className="sentient-subtitle text-center align-items-center justify-content-center d-sm-flex d-none">
              The LaserTrader Difference
            </h3>
            {/* mobile */}
            <h3 className="sentient-contenttitle text-center d-sm-none d-flex">
              The LaserTrader Difference
            </h3>
          </div>
          <div className="w-100" />
          <br />
          <div className="col-12">
            <p className="sentient-content text-center">
              Selling your aesthetic equipment can be a profitable venture if done correctly. The process can be challenging and time-consuming if managed on your own, but you can ensure a successful transaction by determining the value of your equipment, preparing it for sale, and finding the right buyer
            </p>
            <p className="sentient-content text-center">
              <b>Or you can use The LaserTrader by Sentient to handle the sale.</b>
            </p>
            <p className="sentient-content text-center">
              You can list your device on TheLaserTrader, either through consignment with LaserTrader or with the Sentient Assured Certification program, and we’ll ensure the sale of your device at the best price, in the shortest possible time frame, all with minimal effort on your part. If you have any questions on how we work, make sure to reach out—we’re always here to help.
            </p>
          </div>
          <div className="w-100" />
          <div className="row col-12 mt-md-5 mt-1 mb-lg-5 mb-2 p-0 m-0 d-flex justify-content-center">
            <div className=" m-0 p-0">
              <Link href="/sell/listdevice" passHref className="navbar-brand m-0 p-0" onClick={() => window.scrollTo(0, 0)}>
                <p
                  className="sentient-content text-center"
                  style={{
                    fontWeight: '700', textDecoration: 'underline', color: '#4DAC00', whiteSpace: 'break-spaces', cursor: 'pointer'
                  }}
                >
                  Sell your device for cash
                </p>
              </Link>
            </div>
            <div className="w-100" />
            <div className="m-0 p-0">
              <Link
                href="/service/assuredcertification"
                passHref
                className="navbar-brand m-0 p-0"
                onClick={() => window.scrollTo(0, 0)}
              >
                <p
                  className="sentient-content text-center"
                  style={{
                    fontWeight: '700', textDecoration: 'underline', color: '#4DAC00', whiteSpace: 'break-spaces', cursor: 'pointer'
                  }}
                >
                  Contact us to sell your device with the Sentient Assured certification
                </p>
              </Link>
            </div>
            <div className="w-100" />
            <div className=" m-0 p-0">
              <Link href="/sell/listdevice" passHref className="navbar-brand m-0 p-0" onClick={() => window.scrollTo(0, 0)}>
                <p
                  className="sentient-content text-center"
                  style={{
                    fontWeight: '700', textDecoration: 'underline', color: '#4DAC00', whiteSpace: 'break-spaces', cursor: 'pointer'
                  }}
                >
                  List your device on our open market
                </p>
              </Link>
            </div>
          </div>
        </div>

        <div className="row col-12 py-lg-5 py-3 px-sm-5 px-3 m-0 p-0">
          <div className="col-lg-6 mb-2 m-0 p-0">
            <h2 className="sentient-title" style={{ color: '#0A2FFF' }}>Questions?</h2>
          </div>

          <div className="col-lg-6 m-0 p-0">
            <p className="sentient-dmmono mb-0">Frequently Asked Questions</p>
            <hr className="sentient-underline" />
            <p className="sentient-content">
              <strong>Why should I use the open market platform on LaserTrader by Sentient instead of trading my system into the OEM, or selling it to a dealer? </strong>
            </p>
            <p className="sentient-content">
              If an OEM is offering you fair trade in value for your device, you should take it. Often this is not the case. Both OEM&apos;s and dealers will offer you pennies on the dollar. The LaserTrader is a great place to find out what similar devices are being priced at in comparison with the OEM or dealer offer.
              The best analogy is the automobile market. If you take your car into a dealer for a trade-in towards a newer model, that value is often substantially below what you could sell it for on your own.
            </p>
            <br />
            <br />
            <p className="sentient-content">
              <strong>Is there anything else I can do to make my system more valuable and marketable?</strong>
            </p>
            <p className="sentient-content">
              Yes. Get a system inspection and certification with Sentient Assured® to help potential buyers feel more confident about the quality of your system. This is similar to a &quot;certified pre-owned&quot; label often used in the automobile industry.
              <br />
              <br />
              {' '}
              Additionally, list your device with an accurate description of the device, including: the year of manufacture (not delivery date), model, model upgrades, system usage (hours and shot counts on system including handpieces), whether the system has been under factory warranty or a service plan, and list any accessories. If you need assistance determining your usage or the true configuration of your device, give us a call.
            </p>
          </div>
        </div>
      </div>
    </div>
    </PageLayout>
  );
};

export default Sell;
