/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';
import { Button } from 'reactstrap';

import 'react-dropzone-uploader/dist/styles.css';
import { useRouter } from 'next/router';

import ServiceIcon from '@src/assets/images/icons/file-icons/icon_wrench.gif';
import FinanceIcon from '@src/assets/images/icons/file-icons/icon_dollarsign.gif';
import TrainingIcon from '@src/assets/images/icons/file-icons/icon_gradcap.gif';
import ShippingIcon from '@src/assets/images/icons/file-icons/icon_truck.gif';
import MakeIcon from '@src/assets/images/icons/file-icons/icon_gavel.gif';
import AskIcon from '@src/assets/images/icons/file-icons/icon_questionmark.gif';
import WatchListIcon from '@src/assets/images/icons/file-icons/icon_watch.gif';

import MessageIcon from '@src/assets/images/icons/file-icons/icon_share.gif';
import FaceBookIcon from '@src/assets/images/icons/file-icons/icons8-facebook-48.png';
import TwitterIcon from '@src/assets/images/icons/file-icons/icons8-twitter-48.png';
import DiggIcon from '@src/assets/images/icons/file-icons/381396_digg_logo_icon.png';
import YahooIcon from '@src/assets/images/icons/file-icons/icons8-yahoo-web-services-logotype-with-y-alphabet-24.png';
import RedditIcon from '@src/assets/images/icons/file-icons/icons8-reddit-64.png';
import MixIcon from '@src/assets/images/icons/file-icons/icons8-mix-shows-you-content-matched-to-your-interests-24.png';
import GoogleBookMarkIcon from '@src/assets/images/icons/file-icons/icons8-google-48.png';
import EmailIcon from '@src/assets/images/icons/file-icons/icons8-mail-64.png';
import FavoriteIcon from '@src/assets/images/icons/file-icons/icons8-favorite-100.png';
import PrintIcon from '@src/assets/images/icons/file-icons/icons8-print-48.png';
import MoreIcon from '@src/assets/images/icons/file-icons/icons8-more-48.png';

import { useDispatch } from 'react-redux';
import { getDetailSearch } from '@src/api/buy.action';
import { updateInventory, updateInventoryViewsIncreament } from '@src/api/inventory.actions';
import Image from 'next/image';
import PageLayout from '../../../../src/layouts/PageLayout';

const DetailView = () => {
  const router = useRouter();    
  const { inventoryId } = router.query;

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if(inventoryId){
        const updateData = await getDetailSearch(inventoryId) || [];
        setTableData(updateData);
        await updateInventoryViewsIncreament(inventoryId);
      }      
    }
    fetchData();
  }, [inventoryId]);

  const handleButtonQuestionClick = () => {
    router.push(`/contact-us?inventoryId=${tableData.inventoryId}`);
    window.scrollTo(0, 0);
  };

  const handleButtonOfferClick = () => {
    router.push(`/contact-us?inventoryId=${tableData.inventoryId}&b=1`);
    window.scrollTo(0, 0);
  };

  return (
    <>
    <PageLayout>
      <div className="pageTop" >
        <div className="col-12 table-header px-md-5 px-3 py-5 m-0 p-0">
          <Button color="flat-light" className="mt-2" onClick={() => window.history.back()}>
            &lt; back to list
          </Button>
          <h1 className="sentient-subtitle">
            {'PRODUCT DETAILS   '}
            <span style={{ color: 'blue' }}>
              {`${tableData?.productCompany ?? ''} ${tableData?.productModel ?? ''} ${
                tableData?.productYear ?? ''
              }`}
            </span>
          </h1>
        </div>
        <div className="row col-12 py-3 m-0 p-0">
          <div className="col-lg-4 px-md-5 px-3 m-0 p-0 d-flex flex-column">
            <img src={`${process.env.APP_SERVER_URL}/uploads/products/${tableData?.productImage}`} className="img-fluid" alt="" />
            <div className="row mt-3">
              <div className="col-md-6 col-12 ">
                <Button className="btn-warning btn-sm" onClick={handleButtonQuestionClick}>
                  <span style={{ fontSize: '12px' }}>Ask Seller A Question </span>
                </Button>
              </div>
              <div className="col-md-6 pt-md-0 pt-1 justify-content-end d-sm-flex d-none">
                <Button className="btn-warning btn-sm" onClick={handleButtonOfferClick}>
                  <span style={{ fontSize: '12px' }}>Make Seller An Offer </span>
                </Button>
              </div>
              {/* mobile */}
              <div className="col-md-6 col-12 pt-md-0 py-1 d-sm-none d-flex">
                <Button className="btn-warning btn-sm" onClick={handleButtonOfferClick}>
                  <span style={{ fontSize: '12px' }}>Make Seller An Offer </span>
                </Button>
              </div>
            </div>
          </div>

          <div className="row col-lg-8 col-12 m-0 pt-sm-0 pt-3 px-md-5 px-3">
            <div className="col-md-6 col-12 px-3 sentient-content">
              <h6 className="sentient-content">
                {tableData?.productCompany ?? ''}
                <br />
                {tableData?.productModel ?? ''}
              </h6>
              <p className="sentient-content">
                {`Year: ${tableData?.productYear ?? ''}`}
                <br />
                {`Type: ${tableData?.productType ?? ''}`}
                <br />
                {`Wavelength: ${tableData?.waveLength ?? ''}`}
                <br />
                (wavelengths may vary - see description)
                {`SKU: ${tableData?.sku ?? ''}`}
                <br />
                {tableData?.bestOffer ? (
                  <span>
                    Price: $
                    {tableData?.askingPrice?.toLocaleString() ?? 0}
                    {' '}
                    / OBO
                  </span>
                ) : (
                  <span>
                    Price: $
                    {tableData?.askingPrice?.toLocaleString() ?? 0}
                  </span>
                )}
              </p>
              <h6>
                Description:
              </h6>
              <ul className="sentient-content">
                {tableData?.description?.split(';').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <h5>
                Indicated Uses:
              </h5>
              <p className="sentient-content">
                (actual system indications/configuration may vary depending on options)
              </p>
              <ul className="sentient-content">
                {tableData?.productOptions?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="col-md-6 col-12 px-md-5 px-3" >
              <table className="table">
                <tbody>
                  <tr>
                    <td align="right">
                      <Image border="0" src={ServiceIcon} width={60} height={60} alt="" />
                    </td>
                    <td className="sentient-content">
                      <strong> Service - </strong>
                      <a href="/service">Click here </a>
                      <span className="sentient-content">to check if service is available on this system.</span>
                    </td>
                  </tr>
                  <tr>
                    <td align="right">
                      <Image border="0" src={FinanceIcon} width={60} height={60} alt="" />
                    </td>
                    <td className="sentient-content">
                      <strong> Finance - </strong>
                      <a href="/service/financing">$158/mo &nbsp;</a>
                      <span className="sentient-content">(price based on WAC and 60 month 10% finance)</span>
                    </td>
                  </tr>
                  <tr>
                    <td align="right">
                      <Image border="0" src={TrainingIcon} width={60} height={60} alt="" />
                    </td>
                    <td className="sentient-content">
                      <strong> Training  - </strong>
                      <a href="/service/clinical-training"> Certified Training </a>
                      <span className="sentient-content">available, starting at $1500.</span>
                    </td>
                  </tr>
                  <tr>
                    <td align="right">
                      <Image border="0" src={ShippingIcon} width={60} height={60} alt="" />
                    </td>
                    <td className="sentient-content">
                      <strong> Shipping/Handling   - </strong>
                      <span className="sentient-content">Estimated $640-$1000, contact us for exact cost.</span>
                    </td>
                  </tr>
                  <tr>
                    <td align="right">
                      <Image border="0" src={MakeIcon} width={60} height={60} alt="" />
                    </td>
                    <td className="sentient-content">
                      <span className="sentient-content">Make the seller an</span>
                      <a href={`/contact-us?inventoryId=${inventoryId}&b=1`}> Offer. </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="right">
                      <Image border="0" src={AskIcon} width={60} height={60} alt="" />
                    </td>
                    <td className="sentient-content">
                      <a href={`/contact-us?inventoryId=${inventoryId}`}> Ask </a>
                      <span className="sentient-content">seller a question.</span>
                    </td>
                  </tr>
                  <tr>
                    <td align="right">
                      <Image border="0" src={WatchListIcon} width={60} height={60} alt="" />
                    </td>
                    <td className="sentient-content">
                      {/* <a href={`/watch-all?product_id=${tableData?.productId}`}> Watch List </a> */}
                      <a href="/watchlist"> Watch List </a>
                      <span className="sentient-content"> - be automatically notified when similar items become available.</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </PageLayout>
    </>
  );
};

export default DetailView;
