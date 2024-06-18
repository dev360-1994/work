/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { getFullProductModel } from '@src/api/sell.action';
import { RemoveWatch } from '@src/api/contactUs.action';
import PageLayout from '@src/layouts/PageLayout';
import { useRouter } from 'next/router';

const UnWatchList = () => {
  // const { search } = useLocation();
  // const productId = new URLSearchParams(search).get('p');
  // const contactId = new URLSearchParams(search).get('c');

  const router = useRouter();
  const productId = router.query.p;
  const contactId = router.query.c;

  const [watchResult, setWatchResult] = useState(false);

  useEffect(async () => {
    const data = {
      contactId,
      productId,
    };
    await RemoveWatch(data);
  }, []);

  return (
    <PageLayout>
      <div className="w-100 pageTop">
        <div className="row col-12 pb-sm-5 pb-2 m-0 p-0" style={{ minHeight: '500px' }}>
          <div className="col-12 px-md-3 px-2 pt-sm-5 pt-2 m-0 p-0">
            <h1 className="col-12 sentient-title text-center m-0 p-0" style={{ color: '#65CF10' }}>
              Remove Product From Watchlist
            </h1>
            <br />
            <p className="sentient-contenttitle pt-2 text-center">
              You should no longer receive notifications about this product.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default UnWatchList;
