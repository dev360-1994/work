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
import { getLookupCountry,getLookupState} from '@src/api/contact.actions';
import { addSellProductInventory, getFullProductModel, getLaserType } from '@src/api/sell.action';
import {
  getBuySearch, getCompanyManufacturer, getPriceRange, getProductModel,
} from '@src/api/buy.action';
import { getLookupProductOption,getProductActive,getProduct} from '@src/api/product.actions';

import {
  blooleanValue, leadRecordType, leadSourceType, ownerShip, powerRequirements,generalCondition,
} from '@src/components/contactComponents';

import { createRef } from 'react';
import PageLayout from '../../../../src/layouts/PageLayout';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';

const AssuredCertification = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const recaptchaRef = createRef();

  const {
    register, errors, handleSubmit, control, setValue, getValues, clearErrors,
  } = useForm();
  
  const router = useRouter();

  const [selectedProduct, setSelectedProduct] = useState("");
  const [productCompanyInfo, setProductCompanyInfo] = useState([]);
  const [productCompany, setProductCompany] = useState([]);
  const [showDropzone, setShowDropzone] = useState(false);
  const [eventDatePicker, setEventDatePicker] = useState();


  const [apiErrors, setApiErrors] = useState({});
  const [productOption, setProductOption] = useState([]);
  const [productOptionData, setProductOptionData] = useState([]);
  const [states, setStates] = useState([]);
  const [countriesInfo, setCountriesInfo] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [laserType, setLaserType] = useState([]);
  const [selectedLaserType, setSelectedLaserType] = useState();

  const [selectedPowerRequirement, setSelectedPowerRequirement] = useState("");
  const [selectGeneralCondition, setSelectGeneralCondition] = useState("")
  const [selectedOwnerShip, setSelectedOwnerShip] = useState("");
  const [selectedOPeratorManuals, setSelectedOPeratorManuals] = useState("");
  const [selectedCUFactoryWarranty, setSelectedCUFactoryWarranty] = useState("");
  const [selectedOriginalBoxes, setSelectedOriginalBoxes] = useState("");

  const [showPhone, setShowPhone] = useState('');
  const [showFax, setShowFax] = useState('');
  const [files, setFiles] = useState();

  const [selectedCompany, setSelectedCompany] = useState([]);
  const [company, setCompany] = useState([]);
  const [selData, setSelData] = useState([]);
  const [prodList, setProdList] = useState([]);
  const [product, setProduct] = useState([]);
  const [selectedProductOption, setSelectedProductOption] = useState([]);
  const [mobileNumber, setMobileNumber] = useState('');
  const [zip, setZip] = useState('');

  const fields = [
    'first_name', 'last_name', 'company', 'email', 'productName', 'street', 'address1', 'address2', 'country', 'zip', 'mzip',
    'state', 'productModel', 'ifOther', 'companyMfg', 'type', 'waveLength', 'productYear', 'phone', 'city', 'mobile','Mmobile',
    'askingPrice', 'bestOffer', 'serialNumber', 'reasonForSelling', 'productOptions', 'accessories', 'description',
    'productImageFile', 'videoLink', 'shotPulseCount', 'hourCount', 'handPieces', 'generalCondition', 'powerRequirements', 'generalCondition',
    'ownerShip', 'lastServiced', 'operatorManuals', 'cuFactoryWarranty', 'originalBoxes', 'itlPrefix', 'ProductId',
  ];

  // const WatchList = () => {
  //   const {
  //     register, errors, handleSubmit, control, setValue, getValues, clearErrors,
  //   } = useForm();

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      console.log("URL.createObjectURL(i)",i);
      setFiles(i);
      //setCreateObjectURL(URL.createObjectURL(i));
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const optionData = await getLookupProductOption();
        console.log(optionData,"==>optionData")
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
            value: item.name,
          }));
          setLaserType(updateddata || []);
          // setSelectedLaserType(updateddata[0] || '');
        } else {
          setLaserType([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // const optionData = await getLookupProductOption();
        // const updateOption = optionData?.map((item) => ({
        //   label: item.name,
        //   value: item.productOptionId,
        // }));
        // setProductOption(updateOption || []);
        // setSelectedProductOption([]);
      //  setValue('productOption', optionData || '');
        // const productModelData = await getFullProductModel();
        // if (productModelData) {
        //   const minus = '-';
        //   const Modeldata = productModelData?.map((item) => ({
        //     label: item.productName + minus + item.company,
        //     value: item.productId ?? '',
        //   })) ?? [];

        //   if (Modeldata && Modeldata.length > 0) {
        //     setProductCompany(Modeldata);
        //     setSelectedProductCompany(Modeldata[0] || {});
        //   }
        // }

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

        fields.forEach((field) => setValue(field, ''));
        fields.forEach((field) => register(field, ''));

      } catch (error) {
        console.error(error);
      }

    const data1 = await getLookupState("US");
    if (data1?.length > 0) {
      //console.log("data1?.length"+data1?.length);
      const updateddata1= data1?.map((item) => ({
        label: item.stateName,
        value: item.stateId,
      }));
      setStates(updateddata1);
      // setSelectedState(updateddata1[0]);
    }else{
      setStates([]);
      setSelectedState([]);
    }
    };

    
    
  
    fetchData();
  }, []);
  
  const convertToUTC = (date) => {
    const timezoneOffset = date.getTimezoneOffset();
    const utcTimestamp = date.getTime() + (timezoneOffset * 60 * 1000);
    const utcDate = new Date(utcTimestamp);

    return utcDate;
  };

  const handleCountryChange = async (event) => {
    setSelectedCountry(event);
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
  //     } = productCompanyInfo?.find((item) =>{
  //       console.log(item)
  //       return item.productId === selectedProduct.value 
  //     });

  //     console.log(waveLength,"wave")
  //     setValue('companyMfg', company);
  //     // setValue('waveLength', waveLength);
  //     setValue('ifOther', productName);
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

  const onSubmit = async (data) => {
    console.log(data,"form data")
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

    const options = productOption
      .filter((item) => data[item.name] === 'true')
      .map((item) => item.name)
      .join(',');

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
    queryParams += `&recordType=${leadRecordType[3].value}`;

    queryParams += `&00NDn00000e7sPD=${getValues('comments')}`;

    // ---- your information ----------
    queryParams += `&first_name=${encodeURIComponent(getValues('first_name') ?? '')}`;
    queryParams += `&last_name=${encodeURIComponent(getValues('last_name') ?? '')}`;
    queryParams += `&company=${encodeURIComponent(getValues('company') ?? '')}`;
    queryParams += `&email=${encodeURIComponent(getValues('email') ?? '')}`;
    queryParams += `&state=${encodeURIComponent(getValues('state') ?? '')}`;
    queryParams += `&zip=${encodeURIComponent(getValues('zip') || getValues('mzip'))}`;
    queryParams += `&city=${encodeURIComponent(getValues('city') ?? '')}`;
    queryParams += `&mobile=${encodeURIComponent((getValues('mobile') || getValues('Mmobile')) ?? '')}`;
    queryParams += `&phone=${encodeURIComponent(getValues('phone') ?? '')}`;
    queryParams += `&country=${encodeURIComponent(getValues('country') ?? '')}`;
    queryParams += `&street=${encodeURIComponent(getValues('street') ?? '')}`;
    // fields.forEach((field) => { queryParams += getValues(field) ? `&${field}=${getValues(field)}` : ''; });

    // ---product setting---------------
    queryParams += `&00NDn00000aHVmz=${encodeURIComponent(selectedProduct?.label)}`;
    queryParams += `&00NDn00000aGphH=${encodeURIComponent(getValues('ifOther') ?? '')}`;
    queryParams += `&00NDn00000aGqo9=${encodeURIComponent(getValues('productImageFile') ?? '')}`;
    // queryParams += `&00NDn00000aIDrI=${encodeURIComponent(getValues('companyMfg'))}`; // mfg
    queryParams += `&00NDn00000e7sSl=${encodeURIComponent(selectedLaserType?.label)}`;
    queryParams += `&00NDn00000aIFM2=${encodeURIComponent(getValues('waveLength') ?? '')}`;
    queryParams += `&00NDn00000aIFM7=${encodeURIComponent(getValues('productYear') ?? '')}`;
    queryParams += `&00NDn00000aGphq=${encodeURIComponent(getValues('askingPrice'))}`;
    queryParams += `&00NDn00000aGpy3=${encodeURIComponent(options)}`;
    queryParams += `&00NDn00000aGppf=${encodeURIComponent(selectedPowerRequirement?.label ?? '')}`;
    queryParams += `&00NDn00000aGppf=${encodeURIComponent(selectGeneralCondition?.label ?? '')}`;
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
        // router.push('/service/assuredcertification');
        // window.scrollTo(0, 0);
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
    setValue('type', selectedLaserType?.value ? selectedLaserType.value : 0);
    setValue('powerRequirements', selectedPowerRequirement?.label ? selectedPowerRequirement.label : '');
    setValue('generalCondition', selectGeneralCondition?.label ? selectGeneralCondition.label : '');
    setValue('ownerShip', selectedOwnerShip?.label);
    setValue('cuFactoryWarranty', selectedCUFactoryWarranty?.value ? selectedCUFactoryWarranty.value : 0);
    setValue('ProductId', selectedProduct?.value ? selectedProduct.value : 0);
    const lastServiceDate ="";
    if(eventDatePicker!=undefined){
     
     lastServiceDate = convertToUTC(new Date(eventDatePicker)).toLocaleString();

   }
   setValue('lastServiced', lastServiceDate);
    // const { productName } = productCompanyInfo.find((item) => item.productId === selectedProduct.value);
    // setValue('productName', productName || '');

    const form = new FormData();
    form.append('Contact.Phone', getValues('phone'));
    form.append('ProductInventory.WaveLength', getValues('waveLength') ?? '');
    form.append('Contact.Comments', getValues('comments'));
    form.append('Contact.State', getValues('state') ?? 0);
    form.append('Contact.Type', getValues('ownerShip') === 'Owned' ? 'sell' : 'lease');
    form.append('Contact.Country', getValues('country') ?? 0);
    form.append('ProductInventory.ProductId', getValues('ProductId') ?? 0);
    form.append('ProductInventory.EnergyOutput', getValues('powerRequirements') ?? '');
    form.append('generalCondition.QualityConditions', getValues('generalCondition') ?? '')
    form.append('Contact.Address1', getValues('street') ?? '');
    form.append('ProductInventory.ProductYear', getValues('productYear') ?? '');
    form.append('Contact.Address2', getValues('address2') ?? '');
    form.append('ProductInventory.InvDescription', getValues('description') ?? '');
    form.append('ProductInventory.ReasonForSelling', getValues('reasonForSelling') ?? '');
    form.append('Contact.FirstName', getValues('first_name') ?? '');
    form.append('Contact.Email', getValues('email') ?? '');
    form.append('ProductInventory.BlueDot', true); // default
    form.append('Contact.city', getValues('city') ?? '');
    form.append('Contact.mobile', (getValues('mobile') || getValues('Mmobile')) ?? '');
    form.append('Contact.LastName', getValues('last_name') ?? '');
    form.append('ProductInventory.ProductOptions', getValues('productOptions') ?? '');
    form.append('Contact.Zip', getValues('zip') ?? '');
    form.append('ProductInventory.Include30DayWarranty', getValues('cuFactoryWarranty') === 0);
    form.append('Contact.Active', 'true');
    form.append('ProductInventory.VideoLink', getValues('videoLink') ?? '');
    form.append('ProductInventory.BestOffer', getValues('bestoffer') ?? false);
    form.append('ProductInventory.HotDeal', false); // default
    form.append('ProductInventory.ProductName', getValues('company') ?? '');
    form.append('Contact.CompanyName', getValues('company') ?? '');
    form.append('ProductInventory.Type', getValues('ownerShip') === 'Owned' ? 'sell' : 'lease');
    form.append('ProductInventory.Company', getValues('company') ?? '');
    form.append('ProductInventory.PulseLength', getValues('shotPulseCount') ?? ''); //
    form.append('ProductInventory.SerialNumber', getValues('serialNumber') ?? '');
    form.append('ProductInventory.AskingPrice', getValues('askingPrice') ?? '');
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
    form.append('ProductInventory.Include30DayWarranty', getValues('cuFactoryWarranty') === 0);

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
        toast.success('Sell Succeeded', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          style:{ textAlign:"left",width: "400px"}
        });
        // console.log("success")

        router.push('/service/assuredcertification');
        window.scrollTo(0, 0);
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
      <Label className="sentient-content py-3 m-0 p-0">Indicated Uses:</Label>
      <FormGroup>
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

  useEffect(() => {
    async function fetchData() {
      const arrList=[];
      const companyModelData = await getCompanyManufacturer({type:searchType[0].value});
      console.log("<>>>>>>>>>>>>>>>>>>>"+JSON.stringify(companyModelData));
      const modelDataCompany = companyModelData?.map((item, index) => ({
        label: item.companyName,
        value: item.cnt ?? '',
      })) ?? [];

      if (modelDataCompany && modelDataCompany.length > 0) {
        setCompany(modelDataCompany);
        setSelectedCompany("");
      } 
      console.log("modelDataCompany[0].companyName>>"+modelDataCompany[0].label);

     const prodList= await getBuySearch({companyName:modelDataCompany[0].label})|| [];
    
     const minus = '-';
     const prodData = prodList?.map((item, index) => (
      console.log(item,"proddata items"),
      {
      label: item.productModel+minus+ item.productType,
      value: item.inventoryId ?? '',
      prodOption:item.productOptionIds,
      productType:item.productType,
      productWaveLength:item.waveLength,
      yearOfManufracture:item.productYear,
      askingPriceDetails: item.askingPrice
    })) ?? [];

    if (prodData && prodData.length > 0) {
      
      const formattedProdData = prodData.map((item) => (
        console.log(item,"items values"),
        {
        ...item,
        label: item.label.split(minus)[0].trim(), 
      }));
    
      console.log(formattedProdData, "==>formattedProdData");
      setProdList(formattedProdData);
      console.log(formattedProdData[0],"check data store");
      // setValue('waveLength', formattedProdData[0]?.productWaveLength || '');
      // setValue('productYear', formattedProdData[0]?.yearOfManufracture || "");
      // setValue('askingPrice', formattedProdData[0]?.askingPriceDetails || "");
      // setProduct(formattedProdData[0]); 
      // console.log(formattedProdData[0]?.productWaveLength,formattedProdData[0]?.yearOfManufracture)
    }

    const optionData = await getLookupProductOption();
    const updateOption = optionData?.map((item) => (
      console.log("main items",item),
      {
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
   
    console.log(arrList,"==>arrList")
    // setProductOption(arrList && arrList._f ? arrList : []);
    setSelectedProductOption(arrList);
    setValue('productOption', arrList || '');

 console.log("arrList>>>>>>>>>>>>>"+JSON.stringify(arrList));
  }

    fetchData();
  }, []);

  

  const searchType = [
    { value: 1, label: 'Manufacturer' },
  ];
  const [searchValue, setSearchValue] = useState(searchType[0] || null);


  const handleCompanyChange=async (value)=>{
    const arrList=[];
    console.log("VAlueeeeeeeee"+value.label);
     setSelectedCompany(value);
    
    const prodList= await getBuySearch({companyName:value.label})|| [];
    
    const minus = '-';
    const prodData1 = prodList?.map((item, index) => ({
     
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
 
   if (prodData && prodData.length > 0) {
    
    const formattedProdData = prodData.map((item) => ({
      ...item,
      label: item.label.split(minus)[0].trim(), 
    }));
  
    //console.log(formattedProdData, "==>formattedProdData");
    setProdList(formattedProdData);
     const prodList = await getProduct( formattedProdData[0]?.value);
     console.log("prodList>>>>>>>>>>>",prodList);
   // setValue('type', formattedProdData[0]?.productType || '');
     setSelectedLaserType({label:prodList?.type,value:prodList?.type})
      //setValue('waveLength', formattedProdData[0]?.productWaveLength || '');
      setValue('productYear', formattedProdData[0]?.yearOfManufracture || 0);
      //setValue('askingPrice', formattedProdData[0]?.askingPriceDetails || "");
      setProduct(formattedProdData[0]); 
      setValue('waveLength', prodList?.waveLength || '');
      setValue('askingPrice', prodList?.askingPrice || 0);
     

  }

   const optionData = await getLookupProductOption();
    const updateOption = optionData?.map((item) => (
      console.log("main items 2==>",item),
      {
      label: item.name,
      value: item.productOptionId,
      require:true,
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

    
    console.log("ssssssssssssssssssss>>222222>>>>>>>>>>>"+JSON.stringify(arrList));

    // setProductOption(arrList && arrList._f ? arrList : []);
    setSelectedProductOption(arrList);
    setValue('productOption', arrList || '');


  }

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
    setValue('productYear', data[0]?.yearOfManufracture || 0);
    }else{
      setValue('productYear', 0);
    }
 

  };

  const handleZipChange = (e) => {
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
    setZip(sanitizedValue);
  };

  const handleMobileNumberChange = (e) => {
    let inputValue = e.target.value.replace(/\D/g, ''); 

    if (inputValue.length > 10) {
      inputValue = inputValue.substring(0, 10); 
    }

    setMobileNumber(inputValue);
  };

  return (
    <PageLayout>
      <div className="w-100 pageTop">
        <div className="row col-12 pb-sm-3 m-0 p-0">
          <div className="col-lg-5 col-md-5 col-12 px-md-3 px-3 py-5 m-0 p-0">
            <h1
              className="col-sm-11 col-12 sentient-title m-0 p-0"
              style={{ color: "#65CF10", wordBreak: "break-word" }}
            >
              Assured
              <br />
              Certification
            </h1>
          </div>
          <div className="col-lg-7 col-md-7 col-12 px-md-5 px-3 pt-sm-5 pt-2 m-0 p-0">
            <p className="sentient-content pt-1">
              <b>
                Certify your device with Sentient Assured and get more when you
                list your device on the open market.{" "}
              </b>
              Fill out the form below as completely as possible and make sure to
              include contact information and a phone number so we can reach
              you. We’ll contact you as soon as we get any response(s) from your
              ad.
              <br />
              <br />
              Questions on how to create your listing? Reach out—we’re always
              here to help.
            </p>
          </div>
        </div>

        <div className="col-12 px-md-5 px-3 m-0 p-0">
          <hr className="sentient-underline d-sm-flex d-none" />
        </div>

        <div className="row col-12 m-0 p-0">
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="row col-12 m-0 p-0"
          >
            {apiErrors.data ? (
              <Alert color="danger">
                <div className="alert-body">
                  <span>{`Error: ${apiErrors.data}`}</span>
                </div>
              </Alert>
            ) : (
              <></>
            )}
            <div className="row col-12 pt-sm-5 pt-2 pb-3 m-0 p-0">
              <div className="col-lg-5 col-md-5 col-12 px-md-5 px-3 pb-2 m-0 p-0">
                <h1 className="col-sm-11 col-12 sentient-subtitle m-0 p-0">
                  Your Information
                </h1>
              </div>
              <div className="col-lg-7 col-md-7 col-12 px-md-5 px-3  m-0 p-0">
                <div className="col-12 m-0 p-0 px-3">
                  <input type="hidden" name="oid" value="00DDn000009Q6pN" />
                  <input
                    type="hidden"
                    name="retURL"
                    value="https://sl-it-whappeastus-02.azurewebsites.net"
                  />
                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="First Name*"
                      id="first_name"
                      name="first_name"
                      className={`form-control sentient-content ${
                        errors && errors.first_name ? "is-invalid" : ""
                      }`}
                      style={{ border: "1px solid #646464" }}
                      {...register("first_name", { required: true })}
                    />
                  </FormGroup>
                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      name="last_name"
                      type="text"
                      placeholder="Last Name*"
                      style={{ border: "1px solid #646464" }}
                      {...register("last_name", { required: true })}
                      id="last_name"
                      className={`form-control ${
                        errors && errors.last_name ? "is-invalid" : ""
                      }`}
                    />
                  </FormGroup>
                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Company Name*"
                      id="company"
                      name="company"
                      className={classnames(
                        { "is-invalid": errors && errors.company },
                        "form-control sentient-content"
                      )}
                      style={{ border: "1px solid #646464" }}
                      {...register("company", { required: true })}
                    />
                  </FormGroup>
                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="email"
                      placeholder="Email*"
                      id="email"
                      name="email"
                      className={classnames(
                        { "is-invalid": errors && errors.email },
                        "form-control sentient-content"
                      )}
                      style={{ border: "1px solid #646464" }}
                      {...register("email", { required: true })}
                    />
                  </FormGroup>
                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Address line 1*"
                      id="street"
                      name="street"
                      className={classnames(
                        { "is-invalid": errors && errors.street },
                        "form-control sentient-content"
                      )}
                      style={{ border: "1px solid #646464" }}
                      {...register("street", { required: true })}
                    />
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Address line 2"
                      id="address2"
                      name="address2"
                      className={classnames(
                        { "is-invalid": errors && errors.address2 },
                        "form-control sentient-content"
                      )}
                      style={{ border: "1px solid #646464" }}
                      {...register("address2", { required: false })}
                    />
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="City"
                      id="city"
                      name="city"
                      className={classnames(
                        { "is-invalid": errors && errors.city },
                        "form-control sentient-content"
                      )}
                      style={{ border: "1px solid #646464" }}
                      {...register("city", { required: false })}
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
                        defaultValue={
                          countries?.length > 0 ? countries[225] : null
                        }
                        className={`react-select sentient-content ${classnames({
                          "is-invalid": errors && errors.country,
                        })}`}
                        classNamePrefix="select"
                        style={{ border: "1px solid #646464" }}
                        onChange={(value) => {
                          handleCountryChange(value);
                        }}
                        {...register("country")?.label}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="form-group row form-row align-items-center">
                      <FormGroup className="col-md-6 col-12 m-0 p-0 d-flex">
                        <div className="col-md-11 col-12">
                          <Select
                            as={Select}
                            options={states}
                            name="state"
                            id="state"
                            value={selectedState}
                            isClearable={false}
                            control={control}
                            placeholder="State"
                            className={`react-select ${classnames({
                              "is-invalid": errors && errors.state,
                            })}`}
                            classNamePrefix="select"
                            onChange={(value) => {
                              setSelectedState(value);
                            }}
                            {...register("state")?.label}
                          />
                        </div>
                      </FormGroup>

                      <FormGroup className="col-md-6 col-12 m-0 p-0 d-flex">
                        <div className="col-md-12 col-12">
                          <input
                            type="text"
                            placeholder="Zip code"
                            id="zip"
                            name="zip"
                            value={zip}
                            className={classnames(
                              { "is-invalid": errors && errors.zip },
                              "form-control sentient-content"
                            )}
                            style={{ border: "1px solid #646464" }}
                            {...register("zip", { required: false })}
                            onChange={handleZipChange}
                          />
                        </div>
                      </FormGroup>

                      {/* mobile */}
                      <div className="col-md-6 col-12 m-0 p-0 pt-1 d-sm-none d-flex">
                        <Input
                          type="text"
                          placeholder="Zip"
                          id="mzip"
                          name="mzip"
                          className={classnames(
                            { "is-invalid": errors && errors.mzip },
                            "form-control sentient-content"
                          )}
                          style={{ border: "1px solid #646464" }}
                          {...register("mzip", { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  {/* <FormGroup className="form-group row form-row align-items-center">
                    <div className="col-12 m-0 p-0">
                      <input
                        type="number"
                        placeholder="Zip code"
                        id="zip"
                        name="zip"
                        className={classnames(
                          { "is-invalid": errors && errors.zip },
                          "form-control sentient-content"
                        )}
                        style={{ border: "1px solid #646464" }}
                        {...register("zip", { required: false })}
                      />
                    </div>
                  </FormGroup> */}

                  <FormGroup>
                    <div className="form-group row form-row align-items-center">
                      <FormGroup className="col-md-6 col-12 m-0 p-0 d-flex">
                        <div className="col-md-11 col-12">
                          <InputMask
                            type="text"
                            mask="999 999 9999"
                            id="phone"
                            name="phone"
                            placeholder="Office Phone: (123) 555 1234"
                            defaultValue={showPhone}
                            onChange={(e) => setShowPhone(e.target.value)}
                            className={classnames(
                              { "is-invalid": errors && errors.phone },
                              "form-control sentient-content w-100 px-1"
                            )}
                            {...register("phone", { required: false })}
                            style={{
                              border: "1px solid #646464",
                              height: "40px",
                            }}
                          />
                        </div>
                      </FormGroup>

                      <FormGroup className="col-md-6 col-12 m-0 p-0 d-flex">
                        <div className="col-md-12 col-12">
                          <input
                            type="text"
                            placeholder="Mobile"
                            id="mobile"
                            name="mobile"
                            value={mobileNumber}
                            className={classnames(
                              { "is-invalid": errors && errors.mobile },
                              "form-control sentient-content"
                            )}
                            style={{ border: "1px solid #646464" }}
                            {...register("mobile", { required: false })}
                            onChange={handleMobileNumberChange}
                          />
                        </div>
                      </FormGroup>
                    </div>
                  </FormGroup>

                  {/* <FormGroup> */}
                  {/* <div className="form-group row form-row align-items-center">
                      <div className="col-md-12 col-12 m-0 p-0">
                        <InputMask
                          type="text"
                          mask="999 999 9999"
                          id="phone"
                          name="phone"
                          placeholder="Office Phone: (123) 555 1234"
                          defaultValue={showPhone}
                          onChange={(e) => setShowPhone(e.target.value)}
                          className={classnames(
                            { "is-invalid": errors && errors.phone },
                            "form-control sentient-content w-100 px-1"
                          )}
                          {...register("phone", { required: false })}
                          style={{
                            border: "1px solid #646464",
                            height: "40px",
                          }}
                        />
                      </div> */}

                  {/* mobile */}
                  {/* <div className="col-md-6 col-12 pt-1 m-0 p-0 d-sm-none d-flex">
                        <input
                          type="number"
                          placeholder="Mobile"
                          id="Mmobile"
                          name="Mmobile"
                          onChange={(e) => {
                            console.log(e.target.value);
                          }}
                          className={classnames(
                            { "is-invalid": errors && errors.Mmobile },
                            "form-control sentient-content"
                          )}
                          style={{ border: "1px solid #646464" }}
                          {...register("Mmobile", { required: false })}
                        />
                      </div> */}
                  {/* </div> */}
                  {/* </FormGroup> */}

                  {/* <FormGroup className="form-group row form-row align-items-center">
                    <div className="col-12 m-0 p-0">
                      <input
                        type="text"
                        placeholder="Mobile"
                        id="mobile"
                        name="mobile"
                        value={mobileNumber}
                        className={classnames(
                          { "is-invalid": errors && errors.mobile },
                          "form-control sentient-content"
                        )}
                        style={{ border: "1px solid #646464" }}
                        {...register("mobile", { required: false })}
                        onChange={handleMobileNumberChange}
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
                      className={classnames(
                        { "is-invalid": errors && errors.comments },
                        "form-control sentient-content"
                      )}
                      {...register("comments", { required: false })}
                      style={{ border: "1px solid #646464" }}
                    />
                  </FormGroup>
                </div>
              </div>
            </div>

            <div className="col-12 px-md-5 px-3 m-0 p-0">
              <hr className="sentient-underline d-sm-flex d-none" />
            </div>

            <div className="row col-12 py-sm-5 py-2 m-0 p-0">
              <div className="col-lg-5 col-md-5 col-12 px-md-5 px-3 pb-2 m-0 p-0">
                <h1 className="col-12 sentient-subtitle m-0 p-0">
                  Product Information
                </h1>
              </div>

              <div className="col-lg-7 col-md-7 col-12 px-md-5 px-3 m-0 p-0">
                <div className="col-12 m-0 p-0 px-1">
                  <FormGroup className="form-group row form-row align-items-center">
                    <div className="col-12 m-0 p-0">
                      <Select
                        as={Select}
                        options={company}
                        name="productCompany"
                        placeholder="Manufacturer*"
                        value={selectedCompany}
                        isClearable={false}
                        control={control}
                        // defaultvalue={selectedCompany}
                        className={`react-select sentient-content ${classnames(
                          { "is-invalid": errors && errors.productCompany },
                          "border"
                        )}`}
                        classNamePrefix="select"
                        onChange={(value) => {
                          handleCompanyChange(value);
                        }}
                        {...register("productCompany")?.label}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <div className="col-12 py-1 rounded list-group justify-content-end m-0 p-0">
                      <Select
                        as={Select}
                        options={prodList}
                        name="productOption11"
                        value={product}
                        isClearable={false}
                        control={control}
                        placeholder="Model"
                        // defaultvalue={product}
                        className={`react-select sentient-content ${classnames(
                          { "is-invalid": errors && errors.productOption11 },
                          "border"
                        )}`}
                        classNamePrefix="select"
                        onChange={(value) => (handleProductChange(value))}
                        // onChange={(value) => {
                        //   setProduct(value);
                        // }}
                        {...register("productOption11")?.label}
                      />
                    </div>

                    {/* <div className="col-12 rounded list-group justify-content-end m-0 p-0">
                      <Select
                        as={Select}
                        options={productOption}
                        name="productOption"
                        value={selectedProductOption}
                        isClearable={false}
                        control={control}
                        placeholder="Indicated Use"
                        defaultvalue={selectedProductOption}
                        className={`react-select sentient-content ${classnames(
                          { "is-invalid": errors && errors.productOption },
                          "border"
                        )}`}
                        classNamePrefix="select"
                        onChange={(value) => {
                          setSelectedProductOption(value);
                        }}
                        {...register("productOption")?.label}
                        isMulti
                      />
                    </div> */}
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Others"
                      id="ifOther"
                      name="ifOther"
                      className={classnames(
                        { "is-invalid": errors && errors.ifOther },
                        "form-control sentient-content"
                      )}
                      style={{ border: "1px solid #646464" }}
                      {...register("ifOther", { required: false })}
                    />
                  </FormGroup>

                  {/* <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Input CompanyMfg"
                      id="companyMfg"
                      name="companyMfg"
                      className={classnames(
                        { "is-invalid": errors && errors.companyMfg },
                        "form-control sentient-content"
                      )}
                      style={{ border: "1px solid #646464" }}
                      {...register("companyMfg", { required: false })}
                    />
                  </FormGroup> */}

                  <FormGroup className="form-group row form-row align-items-center">
                    <div className="col-12 m-0 p-0">
                      <Select
                        as={Select}
                        options={laserType}
                        name="type"
                        id="type"
                        isDisabled
                        value={selectedLaserType}
                        isClearable={false}
                        control={control}
                        placeholder="Type"
                        className={`react-select ${classnames(
                          { "is-invalid": errors && errors.type },
                          "sentient-content"
                        )}`}
                        classNamePrefix="select"
                        onChange={(value) => setSelectedLaserType(value)}
                        style={{ border: "1px solid #646464" }}
                        {...register("type")?.label}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Wave Length*"
                      id="waveLength"
                      name="waveLength"
                      readOnly
                      className={classnames(
                        { "is-invalid": errors && errors.waveLength },
                        "form-control sentient-content"
                      )}
                      style={{ border: "1px solid #646464" }}
                      {...register("waveLength", { required: false })}
                    />
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Year of Manufacture*"
                      id="productYear"
                      name="productYear"
                      readOnly
                      className={classnames(
                        { "is-invalid": errors && errors.productYear },
                        "form-control sentient-content"
                      )}
                      style={{ border: "1px solid #646464" }}
                      {...register("productYear", {
                        required: true,
                        pattern: /^\d{4}$/,
                      })}
                    />
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Asking Price*"
                      id="askingPrice"
                      name="askingPrice"
                      readOnly
                      className={classnames(
                        { "is-invalid": errors && errors.askingPrice },
                        "form-control sentient-content"
                      )}
                      style={{ border: "1px solid #646464" }}
                      {...register("askingPrice", { required: false })}
                    />
                  </FormGroup>

                  {/* <FormGroup className="form-group row form-row align-items-center">
                    <div className="d-flex align-itmes-center m-0 p-0">
                      <input
                        type="checkbox"
                        name="bestOffer"
                        id="bestOffer"
                        className={classnames(
                          { "is-invalid": errors && errors.bestOffer },
                          "form-check-input"
                        )}
                        {...register("bestOffer", { required: false })}
                      />
                      <label
                        htmlFor="bestOffer"
                        className="form-check-label sentient-content px-3"
                      >
                        Display “Or Best Offer/OBO” after listing price
                      </label>
                    </div>
                  </FormGroup> */}

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Serial Number"
                      id="serialNumber"
                      name="serialNumber"
                      className={classnames(
                        { "is-invalid": errors && errors.serialNumber },
                        "form-control sentient-content"
                      )}
                      style={{ border: "1px solid #646464" }}
                      {...register("serialNumber", { required: false })}
                    />
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <textarea
                      type="textarea"
                      placeholder="Reason For Selling"
                      id="reasonForSelling"
                      name="reasonForSelling"
                      rows={5}
                      className={classnames(
                        { "is-invalid": errors && errors.reasonForSelling },
                        "form-control sentient-content"
                      )}
                      {...register("reasonForSelling", { required: false })}
                      style={{ border: "1px solid #646464" }}
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
                      className={classnames(
                        { "is-invalid": errors && errors.accessories },
                        "form-control sentient-content"
                      )}
                      {...register("accessories", { required: false })}
                      style={{ border: "1px solid #646464" }}
                    />
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Shot/PulseCount"
                      id="shotPulseCount"
                      name="shotPulseCount"
                      className={classnames(
                        { "is-invalid": errors && errors.shotPulseCount },
                        "form-control sentient-content"
                      )}
                      style={{ border: "1px solid #646464" }}
                      {...register("shotPulseCount", { required: false })}
                    />
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Hour Count"
                      id="hourCount"
                      name="hourCount"
                      className={classnames(
                        { "is-invalid": errors && errors.hourCount },
                        "form-control sentient-content"
                      )}
                      style={{ border: "1px solid #646464" }}
                      {...register("hourCount", { required: false })}
                    />
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Hand Pieces"
                      id="handPieces"
                      name="handPieces"
                      className={classnames(
                        { "is-invalid": errors && errors.handPieces },
                        "form-control sentient-content"
                      )}
                      style={{ border: "1px solid #646464" }}
                      {...register("handPieces", { required: false })}
                    />
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <div className="col-12 m-0 p-0">
                      <Select
                        as={Select}
                        options={generalCondition}
                        name="generalCondition"
                        isClearable={false}
                        control={control}
                        className={`react-select ${classnames(
                          { "is-invalid": errors && errors.generalCondition },
                          "sentient-content"
                        )}`}
                        classNamePrefix="select"
                        placeholder="General Condition"
                        value={selectGeneralCondition}
                        onChange={(value) => setSelectGeneralCondition(value)}
                        style={{ border: "1px solid #646464" }}
                        {...register("generalCondition")?.label}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <div className="col-12 m-0 p-0">
                      <Select
                        as={Select}
                        options={powerRequirements}
                        name="powerRequirements"
                        isClearable={false}
                        control={control}
                        className={`react-select ${classnames(
                          { "is-invalid": errors && errors.powerRequirements },
                          "sentient-content"
                        )}`}
                        classNamePrefix="select"
                        placeholder="Power Requirements"
                        value={selectedPowerRequirement}
                        onChange={(value) => setSelectedPowerRequirement(value)}
                        style={{ border: "1px solid #646464" }}
                        {...register("powerRequirements")?.label}
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
                        className={`react-select ${classnames(
                          { "is-invalid": errors && errors.ownerShip },
                          "sentient-content"
                        )}`}
                        classNamePrefix="select"
                        placeholder="Ownership"
                        value={selectedOwnerShip}
                        onChange={(value) => setSelectedOwnerShip(value)}
                        style={{ border: "1px solid #646464" }}
                        {...register("ownerShip")?.label}
                      />
                    </div>
                  </FormGroup>

                  {/* <FormGroup className="form-group row form-row align-items-center">
                    <input
                      type="text"
                      placeholder="Last Serviced"
                      id="lastServiced"
                      name="lastServiced"
                      className={classnames(
                        { "is-invalid": errors && errors.lastServiced },
                        "form-control sentient-content"
                      )}
                      style={{ border: "1px solid #646464" }}
                      {...register("lastServiced", { required: false })}
                    />
                  </FormGroup> */}

                  <FormGroup className="form-group row form-row align-items-center">
                    <div className="col-12 m-0 p-0">
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
                        className={`react-select ${classnames(
                          { "is-invalid": errors && errors.cuFactoryWarranty },
                          "sentient-content"
                        )}`}
                        classNamePrefix="select"
                        defaultValue={blooleanValue[0]}
                        value={selectedCUFactoryWarranty}
                        onChange={(value) =>
                          setSelectedCUFactoryWarranty(value)
                        }
                        style={{ border: "1px solid #646464" }}
                        {...register("cuFactoryWarranty").label}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <div className="col-12 m-0 p-0">
                      <Select
                        as={Select}
                        options={blooleanValue}
                        name="originalBoxes"
                        placeholder="Original Boxes/Crate"
                        isClearable={false}
                        control={control}
                        className={`react-select ${classnames(
                          { "is-invalid": errors && errors.originalBoxes },
                          "sentient-content"
                        )}`}
                        classNamePrefix="select"
                        defaultValue={blooleanValue[0]}
                        value={selectedOriginalBoxes}
                        onChange={(value) => setSelectedOriginalBoxes(value)}
                        style={{ border: "1px solid #646464" }}
                        {...register("originalBoxes").label}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup className="form-group row form-row align-items-center">
                    <textarea
                      placeholder="Description"
                      id="description"
                      name="description"
                      rows={5}
                      className={classnames(
                        { "is-invalid": errors && errors.description },
                        "form-control sentient-content"
                      )}
                      {...register("description", { required: false })}
                      style={{ border: "1px solid #646464" }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <div
                      className="form-group row"
                      style={{ marginLeft: "-15px !important" }}
                    >
                      <Label className="sentient-text-content col-12 col-form-label p-0">
                        Product Image:
                      </Label>
                      <div className="col-12">
                        {register.productImageFile && !showDropzone ? (
                          <>
                            <Image
                              src={register.productImageFile}
                              width={200}
                              height={200}
                              alt="logo"
                            />
                            <Button.Ripple
                              onClick={() => setShowDropzone(true)}
                              className="btn-sm float-right"
                              color="flat-info"
                            >
                              Change
                            </Button.Ripple>
                          </>
                        ) : (
                          <></>
                        )}

                        {!register.productImageFile || showDropzone ? (
                          // <Controller
                          //   control={control}
                          //   name="productImageFile"
                          //   render={({ onChange }) => (
                          //     <div style={{ width: "30%" }}>
                          //       <Dropzone
                          //         accept={acceptedImageFormats}
                          //         multiple={false}
                          //         maxFiles={1}
                          //         maxSizeBytes={1024 * 1024 * 50} // 2MB
                          //         inputContent={(files, extra) =>
                          //           extra.reject
                          //             ? `Only ${acceptedImageFormats} allowed`
                          //             : "Choose File"
                          //         }
                          //         styles={{
                          //           dropzone: {
                          //             overflow: "hidden",
                          //             minHeight: "80px",
                          //             width: "85%",
                          //           },
                          //           dropzoneReject: {
                          //             borderColor: "#F19373 !important",
                          //             backgroundColor: "#F1BDAB",
                          //             overflow: "hidden !important",
                          //           },
                          //           inputLabel: (files, extra) =>
                          //             extra.reject
                          //               ? { color: "#A02800 !important" }
                          //               : {},
                          //         }}
                          //         onChangeStatus={(file, status, allFiles) => {
                          //           handleControlledDropzoneChangeStatus(
                          //             status,
                          //             allFiles,
                          //             onChange
                          //           );
                          //         }}
                          //       />
                          //     </div>
                          //   )}
                          // />

                          <div
                            className="pt-2"
                            style={{ marginLeft: "-15px !important" }}
                          >
                            <input
                              type="file"
                              name="productImageFile"
                              accept={acceptedImageFormats}
                              onChange={uploadToClient} 
                              // style={{ display: "none" }}
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="form-group row">
                      <Label className="col-12 col-form-label m-0 p-0">
                        Video Link
                      </Label>
                      <div className="col-12 m-0 p-0 mt-2">
                        <textarea
                          // type="textarea"
                          placeholder="Enter the full YouTube.com embed code
                          (iFrame code)"
                          id="videoLink"
                          name="videoLink"
                          rows={5}
                          className={classnames(
                            { "is-invalid": errors && errors.videoLink },
                            "form-control sentient-content"
                          )}
                          style={{ border: "1px solid #646464" }}
                          {...register("videoLink", { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div
                      className="col-12 py-1 m-0 p-0"
                      style={{marginLeft:"-15px !important"}}
                    >
                      <ReCAPTCHA
                        sitekey={process.env.APP_GOOGLE_CAPTCHA_KEY}
                        onChange={handleVerify}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="py-3  m-0 p-0 d-flex">
                      <p
                        className="sentient-button sentient-footer p-3"
                        style={{
                          fontSize: "16px",
                          fontWeight: "700",
                          cursor: "pointer",
                          marginLeft: "-15px !important",
                        }}
                        onClick={handleButtonClick}
                      >
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

export default AssuredCertification;