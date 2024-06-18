import { useEffect, useState } from 'react';
import {
  Alert,
  Form, FormGroup, Input, CustomInput,
} from 'reactstrap';

import { useForm } from 'react-hook-form';
import classnames from 'classnames';
import Select from 'react-select';

import ReCAPTCHA from 'react-google-recaptcha';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import Router, { useRouter } from 'next/router';

import { addContactUsProductInventory } from '@src/api/contactUs.action';
import { getLookupCountry,getLookupState } from '@src/api/contact.actions';
import { getLookupProductOption } from '@src/api/product.actions';
import { addSellProductInventory, getFullProductModel, getLaserType } from '@src/api/sell.action';

import {
  blooleanValue, leadRecordType, leadSourceType, ownerShip, powerRequirements,
} from '@src/components/contactComponents';
import { CheckCircle } from 'react-feather';
import PageLayout from '@src/layouts/PageLayout';
import {
  getBuySearch, getCompanyManufacturer, getPriceRange, getProductModel,
} from '@src/api/buy.action';

const Inquiry = () => {
  const {
    register, errors, handleSubmit, control, setValue, getValues, clearErrors,
  } = useForm();

  const router = useRouter();

  const [apiErrors, setApiErrors] = useState({});
  const [countriesInfo, setCountriesInfo] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [productOption, setProductOption] = useState([]);
  const [selectedProductOption, setSelectedProductOption] = useState([]);
  const [productCompany, setProductCompany] = useState([]);
  const [selectedProductCompany, setSelectedProductCompany] = useState();

  const [showPhone, setShowPhone] = useState('');
  const [showFax, setShowFax] = useState('');
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [company, setCompany] = useState([]);
  const [prodList, setProdList] = useState([]);
  const [product, setProduct] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [productErrMsg, setproductErrMsg] = useState('');


  const fields = [
    'firstName', 'lastName', 'company', 'email', 'street', 'address1', 'address2', 'country', 'zip', 'mzip',
    'state', 'phone', 'city', 'mobile', 'comments', 'email', 'person', 'virtual', 'devicemodel',
  ];
  const searchType = [
    { value: 1, label: 'Manufacturer' },
  ];
  const [searchValue, setSearchValue] = useState(searchType[0] || null);

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

        const data1 = await getLookupState("US");
        if (data1?.length > 0) {
          //console.log("data1?.length"+data1?.length);
          const updateddata1= data1?.map((item) => ({
            label: item.stateName,
            value: item.stateId,
          }));
          setStates(updateddata1);
          setSelectedState(updateddata1[0]);
        }else{
          setStates([]);
          setSelectedState([]);
        }
  
  
        // const productModelData = await getFullProductModel();
        // if (productModelData && productModelData.length > 0) {
        //   setProductCompanyInfo(productModelData);
        //   const minus = '-';
        //   const modelData = productModelData.map((item) => ({
        //     label: item.productName + minus + item.company,
        //     value: item.productId ?? '',
        //   }));
  
        //   setProductCompany(modelData);
        //   setSelectedProduct(modelData[0]);
        // }

        const companyModelData = await getCompanyManufacturer({type:searchType[0].value});
       // console.log("<>>>>>>>>>>>>>>>>>>>"+JSON.stringify(companyModelData));
        const modelDataCompany = companyModelData?.map((item, index) => ({
          label: item.companyName,
          value: item.cnt ?? '',
        })) ?? [];
  
        if (modelDataCompany && modelDataCompany.length > 0) {
          setCompany(modelDataCompany);
          setSelectedCompany([]);
        } 
       
        const prodList= await getBuySearch({companyName:modelDataCompany[0].label})|| [];
    
        const minus = '-';
        const prodData = prodList?.map((item, index) => ({
         
         label: item.productModel, //+minus+ item.productType
         value: item.productId ?? '',
         prodOption:item.productOptionIds,
       })) ?? [];
       if (prodData && prodData.length > 0) {
         setProdList(prodData);
         setProduct([]);
       } 
  
        fields.forEach((field) => setValue(field, ''));
        fields.forEach((field) => register(field, ''));
  
        // const laserData = await getLaserType();
        // if (laserData && laserData.length > 0) {
        //   const updateddata = laserData.map((item) => ({
        //     label: item.name,
        //     value: item.laserTypeId,
        //   }));
        //   console.log(updateddata);
        //   setLaserType(updateddata || []);
        //   setSelectedLaserType(updateddata[0] || '');
        // } else {
        //   setLaserType([]);
        // }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedCountry(countries?.length > 0 ? countries[225] : null);
  }, [countries]);

  const [isVerified, setIsVerified] = useState(false);
  const handleVerify = () => {
    setIsVerified(true);
  };


  const handleCompanyChange=async (value)=>{
    const arrList=[];
    //console.log("VAlueeeeeeeee"+value.label);
     setSelectedCompany(value);
    
    const prodList= await getBuySearch({companyName:value.label})|| [];
    
    const minus = '-';
    const prodData1 = prodList?.map((item, index) => ({
     
     label: item.productModel,  //+minus+ item.productType
     value: item.productId ?? '',
     prodOption:item.productOptionIds,
   })) ?? [];

   const prodData = prodData1.reduce((arr, item) => {
    const prodData= arr.filter(i => i['value'] !== item['value']);
    return [...prodData, item];
}, []);
   if (prodData && prodData.length > 0) {
     setProdList(prodData);
     setProduct(prodData[0]);
   } 
 
  }

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

    if(product?.value==undefined){
    
      setproductErrMsg("Please select Manufacturer");
      window.scrollTo(0, 0)
      return;
     }else{
      setproductErrMsg('');
     }
    
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

    setValue('country', selectedCountry?.value ? selectedCountry.label : '');
    setValue('state', selectedState?.value ? selectedState?.label : '');
    
    const requestOptions = {
      method: 'POST',
      mode: 'no-cors',
    };

    const baseUrl = 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8';
    let queryParams = 'oid=00DDn000009Q6pN&retURL=https://sl-it-whappeastus-02.azurewebsites.net';
    queryParams += `&lead_source=${leadSourceType[1].label}`;
    queryParams += `&recordType=${leadRecordType[3].value}`;

    queryParams += `&first_name=${encodeURIComponent(getValues('first_name') ?? '')}`;
    queryParams += `&last_name=${encodeURIComponent(getValues('last_name') ?? '')}`;
    queryParams += `&company=${encodeURIComponent(getValues('company') ?? '')}`;
    queryParams += `&email=${encodeURIComponent(getValues('email') ?? '')}`;
    queryParams += `&state=${encodeURIComponent(getValues('state') ?? '')}`;
    queryParams += `&zip=${encodeURIComponent(getValues('zip') || getValues('mzip'))}`;
    queryParams += `&city=${encodeURIComponent(getValues('city') ?? '')}`;
    queryParams += `&phone=${encodeURIComponent(getValues('phone') ?? '')}`;
    queryParams += `&country=${encodeURIComponent(getValues('country') ?? '')}`;
    queryParams += `&street=${encodeURIComponent(getValues('street') ?? '')}`;
    queryParams += `&mobile=${encodeURIComponent(getValues('mobile') ?? '')}`;

    queryParams += `&00NDn00000e7sPD=${getValues('comments')}`;
    queryParams += `&00NDn00000aIFKz=${encodeURIComponent(getValues('devicemodel') ?? '')}`;
    queryParams += `&00NDn00000e7xua=${encodeURIComponent(getValues('person') ?? '')}`;
    queryParams += `&00NDn00000e7xuf=${encodeURIComponent(getValues('virtual') ?? '')}`;
    // fields.forEach((field) => { queryParams += getValues(field) ? `&${field}=${getValues(field)}` : ''; });

    const url = `${baseUrl}&${queryParams}`;

    await fetch(
      url,
      requestOptions
    )
      .then((response) => {
        // toast.success('Service Contact succeeded', {
        //   position: 'top-center',
        //   autoClose: 2000,
        //   hideProgressBar: true,
        // });
        router.push('/service/training-inquiry');
        window.scrollTo(0, 0);
      })
      .catch((error) => console.log('error', error));
    // ------------------------------------------------
    const comments = `${getValues('comments')}; Device (Make/Model): ${selectedCompany?.label}/${product?.label}; 
    In-person training: ${getValues('person')}; Virtual training: ${getValues('virtual')};`;
    const type = 'inquiry';
    const formData = {
      contact: {
        phone: getValues('phone') ?? '',
        comments: getValues('comments') ?? '',
        state: selectedState?.value ?? 0,
        country: selectedCountry?.value ?? 0,
        address1: getValues('street') ?? '',
        address2: getValues('address2') ?? '',
        firstName: getValues('first_name') ?? '',
        email: getValues('email') ?? '',
        city: getValues('city') ?? '',
        lastName: getValues('last_name') ?? '',
        zip: getValues('zip') || getValues('mzip')  || '',
        fax: getValues('fax') ?? '',
        active: 'true',
        companyName: getValues('company') ?? '',
        type,
        mobile:getValues('mobile') || getValues('Mmobile'),
        personTraining:getValues('person') ?? false,
        virtualTraining:getValues('virtual') ?? false,
      },
      productId: product.value ?? 0,
    };

    try {
      console.log("form data>>>>>>>>",formData);
      await addContactUsProductInventory(formData);
      toast.success('Inquiry Contact succeeded', {
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
  };

  const handleButtonClick = () => {
    clearErrors();
    handleSubmit(onSubmit)();
  };

  return (
    <PageLayout>
    <div className="w-100 pageTop">
      <div className="row col-12 pb-sm-4 pb-2 m-0 p-0">
        <div className="col-lg-5 col-12 px-md-5 px-3 pt-5 m-0 p-0">
          <h1 className="col-sm-11 col-12 sentient-title m-0 p-0" style={{ color: '#65CF10', wordBreak: 'break-word' }}>
            Training
          </h1>
        </div>
        <div className="col-lg-7 col-12 px-md-5 px-3 pt-sm-5 pt-2 m-0 p-0">
          <p className="sentient-contenttitle" style={{ fontSize: '20px' }}>
            No matter where you acquired your device, LaserTrader by Sentient offers clinical training.
          </p>
          <br />
          <p className="sentient-contenttitle" style={{ fontSize: '20px', fontWeight: '400' }}>
            Fill out the form below and LaserTrader will match you with a qualified trainer and schedule you accordingly.
          </p>
        </div>
      </div>

      <div className="col-12 px-md-5 px-3 pb-sm-5 pb-2 m-0 p-0">
        <hr className="sentient-underline" />
      </div>

      <div className="row col-12 m-0 p-0">
        <div className="col-lg-5 col-12 px-md-5 px-3 m-0 p-0">
          <h1 className="col-sm-11 col-12 sentient-subtitle m-0 p-0 pb-3">
            Your Information
          </h1>
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
                  placeholder="Last Name *"
                  {...register('last_name', { required: true })} 
                  style={{ border: '1px solid #646464' }}
                  id="last_name" 
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
                  <div className="col-md-6 col-12 m-0 p-1">
                  <Select
                          as={Select}
                          options={states}
                          name="state"
                          id="state"
                          value={selectedState}
                          isClearable={false}
                          control={control}
                          defaultValue={states.length > 0 ? states[0] : ''}
                          className={`react-select ${classnames({ 'is-invalid': errors && errors.state })}`}
                          classNamePrefix="select"
                          onChange={(value) => { setSelectedState(value); }}
                          {...register('state')?.label} 
                        />
                  </div>
                  <div className="col-md-6 col-12   m-0 p-0 d-sm-flex d-none">
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
                  <div className="col-md-6 col-12 m-0 p-1 pt-1 d-sm-none d-flex">
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
                  <div className="col-md-6 col-12 m-0 p-1">
                    <InputMask
                      type="text"
                      mask="999 999 9999"
                      id="phone"
                      name="phone"
                      placeholder=" Office Phone (123) 555 1234"
                      defaultValue={showPhone}
                      onChange={(e) => (setShowPhone(e.target.value))}
                      className={classnames({ 'is-invalid': errors && errors.phone }, 'form-control sentient-content w-100 px-1')}
                      {...register('phone', { required: false })}
                      style={{ border: '1px solid #646464', height: '40px' }}
                    />
                  </div>
                  <div className="col-md-6 col-12  m-0 p-0 d-sm-flex d-none">
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
                  <div className="col-md-6 col-12 pt-1 m-0 p-1 pt-1 d-sm-none d-flex">
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

            {/* <FormGroup className="form-group row form-row align-items-center">
            <div className="col-md-6 col-12 m-0 p-0">
                 <input
                      type="text"
                      placeholder="Fax"
                      id="fax"
                      name="fax"
                    
                      maxLength={5}
                      className={classnames({ 'is-invalid': errors && errors.fax }, 'form-control sentient-content')}
                      style={{ border: '1px solid #646464' }}
                      autoComplete='off'
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onPaste={(e)=>{
                        e.preventDefault()
                        return false;
                      }} 
                     
                      {...register('fax', { required: false })}
                    />
               </div>
            </FormGroup> */}

           
              <FormGroup className="form-group row form-row align-items-center">
                {/* <Input
                  type="text"
                  placeholder="Device (Make/Model)"
                  id="devicemodel"
                  name="devicemodel"
                  className={classnames({ 'is-invalid': errors && errors.devicemodel }, 'sentient-content')}
                  style={{ border: '1px solid #646464' }}
                  {...register('devicemodel', { required: false })} 
                /> */}

                    <div className="col-12 m-0 p-0">
                    <Select
                      as={Select}
                      options={company}
                      id="companyName"
                      name="companyName"
                      required
                      placeholder="Manufacturer *"
                      value={selectedCompany}
                      isClearable={false}
                      classNamePrefix="select"
                      control={control}
                      defaultvalue={selectedCompany}
                      className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.companyName })}`}
                      onChange={(value) => { handleCompanyChange(value); }}
                      {...register('companyName')?.label}

                    />
                      <span style={{ fontWeight: 'bold', color: 'red' }}>{productErrMsg}</span>
                  </div>
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                  <div className="col-12 m-0 p-0">
                    <Select
                      as={Select}
                      options={prodList}
                      name="productModel"
                      id="productModel"

                      value={product}
                      isClearable={false}
                      control={control}
                      placeholder="Model"
                      defaultvalue={product}
                      className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.productModel }, 'border')}`}
                      classNamePrefix="select"
                      onChange={(value) => { setProduct(value); }}
                      {...register('productModel')?.label}

                    />
                     
                  </div>
                </FormGroup>
            <FormGroup className="form-group row form-row align-items-center">
              <div className="row col-12 py-2 m-0 p-0">
                <div className="col-sm-4 sentient-content pb-2 m-0 p-0">
                  <input
                    type="checkbox"
                    name="person"
                    id="person"
                    className={classnames('form-check-input')}
                    {...register('person', { required: false })}
                  />
                  <label htmlFor="person" className="form-check-label sentient-content px-3">In-person training</label>
                </div>
                <div className="col-sm-4 sentient-content pb-2 m-0 p-0">
                  <input
                    type="checkbox"
                    name="virtual"
                    id="virtual"
                    className={classnames('form-check-input')}
                    {...register('virtual', { required: false })}
                  />
                  <label htmlFor="virtual" className="form-check-label sentient-content px-3">Virtual training</label>
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


              <FormGroup className="form-group row form-row align-items-center">
                <div className="col-12 py-1 m-0 p-0">
                  <ReCAPTCHA
                    sitekey={process.env.APP_GOOGLE_CAPTCHA_KEY}
                    onChange={handleVerify}
                  />
                </div>
              </FormGroup>

              <FormGroup className="form-group row form-row align-items-center">
                <div className="py-2 m-0 p-0 d-flex">
                  <p className="sentient-button sentient-footer p-3" style={{ fontSize: '16px', fontWeight: '700', cursor: 'pointer' }} onClick={handleButtonClick}>
                    Submit training inquiry
                  </p>
                </div>
              </FormGroup>
            </div>
          </Form>
        </div>

      </div>
    </div>
    </PageLayout>
  );
};

export default Inquiry;
