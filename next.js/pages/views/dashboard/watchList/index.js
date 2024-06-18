import { useEffect, useState } from 'react';
import {
  Alert,
  Form, FormGroup, Input,
} from 'reactstrap';

import { useForm } from 'react-hook-form';
import classnames from 'classnames';
import Select from 'react-select';

import ReCAPTCHA from 'react-google-recaptcha';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import Router from 'next/router';

import { getLookupCountry,getLookupState } from '@src/api/contact.actions';
import { getDetailSearch } from '@src/api/buy.action';
import { addContactUsProductInventory } from '@src/api/contactUs.action';
import { getLookupProductOption } from '@src/api/product.actions';
import { getFullProductModel } from '@src/api/sell.action';

import { useRouter } from 'next/router';
import { leadRecordType, leadSourceType } from '@src/components/contactComponents';
import { CheckCircle } from 'react-feather';
import PageLayout from '../../../../src/layouts/PageLayout';
import {
  getBuySearch, getCompanyManufacturer, getPriceRange, getProductModel,
} from '@src/api/buy.action';
const WatchList = () => {
  const {
    register, errors, handleSubmit, control, setValue, getValues, clearErrors,
  } = useForm();

  const router = useRouter();

  const [apiErrors, setApiErrors] = useState({});
  const [countriesInfo, setCountriesInfo] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selData, setSelData] = useState([]);

  const [productOption, setProductOption] = useState([]);
  const [selectedProductOption, setSelectedProductOption] = useState([]);
  const [productCompany, setProductCompany] = useState([]);
  const [selectedProductCompany, setSelectedProductCompany] = useState();
  const [company, setCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);

  const [showPhone, setShowPhone] = useState('');
  const [showFax, setShowFax] = useState('');
  const [prodList, setProdList] = useState([]);
  const [product, setProduct] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);

  const [productErrMsg, setproductErrMsg] = useState('');

 


  const fields = [
    'first_name', 'last_name', 'company', 'email', 'street', 'address1', 'address2', 'country', 'zip', 'mzip',
    'state', 'phone', 'city', 'mobile', 'Mmobile', 'comments','fax','productModel',
  ];

  const searchType = [
    { value: 1, label: 'Manufacturer' },
  ];
  const [searchValue, setSearchValue] = useState(searchType[0] || null);

  const handleCompanyChange=async (value)=>{
    const arrList=[];
    //console.log("VAlueeeeeeeee"+value.label);
     setSelectedCompany(value);
    
    const prodList= await getBuySearch({companyName:value.label})|| [];
    
    const minus = '-';
    const prodData1 = prodList?.map((item, index) => ({
     
     label: item.productModel, //+minus+ item.productType
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

   const optionData = await getLookupProductOption();
    const updateOption = optionData?.map((item) => ({
      label: item.name,
      value: item.productOptionId,
    }));
   
    var wanted =[];
    if(prodData[0]?.prodOption?.length>0){
     wanted =prodData[0]?.prodOption?.split(",");
    }
  

    updateOption.forEach((item) => {
     
      var result=item.value.toString();
      var result1 = wanted.indexOf(result);
      if(parseInt(result1)>=0){
        arrList.push({label:item.label,value:item.value})
      }
    });

    setProductOption(arrList || []);
    setSelectedProductOption(arrList || []);
    setValue('productOption', arrList || '');

  }
  useEffect(() => {
    async function fetchData() {
      const arrList=[];
      const companyModelData = await getCompanyManufacturer({type:searchType[0].value});
      //console.log("<>>>>>>>>>>>>>>>>>>>"+JSON.stringify(companyModelData));
      const modelDataCompany = companyModelData?.map((item, index) => ({
        label: item.companyName,
        value: item.cnt,
      })) ?? [];

      if (modelDataCompany && modelDataCompany.length > 0) {
        setCompany(modelDataCompany);
       // setSelectedCompany([modelDataCompany[0]]);
        setSelectedCompany([]);
       
      } 
     // console.log("modelDataCompany[0].companyName>>"+modelDataCompany[0].label);

     const prodList= await getBuySearch({companyName:modelDataCompany[0].label})|| [];
    
     const minus = '-';
     const prodData = prodList?.map((item, index) => ({
      
      label: item.productModel, //+minus+ item.productType
      value: item.productId ?? '',
      prodOption:item.productOptionIds,
    })) ?? [];
    if (prodData && prodData.length > 0) {
      setProdList([]);
      //setProduct(prodData[0]);
      setProduct([]);
    } 

    const optionData = await getLookupProductOption();
    const updateOption = optionData?.map((item) => ({
      label: item.name,
      value: item.productOptionId,
    }));
    var wanted =[];
    if(prodData[0]?.prodOption?.length>0){
     wanted =prodData[0]?.prodOption?.split(",");
    }
  

    updateOption.forEach((item) => {
     
      var result=item.value.toString();
      var result1 = wanted.indexOf(result);
      if(parseInt(result1)>=0){
        arrList.push({label:item.label,value:item.value})
      }
    });

   
    setProductOption( []);
    //setSelectedProductOption(arrList || []);
    setSelectedProductOption( []);

   // setValue('productOption', arrList || '');
    //console.log("arrList>>>>>>>>>>>>>"+JSON.stringify(arrList));
  }

    fetchData();
  }, [selData]);
  useEffect(() => {
    const fetchData = async () => {
      try {

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
          //console.log("data1?.length"+data1?.length);
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
    

        fields.forEach((field) => setValue(field, ''));
        fields.forEach((field) => register(field, ''));

      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  const selectWatchList = () => (

    // <div className="w-100 pageTop">
   
    <div className="row col-12 pb-sm-1 pb-2 m-0 p-0">
    <div className="col-12 py-1 rounded list-group justify-content-end m-0 p-0">

    <FormGroup className="form-group row form-row align-items-center">
      <Select
          as={Select}
          options={company}
          id="productCompany"
          name="productCompany"
          required
          placeholder="Manufacturer *"
          value={selectedCompany}
          isClearable={false}
          classNamePrefix="select"
          control={control}
          defaultvalue={selectedCompany}
          className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.productCompany })}`}

        
          onChange={(value) => { handleCompanyChange(value); }}

          {...register('productCompany')?.label} 
         // {...register('productCompany')?.label}
        />
          <span style={{ fontWeight: 'bold', color: 'red' }}>{productErrMsg}</span>
      
      </FormGroup>
      </div>
      {/* <div className="col-12 py-1 rounded list-group justify-content-end m-0 p-0">
      <Select
          as={Select}
          options={productCompany}
          name="productCompany"
          placeholder="Devices"
          value={selectedProductCompany}
          isClearable={false}
          control={control}
          defaultvalue={selectedProductCompany}
          className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.productCompany }, 'border')}`}
          classNamePrefix="select"
          onChange={(value) => { setSelectedProductCompany(value); }}
          {...register('productCompany')?.label}
        />
      </div> */}
     
     <div className="col-12 py-1 rounded list-group justify-content-end m-0 p-0">
     <FormGroup className="form-group row form-row align-items-center">

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
            className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.productModel })}`}
            classNamePrefix="select"
            onChange={(value) => { setProduct(value); }}
            {...register('productModel')?.label} 
           
          />
          </FormGroup>
        </div>

        <div className="col-12 rounded list-group justify-content-end m-0 p-0">
        <FormGroup className="form-group row form-row align-items-center">

          <Select
            as={Select}
            options={productOption}
            name="productOption"
            value={selectedProductOption}
            isClearable={false}
            control={control}
            placeholder="AND/OR Indicated Use"
            defaultvalue={selectedProductOption}
            //className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.productOption }, 'border')}`}
            className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.productOption })}`}

            classNamePrefix="select"
            onChange={(value) => { setSelectedProductOption(value); }}
            {...register('productOption')?.label}
            isMulti
          /></FormGroup>
        </div>
      </div>

      // </div>
   
  );

  useEffect(() => {
    setSelectedCountry(countries?.length > 0 ? countries[225] : null);
    console.log(countries);
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

  const [isVerified, setIsVerified] = useState(false);
  const handleVerify = () => {
    setIsVerified(true);
  };

  const onSubmit = async () => {

    //productErrMsg
    //console.log("DDDDDDDDDDDD"+product?.value);

     if(product?.value==undefined){
    
      setproductErrMsg("Please select Manufacturer");
      window.scrollTo(0, 0)
      return;
     }else{
      setproductErrMsg('');
     }

     console.log("ssssssssssss"+product.value)

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

    const options = selectedProductOption?.map((item) => item.label)
      .join(',');

    setValue('country', selectedCountry?.value ? selectedCountry.label : '');
    setValue('state', selectedState?.value ? selectedState.label : '');
    // setValue('fax', showFax);
    // setValue('phone', showPhone);

    const requestOptions = {
      method: 'POST',
      mode: 'no-cors',
    };

    const baseUrl = 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8';
    let queryParams = 'oid=00DDn000009Q6pN&retURL=https://sl-it-whappeastus-02.azurewebsites.net';
    queryParams += `&lead_source=${leadSourceType[1].label}`;
    queryParams += `&recordType=${leadRecordType[0].value}`;

    queryParams += `&00NDn00000e7sPD=${getValues('comments')}`;
    queryParams += `&00NDn00000aHVmz=${encodeURIComponent(selectedCompany.label ?? '')}`;
    queryParams += `&00NDn00000aGpy3=${encodeURIComponent(options ?? '')}`;

    queryParams += `&zip=${encodeURIComponent(getValues('zip') || getValues('mzip'))}`;

    fields.forEach((field) => { queryParams += getValues(field) ? `&${field}=${getValues(field)}` : ''; });

    const url = `${baseUrl}&${queryParams}`;

    await fetch(
      url,
      requestOptions
    )
      .then((response) => {
        toast.success('THANK YOU. We appreciate your business. A representative will be in contact with you very soon.', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          style:{ textAlign:"left",width: "400px"}
        });
        router.push('/watchlist');
        window.scrollTo(0, 0);
      })
      .catch((error) => console.log('error', error));
    // ---------------------------------------------

    const optionsid = selectedProductOption?.map((item) => item.value)
      .join(',');
    const formData = {
      contact: {
        phone: getValues('phone') ?? '',
        comments: getValues('comments') ?? '',
        state: selectedState?.value ?? 0,
        // itlPrefix: getValues('itlPrefix') ?? '',
        country: selectedCountry?.value ?? 0,
        address1: getValues('street') ?? '',
        address2: getValues('address2') ?? '',
        firstName: getValues('first_name') ?? '',
        email: getValues('email') ?? '',
        city: getValues('city'),
        mobile: getValues('mobile') || getValues('Mmobile'),
        lastName: getValues('last_name') ?? '',
        zip: getValues('zip') ?? '',
        fax: getValues('fax') ?? '',
        active: 'true',
        city: getValues('city') ?? '',
        companyName: getValues('company') ?? '',
        model: getValues('productModel') ?? '',
        type: 'watchlist',
      },
      productId: product.value ?? 0,
      productOptions: optionsid ?? '',
    };

    console.log("form data",formData);
    try {
      await addContactUsProductInventory(formData);
      toast.success('Watch List succeeded', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        style:{ textAlign:"left",width: "400px"}
      });
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setApiErrors({ data: 'Watch List error' });
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
      <div className="row col-12 pt-3 pb-sm-2 pb-3 m-0 p-0">
        <div className="col-lg-5 col-12 px-md-5 px-3 py-5 m-0 p-0">
          <h1 className="d-sm-flex d-none col-sm-11 col-12 sentient-title m-0 p-0" style={{ color: '#65CF10' }}>
            Watchlist
          </h1>
          <h2 className="d-sm-none d-flex col-sm-11 col-12 sentient-title m-0 p-0" style={{ fontSize: '60px', color: '#65CF10' }}>
            Watchlist
          </h2>
        </div>
        <div className="col-lg-7 col-12 px-md-5 px-3 pt-sm-5 pt-2 m-0 p-0">
          <p className="sentient-contenttitle" style={{ fontSize: '20px' }}>
            Notify me when similar devices become available
          </p>
          <br />
          <p className="sentient-contenttitle" style={{ fontSize: '20px', fontWeight: '400' }}>
            Use the drop down menu to select laser that you wish to get notified about when they enter our system. You can add as many lasers as you like and/or you can select by indicated use.
            <br />
            <br />
            Note: If you have previously created a watch list this will replace your watch list with these new selections.
          </p>
          {/* <br /> */}
          {selectWatchList()}
        </div>
      </div>

     <div className="col-12 px-md-3 px-2 m-0 p-0">
            <hr className="sentient-underline  d-sm-flex d-none" />
          </div>

      <div className="row col-12 pt-4 m-0 p-0">
        <div className="col-lg-5 col-12 px-md-5 px-3 m-0 p-0">
          <h1 className="col-sm-11 col-12 sentient-subtitle pb-3 m-0 p-0">
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
                  placeholder="Last name *"
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
                  <div className="col-md-6 col-12 m-0 p-1">
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
                  <div className="col-md-6 col-12  m-0 p-0  d-sm-flex d-none">
                    <input
                      type="text"
                      placeholder="Zip code"
                      id="zip"
                      name="zip"
                      className={classnames({ 'is-invalid': errors && errors.zip }, 'form-control sentient-content')}
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
                      placeholder=" Office Phone: (123) 555 1234"
                      defaultValue={showPhone}
                      onChange={(e) => (setShowPhone(e.target.value))}
                      className={classnames({ 'is-invalid': errors && errors.phone }, 'sentient-content form-control w-100 px-1')}
                      {...register('phone', { required: false })}
                      style={{ border: '1px solid #646464', height: '40px' }}
                    />
                  </div>
                  <div className="col-md-6 col-12 m-0 p-0 d-sm-flex d-none">
                    <input
                      type="text"
                      placeholder="Mobile"
                      id="mobile"
                      name="mobile"
                      className={classnames({ 'is-invalid': errors && errors.mobile }, 'form-control sentient-content')}
                      style={{ border: '1px solid #646464' }}
                      autoComplete='off'
                      maxLength={10}
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
                  <div className="col-md-6 col-12 pt-1 m-0 p-1 d-sm-none d-flex">
                    <input
                      type="text"
                      placeholder="Mobile"
                      id="Mmobile"
                      name="Mmobile"
                      maxLength={10}
                      className={classnames({ 'is-invalid': errors && errors.Mmobile }, 'form-control sentient-content')}
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
                      {...register('Mmobile', { required: false })} 
                    />
                  </div>
                </div>
              </FormGroup>
              {/* <FormGroup>
                <div className="form-group row form-row align-items-center">
                  <div className="col-md-6 col-12 m-0 p-1">

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
                    </div>

                    </FormGroup> */}

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
                <div className="pb-5 m-0 p-0 d-flex">
                  <p className="sentient-button sentient-footer p-3" style={{ fontSize: '16px', fontWeight: '700', cursor: 'pointer' }} onClick={handleButtonClick}>
                    Start your Watchlist
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

export default WatchList;
