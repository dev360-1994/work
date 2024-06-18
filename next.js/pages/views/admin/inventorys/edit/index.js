/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import {
  Card, CardBody, Col, FormGroup, Label, Row, Input, Button, Form, Alert, CustomInput,
} from 'reactstrap';
import Select from 'react-select';

// ** Router Components
import { useForm, Controller } from 'react-hook-form';

// ** Third Party Components
import classnames from 'classnames';

import {
  CheckCircle,
} from 'react-feather';
import { toast } from 'react-toastify';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import { acceptedImageFormats } from '@src/configs/dropzoneUploader';
import { getInventory, updateInventory } from '@src/api/inventory.actions';
import FullLayout from '@src/layouts/FullLayout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import UILoader from '@src/components/ui-loader';
import {
  getBuySearch, getCompanyManufacturer, getPriceRange, getProductModel,
} from '@src/api/buy.action';
import { addSellProductInventory, getFullProductModel, getLaserType } from '@src/api/sell.action';
import { getLookupProductOption,getProductActive,getProduct} from '@src/api/product.actions';
import {
  blooleanValue, leadRecordType, leadSourceType, ownerShip,
  devicePowerRequirements, generalConditions
} from '@src/components/contactComponents';



const InventoryEdit = () => {
  const {
    register, errors, handleSubmit, control, setValue, getValues, clearErrors, reset,
  } = useForm();

  const router = useRouter();
  const { id } = router.query || { id: null };

  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const [showDropzoneImage, setShowDropzoneImage] = useState(false);
  const [showDropzoneUser, setShowDropzoneUser] = useState(false);
  const [productOption, setProductOption] = useState([]);


  const [selectedProduct, setSelectedProduct] = useState();
  const [productCompany, setProductCompany] = useState([]);

  const [tabledata, setTableData] = useState({});

  const [inventoryImage, setInventoryImage] = useState();
  const [userImage, setUserImage] = useState();

  const [inventoryFiles, setInventoryFiles] = useState([]);
  const [userFiles, setUserFiles] = useState([]);
  const [company, setCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [laserType, setLaserType] = useState([]);
  const [selectedLaserType, setSelectedLaserType] = useState();

  const [selectedPowerRequirement, setSelectedPowerRequirement] = useState([]);
  const [selectedGeneralCondition, setSelectedGeneralCondition] = useState([]);
  const [selectedOwnerShip, setSelectedOwnerShip] = useState([]);
  const [selectedOPeratorManuals, setSelectedOPeratorManuals] = useState([]);
  const [selectedCUFactoryWarranty, setSelectedCUFactoryWarranty] = useState([]);
  const [selectedOriginalBoxes, setSelectedOriginalBoxes] = useState([]);
  const [eventDatePicker, setEventDatePicker] = useState();


  const fields = [
     'sku', 'productYear', 'askingPrice', 'bestOffer', 'serialNumber', 'reasonForSelling','accessories',
    'active', 'hotDeal', 'blueDot', 'include30DayWarranty', 'videoLink', 'description', 'inventoryImage',
    'userImage', 'approved', 'approvedBy', 'insertedBy', 'sold', 'views',
    'videoApproved', 'userImageApproved', 'notes', 'productId', 'inventoryImageFile', 'userImageFile','shotPulseCount', 'hourCount', 'handPieces', 'generalCondition', 'powerRequirements',
    'ownerShip', 'lastServiced', 'operatorManuals', 'cuFactoryWarranty', 'originalBoxes', 'itlPrefix', 'productModel', 'ifOther', 'companyMfg', 'type', 'waveLength', 'productYear', 
  ];

  const handleControlledDropzoneChangeStatusInventory = (status, allFiles) => {
    setTimeout(() => {
      if (['done', 'removed'].includes(status)) {
        setInventoryFiles([...allFiles]);
      }
    }, 0);
  };

  const handleControlledDropzoneChangeStatusUserImage = (status, allFiles) => {
    setTimeout(() => {
      if (['done', 'removed'].includes(status)) {
        setUserFiles([...allFiles]);
      }
    }, 0);
  };

  const uploadToClient = (event) => {
    setInventoryFiles([]);
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];


      console.log("URL.createObjectURL(i)", i);
      setInventoryFiles(i);
      //setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const uploadToUserClient = (event) => {
    setUserFiles([]);
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];


      console.log("URL.createObjectURL(i)", i);
      setUserFiles(i);
      //setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log('id is', id)
      const products = await getProductActive();
      const selectedInventory = await getInventory(id);
      console.log('selectedInventory is '+JSON.stringify(selectedInventory));
      setTableData(selectedInventory?.inventory);
      fields.forEach((field) => setValue(field, selectedInventory?.inventory[field]=="null"?'':selectedInventory?.inventory[field]));
      if(selectedInventory?.inventory?.lastServiced){
      const localDate = convertToLocal(new Date(selectedInventory?.inventory?.lastServiced));
      setEventDatePicker(new Date(localDate));
      }
      setSelectedOriginalBoxes({value:selectedInventory?.inventory?.originalBoxes,label:selectedInventory?.inventory?.originalBoxes}) ;

      setSelectedGeneralCondition({value:selectedInventory?.inventory?.generalCondition,label:selectedInventory?.inventory?.generalCondition});
      if(selectedInventory?.inventory?.operatorManuals!="null"){
      setSelectedOPeratorManuals({value:selectedInventory?.inventory?.operatorManuals,label:selectedInventory?.inventory?.operatorManuals});
      }
      //setSelectedCUFactoryWarranty({value:selectedInventory?.inventory?.include30DayWarranty,label:selectedInventory?.inventory?.include30DayWarranty});
        if(document.getElementById('bestOffer')){
          document.getElementById('bestOffer').checked=selectedInventory?.inventory?.bestOffer;
        }
        if(document.getElementById('blueDot')){
          document.getElementById('blueDot').checked=selectedInventory?.inventory?.blueDot;
        }

        if(selectedInventory?.inventory?.type==='lease'){
          setSelectedOwnerShip({value:'Leased',label:'Leased'});
        }else{
          setSelectedOwnerShip({value:'Owned',label:'Owned'})
        }

        if(selectedInventory?.inventory?.include30DayWarranty){
          setSelectedCUFactoryWarranty({label:'Yes',value:'0'});
        }else{
          setSelectedCUFactoryWarranty({label:'No',value:'1'})
        }

      const minus = '-';
      const data1 = products?.map((item) => ({
        label: item.productName , //+ minus + item.company
        value: item.productId ?? '',
        company: item.company,
       
      })) ?? [];
      console.log("data1",data1)

    //   const data = data1.reduce((arr, item) => {
    //     const data= arr.filter(i => i['company'] === item['company']);
    //     return [...data, item];
    // }, []);

       const data = data1.filter((item) => item.company === selectedInventory?.productDetails?.company);

      if (data?.length > 0) {
        setProductCompany(data);
        if (selectedInventory?.productDetails?.productId) {
          const product = data.find((item) => item.value == selectedInventory?.productDetails?.productId);
          console.log("<<<<<<<<<<",product);
         
          if (product) {
            console.log("DDDDDDDDDDDDD")
            setSelectedProduct(product);
          }
        } else {
          setSelectedProduct(data[0]);
        }
      }
      // -------------------------------
      const companyModelData = await getCompanyManufacturer({ type: 1 });
      //console.log("<<<<<<<<<<<<<ManuFacture Data>>>>>>>>>>>>>>>>>>>" + JSON.stringify(companyModelData));
      const modelDataCompany = companyModelData?.map((item, index) => ({
        label: item.companyName,
        value: item.cnt ?? '',
      })) ?? [];

      if (modelDataCompany && modelDataCompany.length > 0) {
        setCompany(modelDataCompany);
         const setManfactute = modelDataCompany.filter((item) => item.label === selectedInventory?.productDetails?.company);
        console.log("setManfactute",setManfactute);
        setSelectedCompany(setManfactute[0] || []);
      }
      const laserData = await getLaserType();
      if (laserData && laserData.length > 0) {
        const updateddata = laserData.map((item) => ({
          label: item.name,
          value: item.name,
        }));
        setLaserType(updateddata || []);

        const laserType1 = updateddata.filter((item) => item.label === selectedInventory?.productDetails?.type);
         console.log("........",laserType1);
         if(laserType1?.length>0){
         setSelectedLaserType(laserType1);
         }else{
          setSelectedLaserType({label:selectedInventory?.productDetails?.type, value:selectedInventory?.productDetails?.type})
         }
      }

        setValue('waveLength',selectedInventory?.productDetails?.waveLength);
        setValue('energyOutput',selectedInventory?.productDetails?.energyOutput);
        setValue('handPieces',selectedInventory?.inventory?.handpieces);
        

        const prodList = await getProduct( selectedInventory?.productDetails?.productId);
         console.log("prodList>>",prodList)
            
        setValue('waveLength', prodList?.waveLength || '');
        //setValue('productYear', prodList?.waveLength || "");
        setValue('askingPrice', prodList?.askingPrice || 0);
        setValue('shotPulseCount', prodList?.pulseLength || 0);
        setValue('powerRequirements', prodList?.energyOutput ||'');

        

      // const optionData = await getLookupProductOption();
      // setProductOption(optionData || []);
      // setValue('productOption', optionData || '');
      // console.log("optionData",optionData);
  
      const optionData = (await getLookupProductOption()).map((option) => ({
        ...option,
        active: false,
      }));

      if (selectedInventory?.productDetails?.productOptions) {
        const optionArray = selectedInventory?.productDetails?.productOptions.split(',');
        const productOption = optionData.map((option) => {
          if (optionArray?.includes(option.productOptionId?.toString())) {
            return { ...option, active: 'true' };
          }
          return option;
        });
        setProductOption(productOption);
        productOption.forEach((item) => setValue(item.name, item.active));
        setValue('productOption', optionData || '');
      }
      


      if (selectedInventory) {
        const imageUrlInventory = `${process.env.APP_SERVER_URL}/uploads/products/${selectedInventory?.inventory?.inventoryImage}`;
        const imageUrlUser = `${process.env.APP_SERVER_URL}/uploads/products/${selectedInventory?.inventory?.userImage}`;
        console.log(imageUrlInventory);
        setInventoryImage(imageUrlInventory);
        setUserImage(imageUrlUser);

        console.log('---------', selectedInventory);
      }
    };

    fetchData();
  }, [id]);

  const handleButtonClick = () => {
    clearErrors();
    handleSubmit(onSubmit)();
  };
  
  const convertToLocal = (date) => {
    const newDate = new Date(date.getTime());
    const offset = date.getTimezoneOffset() / 60;
    const hours = date.getHours();
    const minutes = date.getMinutes();

    newDate.setMinutes(minutes+30);
    return newDate;
  };


  const handleProductChange= async (value) => {

    setSelectedProduct(value);
    const productId=value.value;
    console.log("setSelectedProduct"+value.value);
    console.log("selectedCompany.label"+selectedCompany.label);

    const prodList = await getProduct( productId);
    const minus = '-';

    console.log("prodList11",prodList);
      if(prodList){
        setSelectedProduct({value:prodList.productId ,label:prodList.productName});
        setSelectedLaserType({value:prodList.type ,label:prodList.type});
       
        setValue('waveLength', prodList?.waveLength || '');
        //setValue('productYear', prodList?.waveLength || "");
        setValue('askingPrice', prodList?.askingPrice || 0);
        setValue('powerRequirements', prodList?.energyOutput ||'');
        setValue('shotPulseCount', prodList?.pulseLength || 0);

  
        const optionData = (await getLookupProductOption()).map((option) => ({
          ...option,
          active: false,
        }));
  
        if (prodList?.productOptions) {
          const optionArray = prodList?.productOptions.split(',');
          const productOption = optionData.map((option) => {
            if (optionArray?.includes(option.productOptionId?.toString())) {
              return { ...option, active: 'true' };
            }
            return option;
          });
          setProductOption(productOption);
          productOption.forEach((item) => setValue(item.name, item.active));
          setValue('productOption', optionData || '');
        }
       


      }

  }

  const handleCompanyChange = async (value) => {
    const arrList = [];
    //console.log("VAlueeeeeeeee"+value.label);
    setSelectedCompany(value);
   

    const prodList = await getBuySearch({ companyName: value.label }) || [];
    const minus = '-';

    //console.log("prodList",prodList)

    const prodData1 = prodList?.map((item, index) => ({

      label: item.productModel, //+minus+ item.productType
      value: item.productId ?? '',
      prodOption: item.productOptionIds,
      
      productWaveLength: item.waveLength,
      yearOfManufracture: item.productYear,
      askingPriceDetails: item.askingPrice,
      productType:item.productType,

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
      setSelectedLaserType({value:prodData[0].productType ,label:prodData[0].productType});
     
      setValue('waveLength', formattedProdData[0]?.productWaveLength || '');
      setValue('productYear', formattedProdData[0]?.yearOfManufracture || "");
      setValue('askingPrice', formattedProdData[0]?.askingPriceDetails || "");

      const optionData = (await getLookupProductOption()).map((option) => ({
        ...option,
        active: false,
      }));

      if (prodData[0]?.prodOption) {
        const optionArray = prodData[0]?.prodOption.split(',');
        const productOption = optionData.map((option) => {
          if (optionArray?.includes(option.productOptionId?.toString())) {
            return { ...option, active: 'true' };
          }
          return option;
        });
        setProductOption(productOption);
        productOption.forEach((item) => setValue(item.name, item.active));
        setValue('productOption', optionData || '');
      }
     
    }


  }
  
  const convertToUTC = (date) => {
    const timezoneOffset = date.getTimezoneOffset();
    const utcTimestamp = date.getTime() + (timezoneOffset * 60 * 1000);
    const utcDate = new Date(utcTimestamp);

    return utcDate;
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    if (tabledata) {
      const {
        approvedBy = 0,
        insertedBy = 0,
        sold = false,
        views = 0,
        videoApproved = false,
      } = tabledata;

      setValue('approvedBy', approvedBy || '');
      setValue('insertedBy', insertedBy);
      setValue('sold', sold);
      setValue('views', views);
      setValue('videoApproved', videoApproved);
    }

    setValue('inventoryImageFile', inventoryFiles?.length === 0 ? null : inventoryFiles);
    setValue('userImageFile', userFiles?.length === 0 ? null : userFiles);
    setValue('inventoryImage', inventoryFiles?.length === 0 ? null : inventoryFiles.name);
    setValue('userImage', userFiles?.length === 0 ? null : userFiles.name);

    setValue('productId', selectedProduct?.value);
    setValue('operatorManuals',selectedOPeratorManuals.label);
    setValue('handPieces',selectedOPeratorManuals.label);
    setValue('originalBoxes',selectedOriginalBoxes.label);
    setValue('generalCondition', selectedGeneralCondition?.label ?? '');



    


    const lastServiceDate ="";
    if(eventDatePicker!=undefined){
     
     lastServiceDate = convertToUTC(new Date(eventDatePicker)).toLocaleString();

   }
   setValue('lastServiced', lastServiceDate);
   


    fields.forEach((field) => formData.append(field, getValues(field)));



    try {
      setProcessing(true);
      await updateInventory(id, formData);
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Inventory updated
        </>, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
      }
      );
      setProcessing(false);
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setApiErrors({ data: 'Product add error' });
      } else {
        setApiErrors(err.response ? err.response : { data: err.response });
      }
      setProcessing(false);
    }
  };

  return (
    <FullLayout>
      <div className="table-header py-3">
        <Button color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button>
        <h3 className="sentient-contenttitle x-3" style={{ color: '#4DAC00' }}>Edit Inventory</h3>
      </div>
      <Row>
        <Col md="12" sm="12" lg="12">
          <Card>
            <CardBody>
              <Form onSubmit={handleSubmit(onSubmit)} className="p-3">
                {apiErrors.data ? (
                  <Alert color="danger">
                    <div className="alert-body">
                      <span>{`Error: ${apiErrors.data}`}</span>
                    </div>
                  </Alert>
                ) : <></>}
                <UILoader blocking={isProcessing}>
                  <FormGroup>

                    <FormGroup>
                      <div className="row">
                        <div className="col-sm-2">
                          <Label>
                            Manufacturer *:
                          </Label>
                        </div>
                        <div className="col-sm-6">
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
                        </div>
                      </div>

                    </FormGroup>



                    <FormGroup>
                      <div className="row">
                        <div className="col-sm-2">
                          <Label>
                            Product *:
                          </Label>
                        </div>
                        <div className="col-sm-6">
                          <Select
                            as={Select}
                            options={productCompany}
                            name="productName"
                            value={selectedProduct}
                            isClearable={false}
                            control={control}
                            defaultvalue={selectedProduct || ''}
                            className={`react-select ${classnames({ 'is-invalid': errors && errors.productName })}`}
                            classNamePrefix="select"
                            onChange={(value) => (handleProductChange(value))}
                            {...register('productName').label}
                          />
                        </div>
                        <div className="col-sm-3">
                          {selectedProduct?.value ? (
                            <Link className="d-flex align-items-center" passHref href={`/admin/products/edit/${selectedProduct?.value}`}>
                              <Label style={{ cursor: 'pointer' }}>
                                [ edit product ]
                              </Label>
                            </Link>
                          ) : (
                            <Link className="d-flex align-items-center" passHref href="/#/">
                              <Label style={{ cursor: 'pointer' }}>
                                [ edit product ]
                              </Label>
                            </Link>
                          )}
                        </div>
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <div className="row">
                        <div className="col-sm-2">
                          <Label>
                            Other:
                          </Label>
                        </div>
                        <div className="col-sm-6">
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
                        </div>
                      </div>
                    </FormGroup>
                    <FormGroup>

                      <div className="row">
                        <div className="col-sm-2">
                          <Label>
                            Laser Type *:
                          </Label>
                        </div>
                        <div className="col-sm-6">
                          <Select
                            as={Select}
                            options={laserType}
                            id='type'
                            name="type"
                            value={selectedLaserType}
                            isClearable={false}
                            control={control}
                            defaultvalue={selectedLaserType || ''}
                            placeholder="Laser Type*"
                            className={`react-select ${classnames({ 'is-invalid': errors && errors.type }, 'sentient-content')}`}
                            classNamePrefix="select"
                            onChange={(value) => {
                              setSelectedLaserType(value);
                              setProductTypeErrMsg('');
                            }}
                            style={{ border: '1px solid #646464' }}
                            {...register('type')?.label}
                          />


                        </div>
                      </div>

                    </FormGroup>

                    <FormGroup>
                      <div className="row">
                        <div className="col-sm-2">
                          <Label>
                            waveLength *:
                          </Label>
                        </div>
                        <div className="col-sm-6">
                          <input
                            type="text"
                            placeholder="Wave length *"
                            id="waveLength"
                            name="waveLength"
                            className={classnames({ 'is-invalid': errors && errors.waveLength }, 'form-control sentient-content')}
                            style={{ border: '1px solid #646464' }}
                            {...register('waveLength', { required: true })}
                          />
                        </div>
                      </div>
                    </FormGroup>








                    <div className="row">
                      <div className="col-sm-7">
                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                SKU #:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Input sku"
                                id="sku"
                                name="sku"
                                className={classnames({ 'is-invalid': errors && errors.sku }, 'form-control')}
                                {...register('sku', { required: true })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Year of Manufacture *:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Input productYear"
                                id="productYear"
                                name="productYear"
                                autoComplete='off'
                                onKeyPress={(event) => {
                                  if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }}

                                onPaste={(e) => {
                                  e.preventDefault()
                                  return false;
                                }} onCopy={(e) => {
                                  e.preventDefault()
                                  return false;
                                }}
                                className={classnames({ 'is-invalid': errors && errors.productYear }, 'form-control')}
                                {...register('productYear', { required: true })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Asking Price *:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Input askingPrice"
                                id="askingPrice"
                                name="askingPrice"
                                autoComplete='off'
                                onKeyPress={(event) => {
                                  if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }}
                                onPaste={(e) => {
                                  e.preventDefault()
                                  return false;
                                }} onCopy={(e) => {
                                  e.preventDefault()
                                  return false;
                                }}

                                className={classnames({ 'is-invalid': errors && errors.askingPrice }, 'form-control')}
                                {...register('askingPrice', { required: true })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Best Offer :
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="checkbox"
                                name='bestOffer'
                                id='bestOffer'
                                label='bestOffer'
                                className={classnames('form-check-input')}
                                {...register('bestOffer', { required: false })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Searial Number
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Input serialNumber"
                                id="serialNumber"
                                name="serialNumber"
                                className={classnames({ 'is-invalid': errors && errors.serialNumber }, 'form-control')}
                                {...register('serialNumber', { required: false })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Reason For Selling:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <textarea
                                type="textarea"
                                placeholder="Input reasonForSelling"
                                id="reasonForSelling"
                                name="reasonForSelling"
                                rows={5}
                                className={classnames({ 'is-invalid': errors && errors.reasonForSelling }, 'form-control')}
                                {...register('reasonForSelling', { required: false })}
                              />
                            </div>
                          </div>
                        </FormGroup>
                      </div>

                      <div className="col-sm-5">
                        <FormGroup>
                          <Label>
                            Inventory Image
                          </Label>
                          {inventoryImage && !showDropzoneImage ? (
                            <>
                              <img src={inventoryImage} className="img-fluid " alt="logo" />
                              <Button onClick={() => setShowDropzoneImage(true)} className="btn-sm float-right" color="flat-info">Change</Button>
                            </>
                          ) : (<></>)}

                          {!inventoryImage || showDropzoneImage ? (

                            <Controller
                              control={control}
                              name="inventoryImageFile"
                              render={({ onChange }) => (
                                // <Dropzone
                                //   accept={acceptedImageFormats}
                                //   multiple={false}
                                //   maxFiles={1}
                                //   maxSizeBytes={(1024 * 1024) * 2} // 2MB
                                //   inputContent={(files, extra) => (extra.reject ? `Only ${acceptedImageFormats} allowed` : 'Drop image here or click to browse')}
                                //   styles={{
                                //     dropzoneReject: { borderColor: '#F19373 !important', backgroundColor: '#F1BDAB' },
                                //     inputLabel: (files, extra) => (extra.reject ? { color: '#A02800 !important' } : {}),
                                //   }}
                                //   onChangeStatus={(file, status, allFiles) => {
                                //     handleControlledDropzoneChangeStatusInventory(status, allFiles, onChange);
                                //   }}
                                // />
                                <input type="file" name="myImage" accept=".png, .jpg, .jpeg" onChange={uploadToClient} />
                              )}
                            />

                          ) : (<></>)}
                        </FormGroup>
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>
                          Indicated Uses:
                        </Label>
                      </div>
                    </div>
                    <FormGroup className="form-group row form-row align-items-center">
                      <div className="row p-4 col-12">
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
                      </div>
                    </FormGroup>

                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-7">
                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Active :
                              </Label>
                            </div>
                            <div className="col-sm-1">
                              <input
                                type="checkbox"
                                name='active'
                                id='active'
                                label='active'
                                className={classnames('form-check-input')}
                                {...register('active', { required: false })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Hot Deal:
                              </Label>
                            </div>
                            <div className="col-sm-1">
                              <input
                                type="checkbox"
                                name='hotDeal'
                                id='hotDeal'
                                label='hotDeal'
                                className={classnames('form-check-input')}
                                {...register('hotDeal', { required: false })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Blue Dot :
                              </Label>
                            </div>
                            <div className="col-sm-1">
                              <input
                                type="checkbox"
                                name='blueDot'
                                id='blueDot'
                                label='blueDot'
                                className={classnames('form-check-input')}
                                {...register('blueDot', { required: false })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Include Limited Warranty :
                              </Label>
                            </div>
                            <div className="col-sm-1">
                              <input
                                type="checkbox"
                                name='include30DayWarranty'
                                id='include30DayWarranty'
                                label='include30DayWarranty'
                                className={classnames('form-check-input')}
                                {...register('include30DayWarranty', { required: false })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Approved :
                              </Label>
                            </div>
                            <div className="col-sm-1">
                              <input
                                type="checkbox"
                                name='approved'
                                id='approved'
                                label='approved'
                                className={classnames('form-check-input')}
                                {...register('approved', { required: false })}
                              />
                            </div>
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Accessories:
                              </Label>
                            </div>
                            <div className="col-sm-8">
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

                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Shot/Pulse Count:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Shot/Pulse Count"
                                id="shotPulseCount"
                                name="shotPulseCount"
                                className={classnames({ 'is-invalid': errors && errors.shotPulseCount }, 'form-control sentient-content')}
                                style={{ border: '1px solid #646464' }}
                                {...register('shotPulseCount', { required: false })}
                              />

                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Hour Count:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Hour Count"
                                id="hourCount"
                                name="hourCount"
                                className={classnames({ 'is-invalid': errors && errors.hourCount }, 'form-control sentient-content')}
                                style={{ border: '1px solid #646464' }}
                                {...register('hourCount', { required: false })}
                              />

                            </div>
                          </div>
                        </FormGroup>


                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Handpieces:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Handpieces"
                                id="handPieces"
                                name="handPieces"
                                className={classnames({ 'is-invalid': errors && errors.handPieces }, 'form-control sentient-content')}
                                style={{ border: '1px solid #646464' }}
                                {...register('handPieces', { required: false })}
                              />

                            </div>
                          </div>
                        </FormGroup>



                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                General Condition:
                              </Label>
                            </div>
                            <div className="col-sm-8">
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
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Power Requirements:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              {/* <Select
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
                              /> */}
                               <input
                                type="text"
                                placeholder="Power Requirements"
                                id="powerRequirements"
                                name="powerRequirements"
                                className={classnames({ 'is-invalid': errors && errors.powerRequirements }, 'form-control sentient-content')}
                                style={{ border: '1px solid #646464' }}
                                {...register('powerRequirements', { required: false })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Ownership:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <Select
                                as={Select}
                                options={ownerShip}
                                name="ownerShip"
                                placeholder="Ownership"
                                isDisabled
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
                          </div>
                        </FormGroup>


                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Last Serviced:
                              </Label>
                            </div>
                            <div className="col-sm-8">
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
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Operator Manuals:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <Select
                                as={Select}
                                options={blooleanValue}
                                name="operatorManuals"
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
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Currently Under Factory Warranty:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <Select
                                as={Select}
                                options={blooleanValue}
                                name="cuFactoryWarranty"
                                id="cuFactoryWarranty"
                                isDisabled
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
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Original Boxes/Crate:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <Select
                                as={Select}
                                options={blooleanValue}
                                name="originalBoxes"
                                id="originalBoxes"
                                placeholder="Original Boxes/Crate"
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
                          </div>
                        </FormGroup>






                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Video Link: Enter the full YouTube.com embed code (iFrame code):
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <textarea
                                type="textarea"
                                placeholder=""
                                id="videoLink"
                                name="videoLink"
                                rows={5}
                                className={classnames({ 'is-invalid': errors && errors.videoLink }, 'form-control')}
                                {...register('videoLink', { requreid: false })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Description:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <textarea
                                type="textarea"
                                placeholder=""
                                id="description"
                                name="description"
                                rows={7}
                                className={classnames({ 'is-invalid': errors && errors.description }, 'form-control')}
                                {...register('description', { requreid: false })}
                              />
                            </div>
                          </div>
                        </FormGroup>
                      </div>

                      <div className="col-sm-5">
                        <FormGroup>
                          <Label>
                            User Image
                          </Label>
                          {userImage && !showDropzoneUser ? (
                            <>
                              <img src={userImage} className="img-fluid " alt="logo" />
                              <Button onClick={() => setShowDropzoneUser(true)} className="btn-sm float-right" color="flat-info">Change</Button>
                            </>
                          ) : (<></>)}

                          {!userImage || showDropzoneUser ? (

                            <Controller
                              control={control}
                              name="userImageFile"
                              render={({ onChange }) => (
                                // <Dropzone
                                //   accept={acceptedImageFormats}
                                //   multiple={false}
                                //   maxFiles={1}
                                //   maxSizeBytes={(1024 * 1024) * 20}
                                //   inputContent={(files, extra) => (extra.reject ? `Only ${acceptedImageFormats} allowed` : 'Drop image here or click to browse')}
                                //   styles={{
                                //     dropzoneReject: { borderColor: '#F19373 !important', backgroundColor: '#F1BDAB' },
                                //     inputLabel: (files, extra) => (extra.reject ? { color: '#A02800 !important' } : {}),
                                //   }}
                                //   onChangeStatus={(file, status, allFiles) => {
                                //     handleControlledDropzoneChangeStatusUserImage(status, allFiles, onChange);
                                //   }}
                                // />
                                <input type="file" accept=".png, .jpg, .jpeg" onChange={uploadToUserClient} />
                              )}
                            />

                          ) : (<></>)}
                        </FormGroup>
                      </div>
                    </div>


                  </FormGroup>

                  <div>
                    <Button outline size="sm" type="button" color="primary" onClick={handleButtonClick}>
                      Edit Inventory
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

export default InventoryEdit;
