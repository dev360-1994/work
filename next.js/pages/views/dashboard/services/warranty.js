import React, { useEffect, useState } from 'react';
import {
  Alert,
  Form, FormGroup, Input, CustomInput, Label, Button,
} from 'reactstrap';

import { Controller, useForm } from 'react-hook-form';
import classnames from 'classnames';
import Select from 'react-select';

import ReCAPTCHA from 'react-google-recaptcha';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import { CheckCircle } from 'react-feather';

import 'react-dropzone-uploader/dist/styles.css';
import Dropzone, {
} from 'react-dropzone-uploader';

import { acceptedImageFormats } from '@src/configs/dropzoneUploader';

import Router, { useRouter } from 'next/router';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';

import {
  blooleanValue, leadRecordType, leadSourceType, modeContactValue,
} from '@src/components/contactComponents';

import { addWarranty } from '@src/api/warranty.actions';
import {
  getBuySearch, getCompanyManufacturer, getPriceRange, getProductModel,
} from '@src/api/buy.action';
import { getLookupCountry, getLookupState } from '@src/api/contact.actions';
import { getLookupProductOption } from '@src/api/product.actions';
import Image from 'next/image';
import PageLayout from '../../../../src/layouts/PageLayout';

const WarrantyDevice = () => {
  const {
    register, errors, handleSubmit, control, setValue, getValues, clearErrors,
  } = useForm();

  const router = useRouter();
  const [showDropzone, setShowDropzone] = useState(false);

  const [apiErrors, setApiErrors] = useState({});
  const [productOption, setProductOption] = useState([]);
  const [selectedIsCuWarranty, setSelectedIsCuWarranty] = useState([]);
  const [selectedModeContact, setSelectedModeContact] = useState([]);

  const [countriesInfo, setCountriesInfo] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [eventDatePicker, setEventDatePicker] = useState();
  const [contactDatePicker, setContactDatePicker] = useState();

  const [showPhone, setShowPhone] = useState('');
  const [showFax, setShowFax] = useState('');
  const [files, setFiles] = useState();
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [company, setCompany] = useState([]);
  const [prodList, setProdList] = useState([]);
  const [product, setProduct] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [dynamicError, setDynamicError] = useState('');
  const [dynamicError1, setDynamicError1] = useState('');
  const [productErrMsg, setproductErrMsg] = useState('');
  const [dynamicError2, setDynamicError2] = useState('');







  const fields = [
    'first_name', 'last_name', 'company', 'email', 'street', 'address2', 'country', 'state', 'zip', 'mzip', 'phone',
    'city', 'mobile', 'Mmobile', 'comments', 'manufacturer', 'model', 'year', 'issues', 'description', 'productImage', 'productImageFile',
    'lastServiceDate', 'lastServiceAction', 'recentServiceUserName', 'isUnderWarranty', 'underWarrantyUserName',
    'warrantyPlanPeriod', 'warrantyPlanCost', 'preferredContactMode', 'preferredContactTime', 'active',
  ];
  const searchType = [
    { value: 1, label: 'Manufacturer' },
  ];
  const [searchValue, setSearchValue] = useState(searchType[0] || null);


  const handleControlledDropzoneChangeStatus = (status, allFiles) => {
    setTimeout(() => {
      if (['done', 'removed'].includes(status)) {
        setFiles([...allFiles]);
      }
    }, [0]);
  };

  const [isVerified, setIsVerified] = useState(false);
  const handleVerify = () => {
    setIsVerified(true);
  };
  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];


      console.log("URL.createObjectURL(i)", i);
      setFiles(i);
      //setCreateObjectURL(URL.createObjectURL(i));
    }
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


  const handleCompanyChange = async (value) => {
    const arrList = [];
    //console.log("VAlueeeeeeeee"+value.label);
    setSelectedCompany(value);

    const prodList = await getBuySearch({ companyName: value.label }) || [];

    const minus = '-';
    const prodData1 = prodList?.map((item, index) => ({

      label: item.productModel,  //+minus+ item.productType
      value: item.productId ?? '',
      prodOption: item.productOptionIds,
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

  useEffect(() => {
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
        //console.log("data1?.length"+data1?.length);
        const updateddata1 = data1?.map((item) => ({
          label: item.stateName,
          value: item.stateId,
        }));
        setStates(updateddata1);
        setSelectedState(updateddata1[0]);
      } else {
        setStates([]);
        setSelectedState([]);
      }

      const companyModelData = await getCompanyManufacturer({ type: searchType[0].value });
      console.log("<>>>>>>>>>>>>>>>>>>>" + JSON.stringify(companyModelData));
      const modelDataCompany = companyModelData?.map((item, index) => ({
        label: item.companyName,
        value: item.cnt ?? '',
      })) ?? [];

      if (modelDataCompany && modelDataCompany.length > 0) {
        setCompany(modelDataCompany);
        setSelectedCompany([]);
      }

      const prodList = await getBuySearch({ companyName: modelDataCompany[0].label }) || [];

      const minus = '-';
      const prodData = prodList?.map((item, index) => ({

        label: item.productModel + minus + item.productType,
        value: item.productId ?? '',
        prodOption: item.productOptionIds,
      })) ?? [];
      if (prodData && prodData.length > 0) {
        setProdList([]);
        setProduct([]);
      }
      const value = getValues('comments');
      fields.forEach((field) => {
        setValue(field, field === 'comments' && value ? value : '');
      });

      fields.forEach((field) => {
        register(field, field === 'comments' && value ? value : '');
      });

    //  var date= new Date();
    //  var date1= new Date();
    //  date1.setDate(date1.getDate() + 1);
    //  date1.setMonth(date1.getMonth() + 1);


    //  let formattedTime = date.toLocaleTimeString('en-US', { hour12: false });
    //  console.log( "date"+date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+ " "+formattedTime);
    //  document.getElementById("preferredContactTime").value=date1.getFullYear()+"-"+date1.getMonth()+"-"+date1.getDate()+ " "+formattedTime;
    //  document.getElementById("lastServiceDate").value=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+ " "+formattedTime;

    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedCountry(countries?.length > 0 ? countries[225] : null);
  }, [countries]);

  const convertToUTC = (date) => {
    const timezoneOffset = date.getTimezoneOffset();
    const utcTimestamp = date.getTime() + (timezoneOffset * 60 * 1000);
    const utcDate = new Date(utcTimestamp);

    return utcDate;
  };

  const onSubmit = async (data) => {
    
    const lastServiceDate = convertToUTC(new Date(eventDatePicker)).toLocaleString();
    const preferredContacttime = convertToUTC(new Date(contactDatePicker)).toLocaleString();


  console.log("data11"+lastServiceDate);
  console.log("data222222"+preferredContacttime);
  console.log("selectedModeContact"+selectedModeContact?.label);

  if(product?.value==undefined){
    
    setproductErrMsg("Please select Manufacturer");
    window.scrollTo(0, 0)
    return;
   }else if(lastServiceDate ==="Invalid Date"){
    setDynamicError('Please select date of last service');
    const elementToScrollTo = document.getElementById("lastServiceDate");
    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
    setDynamicError1('');
    setproductErrMsg('');
    setDynamicError2('');


    return;
  }else if(selectedModeContact?.label==undefined){
    setDynamicError2('Please select Preferred mode of contact');
    const elementToScrollTo = document.getElementById("preferredContactMode");
    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
    setDynamicError1('');
    setDynamicError('');
    setproductErrMsg('');
    return;
  }else if(preferredContacttime==="Invalid Date"){
    setDynamicError1('Please select preffered time of contact');
    const elementToScrollTo = document.getElementById("preferredContactTime");
    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
    setDynamicError('');
    setproductErrMsg('');
    setDynamicError2('');

    return;
  }else{
    setDynamicError('');
    setDynamicError1('');
    setproductErrMsg('');
    setDynamicError2('');

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

    const requestOptions = {
      method: 'POST',
      mode: 'no-cors',
    };

    // setValue('fax', showFax);
    // setValue('phone', showPhone);
    setValue('productImageFile', files?.length === 0 ? null : files);

    const baseUrl = 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8';
    let queryParams = 'oid=00DDn000009Q6pN&retURL=https://sl-it-whappeastus-02.azurewebsites.net';
    queryParams += `&lead_source=${leadSourceType[1].label}`;
    queryParams += `&recordType=${leadRecordType[4].value}`;

    queryParams += `&00NDn00000e7sPD=${getValues('comments')}`;

    // ---- your information ----------
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
    queryParams += `&mobile=${encodeURIComponent((getValues('mobile') || getValues('Mobile')) ?? '')}`;
    // ---warranty setting---------------


    queryParams += `&00NDn00000aIFKk=${encodeURIComponent(getValues('manufacturer'))}`;

    queryParams += `&00NDn00000aIFL4=${encodeURIComponent(getValues('model'))}`;

    queryParams += `&00NDn00000aIFMH=${encodeURIComponent(getValues('year') ?? '')}`;

    queryParams += `&00NDn00000aIFMq=${encodeURIComponent(getValues('productImageFile') ?? '')}`;

    queryParams += `&00NDn00000aIFO8=${encodeURIComponent(getValues('issues') ?? '')}`;

    queryParams += `&00NDn00000aGpmb=${lastServiceDate}`; //

    queryParams += `&description=${encodeURIComponent(getValues('description') ?? '')}`;

    queryParams += `&00NDn00000aIFON=${encodeURIComponent(getValues('lastServiceAction') ?? '')}`;

    // queryParams += `&00NDn00000aIFMb=${encodeURIComponent(getValues('recentServiceUserName') ?? '')}`; //

    queryParams += `&00NDn00000aGpnU=${encodeURIComponent(selectedIsCuWarranty.label ?? '')}`; //

    queryParams += `&00NDn00000aGpne=${encodeURIComponent(getValues('underWarrantyUserName') ?? '')}`; //

    queryParams += `&00NDn00000aGpno=${encodeURIComponent(getValues('warrantyPlanPeriod') ?? '')}`;

    queryParams += `&00NDn00000aGpnt=${encodeURIComponent(getValues('warrantyPlanCost') ?? '')}`; //

    queryParams += `&00NDn00000aGpgs=${encodeURIComponent(selectedModeContact.label ?? '')}`;

    queryParams += `&00NDn00000aGpgx=${encodeURIComponent(preferredContacttime ?? '')}`;

    queryParams += `&00NDn00000aIFOc=${encodeURIComponent(getValues('deviceMostRecently') ?? '')}`;

    const url = `${baseUrl}&${queryParams}`;

    await fetch(
      url,
      requestOptions
    )
      .then((response) => {
        // toast.success('Sell Contact us succeeded', {
        //   position: 'top-center',
        //   autoClose: 2000,
        //   hideProgressBar: true,
        // });
        router.push('/service/warranty');
        window.scrollTo(0, 0);
      })
      .catch((error) => console.log('error', error));

    // --------------------------------------------
    setValue('country', selectedCountry?.value ? selectedCountry.value : 0);
    setValue('isUnderWarranty', selectedIsCuWarranty.label ?? '');
    setValue('preferredContactMode', selectedModeContact.label ?? '');
    setValue('state', selectedState?.value ? selectedState.value : 0);




    const form = new FormData();
    form.append('Contact.FirstName', getValues('first_name') ?? '');
    form.append('Contact.Email', getValues('email') ?? '');
    form.append('Contact.Address1', getValues('street') ?? '');
    form.append('Contact.Phone', getValues('phone'));
    form.append('Contact.Comments', getValues('comments'));
    form.append('Contact.State', getValues('state') ?? 0);
    form.append('Contact.Country', getValues('country') ?? 0);
    form.append('Contact.Address2', getValues('address2') ?? '');
    form.append('Contact.city', getValues('city'));
    form.append('Contact.mobile', getValues('mobile') || getValues('Mmobile'));
    form.append('Contact.LastName', getValues('last_name') ?? '');
    form.append('Contact.Zip', getValues('zip') || getValues('mzip'));
    form.append('Contact.Active', 'true');
    form.append('Contact.CompanyName', getValues('company') ?? '');
    form.append('Contact.type', 'warranty');

    form.append('Warranty.Model', product?.value ?? 0);
    form.append('Warranty.Manufacturer', selectedCompany?.label ?? '');
    form.append('Warranty.Year', getValues('year') ?? '');
    form.append('Warranty.Issues', getValues('issues') ?? '');
    form.append('Warranty.Description', getValues('description') ?? '');
    form.append('Warranty.ProductIamgeFile', files?.length === 0 ? null : files);
    form.append('Warranty.LastServiceDate', lastServiceDate ?? '');
    form.append('Warranty.LastServiceAction', getValues('lastServiceAction') ?? '');
    form.append('Warranty.RecentServiceUserName', getValues('recentServiceUserName') ?? '');
    form.append('Warranty.IsUnderWarranty', getValues('isUnderWarranty') === 'Yes' ?? false);
    form.append('Warranty.UnderWarrantyUserName', getValues('underWarrantyUserName') ?? '');
    form.append('Warranty.WarrantyPlanPeriod', getValues('warrantyPlanPeriod') ?? '');
    form.append('Warranty.WarrantyPlanCost', getValues('warrantyPlanCost') ?? '');
    form.append('Warranty.PreferredContactMode', getValues('preferredContactMode') ?? '');
    form.append('Warranty.PreferredContactTime', preferredContacttime ?? '');
    form.append('Warranty.Active', false);

    try {
      const res = await addWarranty(form);
      if (res) {
        toast.success(
          <>
            <CheckCircle className="mr-1 text-success" />
            Warranty Succeeded
          </>, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          style:{ textAlign:"left",width: "400px"}
        }
        );
      }
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setApiErrors({ data: 'Sell error' });
      } else {
        setApiErrors(err.response ? err.response : { data: err.response });
      }
    }
  };

  const handleButtonClick = () => {
    clearErrors();
    handleSubmit(onSubmit)();
  };

  return (
    <PageLayout>
      <div className="row col-12 pageTop p-0">
        <div className="row col-12 pb-sm-5 pb-2 m-0 p-0">
          <div className="col-12 px-md-5 px-4 pt-5 m-0 p-0">
            <h1 className="col-sm-11 col-12 sentient-title m-0 p-0" style={{ color: '#65CF10' }}>
              Device
              <br />
              Warranty
            </h1>
          </div>
        </div>

        <div className="col-12 px-md-5 px-3 m-0 p-0">
          <hr className="sentient-underye d-sm-flex d-none" />
        </div>

        <div className="row col-12 m-0 p-0">
          <Form onSubmit={handleSubmit(onSubmit)} className="row col-12 m-0 p-0 px-3">
            {apiErrors.data ? (
              <Alert color="danger">
                <div className="alert-body">
                  <span>{`Error: ${apiErrors.data}`}</span>
                </div>
              </Alert>
            ) : <></>}
            <div className="row col-12 pt-sm-5 pt-3 pb-3 m-0 p-0">
              <div className="col-lg-5 col-12 px-md-5 px-3 pb-3 m-0 p-0">
                <h2 className="col-sm-11 col-12 sentient-subtitle m-0 p-0">
                  Your Information
                </h2>
              </div>
              <div className="col-lg-7 col-12 px-md-5 px-3  m-0 p-0">

                <div className="col-12 px-3 m-0 p-0">
                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="First name*"
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
                      placeholder="Last name*"
                      {...register('last_name', { required: true })}
                      id="last_name"
                      className={`form-control ${errors && errors.last_name ? 'is-invalid' : ''}`}
                    />
                  </FormGroup>
                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Company name*"
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
                      <div className="col-md-6 col-12 m-0 p-0">
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
                      <div className="col-md-6 col-12 m-0 p-1 d-sm-flex d-none">
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
                          onPaste={(e) => {
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
                          onPaste={(e) => {
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
                          className={classnames({ 'is-invalid': errors && errors.phone }, 'sentient-content w-100 px-1')}
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
                          onPaste={(e) => {
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
                          onPaste={(e) => {
                            e.preventDefault()
                            return false;
                          }}
                          {...register('Mmobile', { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>
{/* 
                  <FormGroup className="form-group row form-row align-items-center">
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
                        onPaste={(e) => {
                          e.preventDefault()
                          return false;
                        }}

                        {...register('fax', { required: false })}
                      />
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
                </div>
              </div>
            </div>

            <div className="col-12 px-md-5 px-3 m-0 p-0">
              <hr className="sentient-underline d-sm-flex d-none" />
            </div>

            <div className="row col-12 py-sm-5 py-2 m-0 p-0">
              <div className="col-lg-5 col-12 px-md-5 px-3 pb-2 m-0 p-0">
                <h1 className="col-12 sentient-subtitle m-0 p-0">
                  Warranty Information
                </h1>
              </div>
              <div className="col-lg-7 col-12 px-md-5 px-3  m-0 p-0">
                <div className="col-12 px-3 m-0 p-0">
                  <FormGroup className="form-group row form-row align-items-center">
                    {/* <input
                    type="text"
                    placeholder="Manufacturer"
                    id="manufacturer"
                    name="manufacturer"
                    className={classnames({ 'is-invalid': errors && errors.manufacturer }, 'form-control sentient-content')}
                    style={{ border: '1px solid #646464' }}
                    {...register('manufacturer', { required: false })} 
                  /> */}
                    <div className="col-12 m-0 p-0">
                      <Select
                        as={Select}
                        options={company}
                        id="manufacturer"
                        name="manufacturer"
                        required
                        placeholder="Manufacturer *"
                        value={selectedCompany}
                        isClearable={false}
                        classNamePrefix="select"
                        control={control}
                        defaultvalue={selectedCompany}
                        className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.manufacturer })}`}
                        onChange={(value) => { handleCompanyChange(value); }}
                        {...register('manufacturer')?.label}

                      />
                <span style={{ fontWeight: 'bold', color: 'red' }}>{productErrMsg}</span>

                    </div>
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <div className="col-12 m-0 p-0">
                      {/* <input
                    type="text"
                    placeholder="Model"
                    id="model"
                    name="model"
                    className={classnames({ 'is-invalid': errors && errors.model }, 'form-control sentient-content')}
                    style={{ border: '1px solid #646464' }}
                    {...register('model', { required: false })} 
                  /> */}

                      <Select
                        as={Select}
                        options={prodList}
                        name="model"
                        id="model"

                        value={product}
                        isClearable={false}
                        control={control}
                        placeholder="Model"
                        defaultvalue={product}
                        className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.productModel }, 'border')}`}
                        classNamePrefix="select"
                        onChange={(value) => { setProduct(value); }}
                        {...register('model')?.label}

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
                      onPaste={(e) => {
                        e.preventDefault()
                        return false;
                      }}
                      {...register('year', { required: true, pattern: /^\d{4}$/ })}
                    />
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Issues / Error Codes *"
                      id="issues"
                      name="issues"
                      className={classnames({ 'is-invalid': errors && errors.issues }, 'form-control sentient-content')}
                      style={{ border: '1px solid #646464' }}
                      {...register('issues', { required: true })}
                    />
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <textarea
                      type="textarea"
                      placeholder="Description *"
                      id="description"
                      name="description"
                      rows={5}
                      className={classnames({ 'is-invalid': errors && errors.description }, 'form-control sentient-content')}
                      {...register('description', { required: true })}
                      style={{ border: '1px solid #646464' }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <div className="form-group row form-row align-items-center">
                      <Label className="sentient-text-content col-12 m-0 p-0 col-form-label">
                        Product image / video
                      </Label>
                      <div className="col-12 m-0 p-0">
                        {register.productImageFile && !showDropzone ? (
                          <>
                            <Image src={register.productImageFile} className="img-fluid " alt="logo" />
                            <Button.Ripple onClick={() => setShowDropzone(true)} className="btn-sm float-right" color="flat-info">Change</Button.Ripple>
                          </>
                        ) : (<></>)}

                        {!register.productImageFile || showDropzone ? (
                          <Controller
                            style={{ border: '1px solid #646464' }}
                            control={control}
                            name="productImageFile"
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
                              <input type="file" name="myImage" accept=".png, .jpg, .jpeg, .mp3, .mp4" onChange={uploadToClient} />

                            )}
                          />

                        ) : (<></>)}
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <Flatpickr
                      value={eventDatePicker}
                      id="lastServiceDate"
                      name="lastServiceDate"
                      required
                      placeholder="Date of last service *"
                      onChange={(date) => { setEventDatePicker(date[0]); }}
                      style={{ border: '1px solid #646464' }}
                      className={`form-control ${classnames({ 'is-invalid': errors && errors.lastServiceDate })}`}
                      rules={{ required: true }}
                      options={{
                        mode: 'single',
                        dateFormat: 'Y-m-d H:i:S',
                        enableTime: true, // Enable manual time input
                       
                      }}
                      
                     
                    />  <span style={{ fontWeight: 'bold', color: 'red' }}>{dynamicError}</span>
                  </FormGroup>

                 
                  <FormGroup>
                    <div className="form-group row form-row align-items-center">
                      {/* <Label className="sentient-text-content col-12 m-0 p-0 col-form-label">
                        Is your device currently under warranty?
                      </Label> */}
                      <div className="col-12 m-0 p-0">
                        <Select
                          as={Select}
                          options={blooleanValue}
                          name="isUnderWarranty"
                          placeholder="Is your device currently under warranty? "
                          isClearable={false}
                          control={control}
                          className={`react-select ${classnames({ 'is-invalid': errors && errors.isUnderWarranty }, 'sentient-content')}`}
                          classNamePrefix="select"
                          //defaultValue={blooleanValue[0]}
                          value={selectedIsCuWarranty}
                          onChange={(value) => (setSelectedIsCuWarranty(value))}
                          style={{ border: '1px solid #646464' }}
                          {...register('isUnderWarranty').label}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="With whom is the device under warranty? *"
                      id="underWarrantyUserName"
                      name="underWarrantyUserName"
                      className={classnames({ 'is-invalid': errors && errors.underWarrantyUserName }, 'form-control sentient-content')}
                      {...register('underWarrantyUserName', { required: true })}
                      style={{ border: '1px solid #646464' }}
                    />
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Length of current warranty plan *"
                      id="warrantyPlanPeriod"
                      name="warrantyPlanPeriod"
                      className={classnames({ 'is-invalid': errors && errors.warrantyPlanPeriod }, 'form-control sentient-content')}
                      {...register('warrantyPlanPeriod', { required: true })}
                      style={{ border: '1px solid #646464' }}
                    />
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Cost of current warranty plan *"
                      id="warrantyPlanCost"
                      name="warrantyPlanCost"
                      className={classnames({ 'is-invalid': errors && errors.warrantyPlanCost }, 'form-control sentient-content')}
                      {...register('warrantyPlanCost', { required: true })}
                      style={{ border: '1px solid #646464' }}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault()
                        return false;
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <div className="form-group row form-row align-items-center">
                      {/* <Label className="sentient-text-content col-12 m-0 p-0 col-form-label">
                        Preferred mode of contact
                      </Label> */}
                      <div className="col-12  m-0 p-0">
                        <Select
                          as={Select}
                          options={modeContactValue}
                          id="preferredContactMode"
                          name="preferredContactMode"
                          placeholder="Select preferred method of contact *"
                          isClearable={false}
                          control={control}
                          className={`react-select ${classnames({ 'is-invalid': errors && errors.preferredContactMode }, 'sentient-content')}`}
                          classNamePrefix="select"
                          defaultValue={modeContactValue[0]}
                          value={selectedModeContact}
                          onChange={(value) => (setSelectedModeContact(value))}
                          style={{ border: '1px solid #646464' }}
                          {...register('preferredContactMode').label}
                        /><span style={{ fontWeight: 'bold', color: 'red' }}>{dynamicError2}</span>
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <Flatpickr
                      value={contactDatePicker}
                      id="preferredContactTime"
                      name="preferredContactTime"
                      placeholder="Preferred time of contact (default Eastern Standard Time) *"
                      onChange={(date) => { setContactDatePicker(date[0]); }}
                      style={{ border: '1px solid #646464' }}
                      className={`form-control m-0 ${classnames({ 'is-invalid': errors && errors.preferredContactTime })}`}
                      rules={{ required: true }}
                      options={{
                        mode: 'single',
                        dateFormat: 'Y-m-d H:i:S',
                        enableTime: true, // Enable manual time input
                       
                      }}

                   
                    /><span style={{ fontWeight: 'bold', color: 'red' }}>{dynamicError1}</span>
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="What was performed at last service ? *"
                      id="lastServiceAction"
                      name="lastServiceAction"
                      className={classnames({ 'is-invalid': errors && errors.lastServiceAction }, 'form-control sentient-content')}
                      {...register('lastServiceAction', { required: true })}
                      style={{ border: '1px solid #646464' }}
                    />
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Who serviced the device most recently ? *"
                      id="recentServiceUserName"
                      name="recentServiceUserName"
                      className={classnames({ 'is-invalid': errors && errors.recentServiceUserName }, 'form-control sentient-content')}
                      {...register('recentServiceUserName', { required: true })}
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
                    <div className="pt-2 pb-5 m-0 p-0 d-flex">
                      <p className="sentient-button sentient-footer p-3" style={{ fontSize: '16px', fontWeight: '700', cursor: 'pointer' }} onClick={handleButtonClick}>
                        Submit your device for sale
                      </p>
                    </div>
                  </FormGroup>
                </div>

              </div>
            </div>
          </Form>
        </div>
      </div>
    </PageLayout>
  );
};

export default WarrantyDevice;
