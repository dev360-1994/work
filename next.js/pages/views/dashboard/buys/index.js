/* eslint-disable quotes */
import AdobeStock1 from '@src/assets/images/pages/buy/Frame.png';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { Link, useLocation } from 'react-router-dom/cjs/react-router-dom.min';

import '@fontsource/dm-mono'; // Defaults to weight 400
import '@fontsource/dm-mono/400.css'; // Specify weight
import '@fontsource/dm-mono/400-italic.css'; // Specify weight and style
import parse from 'html-react-parser';
import BuyList from './Table';
import Link from 'next/link';
import Image from 'next/image';
import { getRecents } from '@src/api/buy.action';
import PageLayout from '../../../../src/layouts/PageLayout';
// **  Custom Components

const BuyPage = () => {
  const router = useRouter();
  const { id } = router.query;

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

  const queryMarket = [
    {
      query: 'Where do these posted systems come from and why are they being sold?',
      answer: 'The majority of the systems being posted are from individual physician offices. They are being sold for a variety of reasons, including; trading up to a newer model, leaving the business, not offering a particular procedure any longer, financial hardship, or the end of a lease program.',
    },
    {
      query: 'Why do the prices of some systems posted for sale on the LaserTrader vary so greatly?',
      answer: 'As explained in the selling section of the FAQ\'s, the posted asking price for equipment on TheLaserTrader is the responsibility of the current owner. These owners vary in selling motivation which can result in significant differences in asking price.. If you have a question as to what the current market value price should be for a particular system, call or email us and we’ll be happy to clarify.',
    },
    {
      query: 'Isn’t there a risk of buying a piece of equipment from another physician’s office?',
      answer: 'Keep in mind, chances are a physician would not be using a faulty or broken system on their patients or in their office given such a high degree of liability.',
    },
    {
      query: 'How am I assured of the quality of the device I am considering? Do I need a recent service report or at least an inspection performed prior to paying for the system?',
      answer: 'Many of the systems listed on TheLaserTrader have been under continuous service agreements. We can also make suggestions to help you arrange to have a certification inspection performed at your expense before shipment or certification and / or installation upon delivery to you.',
    },
    {
      query: 'How do I actually purchase or make an offer on a system?',
      answer: 'At the bottom of the page on each systems’ individual detail listing is a "Make an Offer / Ask a Question" button. Click on the link, fill out the form and hit "Send". TheLaserTrader will go to work, contacting the seller on your behalf with your question or offer—it\'s that simple. Then the seller will contact you directly with regard to the inquiry.',
    },
    {
      query: 'Who do you use for service and warranty repair?',
      answer: 'We often give a variety of provider recommendations based on your needs and let you make the choice that works for you. We prefer providers that employ their service technicians rather than those that use contractors which helps control the quality of the service provided.',
    },
    {
      query: 'What about a service contract/warranty for this system?',
      answer: 'We can make recommendations based on our experience, however, you are in charge as we will offer you the various options from different providers. We prefer to recommend providers that employ their service technicians and not contract them out as this typically helps control the quality of the service provided.',
    },
    {
      query: 'Do I need an inspection/installation once my system arrives?',
      answer: 'Some of our customers prefer to have an inspection upon arrival of their new system. You are welcome to hire a service technician to perform this operation. If you need suggestions we may be able to help.',
    },
    {
      query: 'What if I need application training on my new system?',
      answer: 'We offer clinical training, both hands-on and virtually. Our trainers tailor their sessions specifically to your unique system and application needs. ',
    },
    {
      query: 'What does “currently under factory warranty” mean on system listings?',
      answer: 'If it is indicated as "NO," that means the system\'s original (or extended) OEM warranty has expired. Keep in mind, just because it says "NO" doesn\'t mean the system is faulty or in need of repair. A lot of customers have their systems maintained by third party service groups after the original factory warranty has expired (typically a much more cost effective way to maintain their equipment rather than going through the OEM). If it is indicated as "YES," it means the system is currently being maintained under the OEM\'s warranty/service contract/program. This is a great indicator to you that the system is likely in perfect operational condition.',
    },
    {
      query: 'Is the warranty transferable?',
      answer: 'There are very few manufacturers or OEM\'s in the aesthetic industry that will transfer the warranty from owner to owner. They want you to purchase a new service contract with them. If you are interested in having a device with a protection plan, search our Sentient Assured inventory.',
    },
  ];

  const queryAssured = [
    {
      query: 'Is a Sentient Assured device legal?',
      answer: 'Absolutely. Original Equipment Manufacturers (OEMs) rely on a false scare tactic that resold aesthetic devices are illegal. In July of 2021, the President of the United States signed an Executive Order meant to promote competition within technology industries, codifying the “right to repair.”',
    },
    {
      query: 'Is marketing support and practice development assistance included?',
      answer:
      `<span>
      Yes! Reach out to our Assured Development team
      <a href="/" className="navbar-brand sentient-content" style="color: #4DAC00; text-decoration: underline;">
        here.
      </a>
    </span>`,
    },
    {
      query: 'Will I be charged OEM recertification fees?',
      answer: 'LaserTrader by Sentient does not charge recertification fees with very few necessary exceptions. There is no need to re-certify your device with the OEM.',
    },
    {
      query: 'Will my device be FDA cleared?',
      answer: 'Yes. LaserTrader by Sentient makes sure all its devices meet standard OEM specifications, maintaining the original FDA clearance and indications.',
    },
    {
      query: 'Will I have access to clinical training for my Sentient Assured device?',
      answer: `Yes. LaserTrader by Sentient offers clinical training on any of the devices it sells. <a href="/contact-us" className="navbar-brand sentient-content" style="color: #4DAC00; text-decoration: underline;">
      Contact us here.
      </a>`,
    },
    {
      query: 'Will I be liable if I injure a patient with a device purchased on the “gray market”?',
      answer: 'You are no more liable than with a device purchased from an OEM. ',
    },
    {
      query: 'How can I trust my Sentient Assured device will arrive in good condition?',
      answer: 'The Sentient Assured certification guarantees that your device leaves our warehouse in perfect working condition.',
    },
    {
      query: 'Can my Sentient Assured device be serviced with OEM parts?',
      answer: 'Yes.',
    },

  ];

  return (
    <PageLayout>
    <div className="w-100 pageTop">
      <div className="w-100 header-image buypage-image m-0 p-0 d-sm-flex d-none align-items-center">
        <title>Buy</title>
        <div className="col-lg-7 col-12 px-sm-5 px-2">
          <h1 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Buy
          </h1>
        </div>
      </div>
      {/* mobile */}
      <div className="w-100 header-image buypage-mobileimage m-0 p-0 d-sm-none d-flex align-items-center">
        <div className="col-lg-7 col-12 px-sm-5 px-2">
          <h2 className="sentient-title" style={{ color: '#FFFFFF' }}>
            Buy
          </h2>
        </div>
      </div>

      <div className="row m-0 p-0 col-12" style={{ backgroundColor: '#FFFFFF' }}>
        <div id="tableid" className="col-12 m-0 p-0 py-2">
          <BuyList />
        </div>

      </div>

      <div className="row col-12 pt-sm-5 pt-3 m-0 p-0" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="row col-12 m-0 p-0">
          <div className="col-12 px-md-5 px-3  m-0 p-0">
            <h3 className="col-md-8 col-12 sentient-contenttitle m-0 p-0" style={{ color: '#4DAC00' }}>
              At LaserTrader we offer two ways of purchasing a pre-owned device, directly from a provider listing or Sentient Assured™.
            </h3>
          </div>
          <div className="col-lg-6 col-12 py-md-5 py-1 px-md-5 px-3">
            <div className="m-0 p-0">
              <h3 className="sentient-contenttitle col-sm-10 col-12 p-0 text-left" style={{ fontSize: '20px' }}>
                What Does it Mean to Buy Sentient Assured™ with LaserTrader?
              </h3>
              <br />
              <div className="sentient-content text-left">
                Purchase an OEM device for up to 63% less than manufacturer pricing with confidence in its condition and performance, thanks to the Sentient Assured™ Certification.  Enjoy post-sale support from our Assured Development™ team, and the option to add the Sentient Assured Protection Plan™, which guarantees future performance of your device for significantly less than plans offered by OEMs.
                <br />
                <br />
                LaserTrader by Sentient offers additional services like financing and clinical training to help facilitate the success of your device acquisition.
                <br />
                <br />
                <Link href="/about#buysentientassured" passHref={true}>
                  <a className="navbar-brand m-0 p-0">
                    <p
                      className="sentient-content text-left"
                      style={{
                        fontWeight: '700', textDecoration: 'underline', color: '#4DAC00',
                      }}
                    >
                      Read more here
                    </p>
                  </a>
                </Link>
              </div>
            </div>
            <br />
            <br />
            <div className="m-0 p-0">
              <h3 className="sentient-contenttitle col-sm-10 col-12 p-0 text-left" style={{ fontSize: '20px' }}>
                What Does it Mean to Purchase Directly from a Provider Listing?
              </h3>
              <br />
              <p className="sentient-content text-left">
                LaserTrader offers an open market platform, where buyers can purchase directly from seller listings and LaserTrader seamlessly completes the transaction.
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-12 py-1 px-md-5 px-3 m-0 p-0">
            <div className="">
              <Image
                className="w-100"
                src={AdobeStock1}
                // style={{ backgroundSize: 'cover', width: 'auto', borderRadius: '16px' }}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row col-12 m-0 p-0" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="row col-12 py-lg-5 py-2 px-md-5 px-3 m-0 p-0">
          <div className="col-lg-8 py-2 mb-2 m-0 p-0">
            <h2 className="sentient-subtitle d-sm-flex d-none" style={{ color: '#0A2FFF' }}>Buying Sentient Assured inventory? </h2>
            {/* mobile */}
            <h2 className="sentient-contenttitle d-sm-none d-flex" style={{ color: '#0A2FFF' }}>Buying Sentient Assured inventory? </h2>
          </div>

          <div className="offset-lg-5 col-lg-7 px-lg-3 col-12 p-0">
            <p className="sentient-dmmono mb-0 d-sm-flex d-none">Sentient Assured Frequently Asked Questions</p>
            <hr className="sentient-underline d-sm-flex d-none" />

            {queryAssured?.map((item, index) => (
              <div className="m-0 p-0" key={index + 30}>
                <p className="sentient-content">
                  <b>{parse(item.query)}</b>
                </p>
                <p className="sentient-content">
                  {parse(item.answer)}
                </p>
                <br />
                <br />
              </div>
            ))}
          </div>
        </div>

        <div className="row col-12 py-2 px-md-5 px-3 m-0 p-0">
          <div className="col-lg-8 mb-3 py-lg-2 m-0 p-0">
            <h2 className="sentient-subtitle d-sm-flex d-none" style={{ color: '#0A2FFF' }}>Buying off LaserTrader’s Open Market? </h2>
            {/* mobile */}
            <h2 className="sentient-contenttitle d-sm-none d-flex" style={{ color: '#0A2FFF' }}>Buying off LaserTrader’s Open Market? </h2>
          </div>

          <div className="offset-lg-5 col-lg-7 px-lg-3 col-12 p-0">
            <p className="sentient-dmmono mb-0 d-sm-flex d-none">Open Market Frequently Asked Questions</p>
            <hr className="sentient-underline d-sm-flex d-none" />

            {queryMarket?.map((item, index) => (
              <div className="m-0 p-0" key={index + 15}>
                <p className="sentient-content">
                  <b>{item.query}</b>
                </p>
                <p className="sentient-content">
                  {item.answer}
                </p>
                <br />
                <br />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </PageLayout>
  );
};
export default BuyPage;
