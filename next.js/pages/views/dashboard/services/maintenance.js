import { useEffect, useState } from 'react';
import {
  Alert,
  Form, FormGroup, Input, CustomInput, Label, Button,
} from 'reactstrap';

import { Controller, useForm } from 'react-hook-form';
import classnames from 'classnames';
import Select from 'react-select';

import ReCAPTCHA from 'react-google-recaptcha';
import InputMask from 'react-input-mask';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useRouter } from 'next/router';
import Flatpickr from 'react-flatpickr';
import { FaCalendar } from 'react-icons/fa';
import 'flatpickr/dist/themes/material_green.css';

import 'react-dropzone-uploader/dist/styles.css';

import Dropzone, {
  IFileWithMeta,
  StatusValue,
} from 'react-dropzone-uploader';

import { acceptedImageFormats } from '@src/configs/dropzoneUploader';

import { addContactUsProductInventory ,addContactUsProductMaintainance} from '@src/api/contactUs.action';
import { getLookupCountry,getLookupState } from '@src/api/contact.actions';
import { getLookupProductOption } from '@src/api/product.actions';
import { addSellProductInventory, getFullProductModel, getLaserType } from '@src/api/sell.action';
import {
  getBuySearch, getCompanyManufacturer, getPriceRange, getProductModel,
} from '@src/api/buy.action';
import {
  blooleanValue, leadRecordType, leadSourceType, ownerShip, powerRequirements,
} from '@src/components/contactComponents';
import { CheckCircle } from 'react-feather';
import PageLayout from '@src/layouts/PageLayout';
import Image from 'next/image';

const Maintenance = () => {
  const {
    register, errors, handleSubmit, control, setValue, getValues, clearErrors,
  } = useForm();

  const router = useRouter();

  const [apiErrors, setApiErrors] = useState({});
  const [countriesInfo, setCountriesInfo] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState([]);

  const [productOption, setProductOption] = useState([]);
  const [selectedProductOption, setSelectedProductOption] = useState([]);
  const [productCompany, setProductCompany] = useState([]);
  const [selectedProductCompany, setSelectedProductCompany] = useState();
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [company, setCompany] = useState([]);
  const [productCompanyInfo,setProductCompanyInfo]= useState([]);
  const [showPhone, setShowPhone] = useState('');
  const [showFax, setShowFax] = useState('');
  const [files, setFiles] = useState(null);
  const [prodList, setProdList] = useState([]);
  const [product, setProduct] = useState([]);
  const [eventDatePicker, setEventDatePicker] = useState();
  const [methodOfContact, setMethodOfContact] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [productErrMsg, setproductErrMsg] = useState('');


  const searchType = [
    { value: 1, label: 'Manufacturer' },
  ];
  const [searchValue, setSearchValue] = useState(searchType[0] || null);

  const fields = [
    'firstName', 'lastName', 'company', 'email', 'street', 'address1', 'address2', 'country', 'zip', 'mzip',
    'state', 'phone', 'city', 'mobile', 'Mmobile', 'comments', 'email', 'make', 'model', 'year',, 'productImage', 'productFile',
    'errorCode','lastService','lastServiceDate','wholastService','preferredMethodContact','productFile',
  ];

  const [contactType, setContactType] = useState([
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ]);

  const [communicationType, setCommunicationType] = useState([
    { value: 'Email', label: 'Email' },
    { value: 'Text', label: 'Text' },
    { value: 'Phone Call', label: 'Phone Call' },
  ]);



  useEffect(() => {
    const fetchData = async () => {
        // fields.forEach((field) => setValue(field, ''));
        // fields.forEach((field) => register(field, ''));

      try {
        const arrList=[];
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
  
        
     
        const companyModelData = await getCompanyManufacturer({type:searchType[0].value});
        console.log("<>>>>>>>>>>>>>>>>>>>"+JSON.stringify(companyModelData));
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
         setProdList([]);
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
   
      
       setProductOption([]);
       setSelectedProductOption( []);
       setValue('productOption',  '');
        
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedCountry(countries?.length > 0 ? countries[225] : null);
  }, [countries]);

  const handleControlledDropzoneChangeStatus = (status, allFiles) => {

    
    setTimeout(() => {
      if (['done', 'removed'].includes(status)) {
        setFiles([...allFiles]);
        console.log("allFiles"+files[0])
      }
    }, [0]);
  };
  const convertToUTC = (date) => {
    const timezoneOffset = date.getTimezoneOffset();
    const utcTimestamp = date.getTime() + (timezoneOffset * 60 * 1000);
    const utcDate = new Date(utcTimestamp);
    return utcDate;
  };
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
  const handleCompanyChange=async (value)=>{
    const arrList=[];
    //console.log("VAlueeeeeeeee"+value.label);
     setSelectedCompany(value);
    
    const prodList= await getBuySearch({companyName:value.label})|| [];
    
    const minus = '-';
    const prodData1 = prodList?.map((item, index) => ({
     
     label: item.productModel+minus+ item.productType,
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

    
    //console.log("ssssssssssssssssssss>>222222>>>>>>>>>>>"+JSON.stringify(arrList));

    setProductOption(arrList || []);
    setSelectedProductOption(arrList || []);
    setValue('productOption', arrList || '');

  }
  const onSubmit = async () => {
    <ToastContainer />

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

    console.log("files",files);

    setValue('country', selectedCountry?.value ? selectedCountry.label : '');
    //setValue('productFile', files?.length === 0 ? null : files);

     const lastServiceDate ="";
     if(eventDatePicker!=undefined){
      lastServiceDate= eventDatePicker.toISOString();
     }
     console.log("lastServiceDate"+lastServiceDate);
    // setValue('fax', showFax);
    // setValue('phone', showPhone);
    //setValue('productImageFile', files?.length === 0 ? null : files);
    //setValue('productImageFile', productImageFile?.[0]?.file ?? null);


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
    queryParams += `&00NDn00000aIFKz=${encodeURIComponent(getValues('model') ?? '')}`;
    queryParams += `&00NDn00000aIFKf=${encodeURIComponent(getValues('make') ?? '')}`;
    queryParams += `&00NDn00000aIFMC=${encodeURIComponent(getValues('year') ?? '')}`;
   
    const url = `${baseUrl}&${queryParams}`;

    await fetch(
      url,
      requestOptions
    )
      .then((response) => {
        router.push('/service/maintenance');
        window.scrollTo(0, 0);
      })
      .catch((error) => console.log('error', error));
    // -------------------------------------------------
    const comments = `${getValues('comments')}; make: ${selectedCompany?.label};  
    model: ${product?.label}; year: ${getValues('year')};`;
    const type = 'maintenance';

    const formdata = new FormData();
    formdata.append('Contact.Phone', getValues('phone'));
    formdata.append("Contact.Comments", getValues('comments') ?? '');
    formdata.append("Contact.LastServiceDesc", getValues('lastService') || '');
    formdata.append("Contact.State", selectedState?.value ?? 0);
    formdata.append("Contact.ItlPrefix", "");
    formdata.append("Contact.PreferredContactType",selectedType.value || 'AM');
    formdata.append("Contact.ErrorCode", getValues('errorCode') || '');
    formdata.append("Contact.Type", type);
    formdata.append("Contact.Country", selectedCountry?.value ?? 0);
    formdata.append("ProductId", product.value ?? 0);
    formdata.append("Contact.Address1", getValues('street') ?? '');
    formdata.append("Contact.Address2", getValues('address2') ?? '');
    formdata.append("Contact.Finance", "");
    formdata.append("OfferPrice", "");
    formdata.append("Contact.FirstName", getValues('first_name') ?? '');
    formdata.append("Contact.Email",  getValues('email') ?? '');
    formdata.append("Contact.Fax", getValues('fax') ?? '');
    formdata.append("Contact.WhoLastService", getValues('wholastService') || '');
    formdata.append("Contact.LastName", getValues('last_name') ?? '');
    formdata.append("ProductOptions", "");
    formdata.append("Contact.Mobile",getValues('mobile') || getValues('Mmobile'));
    formdata.append("Contact.Zip",  getValues('zip') ?? '');
    formdata.append("Contact.Active", "true");
    
    formdata.append("Contact.City", getValues('city') ?? '');
    formdata.append("Contact.MethodOfContact", methodOfContact?.value || '');
    formdata.append("Contact.CompanyName", getValues('company') || '');
    formdata.append("Contact.ProductFile", files?.length === 0 ? null : files);
    formdata.append("Contact.LastServiceDate",lastServiceDate || '');
    formdata.append("Contact.YearOfManufacture", getValues('year') || 0);
 
    formdata.append('productId', product.value ?? 0);
    formdata.append('ProductFile', files?.length === 0 ? null : files);

    try {
      await addContactUsProductMaintainance(formdata);
      toast.success('Service Contact succeeded', {
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

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

     
      console.log("URL.createObjectURL(i)",i);
      setFiles(i);
      //setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  return (
    <PageLayout>
    <div className="w-100 pageTop">
      <div className="row col-12 pb-sm-5 pb-2 m-0 p-0">
        <div className="col-lg-8 col-12 px-md-5 px-3 pt-5 m-0 p-0">
          <h1 className="col-sm-11 col-12 pt-sm-2 sentient-title m-0 p-0" style={{ color: '#65CF10', wordBreak: 'break-word' }}>
            Service/
            <br />
            Maintenance
          </h1>
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
                  placeholder="Last name *"
                  {...register('last_name', { required: true })} 
                  id="last_name" 
                  className={`form-control sentient-content ${errors && errors.last_name ? 'is-invalid' : ''}`}

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
                  <div className="col-md-6 col-12  m-0 p-0 d-sm-flex d-none">
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
                      placeholder="Zip"
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
                      placeholder="Office Phone: (123) 555 1234"
                      defaultValue={showPhone}
                      onChange={(e) => (setShowPhone(e.target.value))}
                      className={classnames({ 'is-invalid': errors && errors.phone }, 'form-control sentient-content w-100 px-1')}
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
                  <div className="col-md-6 col-12 m-0 p-1 pt-1 d-sm-none d-flex">
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
                <input
                  type="text"
                  placeholder="Year of Manufacture *"
                  id="year"
                  name="year"
                  className={classnames({ 'is-invalid': errors && errors.year }, 'form-control sentient-content')}
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
                 
                  {...register('year', { required: true, pattern: /^\d{4}$/ })}
                />
              </FormGroup>
            
              <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="text"
                  placeholder="Issue(s)/Error codes"
                  id="errorCode"
                  name="errorCode"
                  className={classnames({ 'is-invalid': errors && errors.errorCode }, 'form-control sentient-content')}
                  style={{ border: '1px solid #646464' }}
                  {...register('errorCode', { required: false })}
                />
              </FormGroup>
              <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="text"
                  placeholder="What was performed at last service"
                  id="lastService"
                  name="lastService"
                  className={classnames({ 'is-invalid': errors && errors.lastService }, 'form-control sentient-content')}
                  style={{ border: '1px solid #646464' }}
                  {...register('lastService', { required: false })}
                />
              </FormGroup>
                <FormGroup className="form-group row form-row align-items-center">
                <div className="col-12 m-0 p-0">
                <Flatpickr
                    value={eventDatePicker}
                    id="lastServiceDate"
                    name="lastServiceDate"
                    placeholder="Date of last service"
                    onChange={(date) => { setEventDatePicker(date[0]); }}
                    style={{ border: '1px solid #646464' }}
                    className={`form-control ${classnames({ 'is-invalid': errors && errors.lastServiceDate })}`}
                    rules={{ required: true }}
                    options={{
                      mode: 'single',
                      dateFormat: 'Y-m-d H:i:S',
                      enableTime: true, // Enable manual time input
                    }}
                  />
                 
              </div>
                </FormGroup>

                <FormGroup className="form-group row form-row align-items-center">
                <input
                  type="text"
                  placeholder="Who serviced the device last? *"
                  id="wholastService"
                  name="wholastService"
                  className={classnames({ 'is-invalid': errors && errors.wholastService }, 'form-control sentient-content')}
                  style={{ border: '1px solid #646464' }}
                  {...register('wholastService', { required: true })}
                />
                </FormGroup>

                
                <FormGroup>
                  <div className="form-group row form-row align-items-center">
                    <Label className="sentient-text-content col-12 m-0 p-0 col-form-label">
                      Product image / video
                    </Label>
                    <div className="col-12 m-0 p-0">
                      {register.productFile && !showDropzone ? (
                        <>
                          <Image src={register.productFile} className="img-fluid " alt="logo" />
                          <Button.Ripple onClick={() => setShowDropzone(true)} className="btn-sm float-right" color="flat-info">Change</Button.Ripple>
                        </>
                      ) : (<></>)}

                      {!register.productFile || showDropzone ? (
                        <Controller
                       
                          style={{ border: '1px solid #646464' }}
                          control={control}
                          name="productFile"
                          render={({ onChange }) => (
                            // <Dropzone
                            //   accept={acceptedImageFormats}
                            //   multiple={false}
                            //   maxFiles={1}
                            //   maxSizeBytes={(1024 * 1024) * 50} // 2MB
                            //   inputContent={(files, extra) => (extra.reject ? `Only ${acceptedImageFormats} allowed` : 'Drop image here or click to browse')}
                            //   styles={{
                            //     dropzoneReject: { borderColor: '#F19373 !important', backgroundColor: '#F1BDAB' },
                            //     inputLabel: (files, extra) => (extra.reject ? { color: '#A02800 !important' } : {}),
                            //   }}
                            //   onChangeStatus={(file, status, allFiles) => {
                            //     handleControlledDropzoneChangeStatus(status, allFiles, onChange);
                            //   }}
                            // />
                            <input type="file" name="myImage" accept=".png, .jpg, .jpeg, .mp3, .mp4"  onChange={uploadToClient} />

                          )}
                        />

                      ) : (<></>)}
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className="form-group row form-row align-items-center">
                <div className="col-12 m-0 p-0">
                <Select 
                   as={Select}
                   options={communicationType}
                   id="preferredMethodContact"
                   name="preferredMethodContact"
                   placeholder="Select preferred method of contact"
                   value={methodOfContact}
                   required
                   isClearable={false}
                   control={control}
                   defaultValue={communicationType?.length > 0 ? communicationType[0] : null}
                   className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.preferredMethodContact })}`}
                   classNamePrefix="select"
                   style={{ border: '1px solid #646464' }}

                   onChange={(value) => { setMethodOfContact(value); }}
                   {...register('preferredMethodContact').label}
                 />
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

              <FormGroup>
                <div className="form-group row form-row align-items-center mb-3">
                <div className="col-12  py-2 pl-2 m-0 p-0 d-flex">
                  <p className="sentient-button sentient-footer p-3" style={{ fontSize: '16px', fontWeight: '700', cursor: 'pointer' }} onClick={handleButtonClick}>
                    Submit training inquiry
                  </p>
                </div>
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

export default Maintenance;
