import { useEffect, useState } from 'react';
import {
  Card, CardBody, Col, FormGroup, Label, Row, Input, Button, Form, Alert,
} from 'reactstrap';
import Select from 'react-select';
import ReactPlayer from 'react-player'


// ** Router Components
import { Controller, useForm } from 'react-hook-form';

// ** Third Party Components
import classnames from 'classnames';

import {
  CheckCircle, Trash2,
} from 'react-feather';
import { toast } from 'react-toastify';

import 'react-dropzone-uploader/dist/styles.css';
import { useParams } from 'react-router-dom';
import { deleteProduct } from '@src/api/product.actions';
import {
  getContact, getLookupCountry, getLookupState, updateContact,
} from '@src/api/contact.actions';
import {
  getBuySearch, getCompanyManufacturer, getPriceRange, getProductModel,
} from '@src/api/buy.action';
import { getLookupProductOption } from '@src/api/product.actions';
import { updateInventoryActive, updateInventoryWarranty } from '@src/api/inventory.actions';
import { updateProduct } from '@src/api/product.actions';
import Link from 'next/link';
import FullLayout from '@src/layouts/FullLayout';
import { useRouter } from 'next/router';
import UILoader from '@src/components/ui-loader';
import Flatpickr from 'react-flatpickr';
import { FaCalendar } from 'react-icons/fa';
import 'flatpickr/dist/themes/material_green.css';

import 'react-dropzone-uploader/dist/styles.css';

import Dropzone, {
  IFileWithMeta,
  StatusValue,
} from 'react-dropzone-uploader';

import { acceptedImageFormats } from '@src/configs/dropzoneUploader';

const ContactEdit = () => {
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const [states, setStates] = useState([]);
  const [countriesInfo, setCountriesInfo] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const [exFormData, setExFormData] = useState('');
  const [exWatchData, setExWatchData] = useState([]);
  const [exWatchDeleteflag, setExWatchDeleteflag] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [methodOfContact, setMethodOfContact] = useState(null);
  const [financeType, setFinanceType] = useState('');
  const [checkBuyerType, setCheckBuyerType] = useState(false);
  const [checkType, setCheckType] = useState(false);
  const [checkMethodofContact, setCheckMethodofContact] = useState(false)
  const [chechWatchList, setCheckWatchList] = useState(false);
  const [eventDatePicker, setEventDatePicker] = useState();
  const [files, setFiles] = useState(null);
  const [offer, setOffer] = useState(null);
  const [showDropzone, setShowDropzone] = useState(false);
  const [productImage, setProductImage] = useState();
  const [productImageType, setProductImageType] = useState('');
  const [showDropzoneImage, setShowDropzoneImage] = useState(false);
  const [productErrMsg, setproductErrMsg] = useState('');








  const [company, setCompany] = useState([]);
  const [prodList, setProdList] = useState([]);
  const [product, setProduct] = useState([]);
  const [productOption, setProductOption] = useState([]);
  const [selectedProductOption, setSelectedProductOption] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);


  const [contactType, setContactType] = useState([
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ]);

  const [communicationType, setCommunicationType] = useState([
    { value: 'Email', label: 'Email' },
    { value: 'Text', label: 'Text' },
    { value: 'Phone Call', label: 'Phone Call' },
  ]);

  const [financeVal, setFinanceVal] = useState([
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ]);

  const searchType = [
    { value: 1, label: 'Manufacturer' },
  ];



  const {
    register, errors, handleSubmit, control, setValue, getValues, clearErrors,
  } = useForm();

  const router = useRouter();
  const { type, id } = router.query || { type: "sell", id: null };

  const fields = [
    'firstName', 'lastName', 'email', 'companyName', 'address1', 'address2', 'city', 'state', 'productCompany', 'productModel', 'productOption'
    , 'zip', 'country', 'phone', 'mobile', 'fax', 'active', 'methodOfContact', 'preferredContactType', 'finance', 'comments', 'itlPrefix', 'yourOffer', 'year', 'errorCode', 'lastService', 'wholastService',
  ];

  const handleCompanyChange = async (value) => {
    const arrList = [];
    //console.log("VAlueeeeeeeee"+value.label);
    setSelectedCompany(value);
    setValue("productCompany", value.label)

    const prodList = await getBuySearch({ companyName: value.label }) || [];

    const minus = '-';
    const prodData1 = prodList?.map((item, index) => ({

      label: item.productModel, //+minus+ item.productType
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
      setValue("productModel", prodData[0].value)
    }

    const optionData = await getLookupProductOption();
    const updateOption = optionData?.map((item) => ({
      label: item.name,
      value: item.productOptionId,
    }));

    console.log("updateOption",updateOption);

    var wanted = [];
    const productarrList =[];
    if (prodData[0]?.prodOption?.length > 0) {
      wanted = prodData[0]?.prodOption?.split(",");
    }


    updateOption.forEach((item) => {

      var result = item.value.toString();
      var result1 = wanted.indexOf(result);
      if (parseInt(result1) >= 0) {
        console.log(item.label, item.value)
     
        productarrList.push({label:item.label ,value:item.value});
      }
    });

    console.log("productarrList",productarrList);
    setProductOption(productarrList || [])
   
    setSelectedProductOption(productarrList || []);
    console.log("setSelectedProductOption",selectedProductOption);
    setValue('productOption', productarrList || '');


  }

  useEffect(() => {
    async function fetchData() {
      const arrList = [];
      const companyModelData = await getCompanyManufacturer({ type: searchType[0].value });
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

      const prodList = await getBuySearch({ companyName: modelDataCompany[0].label }) || [];

      const minus = '-';
      const prodData1= prodList?.map((item, index) => ({

        label: item.productModel, //+minus+ item.productType
        value: item.productId ?? '',
        prodOption: item.productOptionIds,
      })) ?? [];

      const prodData = prodData1.reduce((arr, item) => {
        const prodData= arr.filter(i => i['value'] !== item['value']);
        return [...prodData, item];
    }, []);
    
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
      var wanted = [];
      if (prodData[0]?.prodOption?.length > 0) {
        wanted = prodData[0]?.prodOption?.split(",");
      }


      updateOption.forEach((item) => {

        var result = item.value.toString();
        var result1 = wanted.indexOf(result);
        if (parseInt(result1) >= 0) {
          //arrList.push(item )
          arrList.push({label:item.label,value: item.value})
        }
      });
    
   
      setProductOption(arrList || [])
   
      setSelectedProductOption(arrList || []);
      console.log("setSelectedProductOption",selectedProductOption);
      setValue('productOption', arrList || '');

      // setValue('productOption', arrList || '');
      //console.log("arrList>>>>>>>>>>>>>"+JSON.stringify(arrList));
    }

    fetchData();
  }, []);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];


      console.log("URL.createObjectURL(i)", i);
      setFiles(i);
      //setCreateObjectURL(URL.createObjectURL(i));
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      setExWatchDeleteflag(false);
      const countrydata = await getLookupCountry();
      const updateddata = countrydata?.map((item) => ({
        label: item.countryName,
        value: item.countryId,
      }));

      setCountries(updateddata);
      setCountriesInfo(countrydata);
      // ---------------------------------------
      const contactdata = await getContact(id);
      console.log("contact data" + JSON.stringify(contactdata))
      console.log("contact data==>", contactdata)
      //  console.log("watchlist data==>",contactdata?.watchList[0]?.watchListProducts[0])
      fields.forEach((field) => {
        setValue(field, contactdata.contact[field]=="null" ? '':contactdata.contact[field]);
        register(field, { value: contactdata.contact[field]=="null" ? '':contactdata.contact[field]});
      });


      if (contactdata?.contact) {
        setExFormData(contactdata?.invProduct);

       
        if (document.getElementById('warrantyId')) {
          // console.log("<<<<<<>>>>>>>>>>"+contactdata?.invProduct?.isWarranty);
          document.getElementById('warrantyId').checked = contactdata?.invProduct?.isWarranty;
        }
        if (document.getElementById('activeId')) {
          document.getElementById('activeId').checked = contactdata?.invProduct?.isActive;
        }

      


        if (contactdata.contact.type === "watchlist" || contactdata.contact.type === "maintenance" || contactdata.contact.type === "inquiry") {

          setCheckWatchList(true)


          if (contactdata?.watchList?.length > 0) {
            setExWatchData(contactdata?.watchList);
  

            const initialValue = {
              label: contactdata.watchList[0].watchListProducts[0].product.company,
              value: contactdata.watchList[0].watchListProducts[0].product.company,
            };
            setSelectedCompany(initialValue);
            setValue("productCompany", initialValue.value);

            const prodList = await getBuySearch({ companyName: initialValue.label }) || [];


            console.log(prodList)
            console.log(prodList[0].productModel, "==> product list")

            if (prodList && prodList.length > 0) {

              const productModelOptions = prodList.map(item => ({
                label: item.productModel,
                value: item.productModel
              }));

              console.log("productModelOptions:", productModelOptions);
              setProdList(productModelOptions);

              const initialValue = {
                label: contactdata.watchList[0]?.watchListProducts[0]?.product?.productName,
                value: contactdata.watchList[0]?.watchListProducts[0]?.product?.productId,
              };

              console.log(initialValue)

              setProduct(initialValue);
              setValue("productModel", initialValue.value);
            }

            const result = await getBuySearch({ companyName: initialValue.label }) || {};
            console.log(result, "==<<");

         

            // Assuming result[0].productOptions is an array of strings like ['Option1,Option2', 'Option3,Option4']
            const optionData = contactdata.watchList[0]?.watchListProductOptions || [];
           console.log("optionData"+optionData.length);
           var arrayWatchList=[];

           optionData.forEach((item) => {
            arrayWatchList.push({label:item?.productOption?.name ,value:item?.productOption?.productOptionId})

           });

            setProductOption(arrayWatchList || []);
            setSelectedProductOption(arrayWatchList || []);


          } else {
            setExWatchData([]);
            setProductOption([]);
            setSelectedProductOption([]);

          }
        }

      

        if (contactdata.contact.type === "buyer offer" || contactdata.contact.type === "buyer question" || contactdata.contact.type === "question" || contactdata.contact.type === "maintenance") {

          setCheckType(true)
          if (contactdata.contact.preferredContactType != "") {
            
            const initialValue = {
              value: contactdata.contact.preferredContactType,
              label: contactdata.contact.preferredContactType,
            };
            setSelectedType(initialValue);
            setValue("preferredContactType", initialValue.value);

          } else {
            setSelectedType('');
            setValue("preferredContactType", '');
          }

        }

    

        if (contactdata.contact.type === "buyer offer" || contactdata.contact.type === "buyer question" || contactdata.contact.type === "maintenance" || contactdata.contact.type === "question") {

          setCheckMethodofContact(true)

          if (contactdata.contact.methodOfContact) {

            console.log("contactdata.contact.methodOfContact"+contactdata.contact.methodOfContact);


            if (contactdata.contact.methodOfContact != "") {

              const initialValues = {
                value: contactdata.contact.methodOfContact,
                label: contactdata.contact.methodOfContact,
              };
              setMethodOfContact(initialValues);
              setValue("methodOfContact", initialValues.value);
            } else {
              setMethodOfContact('');
              setValue("methodOfContact", '');
            }
          }
        }

      

        if (contactdata.contact.type === "buyer offer") {
          console.log(contactdata.contact.type, "contactdata.contact.type")
          setCheckBuyerType(true)

          if (contactdata.contact.finance) {
            console.log(contactdata.contact.finance, "contactdata.contact.finance")
            if (contactdata.contact.finance != "") {
              const initialValues = {
                value: contactdata.contact.finance,
                label: contactdata.contact.finance,
              };
              setFinanceType(initialValues);
              setValue("finance", initialValues.value);
            } else {
              setFinanceType('');
              setValue("finance", '');
            }
          }
        }

      
        // if(contactdata.contact.mobile){
        //   console.log(contactdata.contact.mobile,"contactdata.contact.mobile")

        // const initialValues = {
        //   value: contactdata.contact.mobile,
        //   label: contactdata.contact.mobile,
        // };
        // setFinanceType(initialValues);
        // setValue("finance", initialValues.value);   

        // }
        if (contactdata?.offer){
          console.log("offer>>"+contactdata?.offer?.offerPrice);
          setValue("yourOffer",contactdata?.offer?.offerPrice);
          setOffer(contactdata?.offer);
        }
          if(contactdata?.invProduct && contactdata?.invProduct?.inventoryId==0){
          setSelectedCompany({value:contactdata?.invProduct?.companyName,label:contactdata?.invProduct?.companyName});
          setValue("productCompany", contactdata?.invProduct?.companyName);

          
          const prodList = await getBuySearch({ companyName: contactdata?.invProduct?.companyName }) || [];


          console.log(prodList)
          console.log(prodList[0].productModel, "==> product list")

          if (prodList && prodList.length > 0) {

            const productModelOptions1 = prodList.map(item => ({
              label: item.productModel,
              value: item.productId
            }));
            const productModelOptions = productModelOptions1.reduce((arr, item) => {
              const productModelOptions= arr.filter(i => i['value'] !== item['value']);
              return [...productModelOptions, item];
          }, []);
           
            setProdList(productModelOptions);

            const selectProdutModel = productModelOptions?.filter((item) => item.value == contactdata?.invProduct?.productId);
            console.log("selectProdutModel",selectProdutModel)
            if(selectProdutModel && selectProdutModel.length>0){
              setProduct(selectProdutModel[0]);
              setValue("productModel", selectProdutModel[0].value);
            }
          }
        }

        if(contactdata.contact.type === "maintenance"){

          const localDate = convertToLocal(new Date(contactdata.contact.lastServiceDate));
          var lastServiceDate = localDate.toLocaleString();
          setEventDatePicker(new Date(lastServiceDate));
          setValue("year",contactdata.contact.yearOfManufacture);
          setValue("errorCode",contactdata.contact.errorCode!=null ? contactdata.contact.errorCode : '');
          setValue("lastService",contactdata.contact.lastServiceDesce!=null ? contactdata.contact.lastServiceDesc : '');
          setValue("wholastService",contactdata.contact.whoLastService!=null ? contactdata.contact.whoLastService :'');

          if(contactdata.contact?.productFile!=undefined && contactdata.contact?.productFile!="null"){
            const productImage1=contactdata.contact?.productFile.toString();
            var arr=productImage1.split('.');
              if(arr[1]==="mp4" || arr[1]==="mp3"){
              setProductImageType('video')
              }else{
                setProductImageType('image');
              }
              console.log("<<<<<<<<<<>>>>>>>>>>>>>>"+productImageType);
            }
            const imageUrlInventory = `${process.env.APP_SERVER_URL}/uploads/warranties/${contactdata.contact?.productFile}`;
            setProductImage(imageUrlInventory);
            console.log("productImage>>>"+productImage);


        }

        if(contactdata.contact.type === "inquiry"){

          if (document.getElementById('virtual')) {
            // console.log("<<<<<<>>>>>>>>>>"+contactdata?.invProduct?.isWarranty);
            document.getElementById('virtual').checked = contactdata?.contact?.virtualTraining;
            setValue("virtual",contactdata?.contact?.virtualTraining);
          }
          if (document.getElementById('person')) {
            document.getElementById('person').checked = contactdata?.contact?.personTraining;
            setValue("person",contactdata?.contact?.personTraining);
          }
        }


        if (contactdata.contact.country) {
          const selCountryId = contactdata.contact.country;
          const selStateId = contactdata.contact.state;
          const country = countrydata?.filter((item) => item.countryId === selCountryId);

          if (country.length > 0) {
            setSelectedCountry({
              label: country[0].countryName,
              value: country[0].countryId,
            });
            if (selCountryId == 223) {
              const statedata = await getLookupState("US");

              if (statedata.length > 0) {
                const updateddata = statedata?.map((item) => ({
                  label: item.stateName,
                  value: item.stateId,
                }));

                setStates(updateddata);

                if (selStateId) {
                  const state = updateddata.filter((item) => item.value === selStateId);
                  state.length > 0 ? setSelectedState(state[0]) : setSelectedState(updateddata[0]);
                } else {
                  setSelectedState(updateddata[0]);
                }
              } else {
                setStates([]);
                setSelectedState({});
              }
            }
          }
        }
      }
    };

    fetchData();
  }, [id, type]);

  
  const convertToLocal = (date) => {
    const newDate = new Date(date.getTime());
    const offset = date.getTimezoneOffset() / 60;
    const hours = date.getHours();
    const minutes = date.getMinutes();

    newDate.setHours(hours - offset);
    newDate.setMinutes(minutes+30);
    return newDate;
  };

  const convertToUTC = (date) => {
    const timezoneOffset = date.getTimezoneOffset();
    const utcTimestamp = date.getTime() + (timezoneOffset * 60 * 1000);
    const utcDate = new Date(utcTimestamp);
    return utcDate;
  };


  useEffect(() => {
    setSelectedCountry(countries?.length > 0 ? countries[225] : null);
  }, [countries]);

  useEffect(() => {
    setSelectedState(states?.length > 0 ? states[0] : null);
  }, [states]);

  const validatePhone = (e) => {
    //console.log("phone value"+e.target.value);
    if (e.target.value?.length > 0 && !/^\d{3} \d{3} \d{4}$/.test(e.target.value)) {
      setPhoneError('Please enter a valid phone number in the format 987 654 3210');
    } else {
      setPhoneError('');
    }
  }


  const onSubmit = async (data) => {
    //console.log("<<<update Data>>"+JSON.stringify(data));
    console.log("edited data ==>", data)
    data.country = selectedCountry?.value ? selectedCountry?.value : 0;
    data.state = selectedState?.value ? selectedState?.value : 0;
    data.type = type;

  

  
    setIsProcessing(true);
    console.log("<<<<<<<<<>>>>>>>>>>>>>>>>")
    const form = new FormData();
    if (type === "watchlist" || type === "maintenance" || type === "inquiry") {
    console.log(selectedProductOption);
      const options = selectedProductOption?.map((item) => item.value)
        .join(',');
        
        form.append("productId", product?.value);
        form.append("contact.productCompany", selectedCompany?.label);
        form.append("contact.productOption", options);
        if (type === "watchlist"){
        form.append("WatchList.WatchListProductOptionIds",options);
        form.append("WatchList.WatchListId",exWatchData[0]?.watchListId);
        }
        if(product?.value==undefined){
          setIsProcessing(false);
          setproductErrMsg("Please select Manufacturer");
          window.scrollTo(0, 0)
          return;
         }else{
          setproductErrMsg('');
          setIsProcessing(true);
         }


    } else {
      form.append("productId", 0);
      form.append("contact.productCompany", '');
      form.append("contact.productOption", '');
    }
    console.log("<<<<<<<<<>11>>>>>>>>>>>>>>>")
    try {
      // console.log("<<<update id>>"+data.phone.length);
      if (data.phone?.length > 0 && !/^\d{3} \d{3} \d{4}$/.test(data.phone)) {
        setPhoneError('Please enter a valid phone number in the format 987 654 3210');
        setIsProcessing(false);
        return false;

      } else {
        setPhoneError('');
        setIsProcessing(true);

      
        console.log("getValues" + getValues('phone'))
        //fields.forEach((field) => form.append(field, getValues(field)));
        form.append("contact.type", type);
        form.append("contact.firstName", getValues('firstName'));
        form.append("contact.lastName",  getValues('lastName'));
        form.append("contact.email",  getValues('email'));
        form.append("contact.companyName",  getValues('companyName'));
        form.append("contact.address1",  getValues('address1'));
        form.append("contact.address2",  getValues('address2'));
        form.append("contact.city",  getValues('city'));
        form.append("contact.state",  data.state);
        form.append("contact.country",  data.country);
        form.append("contact.zip",  getValues('zip'));
        form.append("contact.phone",  getValues('phone'));
        form.append("contact.mobile",  getValues('mobile'));
        form.append("contact.active",  getValues('active'));
        form.append("contact.methodOfContact",  getValues('methodOfContact'));
        form.append("contact.preferredContactType",  getValues('preferredContactType'));
        form.append("contact.finance",  getValues('finance'));
        form.append("contact.comments",  getValues('comments'));
        if(type==="buyer offer"){
        form.append("offer.offerPrice",  getValues('yourOffer'));
        form.append("offer.contactId",  id);
        form.append("offer.offerId", offer?.offerId);
        form.append("offer.inventoryId",  offer?.inventoryId);
        form.append("offer.active",  offer?.active);
        form.append("offer.createdAt",   offer?.createdAt);
        form.append("offer.updatedAt",   offer?.updatedAt);

        }

        if(type==="maintenance"){
          const lastServiceDate = convertToUTC(new Date(eventDatePicker)).toLocaleString();
          setValue('lastServiceDate', lastServiceDate);

          form.append("contact.yearOfManufacture",  getValues('year'));
          form.append("contact.errorCode",  getValues('errorCode'));
          form.append("contact.lastServiceDesc", getValues('lastService'));
          form.append("contact.lastServiceDate",  getValues('lastServiceDate'));
          form.append("contact.whoLastService",  getValues('wholastService'));
          form.append("contact.productFile",   files?.length === 0 ? null : files);
          }

          if(type==="inquiry"){
            form.append("contact.personTraining", getValues('person') ?? false);
            form.append("contact.virtualTraining", getValues('virtual') ?? false);

          }
        form.append("contactId",  id);

       
        await updateContact(id, form);
        toast.success(
          <>
            <CheckCircle className="mr-1 text-success" />
            Contact updated
          </>, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
        }
        );
        setIsProcessing(false);
      }
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setApiErrors({ data: 'Contact add error' });
      } else {
        setApiErrors(err.response ? err.response : { data: err.response?.data });
      }
      setIsProcessing(false);
    }
  };

  const handleCountryChange = async (event) => {
    setSelectedCountry(event);
    const country = countriesInfo?.filter((country) => country.countryId === event.value);
    if (country.length > 0) {
      const data = await getLookupState(country[0]?.countryCode);

      if (data.length > 0) {
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

  const handleExChange = async (event) => {
    const isActive = event.target.checked;
    //console.log("target>>"+isActive);
    //console.log("event.target.name"+event.target.name);

    if (exFormData.inventoryId) {
      (event.target.name === 'active') ? (await updateInventoryActive(exFormData.inventoryId, isActive)) : (await updateInventoryWarranty(exFormData.inventoryId, isActive));
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Inventory
          {' '}
          {event.target.name}
          {' '}
          updated
        </>, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
      }
      );
    } else {
      toast.warning(
        <>
          <CheckCircle className="mr-1 text-success" />
          Inventory
          {' '}
          {event.target.name}
          {' '}
          can not updated.
        </>, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
      }
      );
    }
  };

  const exContacts = () => (
    exFormData?.inventoryId ? (
      <>
        <FormGroup>
          <div className="row">
            <div className="col-sm-7">
              <Label>
                Company - Product
              </Label>
            </div>

            <div className="col-sm-2">
              <Label>
                Active
              </Label>
            </div>
            <div className="col-sm-2">
              <Label>
                Warranty
              </Label>
            </div>
          </div>
        </FormGroup>
        <FormGroup style={{ backgroundColor: 'orange' }}>
          <div className="row">
            <div className="col-sm-7">
              <Link className="d-flex align-items-center" passHref href={`/admin/inventorys/edit/${exFormData?.inventoryId}`}>
                <Label style={{ cursor: 'pointer' }}>
                  {`${exFormData?.companyName} - ${exFormData?.productModel}`}
                </Label>
              </Link>
            </div>

            <div className="col-sm-2 text-center">
              <input
                style={{ cursor: 'pointer' }}
                type="checkbox"
                id="activeId"
                name="active"
                onChange={(e) => { handleExChange(e); }}


                className={classnames('form-check-input')}
              />
            </div>
            <div className="col-sm-2 text-center">
              <Input
                style={{ cursor: 'pointer' }}
                type="checkbox"
                id="warrantyId"
                name="warranty"
                onChange={(e) => { handleExChange(e); }}


                className={classnames('form-check-input')}
              />
            </div>
          </div>
        </FormGroup>
        <br />
      </>
    ) : '');

  const exWatchList = () => (
    exWatchData && exWatchData[0]?.watchListId ? (
      <FormGroup>
        <div className="row col-12">
          <p className="sentient" style={{ color: '#4DAC00' }}>
            WatchList:
          </p>
          {Array.isArray(exWatchData) && exWatchData?.[0]?.watchListProducts?.[0]?.watchListProductId ? (
            <div className="col-12">
              <table className="sentient">
                <thead>
                  <tr>
                    <th className="first-column sentient">
                      <p className="sentient-text-content"> Product </p>
                    </th>
                    <th className="second-column sentient">
                      <p className="sentient-text-content"> Start Date </p>
                    </th>
                    {/* <th className="third-column sentient">
                      <p className="sentient-text-content" />
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {exWatchData.map((mainItem, mainIndex) => (
                    Array.isArray(mainItem.watchListProducts) && mainItem.watchListProducts.map((item, index) => (
                      item.watchListProductId && (
                        <tr key={`${mainIndex}-${index}`}>
                          <td className="sentient">
                            <Link href={`/admin/products/edit/${item.productId || ''}`} passHref className="navbar-brand">
                              <p className="sentient-text-content">
                                {item.product?.productName || ''}
                              </p>
                            </Link>
                          </td>
                          <td className="sentient">
                            <p className="sentient-text-content">
                              {item?.product.createdAt || ''}
                            </p>
                          </td>
                        </tr>
                      )
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          ) : ''}
          <div className="w-100 mb-1" />
          {Array.isArray(exWatchData) && exWatchData?.[0]?.watchListProductOptions?.[0]?.watchListProductOptionId ? (
            <div className="col-12">
              <table className="sentient">
                <thead>
                  <tr>
                    <th className="first-column sentient">
                      <p className="sentient-text-content"> Indicated Uses </p>
                    </th>
                    <th className="second-column sentient">
                      <p className="sentient-text-content"> Start Date </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exWatchData.map((mainItem, mainIndex) => (
                    Array.isArray(mainItem.watchListProductOptions) && mainItem.watchListProductOptions.map((item, index) => (
                      item.watchListProductOptionId && (
                        <tr key={`${mainIndex}-${index}`}>
                          <td className="sentient">
                            <Link href={`/admin/products/edit/${exWatchData[mainIndex].productId || ''}`} passHref className="navbar-brand">
                              <p className="sentient-text-content">
                                {item.productOption?.name || ''}
                              </p>
                            </Link>
                          </td>
                          <td className="sentient">
                            <p className="sentient-text-content">
                              {item?.productOption.createdAt || ''}
                            </p>
                          </td>
                        </tr>
                      )
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          ) : ''}

          <div className="w-100 mb-1" />
        </div>
      </FormGroup>
    ) : null
  );

  return (
    <FullLayout>
      <div className="table-header pt-3">
        <Button color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button>
        <h3>Edit Contact</h3>
      </div>
      <Row>
        <Col md="12" sm="12" lg="12">
          <Card className="px-3">
            <CardBody>
              {exContacts(exFormData)}
              {exWatchList(exWatchData)}
              <Form onSubmit={handleSubmit(onSubmit)}>
                {apiErrors.data ? (
                  <Alert color="danger">
                    <div className="alert-body">
                      <span>{`Error: ${apiErrors.data}`}</span>
                    </div>
                  </Alert>
                ) : (
                  <></>
                )}
                <UILoader blocking={isProcessing}>


                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>First Name *:</Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input firstName"
                          id="firstName"
                          name="firstName"
                          className={classnames(
                            { "is-invalid": errors && errors.firstName },
                            "form-control"
                          )}
                          {...register("firstName", { required: true })}
                        />
                      </div>
                      <div className="col-sm-2">
                        <Label>Last Name *:</Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input lastName"
                          id="lastName"
                          name="lastName"
                          className={classnames(
                            { "is-invalid": errors && errors.lastName },
                            "form-control"
                          )}
                          {...register("lastName", { required: true })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>Company Name *:</Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input companyName"
                          id="companyName"
                          name="companyName"
                          className={classnames(
                            { "is-invalid": errors && errors.companyName },
                            "form-control"
                          )}
                          {...register("companyName", { required: true })}
                        />
                      </div>
                      <div className="col-sm-2">
                        <Label mb="10px">Address1 *:</Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input address1"
                          id="address1"
                          name="address1"
                          className={classnames(
                            { "is-invalid": errors && errors.address1 },
                            "form-control"
                          )}
                          {...register("address1", { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>Address2:</Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input address2"
                          id="address2"
                          name="address2"
                          className={classnames(
                            { "is-invalid": errors && errors.address2 },
                            "form-control"
                          )}
                          {...register("address2", { required: false })}
                        />
                      </div>
                      <div className="col-sm-2">
                        <Label mb="10px">City:</Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input City"
                          id="city"
                          name="city"
                          className={classnames(
                            { "is-invalid": errors && errors.city },
                            "form-control"
                          )}
                          {...register("city", { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>Country:</Label>
                      </div>
                      <div className="col-sm-6">
                        <Select
                          as={Select}
                          options={countries}
                          name="country"
                          value={selectedCountry}
                          isClearable={false}
                          control={control}
                          defaultvalue={
                            countries[0]?.length > 0 ? countries[225] : null
                          }
                          className={`react-select ${classnames({
                            "is-invalid": errors && errors.country,
                          })}`}
                          classNamePrefix="select"
                          onChange={(value) => {
                            handleCountryChange(value);
                          }}
                          {...register("country").label}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>State:</Label>
                      </div>
                      <div className="col-sm-4">
                        <Select
                          as={Select}
                          options={states}
                          name="state"
                          value={selectedState}
                          isClearable={false}
                          defaultvalue={
                            states[0]?.length > 0 ? states[0] : null
                          }
                          control={control}
                          onChange={(value) => {
                            setSelectedState(value);
                          }}
                          className={`react-select ${classnames({
                            "is-invalid": errors && errors.state,
                          })}`}
                          classNamePrefix="select"
                          {...register("state").label}
                        />
                      </div>
                      <div className="col-sm-2">
                        <Label mb="10px">Zip:</Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Zip code"
                          id="zip"
                          name="zip"
                          autoComplete="off"
                          maxLength={5}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            return false;
                          }}
                          className={classnames(
                            { "is-invalid": errors && errors.zip },
                            "form-control"
                          )}
                          {...register("zip", { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>Email *:</Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="email"
                          placeholder="Input email"
                          id="email"
                          name="email"
                          className={classnames(
                            { "is-invalid": errors && errors.email },
                            "form-control"
                          )}
                          {...register("email", { required: true })}
                        />
                      </div>
                      <div className="col-sm-2">
                        <Label>International Prefix:</Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input international Prefix"
                          id="itlPrefix"
                          name="itlPrefix"
                          className={classnames(
                            { "is-invalid": errors && errors.itlPrefix },
                            "form-control"
                          )}
                          {...register("itlPrefix", { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>Phone:</Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input phone"
                          id="phone"
                          name="phone"
                          maxLength={12}
                          onKeyUp={(e) => validatePhone(e)}
                          onPaste={(e) => {
                            e.preventDefault();
                            return false;
                          }}
                          className={classnames(
                            { "is-invalid": errors && errors.phone },
                            "form-control"
                          )}
                          {...register("phone", { required: false })}
                        />
                        <span style={{ fontWeight: "bold", color: "red" }}>
                          {phoneError}
                        </span>
                      </div>
                      {/* <div className="col-sm-2">
                        <Label>Fax:</Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input fax"
                          id="fax"
                          name="fax"
                          className={classnames(
                            { "is-invalid": errors && errors.fax },
                            "form-control"
                          )}
                          {...register("fax", { required: false })}
                        />
                      </div> */}
                      <div className="col-sm-2">
                        <Label>Mobile:</Label>
                      </div>
                      <div className="col-sm-4">
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
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>Active:</Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="checkbox"
                          id="active"
                          name="active"
                          className={classnames(
                            { "is-invalid": errors && errors.active },
                            "form-check-input"
                          )}
                          {...register("active", { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  {chechWatchList && (
                    <FormGroup>
                      <FormGroup>
                        <div className="row">
                          <div className="col-sm-2">
                            <Label>Manufacturer *:</Label>
                          </div>
                          <div className="col-sm-10">
                            <Select
                              as={Select}
                              options={company}
                              id="productCompany"
                              name="productCompany"
                              placeholder="Manufacturer"
                              value={selectedCompany}
                              isClearable={false}
                              classNamePrefix="select"
                              control={control}
                              className={`react-select sentient-content ${classnames(
                                { "is-invalid": errors && errors.productCompany }
                              )}`}
                              onChange={(value) => {
                                handleCompanyChange(value);
                              }}
                              {...register("productCompany")?.label}
                            // {...register('productCompany')?.label}
                            />
                            <span style={{ fontWeight: 'bold', color: 'red' }}>{productErrMsg}</span>

                          </div>
                        </div>
                      </FormGroup>

                      <FormGroup>
                        <div className="row">
                          <div className="col-sm-2">
                            <Label>Model *: </Label>
                          </div>
                          <div className="col-sm-10">
                            <Select
                              as={Select}
                              options={prodList}
                              name="productModel"
                              id="productModel"
                              value={product}
                              isClearable={false}
                              control={control}
                              placeholder="Model"
                              className={`react-select sentient-content ${classnames(
                                { "is-invalid": errors && errors.productModel }
                              )}`}
                              classNamePrefix="select"
                              onChange={(value) => {
                                console.log(value.value);
                                setProduct(value);
                                //setValue("productModel", value.value);
                              }}
                              {...register("productModel")?.label}
                            />
                          </div>
                        </div>
                      </FormGroup>
                    
                      {type === 'watchlist' && (
                      <FormGroup>
                        <div className="row">
                          <div className="col-sm-2">
                            <Label>Indicated Use:</Label>
                          </div>
                          <div className="col-sm-10">
                          <FormGroup>
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
                              // className={`react-select sentient-content ${classnames(
                              //   { "is-invalid": errors && errors.productOption }
                              // )}`}
                              className={`react-select sentient-content ${classnames({ 'is-invalid': errors && errors.productOption })}`}

                              classNamePrefix="select"
                              onChange={(value) => {
                                setSelectedProductOption(value);
                                //setValue("productOption",value.label)
                              }}
                              {...register('productOption')?.label}
                              isMulti
                            />
                            </FormGroup>
                          </div>
                        </div>
                      </FormGroup>
                      )}
                      </FormGroup>
                 
                     )}
                   

                  {checkMethodofContact && (
                    <FormGroup>
                      <div className="row">
                        <div className="col-sm-2">
                          <Label>Preferred Method of Contact:</Label>
                        </div>
                        <div className="col-sm-10">
                          <Select
                            options={communicationType}
                            id="methodOfContact"
                            name="methodOfContact"
                            value={methodOfContact}
                            isClearable={false}
                            control={control}
                            className={`react-select sentient-content ${classnames(
                              {
                                "is-invalid": errors && errors.methodOfContact,
                              }
                            )}`}
                            placeholder="Method of Contact"
                            style={{ border: "1px solid #646464" }}
                            onChange={(value) => {
                              console.log(value.value);
                              setMethodOfContact(value);
                              setValue("methodOfContact", value.value);
                            }}
                            {...register("methodOfContact")?.label}
                          />
                        </div>
                      </div>
                    </FormGroup>
                  )}

                  {checkType && (
                    <FormGroup>
                      <div className="row">
                        <div className="col-sm-2">
                          <Label>Preferred time of contact:</Label>
                        </div>
                        <div className="col-sm-10">
                          <Select
                            as={Select}
                            options={contactType}
                            id="preferredContactType"
                            name="preferredContactType"
                            value={selectedType}
                            control={control}
                          
                            className={`react-select ${classnames({
                              "is-invalid":
                                errors && errors.preferredContactType,
                            })}`}

                            placeholder="AM/PM"
                            style={{ border: "1px solid #646464" }}
                            {...register("preferredContactType").label}
                            onChange={(value) => {
                              console.log(value.value);
                              setSelectedType(value);
                              setValue("preferredContactType", value.value);
                            }}
                          />
                        </div>
                      </div>
                    </FormGroup>
                  )}

                  {checkBuyerType && (
                    <FormGroup>
                      <div className="row">
                        <div className="col-sm-2">
                          <Label>Do you need financing:</Label>
                        </div>
                        <div className="col-sm-10">
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
                            placeholder="Y/N"
                            className={`react-select sentient-content ${classnames(
                              { "is-invalid": errors && errors.finance }
                            )}`}
                            // classNamePrefix="Select Finance Type"
                            style={{ border: "1px solid #646464" }}
                            onChange={(value) => {
                              console.log(value.value);
                              setFinanceType(value);
                              setValue("finance", value.value);
                            }}
                            {...register("finance").label}
                          />
                        </div>
                      </div>
                    </FormGroup>
                  )}
                  {type === 'buyer offer' && (
                    <FormGroup>
                      <div className="row">
                        <div className="col-sm-2">
                          <Label>Your Offer:</Label>
                        </div>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            placeholder="Input Your Offer"
                            id="yourOffer"
                            name="yourOffer"
                            className={classnames({ 'is-invalid': errors && errors.yourOffer }, 'form-control sentient-content')}
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
                            {...register('yourOffer', { required: false })}
                          />

                        </div>
                      </div>

                    </FormGroup>

                  )}

                  {type === 'maintenance' && (
                    <>
                      <FormGroup>
                        <div className="row">
                          <div className="col-sm-2">
                            <Label>Year of Manufacture *:</Label>
                          </div>
                          <div className="col-sm-10">
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

                              {...register('year', { required: true })}
                            />

                          </div>
                        </div>
                      </FormGroup>
                      <FormGroup>

                        <div className="row">
                          <div className="col-sm-2">
                            <Label>Issue(s)/Error codes:</Label>
                          </div>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              placeholder="Issue(s)/Error codes"
                              id="errorCode"
                              name="errorCode"
                              className={classnames({ 'is-invalid': errors && errors.errorCode }, 'form-control sentient-content')}
                              style={{ border: '1px solid #646464' }}
                              {...register('errorCode', { required: false })}
                            />
                          </div>
                        </div>

                      </FormGroup>
                      <FormGroup>
                        <div className="row">
                          <div className="col-sm-2">
                            <Label>What was performed at last service:</Label>
                          </div>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              placeholder="What was performed at last service"
                              id="lastService"
                              name="lastService"
                              className={classnames({ 'is-invalid': errors && errors.lastService }, 'form-control sentient-content')}
                              style={{ border: '1px solid #646464' }}
                              {...register('lastService', { required: false })}
                            />
                          </div>
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <div className="row">
                          <div className="col-sm-2">
                            <Label>Date of last service:</Label>
                          </div>
                          <div className="col-sm-10">
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
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <div className="row">
                          <div className="col-sm-2">
                            <Label>Who serviced the device last? *:</Label>
                          </div>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              placeholder="Who serviced the device last? *"
                              id="wholastService"
                              name="wholastService"
                              className={classnames({ 'is-invalid': errors && errors.wholastService }, 'form-control sentient-content')}
                              style={{ border: '1px solid #646464' }}
                              {...register('wholastService', { required: true })}
                            />

                          </div>
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <div className="row" style={{ height:"auto"}}>
                          <div className="col-sm-2">
                            <Label>Product image / video</Label>
                          </div>
                          <div className="col-sm-4"  style={{ height:"auto"}}>
                          {productImage && !showDropzoneImage ? (
                            <>
                          
                             {productImageType==="image" && (
                             <img src={productImage}  width="60%" height="40%" className="img-fluid " alt="logo" />
                             )}
                               {productImageType==="video" && (
                              <ReactPlayer url={productImage} width="250px" height="160px" controls={true} />  
                              )}
                              <Button onClick={() => setShowDropzoneImage(true)} className="btn-sm float-right" color="flat-info">Change</Button>
                                   
                            
                            </>
                          ) : (<></>)}

                         {!productImage || showDropzoneImage ? (
                              <Controller

                                style={{ border: '1px solid #646464' }}
                                control={control}
                                name="productFile"
                                render={({ onChange }) => (

                                  <input type="file" name="myImage" accept=".png, .jpg, .jpeg, .mp3, .mp4" onChange={uploadToClient} />

                                )}
                              />

                            ) : (<></>)}
                          </div>
                        </div>
                      </FormGroup>
                    </>
                  )}

                {type === 'inquiry' && (
                 <>
                    <FormGroup >
                    <div className="row">
                          <div className="col-sm-4 m-2 p-0" style={{textAlign:"right"}}>
                          <input
                            type="checkbox"
                            name="person"
                            id="person"
                            className={classnames('form-check-input')}
                          //  onChange={(e) => { setValue("person",e.target.checked); }}

                            {...register('person', { required: false })}
                          />
                          <label htmlFor="person" className="form-check-label sentient-content px-3">In-person training</label>
                        </div>
                        <div className="col-sm-4 m-2 p-0">
                          <input
                            type="checkbox"
                            name="virtual"
                            id="virtual"
                            className={classnames('form-check-input')}
                          //  onChange={(e) => { setValue("virtual",e.target.checked); }}
                            {...register('virtual', { required: false })}
                          />
                          <label htmlFor="virtual" className="form-check-label sentient-content px-3">Virtual training</label>
                        </div>
                      </div>
                    </FormGroup>
                    </>
                  )}
                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>Comments:</Label>
                      </div>
                      <div className="col-sm-10">
                        <textarea
                          type="textarea"
                          placeholder=""
                          id="comments"
                          name="comments"
                          rows={5}
                          className={classnames(
                            { "is-invalid": errors && errors.comments },
                            "form-control"
                          )}
                          {...register("comments", { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>
                  <div>
                    <Button outline size="sm" type="submit" color="primary">
                      Edit Contact
                    </Button>
                  </div>
                </UILoader>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </FullLayout>
  );
};

export default ContactEdit;
