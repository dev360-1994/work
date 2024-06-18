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
import Dropzone, {
  IFileWithMeta,
  StatusValue,
} from 'react-dropzone-uploader';
import { CheckCircle } from 'react-feather';

import { acceptedImageFormats } from '@src/configs/dropzoneUploader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getLookupCountry, getLookupState } from '@src/api/contact.actions';
import { addSellProductInventory, getFullProductModel, getLaserType } from '@src/api/sell.action';

import {
  blooleanValue, leadRecordType, leadSourceType, ownerShip,
  devicePowerRequirements, generalConditions
} from '@src/components/contactComponents';

import { createRef } from 'react';
import PageLayout from '@src/layouts/PageLayout';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import {
  getBuySearch, getCompanyManufacturer, getPriceRange, getProductModel,
} from '@src/api/buy.action';
import { getLookupProductOption,getProductActive,getProduct} from '@src/api/product.actions';

const ListDevice = () => {
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

  const [selectedPowerRequirement, setSelectedPowerRequirement] = useState([]);
  const [selectedGeneralCondition, setSelectedGeneralCondition] = useState([]);
  const [selectedOwnerShip, setSelectedOwnerShip] = useState([]);
  const [selectedOPeratorManuals, setSelectedOPeratorManuals] = useState([]);
  const [selectedCUFactoryWarranty, setSelectedCUFactoryWarranty] = useState([]);
  const [selectedOriginalBoxes, setSelectedOriginalBoxes] = useState([]);
  const [eventDatePicker, setEventDatePicker] = useState();
  const [prodList, setProdList] = useState([]);
  const [product, setProduct] = useState([]);

  // const [selectedPowerRequirement, setSelectedPowerRequirement] = useState(powerRequirements[0]);
  // const [selectedOwnerShip, setSelectedOwnerShip] = useState(ownerShip[0]);
  // const [selectedOPeratorManuals, setSelectedOPeratorManuals] = useState(blooleanValue[0]);
  // const [selectedCUFactoryWarranty, setSelectedCUFactoryWarranty] = useState(blooleanValue[0]);
  // const [selectedOriginalBoxes, setSelectedOriginalBoxes] = useState(blooleanValue[0]);

  const [showPhone, setShowPhone] = useState('');
  const [showFax, setShowFax] = useState('');

  const [files, setFiles] = useState();

  const fields = [
    'first_name', 'last_name', 'company', 'email', 'productName', 'street', 'address1', 'address2', 'country', 'zip', 'mzip',
    'state', 'productModel', 'ifOther', 'companyMfg', 'type', 'waveLength', 'productYear', 'phone', 'city', 'mobile', 'Mmobile',
    'askingPrice', 'bestOffer', 'serialNumber', 'reasonForSelling', 'productOptions', 'accessories', 'description',
    'productImageFile', 'videoLink', 'shotPulseCount', 'hourCount', 'handPieces', 'generalCondition', 'powerRequirements',
    'ownerShip', 'lastServiced', 'operatorManuals', 'cuFactoryWarranty', 'originalBoxes', 'itlPrefix', 'ProductId',
  ];

  const searchType = [
    { value: 1, label: 'Manufacturer' },
  ];
  const [companyManufacturer, setCompanyManufacturer] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);

  const [productCompanyErrMsg, setProductCompanyErrMsg] = useState('');
  const [productModelErrMsg, setProductModelErrMsg] = useState('');
  const [productTypeErrMsg, setProductTypeErrMsg] = useState('');

  const handleCompanyChange = async (value) => {
    const arrList = [];
    //console.log("VAlueeeeeeeee"+value.label);
    setSelectedCompany(value);
    setProductCompanyErrMsg('');

    const prodList = await getBuySearch({ companyName: value.label }) || [];
    const minus = '-';

    const prodData1 = prodList?.map((item, index) => ({

      label: item.productModel, //+minus+ item.productType
      value: item.productId ?? '',
      prodOption: item.productOptionIds,
      productType:item.productType,

      productWaveLength: item.waveLength,
      yearOfManufracture: item.productYear,
      askingPriceDetails: item.askingPrice
    })) ?? [];

    const prodData = prodData1.reduce((arr, item) => {
      const prodData= arr.filter(i => i['value'] !== item['value']);
      return [...prodData, item];
  }, []);
    if (prodData && prodData.length > 0) {
      const formattedProdData = prodData.map((item) => ({
        ...item,
        label: item.label.split(minus)[0].trim(),
      }));
      setProductCompany(prodData);
      setSelectedProduct(prodData[0]);
      setProductModelErrMsg('');
      setProdList(formattedProdData);
      setValue('waveLength', formattedProdData[0]?.productWaveLength || '');
      setSelectedLaserType({label:formattedProdData[0]?.productType,value:formattedProdData[0]?.productType})
      setValue('productYear', formattedProdData[0]?.yearOfManufracture || "");
      setValue('askingPrice', formattedProdData[0]?.askingPriceDetails || "");
      setProduct(formattedProdData[0]);
    }

    //  const optionData = await getLookupProductOption();
    //   const updateOption = optionData?.map((item) => ({
    //     label: item.name,
    //     value: item.productOptionId,
    //   }));

    //   var wanted =[];
    //   if(prodData[0]?.prodOption?.length>0){
    //    wanted =prodData[0]?.prodOption?.split(",");
    //   }
    //   updateOption.forEach((item) => {
    //     var result=item.value.toString();
    //     var result1 = wanted.indexOf(result);
    //     if(parseInt(result1)>=0){
    //       arrList.push({label:item.label,value:item.value})
    //     }
    //   });
    //   setProductOption(arrList || []);
    //   setSelectedProductOption(arrList || []);
    //   setValue('productOption', arrList || '');

  }

  useEffect(() => {
    const fetchData = async () => {
      try {

        const companyModelData = await getCompanyManufacturer({ type: searchType[0].value });
        const modelDataCompany = companyModelData?.map((item, index) => ({
          label: item.companyName,
          value: item.cnt,
        })) ?? [];

        if (modelDataCompany && modelDataCompany.length > 0) {
          setCompanyManufacturer(modelDataCompany);
          // setSelectedCompany([modelDataCompany[0]]);
          setSelectedCompany([]);
        }

        const prodList = await getBuySearch({ companyName: modelDataCompany[0].label }) || [];

        const minus = '-';
        const prodData = prodList?.map((item, index) => ({

          label: item.productModel, //+minus+ item.productType
          value: item.productId ?? '',
          prodOption: item.productOptionIds,
        })) ?? [];
        if (prodData && prodData.length > 0) {
          setProductCompany([]);
          //setSelectedProduct(prodData[0]);
          setSelectedProduct([]);
        }
        const optionData = await getLookupProductOption();
        setProductOption(optionData || []);
        setValue('productOption', optionData || '');

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
        } else {
          setStates([]);
          setSelectedState({});
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

        fields.forEach((field) => setValue(field, ''));

        const laserData = await getLaserType();
        if (laserData && laserData.length > 0) {
          const updateddata = laserData.map((item) => ({
            label: item.name,
            value: item.name,
          }));
          setLaserType(updateddata || []);
          //setSelectedLaserType(updateddata[0] || '');
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

  useEffect(() => {
    setSelectedCountry(countries?.length > 0 ? countries[225] : null);
  }, [countries]);
  useEffect(() => {
    setSelectedState(states?.length > 0 ? states[0] : null);
  }, [states]);

  // useEffect(() => {
  //   if (selectedProduct) {
  //     const {
  //       company, waveLength, type, askingPrice, productName,
  //     } = productCompanyInfo?.find((item) => item.productId === selectedProduct.value);

  //     setValue('companyMfg', company);
  //     //setValue('waveLength', waveLength);
  //     //setValue('ifOther', productName);
  //     setValue('type', type);
  //     setSelectedLaserType(type);
  //     setValue('askingPrice', askingPrice);
  //   }
  // }, [selectedProduct]);

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

  const convertToUTC = (date) => {
    const timezoneOffset = date.getTimezoneOffset();
    const utcTimestamp = date.getTime() + (timezoneOffset * 60 * 1000);
    const utcDate = new Date(utcTimestamp);

    return utcDate;
  };

  const onSubmit = async (data) => {
    if (selectedCompany?.label === undefined || selectedCompany?.label === '') {
      setProductCompanyErrMsg("Please select Manufacturer");
      // Get the offset of the element based on the viewport
      const elementToScrollTo = document.getElementById("productCompany");
      if (elementToScrollTo) {
        elementToScrollTo.scrollIntoView({ behavior: "smooth" });
      }
      return;
    } else {
      setProductCompanyErrMsg('');
    }

    if (selectedProduct?.label === undefined || selectedProduct?.label === '') {
      setProductModelErrMsg("Please select Product Model");
      // Scroll to the element with the specified ID
      const elementToScrollTo = document.getElementById("productModel");
      if (elementToScrollTo) {
        elementToScrollTo.scrollIntoView({ behavior: "smooth" });
      } return;
    } else {
      setProductModelErrMsg('');
    }

    if (selectedLaserType?.label === undefined || selectedLaserType?.label === '') {
      setProductTypeErrMsg("Please select Type");
      // Scroll to the element with the specified ID
      const elementToScrollTo = document.getElementById("type");
      if (elementToScrollTo) {
        elementToScrollTo.scrollIntoView({ behavior: "smooth" });
      } return;
    } else {
      setProductTypeErrMsg('');
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
        style: { textAlign: "left", width: "400px" }

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

    setValue('phone', showPhone);
    setValue('productImageFile', files != undefined ? files : null);
    setValue('productName', selectedProduct?.label ? selectedProduct?.label : '');
    setValue('companyMfg', selectedCompany?.label ? selectedCompany.label : '');
    setValue('generalCondition', selectedGeneralCondition?.label ? selectedGeneralCondition.label : '');



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
    queryParams += `&phone=${encodeURIComponent(getValues('phone') ?? '')}`;
    queryParams += `&country=${encodeURIComponent(getValues('country') ?? '')}`;
    queryParams += `&mobile=${encodeURIComponent((getValues('mobile') || getValues('Mmobile')) ?? '')}`;
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
    const lastServiceDate ="";
     if(eventDatePicker!=undefined){
      
      lastServiceDate = convertToUTC(new Date(eventDatePicker)).toLocaleString();

    }
    setValue('lastServiced', lastServiceDate);

    setValue('state', selectedState?.value ? selectedState.value : 0);
    setValue('productModel', selectedProduct?.value ? selectedProduct.value : 0);
    setValue('type', selectedLaserType?.label);
    setValue('powerRequirements', selectedPowerRequirement?.label ? selectedPowerRequirement.label : '');
    setValue('ownerShip', selectedOwnerShip?.label);
    setValue('cuFactoryWarranty', selectedCUFactoryWarranty?.value ? selectedCUFactoryWarranty.value : 0);
    setValue('ProductId', selectedProduct?.value ? selectedProduct.value : 0);

    //const { productName } = productCompanyInfo.find((item) => item.productId === selectedProduct.value);
    //setValue('productName', productName || '');
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
    form.append('ProductInventory.Type', getValues('ownerShip') === 'Owned' ? 'sell' : 'lease');
    form.append('ProductInventory.Company', getValues('companyMfg') ?? '');
    form.append('ProductInventory.PulseLength', getValues('shotPulseCount') ?? ''); //
    form.append('ProductInventory.SerialNumber', getValues('serialNumber') ?? '');
    form.append('ProductInventory.AskingPrice', getValues('askingPrice') != null && getValues('askingPrice') !== '' ? getValues('askingPrice') : 0);
    form.append('ProductInventory.UserImageFile', getValues('productImageFile') ?? '');
    form.append('ProductInventory.Company', selectedCompany?.label ? selectedCompany.label : '');
    form.append('ProductInventory.ProductName', selectedProduct?.label ? selectedProduct.label : '');
    //form.append('ProductInventory.Description ',getValues('accessories') ?? '');
    form.append('ProductInventory.GeneralCondition',getValues('generalCondition'));
    form.append('ProductInventory.Accessories',getValues('accessories'));
    form.append('ProductInventory.HourCount',getValues('hourCount'));
    form.append('ProductInventory.LastServiced',getValues('lastServiced') ?? '');
    form.append('ProductInventory.OperatorManuals',selectedOPeratorManuals.label ?? '');
    form.append('ProductInventory.Handpieces', getValues('handPieces') ?? '');
    form.append('ProductInventory.OriginalBoxes', selectedOriginalBoxes.label ?? '');

    
    const description = `${getValues('description')}; Accessories: ${getValues('accessories')}; 
    Shot/Pulse Count: ${getValues('shotPulseCount')}; General Condition: ${getValues('generalCondition')};
    Power: ${getValues('powerRequirements')}; Ownership: ${getValues('ownerShip')};
    Last Serviced: ${getValues('lastServiced')}; Currently Under Factory Warranty: ${selectedCUFactoryWarranty?.label};
    Original Boxes/Crate: ${selectedOriginalBoxes.label}; Handpieces: ${getValues('handPieces')};
    Hour Count: ${getValues('hourCount')}; Operator Manuals: ${selectedOPeratorManuals.label};`;

    form.append('ProductInventory.Description', getValues('description') ?? '');
    try {
      const res = await addSellProductInventory(form);
      if (res) {
        console.log('aaa ->', res);
        toast.success(
          <>
            <CheckCircle className="mr-1 text-success" />
            Sell succeeded
          </>, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          style:{ textAlign:"left", width: "400px" }
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

  const DynamicProduct = () => (
    <>
      <FormGroup className="form-group row form-row align-items-center">
        <Label className="sentient-content py-2 m-0 p-0">
          Indicated Uses:
        </Label>
        <FormGroup className="form-group row form-row align-items-center">
          {/* <div className="row col-12 ">
          {productOption?.map((item) => (
            <div className="col-sm-6 sentient-content m-0 p-0 pb-1 d-flex" key={item.productOptionId}>
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
          ))}
        </div> */}
          <div className="row col-12">
            {productOption?.map((item) => (
              <div
                className="col-sm-6 col-md-6 py-3 px-0"
                key={item.productOptionId}
              >
                <div className="d-flex">
                  <input
                    type="checkbox"
                    name={item.name}
                    id={item.productOptionId}
                    value={item.active}
                    className={classnames("form-check-input")}
                    {...register(item.name, { required: false })}
                  />
                  <label
                    htmlFor={item.productOptionId}
                    className="form-check-label sentient-content px-3"
                    style={{fontSize:"15px",marginTop:"0.2rem"}}
                  >
                    {item.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </FormGroup>
      </FormGroup>
    </>
  );

  const handleButtonClick = () => {
    clearErrors();
    handleSubmit(onSubmit)();
  };

  const querySentient = [
    {
      query: 'What does it cost to list your laser on the LaserTrader open market?',
      answer: 'Nothing out of your pocket at any point in the process! Just like other services such as Ebay or Craigslist,  the sale price is negotiated between the seller and buyer directly. Negotiation points to consider are the crating, insurance and shipping costs associated with the transfer of the system. A warranty may also be a consideration.',
    },
    {
      query: 'What should I price my systems at?',
      answer: 'TheLaserTrader keeps a virtual Blue Book of fair market values for devices and we are happy to provide guidance on how to price your system. Your system is worth what the market will pay, regardless of how much you paid for it. The higher the price is set above the market price - the longer it will sit without any offers.',
    },
    {
      query: 'Should I price my system similar to the same models already posted on LaserTrader?',
      answer: 'Pricing is set by the owner of the listing and may not be indicative of what the market will bear. The best and most reliable method is to contact TheLaserTrader to inquire about the market value, and determine from there.',
    },
    {
      query: 'Do I need to check the OBO (or best offer) button on my listing ad?',
      answer: 'No, but we strongly suggest that you entertain offers. It is a great way to get connected with potential buyers. Keep in mind you can always say no, or counter the offer.',
    },
    {
      query: 'How do I make changes to the Price or Description of a system I have listed?',
      answer: 'Call us at (866) 400-1250 and talk to us live, or simply send an e-mail to <a className="sentient-content navbar-brand" href="mailto:assureddevelopment@sentientlasers.com" style= "text-decoration: underline; color: #4DAC00;"><b> info@thelasertrader.com </b></a>',
    },
    {
      query: 'How do I keep track of my listing?',
      answer: 'Every thirty (30) days you will be sent an automatic email reminder asking if your system is still for sale or if you would like to make any changes to your listing. Additionally, there is a counter on each listing that tracks how many people have viewed your device. This can be a good indication of whether your device is appropriately priced or heavily sought after.',
    },
    {
      query: 'Is there anything that I have to sign to consign my device with the LaserTrader?',
      answer: 'No. There is no obligation or anything that is needed upfront to post on The LaserTrader. Please notify us if you sell a listed device outside of The LaserTrader, so we can take your ad down.',
    },
    {
      query: 'Do I have to send my system to the LaserTrader to consign it?',
      answer: 'No. We strongly believe that you should NEVER send your equipment to a dealer / broker in order to sell it. It makes much more sense to keep your asset in your control until the time of sale.',
    },
    {
      query: 'How am I notified of potential offers from buyers?',
      answer: 'You will be notified directly by the interested party via the email address provided upon listing. Before the contact information is exchanged, the LaserTrader team will make sure the potential buyer is legitimate to help minimize "spam" or bogus buyers.',
    },
    {
      query: 'How do I ship my system and who pays for it?',
      answer: 'Typically the buyer will pay for all shipping and handling of the system, but this is a point of negotiation. The LaserTrader can make vendor recommendations to assist with the crating, pick up, insurance, and delivery of the system. If you have the original shipping crate for the device make sure to note that in your listing, as it makes the transfer easier for both parties.',
    },
  ];

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue('phone', inputValue); // Update the 'phone1' value in the form
    setShowPhone(inputValue); // Update state for visual display, if needed
  };
  
  const handleProductChange= async (value) => {
    setProduct(value);
    const minus = '-';
    const prodList = await getProduct( value.value);
    console.log("prodList>>>>>>>>>>>",prodList);
  // setValue('type', formattedProdData[0]?.productType || '');
     setSelectedLaserType({label:prodList?.type,value:prodList?.type})
     //setValue('waveLength', formattedProdData[0]?.productWaveLength || '');
     
     setValue('waveLength', prodList?.waveLength || '');
     setValue('askingPrice', prodList?.askingPrice || 0);

     const prodList1= await getBuySearch({companyName:selectedCompany?.label})|| [];
     const prodData1 = prodList1?.map((item, index) => ({
     
      label: item.productModel+minus+ item.productType,
     // value: item.inventoryId ?? '',
      prodOption:item.productOptionIds,label: item.productModel+minus+ item.productType,
      value: item.productId ?? '',
      prodOption:item.productOptionIds,
      productType:item.productType,
      productWaveLength:item.waveLength,
      yearOfManufracture:item.productYear,
      askingPriceDetails: item.askingPrice
    })) ?? [];

    const prodData = prodData1.reduce((arr, item) => {
      const prodData= arr.filter(i => i['value'] !== item['value']);
      return [...prodData, item];
    }, []);

  const data = prodData.filter((item) => item.value === product?.value);
    if(data?.length>0){
    setValue('productYear', data[0]?.yearOfManufracture || "");
    }else{
      setValue('productYear', 0);
    }
 

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


  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      console.log("URL.createObjectURL(i)", i);
      setFiles(i);
      //setCreateObjectURL(URL.createObjectURL(i));
    }
  };
  return (
    <PageLayout>
      <div className="w-100 pageTop">
        <div className="w-100 header-image listdevicepage-image m-0 p-0 d-sm-flex d-none align-items-center">
          <div className="col-lg-7 col-12 px-md-5 px-3 m-0 p-0">
            <h1 className="sentient-title" style={{ color: '#FFFFFF' }}>
              List Your Device
            </h1>
          </div>
        </div>
        {/* mobile */}
        <div className="w-100 header-image listdevicepage-mobileimage m-0 p-0 d-sm-none d-flex align-items-center">
          <div className="col-lg-7 col-12 px-md-5 px-3 m-0 p-0">
            <h1 className="sentient-title" style={{ color: '#FFFFFF' }} >
              List Your Device
            </h1>
          </div>
        </div>
        <div className="w-100" />
        <div className="row col-12 m-0 p-0 py-lg-5 px-md-5 px-3 py-2" >
          <div className="col-lg-6 col-12 m-0 p-0">
            <h3 className="col-sm-10 col-12 sentient-contenttitle m-0 p-0">
              Listing your medical laser or IPL system with LaserTrader is free. We’ll keep your listing up for as long as you’d like or until it sells.
            </h3>
          </div>
          <div className="col-lg-6 col-12 pt-lg-0 pt-3 m-0 p-0">
            <p className="sentient-contenttitle" style={{ fontSize: '24px', fontWeight: '400' }}>
              Fill out the form below as completely as possible and make sure to include contact information and a phone number so we can reach you. We’ll contact you as soon as we get any response(s) from your ad.
              <br />
              <br />
              LaserTrader by Sentient purchases select devices, and may contact you directly with an offer.
            </p>
          </div>
        </div>

        {/* <div className="col-12 px-md-5 px-3 m-0 p-0" style={{ backgroundColor: '#FFFFFF' }}>
        <hr className="sentient-underline d-sm-flex d-none" />
      </div> */}

        <div className="row col-12 m-0 p-0" >
          <div className="col-12 px-md-5 px-3 m-0 p-0" >
            <hr className="sentient-underline d-sm-flex d-none" />
          </div>
          <div className="col-12 px-md-5 px-3 pt-lg-3 pt-2 m-0 p-0">
            <h2 className="sentient-subtitle d-sm-flex d-none">Sell your laser with LaserTrader by Sentient</h2>
            {/* mobile */}
            <h2 className="sentient-contenttitle d-sm-none d-flex">Sell your laser with LaserTrader by Sentient</h2>
          </div>
          <div className="col-12 px-md-5 px-3 py-m-3 py-2 m-0 p-0">
            <p className="sentient-content">We will make contact with you as soon as we get any response(s) from your ad. Again, please remember to add as much detail as possible. If your laser / IPL has an hour, shot or pulse counter, it is recommended to list this information for the machine as well as the applicable treatment heads or handpieces.  </p>
            <p className="sentient-content"> <b>NOTE: </b>If you sell your system on your own please notify TheLaserTrader.com so we can take down (end) your listing. Thank you in advance for your cooperation.</p>
            <p className="sentient-content"> <b>NOTE: </b>We do NOT post Microdermabrators, COLD (Therapy) Lasers or Non-FDA Approved devices</p>
          </div>

          <div className="col-12 px-md-5 px-3 pt-2 m-0 p-0">
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
                  <div className="col-12 m-0 p-0 px-md-5 px-3 ">
                    <input type="hidden" name="oid" value="00DDn000009Q6pN" />
                    <input type="hidden" name="retURL" value="https://sl-it-whappeastus-02.azurewebsites.net" />
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
                        style={{ border: '1px solid #646464' }}
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
                        placeholder="Address line 1*"
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
                        <div className="col-md-6 col-12 m-0 p-0 d-sm-flex d-none">
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
                            placeholder=" Office Phone: (123) 555 1234"
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
                            className={classnames({ 'is-invalid': errors && errors.mobile }, 'form-control sentient-content')}
                            style={{ border: '1px solid #646464' }}
                            autoComplete='off'
                            maxLength={10}
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
                        <div className="col-md-6 col-12 pt-1 m-0 p-1 d-sm-none d-flex">
                          <input
                            type="text"
                            placeholder="Mobile"
                            id="Mmobile"
                            name="Mmobile"
                            className={classnames({ 'is-invalid': errors && errors.Mmobile }, 'form-control sentient-content')}
                            style={{ border: '1px solid #646464' }}
                            autoComplete='off'
                            maxLength={10}
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

                <div className="col-lg-7 col-12 px-md-5 px-3 m-0 p-0">
                  <div className="col-12 px-md-5 px-3 m-0 p-0">
                    <FormGroup className="form-group row form-row align-items-center">
                      <div className="col-12 m-0 p-0">
                        <Select
                          as={Select}
                          options={companyManufacturer}
                          id="productCompany"
                          name="productCompany"
                          required
                          placeholder="Manufacturer*"
                          value={selectedCompany}
                          isClearable={false}
                          classNamePrefix="select"
                          control={control}
                          defaultvalue={selectedCompany}
                          className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.productCompany })}`}
                          onChange={(value) => { handleCompanyChange(value); }}
                          {...register('productCompany')?.label}
                        />
                        <span style={{ fontWeight: 'bold', color: 'red' }}>{productCompanyErrMsg}</span>

                      </div>
                    </FormGroup>
                    <FormGroup className="form-group row form-row align-items-center">
                      <div className="col-12 m-0 p-0">
                        <Select
                          as={Select}
                          options={prodList}
                          name="productModel"
                          id="productModel"
                          value={selectedProduct}
                          isClearable={false}
                          control={control}
                          placeholder="Model"
                          defaultvalue={selectedProduct}
                          className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.productModel })}`}
                          classNamePrefix="select"
                          onChange={(value) => (handleProductChange(value))}
                          //onChange={(value) => { setSelectedProduct(value); }}
                          {...register('productModel')?.label}

                        />
                        <span style={{ fontWeight: 'bold', color: 'red' }}>{productModelErrMsg}</span>

                      </div>

                    </FormGroup>
                    {/* <FormGroup className="form-group row form-row align-items-center">
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
                  </FormGroup> */}

                    <FormGroup className="form-group row form-row align-items-center">
                      <input
                        type="text"
                        placeholder="Other"
                        id="ifOther"
                        name="ifOther"
                        className={classnames({ 'is-invalid': errors && errors.ifOther }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                        {...register('ifOther', { required: false })}
                      />
                    </FormGroup>

                    {/* <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Input CompanyMfg"
                      id="companyMfg"
                      name="companyMfg"
                      className={classnames({ 'is-invalid': errors && errors.companyMfg }, 'form-control sentient-content')}
                      style={{ border: '1px solid #646464' }}
                      {...register('companyMfg', { required: false })}
                    />
                  </FormGroup> */}

                    <FormGroup className="form-group row form-row align-items-center">
                      <div className="col-12 m-0 p-0">
                        <Select
                          as={Select}
                          options={laserType}
                          id='type'
                          name="type"
                          isDisabled
                          value={selectedLaserType}
                          isClearable={false}
                          control={control}
                          defaultvalue={selectedLaserType || ''}
                          placeholder="Type*"
                          className={`react-select ${classnames({ 'is-invalid': errors && errors.type }, 'sentient-content')}`}
                          classNamePrefix="select"
                          onChange={(value) => {
                            setSelectedLaserType(value);
                            setProductTypeErrMsg('');
                          }}
                          style={{ border: '1px solid #646464' }}
                          {...register('type')?.label}
                        />
                        <span style={{ fontWeight: 'bold', color: 'red' }}>{productTypeErrMsg}</span>

                      </div>
                    </FormGroup>

                    <FormGroup className="form-group row form-row align-items-center">
                      <input
                        type="text"
                        placeholder="Wave length *"
                        id="waveLength"
                        name="waveLength"
                        readOnly
                        className={classnames({ 'is-invalid': errors && errors.waveLength }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                        {...register('waveLength', { required: true })}
                      />
                    </FormGroup>

                    <FormGroup className="form-group row form-row align-items-center">
                      <input
                        type="text"
                        placeholder="Year of Manufacture *"
                        id="productYear"
                        name="productYear"
                        readOnly
                        className={classnames({ 'is-invalid': errors && errors.productYear }, 'form-control sentient-content')}
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
                        {...register('productYear', { required: true, pattern: /^\d{4}$/ })}
                      />
                    </FormGroup>

                    <FormGroup className="form-group row form-row align-items-center">
                      <input
                        type="text"
                        placeholder="Asking price "
                        id="askingPrice"
                        name="askingPrice"
                        readOnly
                        className={classnames({ 'is-invalid': errors && errors.askingPrice }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                        {...register('askingPrice', { required: false })}
                      />
                    </FormGroup>

                    <FormGroup className="form-group row form-row align-items-center">
                      <div className="d-flex align-items-center m-0 p-0">
                        {/* <label htmlFor="bestOffer" className="form-check-label sentient-content px-1 fs-5">
                          {"\"Or Best Offer\""}:
                        </label> */}
                        <input
                          type="checkbox"
                          name="bestOffer"
                          id="bestOffer"
                          className={classnames("form-check-input")}
                          {...register('bestOffer', { required: false })}
                        />
                        <span className="sentient-content ms-1">&nbsp; Include {"\"Or Best Offer/ OBO\""}</span>
                      </div>
                    </FormGroup>


                    <FormGroup className="form-group row form-row align-items-center">
                      <input
                        type="text"
                        placeholder="Serial number"
                        id="serialNumber"
                        name="serialNumber"
                        className={classnames({ 'is-invalid': errors && errors.serialNumber }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                        {...register('serialNumber', { required: false })}
                      />
                    </FormGroup>

                    <FormGroup className="form-group row form-row align-items-center">
                      <textarea
                        type="textarea"
                        placeholder="Reason for selling"
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
                      <textarea
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
                        placeholder="Shot/Pulse Count"
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
                        placeholder="Hour Count"
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
                        placeholder="Handpieces"
                        id="handPieces"
                        name="handPieces"
                        className={classnames({ 'is-invalid': errors && errors.handPieces }, 'form-control sentient-content')}
                        style={{ border: '1px solid #646464' }}
                        {...register('handPieces', { required: false })}
                      />
                    </FormGroup>

                    {/* <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="generalCondition"
                      id="generalCondition"
                      name="generalCondition"
                      className={classnames({ 'is-invalid': errors && errors.generalCondition }, 'form-control sentient-content')}
                      style={{ border: '1px solid #646464' }}
                      {...register('generalCondition', { required: false })}
                    />
                  </FormGroup> */}
                    <FormGroup className="form-group row form-row align-items-center">
                      <div className="col-12 m-0 p-0">
                        <Select
                          as={Select}
                          options={generalConditions}
                          name="generalCondition"
                          isClearable={false}
                          control={control}
                          placeholder="General Condition"
                          className={`react-select ${classnames({ 'is-invalid': errors && errors.generalCondition }, 'sentient-content')}`}
                          classNamePrefix="select"
                          defaultValue={selectedGeneralCondition}
                          value={selectedGeneralCondition}
                          onChange={(value) => (setSelectedGeneralCondition(value))}
                          style={{ border: '1px solid #646464' }}
                          {...register('generalCondition')?.label}
                        />
                      </div>
                    </FormGroup>

                    <FormGroup className="form-group row form-row align-items-center">
                      <div className="col-12 m-0 p-0">
                        <Select
                          as={Select}
                          options={devicePowerRequirements}
                          name="powerRequirements"
                          isClearable={false}
                          control={control}
                          placeholder="Power Requirements"
                          className={`react-select ${classnames({ 'is-invalid': errors && errors.powerRequirements }, 'sentient-content')}`}
                          classNamePrefix="select"
                          defaultValue={selectedPowerRequirement}
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
                          placeholder="Ownership"
                          isClearable={false}
                          control={control}
                          className={`react-select ${classnames({ 'is-invalid': errors && errors.ownerShip }, 'sentient-content')}`}
                          classNamePrefix="select"
                          defaultValue={selectedOwnerShip}
                          value={selectedOwnerShip}
                          onChange={(value) => (setSelectedOwnerShip(value))}
                          style={{ border: '1px solid #646464' }}
                          {...register('ownerShip')?.label}
                        />
                      </div>
                    </FormGroup>

                    {/* <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="lastServiced"
                      id="lastServiced"
                      name="lastServiced"
                      className={classnames({ 'is-invalid': errors && errors.lastServiced }, 'form-control sentient-content')}
                      style={{ border: '1px solid #646464' }}
                      {...register('lastServiced', { required: false })}
                    />
                    
                  </FormGroup> */}
                    <FormGroup className="form-group row form-row align-items-center">
                      <Flatpickr
                        value={eventDatePicker}
                        id="lastServiced"
                        name="lastServiced"
                        placeholder="Last Serviced"
                        onChange={(date) => { setEventDatePicker(date[0]); }}
                        //style={{ border: '1px solid #646464' }}
                        className={classnames({ 'is-invalid': errors && errors.lastServiced }, 'form-control sentient-content')}
                        rules={{ required: false }}
                        options={{
                          mode: 'single',
                          dateFormat: 'Y-m-d H:i:S',
                          enableTime: true, // Enable manual time input
                        }}
                      />
                    </FormGroup>

                    <FormGroup className="form-group row form-row align-items-center">
                      <div className="col-12 m-0 p-0">
                        <Select
                          as={Select}
                          options={blooleanValue}
                          name="operatorManuals"
                          id="operatorManuals"
                          placeholder="Operator Manuals"
                          isClearable={false}
                          control={control}
                          className={`react-select ${classnames({ 'is-invalid': errors && errors.operatorManuals }, 'sentient-content')}`}
                          classNamePrefix="select"
                          defaultValue={selectedOPeratorManuals}
                          value={selectedOPeratorManuals}
                          onChange={(value) => (setSelectedOPeratorManuals(value))}
                          style={{ border: '1px solid #646464' }}
                          {...register('operatorManuals')?.label}
                        />
                      </div>
                    </FormGroup>

                    <FormGroup className="form-group row form-row align-items-center">
                      <div className="col-12 m-0 p-0">
                        <Select
                          as={Select}
                          options={blooleanValue}
                          name="cuFactoryWarranty"
                          placeholder="Currently Under Factory Warranty"
                          isClearable={false}
                          control={control}
                          className={`react-select ${classnames({ 'is-invalid': errors && errors.cuFactoryWarranty }, 'sentient-content')}`}
                          classNamePrefix="select"
                          defaultValue={selectedCUFactoryWarranty}
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
                          placeholder="Original Boxes/Crate:"
                          isClearable={false}
                          control={control}
                          className={`react-select ${classnames({ 'is-invalid': errors && errors.originalBoxes }, 'sentient-content')}`}
                          classNamePrefix="select"
                          defaultValue={selectedOriginalBoxes}
                          value={selectedOriginalBoxes}
                          onChange={(value) => (setSelectedOriginalBoxes(value))}
                          style={{ border: '1px solid #646464' }}
                          {...register('originalBoxes').label}
                        />
                      </div>
                    </FormGroup>

                    <FormGroup className="form-group row form-row align-items-center">
                      <textarea
                        placeholder="Description"
                        id="description"
                        name="description"
                        rows={5}
                        className={classnames({ 'is-invalid': errors && errors.description }, 'form-control sentient-content')}
                        {...register('description', { required: false })}
                        style={{ border: '1px solid #646464' }}
                      />
                    </FormGroup>

                    <FormGroup>
                      <div className="form-group row ">
                        <Label className="sentient-text-content col-12 col-form-label m-0 p-0">
                          Product Image:
                        </Label>
                        <div className="col-12 m-0 p-0">
                          {register.productImageFile && !showDropzone ? (
                            <>
                              <img src={register.productImageFile} className="img-fluid " alt="logo" />
                              <Button onClick={() => setShowDropzone(true)} className="btn-sm float-right" color="flat-info">Change</Button>
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

                    <FormGroup>
                      <div className="form-group row">
                        <Label className="col-12 col-form-label m-0 p-0 pt-2">
                          Video Link
                        </Label>
                        <div className="col-12 m-0 p-0">
                          <textarea
                            // type="textarea"
                            placeholder="Enter the full YouTube.com embed code (iFrame code)"
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

                    <FormGroup className="form-group row form-row align-items-center">
                      <div className="col-12 py-1 m-0 p-0">
                        <ReCAPTCHA
                          sitekey={process.env.APP_GOOGLE_CAPTCHA_KEY}
                          onChange={handleVerify}
                        />
                      </div>
                    </FormGroup>

                    <FormGroup className="form-group row form-row align-items-center">
                      <div className="py-2  m-0 p-0 d-flex">
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
          <div className="col-12 px-md-5 px-2 m-0 p-0">
            <hr className="sentient-underline d-sm-flex d-none" />
          </div>
        </div>

        <div className="row col-12 py-lg-5 py-2 px-md-5 px-3 m-0 p-0" >
          <div className="col-lg-6 mb-2 m-0 p-0">
            <h2 className="sentient-title" style={{ color: '#0A2FFF', wordBreak: 'break-word' }}>Questions?</h2>
          </div>

          <div className="col-lg-6 m-0 p-0">
            <p className="sentient-dmmono mb-0 d-sm-flex d-none">Frequently Asked Questions</p>
            <hr className="sentient-underline d-sm-flex d-none" />

            {querySentient.map((item, index) => (
              <>
                <div className="m-0 p-0" key={index}>
                  <p className="sentient-content" style={{ fontWeight: '700' }}>
                    {parse(item.query)}
                  </p>
                </div>
                <div className="pb-3 m-0 p-0">
                  <p className="sentient-content">
                    {parse(item.answer)}
                  </p>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ListDevice;