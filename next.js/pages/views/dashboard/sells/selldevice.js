/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import Image from 'next/image';

// **  Custom Components
import '@fontsource/dm-mono'; // Defaults to weight 400
import '@fontsource/dm-mono/400.css'; // Specify weight
import '@fontsource/dm-mono/400-italic.css'; // Specify weight and style
import {
  Alert,
  Form, FormGroup, Input, CustomInput, Label, Button,
} from 'reactstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import { Controller, useForm } from 'react-hook-form';
import classnames from 'classnames';
import Select from 'react-select';
import InputMask from 'react-input-mask';

import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import { CheckCircle } from 'react-feather';
import { acceptedImageFormats } from '@src/configs/dropzoneUploader';
import { toast } from 'react-toastify';
import { getLookupCountry } from '@src/api/contact.actions';
import { getLookupProductOption } from '@src/api/product.actions';
import { addSellProductInventory, getFullProductModel, getLaserType } from '@src/api/sell.action';

import {
  blooleanValue, leadRecordType, leadSourceType, ownerShip, powerRequirements,
} from '@src/components/contactComponents';

import { createRef } from 'react';
import PageLayout from '@src/layouts/PageLayout';

const SellDevice = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const recaptchaRef = createRef();

  const {
    register, errors, handleSubmit, control, setValue, getValues, clearErrors,
  } = useForm();
  
  const router = useRouter();

  const [selectedProduct, setSelectedProduct] = useState();
  const [productCompanyInfo, setProductCompanyInfo] = useState([]);
  const [productCompany, setProductCompany] = useState([]);
  const [showDropzone, setShowDropzone] = useState(false);

  const [apiErrors, setApiErrors] = useState({});
  const [productOption, setProductOption] = useState([]);
  const [states, setStates] = useState([]);
  const [countriesInfo, setCountriesInfo] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [laserType, setLaserType] = useState([]);
  const [selectedLaserType, setSelectedLaserType] = useState();

  const [selectedPowerRequirement, setSelectedPowerRequirement] = useState(powerRequirements[0]);
  const [selectedOwnerShip, setSelectedOwnerShip] = useState(ownerShip[0]);
  const [selectedOPeratorManuals, setSelectedOPeratorManuals] = useState(blooleanValue[0]);
  const [selectedCUFactoryWarranty, setSelectedCUFactoryWarranty] = useState(blooleanValue[0]);
  const [selectedOriginalBoxes, setSelectedOriginalBoxes] = useState(blooleanValue[0]);

  const [showPhone, setShowPhone] = useState('');
  const [showFax, setShowFax] = useState('');

  const [files, setFiles] = useState();

  const fields = [
    'first_name', 'last_name', 'company', 'email', 'productName', 'street', 'address1', 'address2', 'country', 'zip', 'mzip',
    'state', 'productModel', 'ifOther', 'companyMfg', 'type', 'waveLength', 'productYear', 'phone', 'mobile', 'Mmobile', 'city',
    'askingPrice', 'bestOffer', 'serialNumber', 'reasonForSelling', 'productOptions', 'accessories', 'description',
    'productImageFile', 'videoLink', 'shotPulseCount', 'hourCount', 'handPieces', 'generalCondition', 'powerRequirements',
    'ownerShip', 'lastServiced', 'operatorManuals', 'cuFactoryWarranty', 'originalBoxes', 'itlPrefix', 'ProductId',
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const optionData = await getLookupProductOption();
        setProductOption(optionData || []);
        setValue('productOption', optionData || '');
  
        const data = await getLookupCountry();
        if (data && data.length > 0) {
          const updatedData = data.map((item) => ({
            label: item.countryName,
            value: item.countryId,
          }));
          setCountries(updatedData);
          setCountriesInfo(data);
        } else {
          setCountries([]);
          setCountriesInfo([]);
        }
  
        const productModelData = await getFullProductModel();
        if (productModelData && productModelData.length > 0) {
          setProductCompanyInfo(productModelData);
          const minus = '-';
          const modelData = productModelData.map((item) => ({
            label: item.productName + minus + item.company,
            value: item.productId ?? '',
          }));
  
          setProductCompany(modelData);
          setSelectedProduct(modelData[0]);
        }
  
        fields.forEach((field) => setValue(field, ''));
  
        const laserData = await getLaserType();
        if (laserData && laserData.length > 0) {
          const updateddata = laserData.map((item) => ({
            label: item.name,
            value: item.laserTypeId,
          }));
          setLaserType(updateddata || []);
          setSelectedLaserType(updateddata[0] || '');
        } else {
          setLaserType([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleCountryChange = async (event) => {
    setSelectedCountry(event);
  };

  useEffect(() => {
    setSelectedCountry(countries?.length > 0 ? countries[225] : null);
  }, [countries]);
  useEffect(() => {
    setSelectedState(states?.length > 0 ? states[0] : null);
  }, [states]);

  useEffect(() => {
    if (selectedProduct) {
      const {
        company, waveLength, type, askingPrice, productName,
      } = productCompanyInfo?.find((item) => item.productId === selectedProduct.value);

      setValue('companyMfg', company);
      setValue('waveLength', waveLength);
      setValue('ifOther', productName);
      setValue('type', type);
      setSelectedLaserType(type);
      setValue('askingPrice', askingPrice);
    }
  }, [selectedProduct]);

  const handleControlledDropzoneChangeStatus = (status, allFiles) => {
    setTimeout(() => {
      if (['done', 'removed'].includes(status)) {
        setFiles([...allFiles]);
      }
    }, [selectedProduct]);
  }; 

  const [isVerified, setIsVerified] = useState(false);
  const handleVerify = () => {
    setIsVerified(true);
  };

  const onSubmit = async (data) => {
    if (!isVerified) {
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Please verify that you are not a robot.
        </>, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
        }
      );
      return;
    }
    const options = productOption
      .filter((item) => data[item.name] === 'true')
      .map((item) => item.name)
      .join(',');

    const requestOptions = {
      method: 'POST',
      mode: 'no-cors',
    };

    setValue('fax', showFax);
    setValue('phone', showPhone);
    setValue('productImageFile', files?.length === 0 ? null : files);

    const baseUrl = 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8';
    let queryParams = 'oid=00DDn000009Q6pN&retURL=https://sl-it-whappeastus-02.azurewebsites.net';
    queryParams += `&lead_source=${leadSourceType[1].label}`;
    queryParams += `&recordType=${leadRecordType[0].value}`;

    queryParams += `&00NDn00000e7sPD=${getValues('comments')}`;

    // ---- your information ----------
    queryParams += `&first_name=${encodeURIComponent(getValues('first_name') ?? '')}`;
    queryParams += `&last_name=${encodeURIComponent(getValues('last_name') ?? '')}`;
    queryParams += `&company=${encodeURIComponent(getValues('company') ?? '')}`;
    queryParams += `&email=${encodeURIComponent(getValues('email') ?? '')}`;
    queryParams += `&state=${encodeURIComponent(getValues('state') ?? '')}`;
    queryParams += `&zip=${encodeURIComponent(getValues('zip') || getValues('mzip'))}`;
    queryParams += `&city=${encodeURIComponent(getValues('city') ?? '')}`;
    queryParams += `&mobile=${encodeURIComponent(getValues('mobile') ?? '')}`;
    queryParams += `&phone=${encodeURIComponent(getValues('phone') ?? '')}`;
    queryParams += `&country=${encodeURIComponent(getValues('country') ?? '')}`;
    queryParams += `&street=${encodeURIComponent(getValues('street') ?? '')}`;    
    // ---product setting---------------
    queryParams += `&00NDn00000aHVmz=${encodeURIComponent(selectedProduct?.label)}`;
    queryParams += `&00NDn00000aGphH=${encodeURIComponent(getValues('ifOther') ?? '')}`;
    queryParams += `&00NDn00000aGqo9=${encodeURIComponent(getValues('productImageFile') ?? '')}`;
    queryParams += `&00NDn00000aIDrI=${encodeURIComponent(getValues('companyMfg'))}`; // mfg
    queryParams += `&00NDn00000e7sSl=${encodeURIComponent(selectedLaserType?.label)}`;
    queryParams += `&00NDn00000aIFM2=${encodeURIComponent(getValues('waveLength') ?? '')}`;
    queryParams += `&00NDn00000aIFM7=${encodeURIComponent(getValues('productYear') ?? '')}`;
    queryParams += `&00NDn00000aGphq=${encodeURIComponent(getValues('askingPrice'))}`;
    queryParams += `&00NDn00000aGpy3=${encodeURIComponent(options)}`;
    queryParams += `&00NDn00000aGppf=${encodeURIComponent(selectedPowerRequirement?.label ?? '')}`;
    queryParams += `&00NDn00000aGpkf=${encodeURIComponent(selectedOPeratorManuals?.label ?? '')}`;
    queryParams += `&00NDn00000aGpjw=${encodeURIComponent(selectedCUFactoryWarranty?.label ?? '')}`;
    queryParams += `&00NDn00000aGpkz=${encodeURIComponent(selectedOriginalBoxes?.label ?? '')}`;
    queryParams += `&description=${encodeURIComponent(getValues('description') ?? '')}`;
    queryParams += `&00NDn00000aGpk1=${encodeURIComponent(getValues('reasonForSelling') ?? '')}`;
    queryParams += `&00NDn00000aGpln=${encodeURIComponent(getValues('videoLink') ?? '')}`;
    queryParams += `&00NDn00000aGpi5=${encodeURIComponent(getValues('bestOffer') ?? '')}`;
    queryParams += `&00NDn00000aGpiZ=${encodeURIComponent(getValues('accessories') ?? '')}`;
    queryParams += `&00NDn00000aGpiK=${encodeURIComponent(getValues('serialNumber') ?? '')}`;
    queryParams += `&00NDn00000aGpkG=${encodeURIComponent(getValues('generalCondition') ?? '')}`;
    queryParams += `&00NDn00000aGpjN=${encodeURIComponent(getValues('lastServiced') ?? '')}`;
    queryParams += `&00NDn00000aGpiP=${encodeURIComponent(getValues('handPieces') ?? '')}`;
    queryParams += `&00NDn00000aGpkV=${encodeURIComponent(selectedOwnerShip?.label ?? '')}`;
    queryParams += `&00NDn00000e7sX2=${encodeURIComponent(getValues('hourCount') ?? '')}`;
    queryParams += `&00NDn00000e7sWi=${encodeURIComponent(getValues('shotPulseCount') ?? '')}`;

    const url = `${baseUrl}&${queryParams}`;

    await fetch(
      url,
      requestOptions
    )
      .then((response) => {
        router.push('/sell/listdevice');
        window.scrollTo(0, 0);
      })
      .catch((error) => console.log('error', error));
    // ----------------------------------------------------------
    const optionid = productOption
      .filter((item) => data[item.name] === 'true')
      .map((item) => item.productOptionId)
      .join(',');
    setValue('productOptions', optionid);
    setValue('country', selectedCountry?.value ? selectedCountry.value : 0);
    setValue('state', selectedState?.value ? selectedState.value : 0);
    setValue('productModel', selectedProduct?.value ? selectedProduct.value : 0);
    setValue('type', selectedLaserType?.label);
    setValue('powerRequirements', selectedPowerRequirement?.label ? selectedPowerRequirement.label : '');
    setValue('ownerShip', selectedOwnerShip?.label);
    setValue('cuFactoryWarranty', selectedCUFactoryWarranty?.value ? selectedCUFactoryWarranty.value : 0);
    setValue('ProductId', selectedProduct?.value ? selectedProduct.value : 0);

    const { productName } = productCompanyInfo.find((item) => item.productId === selectedProduct.value);
    setValue('productName', productName || '');
    const form = new FormData();
    form.append('Contact.Phone', getValues('phone'));
    form.append('ProductInventory.WaveLength', getValues('waveLength') ?? '');
    form.append('Contact.Comments', getValues('comments'));
    form.append('Contact.State', getValues('state') ?? 0);
    form.append('Contact.Type', getValues('ownerShip') === 'Owned' ? 'sell' : 'lease');
    form.append('Contact.Country', getValues('country') ?? 0);
    form.append('ProductInventory.ProductId', getValues('ProductId') ?? 0);
    form.append('ProductInventory.EnergyOutput', getValues('powerRequirements') ?? '');
    form.append('Contact.Address1', getValues('street') ?? '');
    form.append('ProductInventory.ProductYear', getValues('productYear') ?? '');
    form.append('Contact.Address2', getValues('address2') ?? '');
    form.append('ProductInventory.InvDescription', getValues('description') ?? '');
    form.append('ProductInventory.ReasonForSelling', getValues('reasonForSelling') ?? '');
    form.append('Contact.FirstName', getValues('first_name') ?? '');
    form.append('Contact.Email', getValues('email') ?? '');
    form.append('ProductInventory.BlueDot', false); // default
    form.append('Contact.city', getValues('city') ?? '');
    form.append('Contact.mobile', getValues('mobile') ?? '');
    form.append('Contact.LastName', getValues('last_name') ?? '');
    form.append('ProductInventory.ProductOptions', getValues('productOptions') ?? '');
    form.append('Contact.Zip', getValues('zip') ?? '');
    form.append('ProductInventory.Include30DayWarranty', getValues('cuFactoryWarranty') === 0);
    form.append('Contact.Active', 'true');
    form.append('ProductInventory.VideoLink', getValues('videoLink') ?? '');
    form.append('ProductInventory.BestOffer', getValues('bestoffer') ?? false);
    form.append('ProductInventory.HotDeal', false); // default
    form.append('ProductInventory.ProductName', getValues('productName') ?? '');
    form.append('Contact.CompanyName', getValues('company') ?? '');
    form.append('ProductInventory.Type', getValues('type') ?? '');
    form.append('ProductInventory.Company', getValues('companyMfg') ?? '');
    form.append('ProductInventory.PulseLength', getValues('shotPulseCount') ?? ''); //
    form.append('ProductInventory.SerialNumber', getValues('serialNumber') ?? '');
    form.append('ProductInventory.AskingPrice', getValues('askingPrice') ?? '');
    form.append('ProductInventory.UserImageFile', getValues('productImageFile') ?? '');

    const description = `${getValues('description')}; Accessories: ${getValues('accessories')}; 
    Shot/Pulse Count: ${getValues('shotPulseCount')}; General Condition: ${getValues('generalCondition')};
    Power: ${getValues('powerRequirements')}; Ownership: ${getValues('ownerShip')};
    Last Serviced: ${getValues('lastServiced')}; Currently Under Factory Warranty: ${selectedCUFactoryWarranty?.label};
    Original Boxes/Crate: ${selectedOriginalBoxes.label}; Handpieces: ${getValues('handPieces')};
    Hour Count: ${getValues('hourCount')}; Operator Manuals: ${selectedOPeratorManuals.label};`;

    form.append('ProductInventory.Description', description);

    try {
      const res = await addSellProductInventory(form);
      if (res) {
        toast.success(
          <>
            <CheckCircle className="mr-1 text-success" />
            Sell successed
          </>, {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: true,
          }
        );
      }
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setApiErrors({ data: 'Sell error' });
      } else {
        setApiErrors(err.response ? err.response : { data: err.response});
      }
    }
  };

  const DynamicProduct = () => (
    <>
      <Label className="sentient-content py-3 m-0 p-0">
        Indicated Uses:
      </Label>
      <FormGroup>
        <div className="row col-12">
          {productOption?.map((item) => (
            <div className="col-sm-6 sentient-content pb-1 " key={item.productOptionId}>
              <input
                type="checkbox"
                name={item.name}
                id={item.productOptionId}
                value={item.active}
                className={classnames('form-check-input')}
                {...register(item.name, { required: false })}
              />
              <label htmlFor="" className="form-check-label sentient-content px-3 ">{item.name}</label>
            </div>
            // <div className="col-sm-6 sentient-content pb-1" key={item.productOptionId}>
            //   <CustomInput
            //     inline
            //     type="checkbox"
            //     name={item.name}
            //     value={item.active}
            //     id={item.productOptionId}
            //     label={item.name}
            //     {...register(item.name, { required: false })}
            //   />
            // </div>
          ))}
        </div>
      </FormGroup>
    </>
  );

  const handleButtonClick = () => {
    clearErrors();
    handleSubmit(onSubmit)();
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue('phone', inputValue); // Update the 'phone1' value in the form
    setShowPhone(inputValue); // Update state for visual display, if needed
  };

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
    <div className="row col-12 pageTop">
      <div className="row col-12 pb-sm-5 pb-2 m-0 p-0">
        <div className="col-lg-5 col-12 px-md-5 px-3 pt-sm-5 pt-2 m-0 p-0">
          <h1 className="col-sm-11 col-12 sentient-title m-0 p-0" style={{ color: '#65CF10' }}>
            Sell to
            <br />
            LaserTrader
          </h1>
        </div>
        <div className="col-lg-7 col-12 px-md-5 px-3 pt-sm-5 pt-2 m-0 p-0">
          <p className="sentient-content">
            Fill out the form below as completely as possible and make sure to include contact information and a phone number so we can reach you. We’ll contact you as soon as we get any response(s) from your ad.
            <br />
            <br />
            Questions on how to create your listing? Reach out—we’re always here to help.
          </p>
        </div>
      </div>

      <div className="col-12 px-md-5 px-3 m-0 p-0">
        <hr className="sentient-underline d-sm-flex d-none" />
      </div>

      <div className="row col-12 m-0 p-0">
        <Form onSubmit={handleSubmit(onSubmit)} className="row col-12 m-0 p-0">
          {apiErrors.data ? (
            <Alert color="danger">
              <div className="alert-body">
                <span>{`Error: ${apiErrors.data}`}</span>
              </div>
            </Alert>
          ) : <></>}
          <div className="row col-12 pt-sm-5 pt-2 pb-3 m-0 p-0">
            <div className="col-lg-5 col-12 px-md-5 px-3 pb-2 m-0 p-0">
              <h1 className="col-sm-11 col-12 sentient-subtitle m-0 p-0">
                Your Information
              </h1>
            </div>
            <div className="col-lg-7 col-12 px-md-5 px-3  m-0 p-0">
              <div className="col-12 m-0 p-0">
                <input type="hidden" name="oid" value="00DDn000009Q6pN" />
                <input type="hidden" name="retURL" value="https://sl-it-whappeastus-02.azurewebsites.net" />
                <FormGroup className="form-group row form-row align-items-center">
                  <input
                    type="text"
                    placeholder="FirstName*"
                    id="first_name"
                    name="first_name"
                    className={`form-control sentient-content ${errors && errors.first_name ? 'is-invalid' : ''}`}
                    style={{ border: '1px solid #646464' }}
                    {...register("first_name", { required: true })}
                  />
                </FormGroup>
                <FormGroup className="form-group row form-row align-items-center">
                    <input 
                    name="last_name" 
                    type="text" 
                    placeholder="LastName*"
                    {...register('last_name', { required: true })} 
                    id="last_name" 
                    className={`form-control ${errors && errors.last_name ? 'is-invalid' : ''}`} 
                    />
                </FormGroup>
                <FormGroup className="form-group row form-row align-items-center">
                  <input
                    type="text"
                    placeholder="CompanyName"
                    id="company"
                    name="company"
                    className={classnames({ 'is-invalid': errors && errors.company }, 'form-control sentient-content')}
                    style={{ border: '1px solid #646464' }}
                    {...register('company', { required: true })} 
                  />
                </FormGroup>
                <FormGroup className="form-group row form-row align-items-center">
                  <input
                    type="email"
                    placeholder="Email*"
                    id="email"
                    name="email"
                    className={classnames({ 'is-invalid': errors && errors.email }, 'form-control sentient-content')}
                    style={{ border: '1px solid #646464' }}
                    {...register('email', { required: true })} 
                  />
                </FormGroup>
                <FormGroup className="form-group row form-row align-items-center">
                  <input
                    type="text"
                    placeholder="Address1"
                    id="street"
                    name="street"
                    className={classnames({ 'is-invalid': errors && errors.street }, 'form-control sentient-content')}
                    style={{ border: '1px solid #646464' }}
                    {...register('street', { required: true })} 
                  />
                </FormGroup>
                <FormGroup className="form-group row form-row align-items-center">
                  <input
                    type="text"
                    placeholder="Address2"
                    id="address2"
                    name="address2"
                    className={classnames({ 'is-invalid': errors && errors.address2 }, 'form-control sentient-content')}
                    style={{ border: '1px solid #646464' }}
                    {...register('address2', { required: false })} 
                  />
                </FormGroup>

                <FormGroup className="form-group row form-row align-items-center">
                  <input
                    type="text"
                    placeholder="City"
                    id="city"
                    name="city"
                    className={classnames({ 'is-invalid': errors && errors.city }, 'form-control sentient-content')}
                    style={{ border: '1px solid #646464' }}
                    {...register('city', { required: false })} 
                  />
                </FormGroup>

                <FormGroup className="form-group row form-row align-items-center">
                  <div className="col-12 m-0 p-0">
                    <Select
                      options={countries}
                      id="country"
                      name="country"
                      value={selectedCountry}
                      isClearable={false}
                      control={control}
                      defaultValue={countries?.length > 0 ? countries[225] : null}
                      className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.country })}`}
                      classNamePrefix="select"
                      style={{ border: '1px solid #646464' }}
                      onChange={(value) => { handleCountryChange(value); }}
                      {...register('country')?.label}
                    />
                  </div>
                </FormGroup> 

                <FormGroup>
                  <div className="form-group row form-row align-items-center">
                    <div className="col-md-6 col-12 m-0 p-0">
                      <input
                        type="text"
                        placeholder="State"
                        id="state"
                        name="state"
                        className={classnames({ 'is-invalid': errors && errors.state }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                        {...register('state', { required: false })} 
                      />
                    </div>
                    <div className="col-md-6 col-12 d-sm-flex d-none">
                      <input
                        type="text"
                        placeholder="Zip"
                        id="zip"
                        name="zip"
                        className={classnames({ 'is-invalid': errors && errors.zip }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                        {...register('zip', { required: false })} 
                      />
                    </div>
                    {/* mobile */}
                    <div className="col-md-6 col-12 m-0 p-0 pt-1 d-sm-none d-flex">
                      <Input
                        type="text"
                        placeholder="Zip"
                        id="mzip"
                        name="mzip"
                        className={classnames({ 'is-invalid': errors && errors.mzip }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                        {...register('mzip', { required: false })} 
                      />
                    </div>
                  </div>
                </FormGroup>

                <FormGroup>
                  <div className="form-group row form-row align-items-center">
                    <div className="col-md-6 col-12 m-0 p-0">
                      <InputMask
                        type="text"
                        mask="999 999 9999"
                        id="phone"
                        name="phone"
                        placeholder="phone: (123) 555 1234"
                        defaultValue={showPhone}
                        onChange={(e) => (setShowPhone(e.target.value))}
                        className={classnames({ 'is-invalid': errors && errors.phone }, 'form-control sentient-content w-100 px-1')}
                        {...register('phone', { required: false })}
                        style={{ border: '1px solid #646464', height: '40px' }}
                      />
                    </div>
                    <div className="col-md-6 col-12 d-sm-flex d-none">
                      <input
                        type="text"
                        placeholder="Mobile"
                        id="mobile"
                        name="mobile"
                        className={classnames({ 'is-invalid': errors && errors.mobile }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                        {...register('mobile', { required: false })} 
                      />
                    </div>
                    {/* mobile */}
                    <div className="col-md-6 col-12 pt-1 m-0 p-0 d-sm-none d-flex">
                      <input
                        type="text"
                        placeholder="Mobile"
                        id="Mmobile"
                        name="Mmobile"
                        className={classnames({ 'is-invalid': errors && errors.Mmobile }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                        {...register('Mmobile', { required: false })} 
                      />
                    </div>
                  </div>
                </FormGroup>

                <FormGroup className="form-group row form-row align-items-center">
                  <textarea
                    type="textarea"
                    placeholder="Comments"
                    id="comments"
                    name="comments"
                    rows={5}
                    className={classnames({ 'is-invalid': errors && errors.comments }, 'form-control sentient-content')}
                    {...register('comments', { required: false })} 
                    style={{ border: '1px solid #646464' }}
                  />
                </FormGroup>                  
              </div>
            </div>
          </div>

          <div className="col-12 px-md-5 px-3 m-0 p-0">
            <hr className="sentient-underline d-sm-flex d-none" />
          </div>

          <div className="row col-12 py-sm-5 py-2 m-0 p-0">
            <div className="col-lg-5 col-12 px-md-5 px-3 pb-2 m-0 p-0">
              <h1 className="col-12 sentient-subtitle m-0 p-0">
                Product Information
              </h1>
            </div>

            <div className="col-lg-7 col-12 px-md-5 px-3  m-0 p-0">
              <FormGroup className="form-group row form-row align-items-center">
                <div className="col-12 m-0 p-0">
                  <Select
                    as={Select}
                    options={productCompany}
                    name="productModel"
                    value={selectedProduct}
                    isClearable={false}
                    control={control}
                    defaultvalue={selectedProduct || ''}
                    placeholder="Product / Model: Select existing product"
                    className={`react-select ${classnames({ 'is-invalid': errors && errors.productModel }, 'sentient-content')}`}
                    classNamePrefix="select"
                    onChange={(value) => (setSelectedProduct(value))}
                    style={{ border: '1px solid #646464' }}
                    {...register('productModel')?.label}
                  />
                </div>
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="text"
                  placeholder="Product: If not available in dropdown"
                  id="ifOther"
                  name="ifOther"
                  className={classnames({ 'is-invalid': errors && errors.ifOther }, 'form-control sentient-content')}
                  style={{ border: '1px solid #646464' }}
                  {...register('ifOther', { required: false })}
                />
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="text"
                  placeholder="Input CompanyMfg"
                  id="companyMfg"
                  name="companyMfg"
                  className={classnames({ 'is-invalid': errors && errors.companyMfg }, 'form-control sentient-content')}
                  style={{ border: '1px solid #646464' }}
                  {...register('companyMfg', { required: false })}
                />
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <div className="col-12 m-0 p-0">
                  <Select
                    as={Select}
                    options={laserType}
                    name="type"
                    value={selectedLaserType}
                    isClearable={false}
                    control={control}
                    defaultvalue={selectedLaserType || ''}
                    placeholder="Product / Model: Select existing product"
                    className={`react-select ${classnames({ 'is-invalid': errors && errors.type }, 'sentient-content')}`}
                    classNamePrefix="select"
                    onChange={(value) => (setSelectedLaserType(value))}
                    style={{ border: '1px solid #646464' }}
                    {...register('type')?.label}
                  />
                </div>
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="text"
                  placeholder="Input waveLength"
                  id="waveLength"
                  name="waveLength"
                  className={classnames({ 'is-invalid': errors && errors.waveLength }, 'form-control sentient-content')}
                  style={{ border: '1px solid #646464' }}
                  {...register('waveLength', { required: false })}
                />
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="text"
                  placeholder="Input productYear"
                  id="productYear"
                  name="productYear"
                  className={classnames({ 'is-invalid': errors && errors.productYear }, 'form-control sentient-content')}
                  style={{ border: '1px solid #646464' }}
                  {...register('productYear', { required: true, pattern: /^\d{4}$/ })}
                />
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="text"
                  placeholder="Input askingPrice"
                  id="askingPrice"
                  name="askingPrice"
                  className={classnames({ 'is-invalid': errors && errors.askingPrice }, 'form-control sentient-content')}
                  style={{ border: '1px solid #646464' }}
                  {...register('askingPrice', { required: false })}
                />
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <div className="d-flex align-itmes-center m-0 p-0">
                  <input
                    type="checkbox"
                    name="bestOffer"
                    id="bestOffer"
                    className={classnames({ 'is-invalid': errors && errors.bestOffer }, 'form-check-input')}
                    {...register('bestOffer', { required: false })}
                  />
                  <label htmlFor="bestOffer" className="form-check-label sentient-content px-3">Display “Or Best Offer/OBO” after listing price</label>
                </div>
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="text"
                  placeholder="Input serialNumber"
                  id="serialNumber"
                  name="serialNumber"
                  className={classnames({ 'is-invalid': errors && errors.serialNumber }, 'form-control sentient-content')}
                  style={{ border: '1px solid #646464' }}
                  {...register('serialNumber', { required: false })}
                />
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="textarea"
                  placeholder="ReasonForSelling"
                  id="reasonForSelling"
                  name="reasonForSelling"
                  rows={5}
                  className={classnames({ 'is-invalid': errors && errors.reasonForSelling }, 'form-control sentient-content')}
                  {...register('reasonForSelling', { required: false })}
                  style={{ border: '1px solid #646464' }}
                />
              </FormGroup>

              {DynamicProduct()}

              <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="textarea"
                  placeholder="Accessories"
                  id="accessories"
                  name="accessories"
                  rows={5}
                  className={classnames({ 'is-invalid': errors && errors.accessories }, 'form-control sentient-content')}
                  {...register('accessories', { required: false })}
                  style={{ border: '1px solid #646464' }}
                />
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="text"
                  placeholder="shot/plusCount"
                  id="shotPulseCount"
                  name="shotPulseCount"
                  className={classnames({ 'is-invalid': errors && errors.shotPulseCount }, 'form-control sentient-content')}
                  style={{ border: '1px solid #646464' }}
                  {...register('shotPulseCount', { required: false })}
                />
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="text"
                  placeholder="hourCount"
                  id="hourCount"
                  name="hourCount"
                  className={classnames({ 'is-invalid': errors && errors.hourCount }, 'form-control sentient-content')}
                  style={{ border: '1px solid #646464' }}
                  {...register('hourCount', { required: false })}
                />
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="text"
                  placeholder="handPieces"
                  id="handPieces"
                  name="handPieces"
                  className={classnames({ 'is-invalid': errors && errors.handPieces }, 'form-control sentient-content')}
                  style={{ border: '1px solid #646464' }}
                  {...register('handPieces', { required: false })}
                />
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="text"
                  placeholder="generalCondition"
                  id="generalCondition"
                  name="generalCondition"
                  className={classnames({ 'is-invalid': errors && errors.generalCondition }, 'form-control sentient-content')}
                  style={{ border: '1px solid #646464' }}
                  {...register('generalCondition', { required: false })}
                />
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <div className="col-12 m-0 p-0">
                  <Select
                    as={Select}
                    options={powerRequirements}
                    name="powerRequirements"
                    isClearable={false}
                    control={control}
                    className={`react-select ${classnames({ 'is-invalid': errors && errors.powerRequirements }, 'sentient-content')}`}
                    classNamePrefix="select"
                    defaultValue={powerRequirements[0]}
                    value={selectedPowerRequirement}
                    onChange={(value) => (setSelectedPowerRequirement(value))}
                    style={{ border: '1px solid #646464' }}
                    {...register('powerRequirements')?.label}
                  />
                </div>
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <div className="col-12 m-0 p-0">
                  <Select
                    as={Select}
                    options={ownerShip}
                    name="ownerShip"
                    isClearable={false}
                    control={control}
                    className={`react-select ${classnames({ 'is-invalid': errors && errors.ownerShip }, 'sentient-content')}`}
                    classNamePrefix="select"
                    defaultValue={ownerShip[0]}
                    value={selectedOwnerShip}
                    onChange={(value) => (setSelectedOwnerShip(value))}
                    style={{ border: '1px solid #646464' }}
                    {...register('ownerShip')?.label}
                  />
                </div>
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="text"
                  placeholder="lastServiced"
                  id="lastServiced"
                  name="lastServiced"
                  className={classnames({ 'is-invalid': errors && errors.lastServiced }, 'form-control sentient-content')}
                  style={{ border: '1px solid #646464' }}
                  {...register('lastServiced', { required: false })}
                />
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <div className="col-12 m-0 p-0">
                  <Select
                    as={Select}
                    options={blooleanValue}
                    name="operatorManuals"
                    isClearable={false}
                    control={control}
                    className={`react-select ${classnames({ 'is-invalid': errors && errors.operatorManuals }, 'sentient-content')}`}
                    classNamePrefix="select"
                    defaultValue={blooleanValue[0]}
                    value={selectedOPeratorManuals}
                    onChange={(value) => (setSelectedOPeratorManuals(value))}
                    style={{ border: '1px solid #646464' }}
                    {...register('lastServiced')?.label}
                  />
                </div>
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <div className="col-12 m-0 p-0">
                  <Select
                    as={Select}
                    options={blooleanValue}
                    name="cuFactoryWarranty"
                    isClearable={false}
                    control={control}
                    className={`react-select ${classnames({ 'is-invalid': errors && errors.cuFactoryWarranty }, 'sentient-content')}`}
                    classNamePrefix="select"
                    defaultValue={blooleanValue[0]}
                    value={selectedCUFactoryWarranty}
                    onChange={(value) => (setSelectedCUFactoryWarranty(value))}
                    style={{ border: '1px solid #646464' }}
                    {...register('cuFactoryWarranty').label}
                  />
                </div>
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <div className="col-12 m-0 p-0">
                  <Select
                    as={Select}
                    options={blooleanValue}
                    name="originalBoxes"
                    isClearable={false}
                    control={control}
                    className={`react-select ${classnames({ 'is-invalid': errors && errors.originalBoxes }, 'sentient-content')}`}
                    classNamePrefix="select"
                    defaultValue={blooleanValue[0]}
                    value={selectedOriginalBoxes}
                    onChange={(value) => (setSelectedOriginalBoxes(value))}
                    style={{ border: '1px solid #646464' }}
                    {...register('originalBoxes').label}
                  />
                </div>
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <textarea
                  placeholder="description"
                  id="description"
                  name="description"
                  rows={5}
                  className={classnames({ 'is-invalid': errors && errors.description }, 'form-control sentient-content')}
                  {...register('description', { required: false })}
                  style={{ border: '1px solid #646464' }}
                />
              </FormGroup>

              <FormGroup>
                <div className="form-group row">
                  <Label className="sentient-text-content col-12 col-form-label">
                    Your Products Image:
                  </Label>
                  <div className="col-12">
                    {register.productImageFile && !showDropzone ? (
                      <>
                        <img src={register.productImageFile} width={200} height={200}  alt="logo" />
                        <Button.Ripple onClick={() => setShowDropzone(true)} className="btn-sm float-right" color="flat-info">Change</Button.Ripple>
                      </>
                    ) : (<></>)}

                    {!register.productImageFile || showDropzone ? (
                      <Controller
                        style={{ border: '1px solid #646464' }}
                        control={control}
                        name="productImageFile"
                        render={({ onChange }) => (
                          <Dropzone
                            accept={acceptedImageFormats}
                            multiple={false}
                            maxFiles={1}
                            maxSizeBytes={(1024 * 1024) * 50} // 2MB
                            inputContent={(files, extra) => (extra.reject ? `Only ${acceptedImageFormats} allowed` : 'Drop image here or click to browse')}
                            styles={{
                              dropzoneReject: { borderColor: '#F19373 !important', backgroundColor: '#F1BDAB' },
                              inputLabel: (files, extra) => (extra.reject ? { color: '#A02800 !important' } : {}),
                            }}
                            onChangeStatus={(file, status, allFiles) => {
                              handleControlledDropzoneChangeStatus(status, allFiles, onChange);
                            }}
                          />
                        )}
                      />

                    ) : (<></>)}
                  </div>
                </div>
              </FormGroup>

              <FormGroup>
                <div className="form-group row">
                  <Label className="col-12 col-form-label m-0 p-0">
                    Video Link: Enter the full YouTube.com embed code (iFrame code)
                  </Label>
                  <div className="col-12 m-0 p-0">
                    <textarea
                      // type="textarea"
                      placeholder=""
                      id="videoLink"
                      name="videoLink"
                      rows={5}
                      className={classnames({ 'is-invalid': errors && errors.videoLink }, 'form-control sentient-content')}
                      style={{ border: '1px solid #646464' }}
                      {...register('videoLink', { required: false })}
                    />
                  </div>
                </div>
              </FormGroup>

              <FormGroup>
                <div className="col-12 py-1 m-0 p-0">
                  <ReCAPTCHA
                    sitekey={process.env.APP_GOOGLE_CAPTCHA_KEY}
                    onChange={handleVerify}
                  />
                </div>
              </FormGroup>

              <FormGroup>
                <div className="py-3  m-0 p-0 d-flex">
                  <p className="sentient-button sentient-footer p-3" style={{ fontSize: '16px', fontWeight: '700', cursor: 'pointer' }} onClick={handleButtonClick}>
                    Submit your device for sale
                  </p>
                </div>
              </FormGroup>
            </div>
          </div>
        </Form>
      </div>
    </div>
    </PageLayout>
  );
};

export default SellDevice;
