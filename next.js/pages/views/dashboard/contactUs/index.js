import React, { useEffect, useState } from 'react';
import {
  Alert,
  Form, FormGroup, Input, Spinner,
} from 'reactstrap';

import { useForm } from 'react-hook-form';
import classnames from 'classnames';
import Select from 'react-select';
import ReCAPTCHA from 'react-google-recaptcha';
import { CheckCircle } from 'react-feather';


import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import { getLookupCountry,getLookupState } from '@src/api/contact.actions';
import { getDetailSearch } from '@src/api/buy.action';
import { addContactUsProductInventory } from '@src/api/contactUs.action';
import { useRouter } from 'next/router';
import { leadRecordType, leadSourceType } from '@src/components/contactComponents';
import SellDevice from '../sells/selldevice';
import PageLayout from '@src/layouts/PageLayout';

const ContactUs = () => {
  const router = useRouter();
  const { inventoryId, b, s } = router.query;
console.log("router"+router.asPath);
console.log("inventoryId"+inventoryId)
console.log("b"+b);
console.log("s"+s);
  const {
    register, errors, handleSubmit, control, setValue, getValues, clearErrors,
  } = useForm();

  const [apiErrors, setApiErrors] = useState({});
  const [countriesInfo, setCountriesInfo] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [tableData, setTableData] = useState({});
  const [methodOfContact, setMethodOfContact] = useState(null);

  const [showPhone, setShowPhone] = useState();
  const [showFax, setShowFax] = useState();
  const [selectedType, setSelectedType] = useState('');
  const [financeType, setFinanceType] = useState('');
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);


  const [contactType, setContactType] = useState([
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ]);
  const [financeVal, setFinanceVal] = useState([
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ]);

  const [communicationType, setCommunicationType] = useState([
    { value: 'Email', label: 'Email' },
    { value: 'Text', label: 'Text' },
    { value: 'Phone Call', label: 'Phone Call' },
  ]);



  const fields = [
    'first_name', 'last_name', 'company', 'email', 'street', 'address2', 'country', 'zip', 'mzip', 'city',
    'state', 'phone', 'mobile', 'Mmobile','comments', 'yourOffer', 'inventoryId', 'lead_source', 'recordType','preferredContactType','finance',
  ];

  useEffect(() => {
   //setSelectedType(contactType[0]);
    //setFinanceType(financeVal[0]);
    //setMethodOfContact(communicationType[0]);

    const fetchData = async () => {
      const data = await getLookupCountry();
      if (data?.length > 0) {
        const updateddata = data?.map((item) => ({
          label: item.countryName,
          value: item.countryId,
        }));
        setCountries(updateddata);
        setCountriesInfo(data);
      } else {
        setCountries([]);
        setCountriesInfo([]);
      }

      const data1 = await getLookupState("US");
      if (data1?.length > 0) {
        console.log("data1?.length"+data1?.length);
        const updateddata1= data1?.map((item) => ({
          label: item.stateName,
          value: item.stateId,
        }));
        setStates(updateddata1);
        setSelectedState(updateddata1[0]);
      }else{
        setStates([]);
        setSelectedState({});
      }
  
      const value = getValues('comments');
      fields.forEach((field) => {
        setValue(field, field === 'comments' && value ? value : '');
      });
  
      fields.forEach((field) => {
        register(field, field === 'comments' && value ? value : '');
      });
    };
  
    fetchData();
  }, []);
  
  const [isVerified, setIsVerified] = useState(false);
  const handleVerify = () => {
    setIsVerified(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const updateData = await getDetailSearch(inventoryId) || {};
      console.log("<<<<>>>>>>>>>>>>>")+JSON.stringify(updateData);
      setTableData(updateData);
      console.log(updateData);
      const value = `Inquiry about ${updateData?.productCompany} - ${updateData?.productModel} - SKU ${updateData?.sku}`;
      setValue('comments', value);
    };
  
    if (inventoryId) {
      fetchData();
    } else {
      setValue('comments', '');
    }
  }, [inventoryId]);
  

  useEffect(() => () => {
    if (location.state && location.state.inventoryId) {
      setValue('comments', '');
    }
  }, [router]);

  useEffect(() => {
    setSelectedCountry(countries?.length > 0 ? countries[225] : null);
  }, [countries]);

  const handleCountryChange = async (event) => {
    setSelectedCountry(event);
    const country = countriesInfo?.filter((country) => country.countryId === event.value);
    if (country?.length > 0) {
      const data = await getLookupState(country[0]?.countryCode);

      if (data?.length > 0) {
        const updateddata = data?.map((item) => ({
          label: item.stateName,
          value: item.stateId,
        }));
        setStates(updateddata);
        setSelectedState(updateddata[0]);
      } else {
        setStates([]);
        setSelectedState({});
      }
    }
  };

  const onSubmit = async () => {
    setValue('country', selectedCountry?.value ? selectedCountry.label : '');
    // setValue('fax', showFax);
    // setValue('phone', showPhone);
    console.log(getValues());

    if (!isVerified) {
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Please verify that you are not a robot.
        </>, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          style:{ textAlign:"left",width: "400px"}
        }
      );
      return;
    }
    console.log("fax>>>"+ (getValues('fax') || getValues('fax1')) ?? '',);
    const requestOptions = {
      method: 'POST',
      mode: 'no-cors',
    };

    const baseUrl = 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8';
    let queryParams = 'oid=00DDn000009Q6pN&retURL=https://sl-it-whappeastus-02.azurewebsites.net';
    queryParams += `&lead_source=${leadSourceType[1].label}`;
    queryParams += `&recordType=${leadRecordType[0].value}`;

    queryParams += `&00NDn00000e7sPD=${getValues('comments')}`;

    queryParams += `&first_name=${encodeURIComponent(getValues('first_name') ?? '')}`;
    queryParams += `&last_name=${encodeURIComponent(getValues('last_name') ?? '')}`;
    queryParams += `&company=${encodeURIComponent(getValues('company') ?? '')}`;
    queryParams += `&email=${encodeURIComponent(getValues('email') ?? '')}`;
    queryParams += `&state=${encodeURIComponent( selectedState?.value ? selectedState.value : 0)}`;
    queryParams += `&zip=${encodeURIComponent(getValues('zip') || getValues('mzip'))}`;
    queryParams += `&city=${encodeURIComponent(getValues('city') ?? '')}`;
    queryParams += `&phone=${encodeURIComponent(getValues('phone') ?? '')}`;
    queryParams += `&country=${encodeURIComponent(getValues('country') ?? '')}`;
    queryParams += `&mobile=${encodeURIComponent((getValues('mobile') || getValues('Mmobile')) ?? '')}`;
    queryParams += `&street=${encodeURIComponent(getValues('street') ?? '')}`;

    // fields.forEach((field) => { queryParams += getValues(field) ? `&${field}=${getValues(field)}` : ''; });
    queryParams += `&zip=${encodeURIComponent(getValues('zip') || getValues('mzip'))}`;

    if (inventoryId) {
      if (b === '1') {
        queryParams += `&00NDn00000e7sSv=${getValues('yourOffer') || ''}`;
      }
      queryParams += `&00NDn00000aHVmz=${encodeURIComponent(tableData?.productModel)}`;
      queryParams += `&00NDn00000aGpgd=${encodeURIComponent(tableData?.sku)}`;
      queryParams += `&00NDn00000aIDrI=${encodeURIComponent(tableData?.productCompany)}`; // mfg
      queryParams += `&00NDn00000e7sSl=${encodeURIComponent(tableData?.productType)}`;
      queryParams += `&00NDn00000aIFM2=${encodeURIComponent(tableData?.waveLength)}`;
      queryParams += `&00NDn00000aIFM7=${encodeURIComponent(tableData?.productYear)}`;
      queryParams += `&00NDn00000aGphq=${encodeURIComponent(tableData?.askingPrice)}`;
      queryParams += `&00NDn00000aGpy3=${encodeURIComponent(tableData?.productOptions)}`; // And/Or Indicated Use
    }
    
    const url = `${baseUrl}&${queryParams}`;

    await fetch(
      url,
      requestOptions
    )
      .then((response) => {       
        if (b === '1') {
          router.push(`/contact-us?inventoryId=${inventoryId}&b=1`);
        } else if (inventoryId) {
          router.push(`/contact-us?inventoryId=${inventoryId}`);
        } else {
          router.push('/contact-us');
        }
        window.scrollTo(0, 0);
      })
      .catch((error) => console.log('error', error));
    // ---------------------------------------------------------
    let type = 'question';
    if (inventoryId) {
      type = b === '1' ? 'buyer offer' : 'buyer question';
    }    

    if(b === '1'){
      const formData = {
        contact: {
          phone: getValues('phone'),
          comments: getValues('comments') ?? '',
          state: selectedState?.value ? selectedState.value : 0,
          country: selectedCountry?.value ?? 0,
          address1: getValues('street') ?? '',
          address2: getValues('address2') ?? '',
          firstName: getValues('first_name') ?? '',
          email: getValues('email') ?? '',
          mobile: getValues('mobile') ?? '',
          lastName: getValues('last_name') ?? '',
          city: getValues('city') ?? '',
          zip: getValues('zip') ?? '',
          active: 'true',
          companyName: getValues('company') ?? '',
          preferredContactType: selectedType.value || '',
          fax: (getValues('fax') || getValues('fax1')) ?? '',
          finance: financeType.value || '',
          methodOfContact:methodOfContact?.value ?? '',
          type,
        
        },
        inventoryId: inventoryId ?? 0,
        offerPrice: getValues('yourOffer') || 0,
      };
  
      try {
        await addContactUsProductInventory(formData);
        toast.success('Contact us succeeded', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          style:{ textAlign:"left",width: "400px"}
        });

      } catch (err) {
        if (err.response && err.response.status === 500) {
          setApiErrors({ data: 'contact us error' });
        } else {
          setApiErrors(err.response ? err.response : { data: err.response});
        }
      } 
    } else {
        const formData = {
          contact: {
            phone: getValues('phone'),
            comments: getValues('comments') ?? '',
            state: selectedState?.value ? selectedState.value : 0,
            country: selectedCountry?.value ?? 0,
            address1: getValues('street') ?? '',
            address2: getValues('address2') ?? '',
            firstName: getValues('first_name') ?? '',
            email: getValues('email') ?? '',
            mobile: (getValues('mobile') || getValues('Mmobile')) ?? '',
            lastName: getValues('last_name') ?? '',
            city: getValues('city') ?? '',
            zip: getValues('zip') ?? '',
            active: 'true',
            companyName: getValues('company') ?? '',
            preferredContactType: selectedType.value || '',
            fax: (getValues('fax') || getValues('fax1')) ?? '',
            finance: financeType.value ||  '',
            methodOfContact:methodOfContact?.value ?? '',
            type,
          
          },
          inventoryId: inventoryId ?? 0,
        };

        try {
          await addContactUsProductInventory(formData);
          toast.success('Contact us succeeded', {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: true,
            style:{ textAlign:"left",width: "400px"}
          });  
        } catch (err) {
          if (err.response && err.response.status === 500) {
            setApiErrors({ data: 'contact us error' });
          } else {
            setApiErrors(err.response ? err.response : { data: err.response});
          }
        }
    }     
  };

  const handleButtonClick = () => {
    clearErrors();
    handleSubmit(onSubmit)();
  };

  return (
    <>
    <PageLayout>
      { s === '1' && <SellDevice />}
      { s !== '1'
      && (
      <div className="w-100 pageTop">
        <div className="row col-12 pb-sm-4 pb-2 m-0 p-0">
          <div className="col-lg-5 col-12 px-md-5 px-3 pt-5 m-0 p-0">
            <h1 className="col-sm-11 col-12 pt-sm-2 sentient-title m-0 p-0" style={{ color: '#65CF10' }}>
              Contact Us
            </h1>
          </div>
          <div className="col-lg-7 col-12 px-md-5 px-3 pt-sm-5 pt-2 m-0 p-0">
            <p className="sentient-contenttitle  pt-sm-2" style={{ fontSize: '20px', fontWeight: 400 }}>
              TheLaserTrader.com c/o Sentient Lasers
              <br />
              4383 N. Forestdale Drive, Ste. 202 Park City, UT 84098
            </p>
            <p className="sentient-contenttitle" style={{ fontSize: '20px', fontWeight: '400' }}>
              <b>Office</b>
              : 435-333-3206
              <br />
              <b>Toll Free</b>
              : 866-597-6895
            </p>
            <p className="sentient-contenttitle" style={{ fontSize: '20px', fontWeight: '400' }}>
              <b>Email Directly</b>
              : info@thelasertrader.com
            </p>
          </div>
        </div>

        <div className="col-12 px-md-5 px-3 m-0 p-0">
          <hr className="sentient-underline d-sm-flex d-none" />
        </div>

        {inventoryId && (
        <>
          <div className="row col-12 py-sm-5 py-2 m-0 p-0">
            <div className="col-lg-5 col-12 px-md-5 px-3 pb-2 m-0 p-0">
              <h2 className="col-12 sentient-subtitle m-0 p-0">
                Product Information
              </h2>
            </div>
            <div className="col-lg-7 col-12 px-md-5 px-3  m-0 p-0">
              <p className="sentient-content" style={{ lineHeight: '2.5' }}>
                <b>Product/Model:</b>
            &nbsp;
                {tableData?.productModel}
                <br />
                <b>Laser SKU #:</b>
            &nbsp;
                {tableData?.sku}
                <br />
                <b>Company/Mfg:</b>
            &nbsp;
                {tableData?.productCompany}
                <br />
                <b>Type:</b>
            &nbsp;
                {tableData?.productType}
                <br />
                <b>Wavelength:</b>
            &nbsp;
                {tableData?.waveLength}
                <br />
                <b>Year:</b>
            &nbsp;
                {tableData?.productYear}
                <br />
                <b>Selling Price:</b>
            &nbsp;
                {tableData?.bestOffer ? (
                  <span>
                    $
                    {tableData?.askingPrice?.toLocaleString() ?? 0}
                    {' '}
                    / OBO
                  </span>
                ) : (
                  <span>
                    $
                    {tableData?.askingPrice?.toLocaleString() ?? 0}
                  </span>
                )}

                <br />
                <b>Indicated Uses:</b>
                &nbsp;
                {tableData?.productOptions?.length>0 ? tableData?.productOptions.join(', '): ''}

                {b === '1' && (
                <>
                  <br />
                  <b>Your Offer:</b>
                  <br />
                  <input
                    type="number"
                    placeholder="Input Your Offer"
                    id="yourOffer"
                    name="yourOffer"
                    className={classnames({ 'is-invalid': errors && errors.yourOffer }, 'form-control sentient-content')}
                    style={{ border: '1px solid #646464' }}
                    {...register('yourOffer', { required: false, pattern: /^\d*\.?\d*$/, })}
                  />
                </>
                )}
              </p>
            </div>
          </div>
          <div className="col-12 px-md-3 px-2 m-0 p-0">
            <hr className="sentient-underline  d-sm-flex d-none" />
          </div>
        </>
        )}

        <div className="row col-12 py-sm-5 py-2 m-0 p-0">
          <div className="col-lg-5 col-12 px-md-5 px-3 pb-2 m-0 p-0">
            <h2 className="col-sm-11 col-12 sentient-subtitle m-0 p-0">
              Your Information
            </h2>
          </div>
          <div className="col-lg-7 col-12 px-md-5 px-3  m-0 p-0">
            <Form onSubmit={handleSubmit(onSubmit)}>
              {apiErrors.data ? (
                <Alert color="danger">
                  <div className="alert-body">
                    <span>{`Error: ${apiErrors.data}`}</span>
                  </div>
                </Alert>
              ) : <></>}
              <div className="col-12 m-0 p-0 px-3">
                <input type="hidden" name="oid" value="00DDn000009Q6pN" />
                <input type="hidden" name="retURL" value="https://sl-it-whappeastus-02.azurewebsites.net" />
                <FormGroup style={{ display: 'none' }}>
                  <Select
                    as={Select}
                    options={leadSourceType}
                    name="lead_source"
                    id="lead_source"
                    value={leadSourceType[1]}
                    isClearable={false}
                    control={control}
                    defaultvalue={leadSourceType[1]}
                    // className={`react-select ${classnames({ 'is-invalid': errors.lead_source })}`}
                    classNamePrefix="select"
                    // innerRef={register({ required: true })}
                  />
                </FormGroup>
                <FormGroup style={{ display: 'none' }}>
                  <Select
                    as={Select}
                    options={leadRecordType}
                    name="recordType"
                    id="recordType"
                    value={leadRecordType[0]}
                    isClearable={false}
                    control={control}
                    defaultvalue={leadRecordType[0]}
                    className={`react-select ${classnames({ 'is-invalid': errors && errors.recordType })}`}
                    classNamePrefix="select"
                    // innerRef={register({ required: true })}
                  />
                </FormGroup>
                <FormGroup className="form-group row form-row align-items-center">
                  <input
                    type="text"
                    placeholder="First name *"
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
                    placeholder="Last name *"
                    {...register('last_name', { required: true })} 
                    id="last_name" 
                    style={{ border: '1px solid #646464' }}
                    className={`form-control ${errors && errors.last_name ? 'is-invalid' : ''}`} 
                   />
                </FormGroup>
                <FormGroup className="form-group row form-row align-items-center">
                  <input
                    type="text"
                    placeholder="Company name *"
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
                    placeholder="Email *"
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
                    placeholder="Address line 1 *"
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
                    placeholder="Address line 2"
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
                    <div className="col-md-6  col-12 m-0 p-0">
                      {/* <input
                        type="text"
                        placeholder="State"
                        id="state"
                        name="state"
                        className={classnames({ 'is-invalid': errors && errors.state }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                        {...register('state', { required: false })} 
                      /> */}

                         <Select
                          as={Select}
                          options={states}
                          name="state"
                          value={selectedState}
                          isClearable={false}
                          control={control}
                          defaultValue={states.length > 0 ? states[0] : ''}
                          className={`react-select ${classnames({ 'is-invalid': errors && errors.state })}`}
                          classNamePrefix="select"
                          onChange={(value) => { setSelectedState(value); }}
                          {...register('state').label}
                        />
                    </div>
                    <div className="col-md-6  col-12 m-0 p-1 d-sm-flex d-none">
                      <input
                        type="text"
                        placeholder="Zip code"
                        id="zip"
                        name="zip"
                        className={classnames({ 'is-invalid': errors && errors.zip }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onPaste={(e)=>{
                          e.preventDefault()
                          return false;
                        }} 
                        {...register('zip', { required: false })} 
                      />
                    
                    </div>
                    {/* mobile */}
                    <div className="col-sm-6 col-12 m-0 p-0 pt-2 d-sm-none d-flex">
                      <Input
                        type="text"
                        placeholder="Zip code"
                        id="mzip"
                        name="mzip"
                        className={classnames({ 'is-invalid': errors && errors.mzip }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onPaste={(e)=>{
                          e.preventDefault()
                          return false;
                        }} 
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
                        placeholder=" Office Phone: (123) 555 1234"
                        defaultValue={showPhone}
                        onChange={(e) => (setShowPhone(e.target.value))}
                        className={classnames({ 'is-invalid': errors && errors.phone }, 'sentient-content form-control w-100 px-1')}
                        {...register('phone', { required: false })}
                        style={{ border: '1px solid #646464', height: '40px' }}
                      />
                    </div>
                    <div className="col-md-6 col-12 p-1 d-sm-flex d-none">
                      <input
                        type="text"
                        placeholder="Mobile"
                        id="mobile"
                        name="mobile"
                        maxLength={10}
                        className={classnames({ 'is-invalid': errors && errors.mobile }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onPaste={(e)=>{
                          e.preventDefault()
                          return false;
                        }} 
                        {...register('mobile', { required: false })} 
                      />
                    </div>
                    {/* mobile */}
                    <div className="col-md-6 col-12 m-0 p-0 pt-2 d-sm-none d-flex">
                      <input
                        type="text"
                        placeholder="Mobile"
                        id="Mmobile"
                        name="Mmobile"
                        maxLength={10}
                        className={classnames({ 'is-invalid': errors && errors.Mmobile }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onPaste={(e)=>{
                          e.preventDefault()
                          return false;
                        }} 
                        {...register('Mmobile', { required: false })} 
                      />
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className="form-group row form-row align-items-center">
               <div className="col-12 m-0 p-0">
               {(b === '1' || inventoryId)  && (
                   <Select 
                   options={communicationType}
                   id="preferredMethodContact"
                   name="preferredMethodContact"
                   value={methodOfContact}
                   isClearable={false}
                   control={control}
                   defaultValue={communicationType?.length > 0 ? communicationType[0] : null}
                   className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.preferredMethodContact })}`}
                   placeholder="Select Preferred Method of Contact"
                   style={{ border: '1px solid #646464' }}
                   onChange={(value) => { setMethodOfContact(value); }}
                   {...register('preferredMethodContact')?.label}
                 />
                    )}
                </div>

                </FormGroup>
                <FormGroup className="form-group row form-row align-items-center">
              
                <div className="col-12 m-0 p-0">
                    <Select 
                     as={Select}
                      options={contactType}
                      id="preferredContactType"
                      name="preferredContactType"
                      required
                      value={selectedType}
                      isClearable={false}
                      control={control}
                      classNamePrefix="select"
                      defaultValue={contactType?.length > 0 ? contactType[0] : null}
                      className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.preferredContactType })}`}
                      placeholder="Preferred time of contact? AM/PM"
                      style={{ border: '1px solid #646464' }}
                      onChange={(value) => { setSelectedType(value); }}
                      {...register('preferredContactType').label}
                    />
                    </div>
                    {/* <div className="col-md-6 col-12 m-0 p-1 d-sm-flex d-none">

                    <input
                        type="text"
                        placeholder="Fax"
                        id="fax"
                        name="fax"
                      
                        maxLength={5}
                        className={classnames({ 'is-invalid': errors && errors.fax }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                       
                        {...register('fax', { required: false })}
                      />
                    </div> */}

                    {/* <div className="col-md-6 col-12 pt-2 m-0 p-0 d-sm-none d-flex">
                    <input
                        type="text"
                        placeholder="Fax"
                        id="fax1"
                        name="fax1"
                
                        maxLength={5}
                        className={classnames({ 'is-invalid': errors && errors.fax1 }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                       
                        {...register('fax1', { required: false })}
                      />
                    </div> */}
                </FormGroup>
              
               <FormGroup className="form-group row form-row align-items-center">
               <div className="col-12 m-0 p-0">
               {(b === '1' ) && (
                     <Select 
                      as={Select}
                      options={financeVal}
                      id="finance"
                      name="finance"
                      required
                      value={financeType}
                      isClearable={false}
                      control={control}
                      classNamePrefix="select"
                      defaultValue={financeVal?.length > 0 ? financeVal[0] : null}
                      placeholder="Do you need financing? Y/N"
                      className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.finance })}`}
                     // classNamePrefix="Select Finance Type"
                      style={{ border: '1px solid #646464' }}
                      onChange={(value) => { setFinanceType(value); }}
                      {...register('finance').label}
                    />
                    )} 
                </div>

                </FormGroup>
 
             
            

                <FormGroup className="form-group row form-row align-items-center">
                  <textarea
                    type="textarea"
                    placeholder={(inventoryId > 0 && b==1) ? 'Comments': 'Question or Comment'}
                    id="comments"
                    name="comments"
                    rows={5}
                    className={classnames({ 'is-invalid': errors && errors.comments }, 'form-control sentient-content')}
                    {...register('comments', { required: false })} 
                    style={{ border: '1px solid #646464' }}
                  />
                </FormGroup>

                <FormGroup className="form-group row form-row align-items-center">
                <div className="col-12 py-1 m-0 p-0">
                  <ReCAPTCHA
                    sitekey={process.env.APP_GOOGLE_CAPTCHA_KEY}
                    onChange={handleVerify}
                  />
                </div>
              </FormGroup>
               
                <FormGroup className="form-group row form-row align-items-center">
                  <div className="py-2 m-0 p-0 d-flex ">
                    {b === '1' && (
                      <p className="sentient-button sentient-footer p-3" style={{ fontSize: '16px', fontWeight: '700', cursor: 'pointer' }} onClick={handleButtonClick}>
                        Submit your offer 
                      </p>
                    )}
                    { b !== '1' && inventoryId && (
                      <p className="sentient-button sentient-footer p-3" style={{ fontSize: '16px', fontWeight: '700', cursor: 'pointer' }} onClick={handleButtonClick}>
                        Submit your question
                      </p>
                    )}
                    { b !== '1' && !inventoryId && (
                      <p className="sentient-button sentient-footer p-3" style={{ fontSize: '16px', fontWeight: '700', cursor: 'pointer' }} onClick={handleButtonClick}>
                        Submit your information
                      </p>
                    )}
                  </div>
                </FormGroup>
              </div>
            </Form>
          </div>

        </div>
      </div>
      )}
      </PageLayout>
    </>
  );
};

export default ContactUs;
