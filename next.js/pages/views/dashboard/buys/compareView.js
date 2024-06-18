/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import {
  Button,
} from 'reactstrap';

import { useRouter } from 'next/router';
import { getBuySearch } from '@src/api/buy.action';
import PageLayout from '../../../../src/layouts/PageLayout';

const CompareView = () => {
  const router = useRouter();
  const comparedata = router.query.compareData || {};

  console.log(comparedata);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const optionData = await getBuySearch(comparedata);
      setTableData(optionData);
    };

    fetchData();
  }, [comparedata]);

  const CompareData = () => (
    <>
      <div className="row col-12 px-md-5 px-3 pb-2 m-0 p-0">
        {tableData.map((item) => (
          <div className="col-md-6 col-12 pb-2" key={item.inventoryId}>
            <div className="row col-12 border p-2">
              <div className="col-xl-6 col-12 ">
                <img className="w-100" src={`${process.env.APP_SERVER_URL}/uploads/products/${item?.productImage}`} style={{ height: 'auto', width: 'auto' }} alt={item.productImage} />
              </div>
              <div className="col-xl-6 col-12 pt-xl-0 pt-2 ">
                <h6 className="sentient-content">
                  {item.productCompany}
                  <br />
                  {item.productModel}
                </h6>
                <p className="sentient-content">
                  {`Year: ${item.productYear}`}
                  <br />
                  {`Type: ${item.productType}`}
                  <br />
                  {`Wavelength: ${item.waveLength}`}
                  <br />
                  {`SKU: ${item.sku}`}
                  <br />
                  {item?.bestOffer ? (
                    <span>
                      Price: $
                      {item?.askingPrice?.toLocaleString() ?? 0}
                      {' '}
                      / OBO
                    </span>
                  ) : (
                    <span>
                      Price: $
                      {item?.askingPrice?.toLocaleString() ?? 0}
                    </span>
                  )}
                </p>
                <h6>
                  Description:
                </h6>
                <p className="seintiet-dmmono">
                  {item.description}
                </p>
                <h5>
                  Indicated Uses:
                </h5>
                <p className="seintiet-dmmono">
                  {item.productOptions}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </>
  );

  return (
    <PageLayout>
    <div className="w-100 pageTop">
      <div className="table-header px-md-5 px-3 pt-5 pb-3 mb-1">
        <Button color="flat-light" onClick={() => router.back()}>
          &lt; back to list
        </Button>
        <h3 className="sentient-subtitle">
          PRODUCT COMPARISON
        </h3>
      </div>
      {CompareData()}
    </div>
    </PageLayout>
  );
};

export default CompareView;
