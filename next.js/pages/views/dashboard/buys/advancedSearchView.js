import { useEffect, useState } from 'react';
import {
  Alert,
  Button, CustomInput, Form, FormGroup, Input, Label,
} from 'reactstrap';

import { useForm } from 'react-hook-form';
import classnames from 'classnames';
import Select from 'react-select';

import { useRouter
 } from 'next/router';
import SearchInput, { createFilter } from 'react-search-input';

import { getLookupProductOption, getProductActive } from '@src/api/product.actions';
import { getFullProductModel } from '@src/api/sell.action';
import { getCompanyManufacturer, getProductModel } from '@src/api/buy.action';
import PageLayout from '@src/layouts/PageLayout';

const AdvancedSearchView = () => {
  const router = useRouter();
  // const dispatch = useDispatch();

  const {
    register, errors, handleSubmit, control, setValue, getValues, clearErrors,
  } = useForm();

  const [apiErrors, setApiErrors] = useState({});
  const [productOption, setProductOption] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [product, setProduct] = useState([]);
  const [company, setCompany] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);

  const KEYS_TO_FILTERS = ['label'];

  useEffect(() => {
    const filteredProducts = product.filter(createFilter(selectedValue, KEYS_TO_FILTERS));
    setSelectedProduct(filteredProducts);
  }, [selectedValue]);

  useEffect(() => {
    const fetchData = async () => {
      // await getProductActive();
      const optionData = await getLookupProductOption();

      if(optionData){
        setProductOption(optionData ?? []);
        setValue('productOption', optionData);
      }

      const productModelData = await getProductModel() ?? [];
      // let modelData = {
      //   label: '',
      //   value: '',
      // };
      if(productModelData?.length > 0){
        const modelData = productModelData?.map((item, index) => ({
          label: item.productName,
          value: index ?? '',
        })) ?? [];

        if (modelData && modelData?.length > 0) {
          setProduct(modelData);
          setSelectedProduct(modelData[0]);
        }
  
        const companyModelData = await getCompanyManufacturer();
        const modelDataCompany = companyModelData?.map((item, index) => ({
          label: item.companyName,
          value: index ?? '',
        })) ?? [];

        if (modelDataCompany && modelDataCompany.length > 0) {
          setCompany(modelDataCompany);
          setSelectedCompany(modelDataCompany[0]);
        }
      }
    };
    fetchData();
  }, []);

  const handleButtonProductClick = () => {
    // const setdata = {
    //   productName: selectedProduct.label || '',
    // };
    const productName = getValues('productName');
    const setdata = {
      productName: productName || '',
    };
    router.push({
      pathname: '/products',
      state: { setdata },
      hash: '#tableid',
    });
  };
  const handleButtonCompanyClick = () => {
    const companyName = getValues('companyName');
    const setdata = {
      companyName: companyName || '',
    };
    // const setdata = {
    //   companyName: selectedCompany.label || '',
    // };

    router.push({
      pathname: '/products',
      state: { setdata },
      hash: '#tableid',
    });
  };

  const onSubmit = async (data) => {
    const options = productOption
      .filter((item) => data[item.name] === 'true')
      .map((item) => item.productOptionId)
      .join(',');

    // const setdata = {
    //   productOption: options || '',
    //   productName: selectedProduct.label || '',
    //   companyName: selectedCompany.label || '',
    //   blueDot: data?.warranty || '',
    // };
    const setdata = {
      productOption: options || '',
      productName: data?.productName || '',
      companyName: data?.companyName || '',
      blueDot: data?.warranty || '',
    };
    router.push({
      pathname: '/products',
      state: { setdata },
      hash: '#tableid',
    });
  };

  const handleButtonInventoryClick = () => {
    clearErrors();
    handleSubmit(onSubmit)();
  };

  const DynamicProduct = () => (
    <>
      <Label>
        Indicated Uses:
      </Label>

      <FormGroup>
        <div className="row">
          {productOption?.map((item, index) => (
            <div className="col-sm-6 d-flex align-itmes-center pb-1" key={item.productOptionId}>
              <input
                key={index}
                type="checkbox"
                name={item.name}
                value={item.active}
                id={item.productOptionId}
                className={classnames({ 'is-invalid': errors && errors.item.name }, 'form-check-input')}
                {...register(item.name, { required: false })}
              />
              <label htmlFor={item.name} className="form-check-label sentient-content px-3">{item.name}</label>
            </div>
          ))}
        </div>
      </FormGroup>
    </>
  );

  return (
    <PageLayout>
    <div className="w-100 pageTop">
      <div className="table-header px-md-5 px-3 pt-5 py-3">
        <Button color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button>
        <h3 className="sentient-subtitle d-sm-flex d-none">
          SEARCH INVENTORY - BUY LASERS
        </h3>
        <h3 className="sentient-contenttitle d-sm-none d-flex">
          SEARCH INVENTORY - BUY LASERS
        </h3>
        <hr className="sentient-underline" />
      </div>
      <div className="row col-12 pt-3 pb-5 m-0 p-0">
        <div className="col-lg-6 col-12 px-md-5 px-3 m-0 p-0">
          <p className="sentient-content">
            TheLaserTrader.com helps you find the ideal pre-owned medical laser or IPL! We do not own, personally inspect or stock the posted equipment - experience has shown dealers that stock inventory have to charge more for the systems they sell to cover their increased overhead. Plus they sometimes try to sell you what they have rather than what you need! Instead, we carry a
            <a className="" style={{ color: '#65CF10' }} href="/products" onClick={() => window.scrollTo(0, 0)}> virtual inventory </a>
            of used lasers and IPL machines. The systems you buy through the use of TheLaserTrader.com  open market come directly from the seller&apos;s office to you.
          </p>
          <p className="sentient-content">
            The following is a listing of various medical lasers for sale. Please remember that all prices listed are set by the seller and reasonable offers may be accepted. If you do not see what you are looking for, please contact us so we can perform a world-wide search (we work in over 20 countries). All prices listed below are in US dollars.
          </p>
          <p className="sentient-content">
            <strong>SPECIAL NOTE: </strong>
            Sometimes a seller that has listed their equipment on TheLaserTrader.com may have sold the item(s) on their own. From time to time the seller forgets to notify us. We apologize if you see an item advertised that may no longer be available. If you prefer, you may check with us first to make sure that the item(s) posted remain available. We apologize for any inconvenience this may cause. Thank you in advance for your cooperation and understanding.
          </p>
          <p className="sentient-content">
            To use the
            <strong> SEARCH </strong>
            fields below you may fill in as
            <strong> LITTLE </strong>
            or as
            <strong>&nbsp;MUCH </strong>
            information as you would like to find the
            <strong> INVENTORY </strong>
            you want (or leave all fields
            <strong>&nbsp;BLANK </strong>
            and click
            <strong> SEARCH </strong>
            and it will display the
            <strong> ENTIRE </strong>
            available inventory).
          </p>
        </div>
        <div className="col-lg-6 col-12 px-md-5 px-3 m-0 p-0">
          <Form onSubmit={handleSubmit(onSubmit)}>
            {apiErrors.data ? (
              <Alert color="danger">
                <div className="alert-body">
                  <span>{`Error: ${apiErrors.data}`}</span>
                </div>
              </Alert>
            ) : <></>}
            <FormGroup>
              <div className="row col-12 m-0 p-0">
                <div className="col-12 m-0 p-0">
                  <FormGroup>
                    <div className="d-flex justify-content-between">
                      <Label className="col-form-label">
                        Product / Model:
                      </Label>
                      <div className="">
                        {/* <Select
                          as={Select}
                          options={product}
                          name="productName"
                          value={selectedProduct}
                          isClearable={false}
                          control={control}
                          defaultvalue={selectedProduct || ''}
                          className={`react-select ${classnames({ 'is-invalid': errors.productName })}`}
                          classNamePrefix="select"
                          onChange={(value) => (setSelectedProduct(value))}
                          innerRef={register({ required: true })}
                        /> */}
                        {/* <SearchInput className="search-input" value={selectedValue} onChange={(value) => setSelectedValue(value)} />

                        <table className="mail">
                          {selectedProduct?.map((item) => (
                            <tr key={item.value}>
                              <td>{item.label}</td>
                            </tr>
                          ))}
                        </table> */}

                        <input
                          type="text"
                          placeholder="Input productName"
                          id="productName"
                          name="productName"
                          className={classnames({ 'is-invalid': errors && errors.productName }, 'form-control sentient-content')}
                          style={{ border: '1px solid #646464' }}
                          {...register('productName', { required: false })}
                        />
                      </div>
                      <div >
                        <Button outline size="md" type="button" onClick={handleButtonProductClick} color="primary">
                          GO
                        </Button>
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="d-flex justify-content-between">
                      <Label className="col-form-label">
                        Company / Mfg:
                      </Label>
                      <div className="">
                        {/* <Select
                          as={Select}
                          options={company}
                          name="companyName"
                          value={selectedCompany}
                          isClearable={false}
                          control={control}
                          defaultvalue={selectedCompany || ''}
                          className={`react-select ${classnames({ 'is-invalid': errors.companyName })}`}
                          classNamePrefix="select"
                          onChange={(value) => (setSelectedCompany(value))}
                          innerRef={register({ required: true })}
                        /> */}
                        <input
                          type="text"
                          placeholder="Input company"
                          id="companyName"
                          name="companyName"
                          className={classnames({ 'is-invalid': errors && errors.companyName }, 'form-control sentient-content')}
                          {...register('companyName', { required: false })}
                          style={{ border: '1px solid #646464' }}
                        />
                      </div>
                      <div className="">
                        <Button outline size="md" type="button" onClick={handleButtonCompanyClick} color="primary">
                          GO
                        </Button>
                      </div>
                    </div>
                  </FormGroup>

                  {DynamicProduct()}
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <div className="row">
                <div className="col-md-6 col-9">
                  <Label>
                    <strong>Only products that include 30 Day Limited Warranty:</strong>
                    :
                  </Label>
                </div>
                <div className="col-md-6 col-3">
                  <input
                    type="checkbox"
                    name="warranty"
                    id="warranty"
                    className={classnames({ 'is-invalid': errors && errors.warranty }, 'form-check-input')}
                    {...register('warranty', { required: false })}
                  />
                </div>
                <div className="col-12 pt-1">
                  <span className="sentient-content">If you want to search the entire inventory, do not fill in any criteria. Just click on the button below.</span>
                </div>
                <div className="col-12 pt-2">
                  <Button outline size="sm" type="button" onClick={handleButtonInventoryClick} color="primary">
                    Search Inventory
                  </Button>
                </div>
              </div>
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
    </PageLayout>
  );
};

export default AdvancedSearchView;
