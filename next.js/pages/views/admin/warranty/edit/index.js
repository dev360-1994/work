/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import {
  Card, CardBody, Col, FormGroup, Label, Row, Input, Button, Form, Alert, CustomInput,
} from 'reactstrap';
import Select from 'react-select';
import ReactPlayer from 'react-player'


// ** Router Components
import { useForm, Controller } from 'react-hook-form';

// ** Third Party Components
import classnames from 'classnames';

import {
  CheckCircle,
} from 'react-feather';
import { toast } from 'react-toastify';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone, {
  IFileWithMeta,
  StatusValue,
} from 'react-dropzone-uploader';
import Flatpickr from 'react-flatpickr';
import { acceptedImageFormats } from '@src/configs/dropzoneUploader';
import { getWarranty, updateWarranty } from '@src/api/warranty.actions';
import { blooleanValue, modeContactValue } from '@src/components/contactComponents';
import Link from 'next/link';
import { useRouter } from 'next/router';
import FullLayout from '@src/layouts/FullLayout'
import UILoader from '@src/components/ui-loader';
import 'flatpickr/dist/themes/light.css';
import {
  getBuySearch, getCompanyManufacturer, getPriceRange, getProductModel,
} from '@src/api/buy.action';

const WarrantyEdit = () => {
  const {
    register, errors, handleSubmit, control, setValue, getValues, clearErrors, reset,
  } = useForm();

  const router = useRouter();
  //const { id } = router.query;
  var id='';
  if(router.asPath.split("/").length>1){
    console.log("array",router.asPath.split("/"));
    id=router.asPath.split("/")[4];
    console.log("type>>"+id)
  }



  console.log("router.query"+router.asPath)

  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const [eventDatePicker, setEventDatePicker] = useState();
  const [contactDatePicker, setContactDatePicker] = useState();

  const [selectedIsCuWarranty, setSelectedIsCuWarranty] = useState(blooleanValue[0]);
  const [selectedModeContact, setSelectedModeContact] = useState(modeContactValue[0]);

  const [showDropzoneImage, setShowDropzoneImage] = useState(false);
  const [company, setCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);


  const [selectedWarranty, setSelectedWarranty] = useState([]);

  const [productImage, setProductImage] = useState();
  const [productImageType, setProductImageType] = useState('');
  const [prodList, setProdList] = useState([]);
  const [product, setProduct] = useState([]);
  const [files, setFiles] = useState('');
  const [dynamicError, setDynamicError] = useState('');
  const [dynamicError1, setDynamicError1] = useState('');
  const [productErrMsg, setproductErrMsg] = useState('');
  const [dynamicError2, setDynamicError2] = useState('');
  const [modelErrMsg, setModelErrMsg] = useState('');

  


  const fields = [
    'manufacturer', 'model', 'year', 'issues', 'description', 'productImage','productIamgeFile',
    'lastServiceDate', 'lastServiceAction', 'recentServiceUserName', 'isUnderWarranty', 
    'warrantyPlanPeriod', 'underWarrantyUserName', 'warrantyPlanCost', 'preferredContactMode', 'preferredContactTime', 'active',
  ];

  const handleControlledDropzoneChangeStatusWarranty = (status, allFiles) => {
    setTimeout(() => {
      if (['done', 'removed'].includes(status)) {
       // setFiles([...allFiles]);
      }
    }, 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWarranty(id);
      console.log("warranty response>>>"+JSON.stringify(data));
      if (data) {
        setSelectedWarranty(data || []);
      }

      const companyModelData = await getCompanyManufacturer({ type: 1 });
      //console.log("<<<<<<<<<<<<<ManuFacture Data>>>>>>>>>>>>>>>>>>>" + JSON.stringify(companyModelData));
      const modelDataCompany = companyModelData?.map((item, index) => ({
        label: item.companyName,
        value: item.cnt ?? '',
      })) ?? [];

      if (modelDataCompany && modelDataCompany.length > 0) {
        setCompany(modelDataCompany);
        const setManfactute = modelDataCompany.filter((item) => item.label === data.manufacturer);
        console.log("setManfactute",setManfactute);
        setSelectedCompany(setManfactute[0] || []);
      }

      const prodList = await getBuySearch({ companyName: data.manufacturer });

      const minus = '-';
      const prodData1 = prodList?.map((item, index) => ({
  
        label: item.productModel,  //+minus+ item.productType
        value: item.productId,
        //prodOption: item.productOptionIds,
      })) ?? [];

      const prodData = prodData1.reduce((arr, item) => {
        const prodData= arr.filter(i => i['value'] !== item['value']);
        return [...prodData, item];
    }, []);
      if (prodData && prodData.length > 0) {
        setProdList(prodData);
        console.log("prodData",JSON.stringify(prodData));
        const setModel = prodData.filter((item) => item.value == parseInt(data.model));
        console.log("setModel",setModel);
        setProduct(setModel[0] || []);
      }

    };

    fetchData();
  }, [id]);

  const convertToUTC = (date) => {
    const timezoneOffset = date.getTimezoneOffset();
    const utcTimestamp = date.getTime() + (timezoneOffset * 60 * 1000);
    const utcDate = new Date(utcTimestamp);
    return utcDate;
  };

  const handleCompanyChange = async (event) => {
    const arrList = [];
    //console.log("VAlueeeeeeeee"+value.label);
    setSelectedCompany(event);

    const prodList = await getBuySearch({ companyName: event.label }) || [];

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

  const convertToLocal = (date) => {
    const newDate = new Date(date.getTime());
    const offset = date.getTimezoneOffset() / 60;
    const hours = date.getHours();
    const minutes = date.getMinutes();

    newDate.setMinutes(minutes+30);
    return newDate;
  };

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

     
      console.log("URL.createObjectURL(i)",i);
      setFiles(i);
      //setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  useEffect(() => {

    console.log("productImage>>>"+selectedWarranty.productImage);
    if (selectedWarranty) {
      if(selectedWarranty.productImage!=undefined){
      const productImage1=selectedWarranty.productImage.toString();
      var arr=productImage1.split('.');
        if(arr[1]==="mp4" || arr[1]==="mp3"){
        setProductImageType('video')
        }else{
          setProductImageType('image');
        }
        console.log("<<<<<<<<<<>>>>>>>>>>>>>>"+productImageType);
      }
      const imageUrlInventory = `${process.env.APP_SERVER_URL}/uploads/warranties/${selectedWarranty.productImage}`;
      setProductImage(imageUrlInventory);
      console.log("productImage>>>"+productImage);

      const localDate = convertToLocal(new Date(selectedWarranty.lastServiceDate));
      selectedWarranty.lastServiceDate = localDate.toLocaleString();

      const preferredContactTime1 = convertToLocal(new Date(selectedWarranty.preferredContactTime));
      selectedWarranty.preferredContactTime = preferredContactTime1.toLocaleString();

      fields.forEach((field) => setValue(field, selectedWarranty[field]));
      // fields.forEach((field) => register(field, selectedWarranty[field]));

      setEventDatePicker(new Date(selectedWarranty.lastServiceDate));
      setContactDatePicker(new Date(selectedWarranty.preferredContactTime));
      selectedWarranty.isUnderWarranty === true ? setSelectedIsCuWarranty(blooleanValue[0]) : setSelectedIsCuWarranty(blooleanValue[1]);
      selectedWarranty.preferredContactMode === 'Email' ? setSelectedModeContact(modeContactValue[0]) : selectedWarranty.preferredContactMode === 'Phone' ? setSelectedModeContact(modeContactValue[1]) : setSelectedModeContact(modeContactValue[2]);

    }
  }, [selectedWarranty,productImageType]);

  const onSubmit = async () => {
    const formData = new FormData();

    const lastServiceDate = convertToUTC(new Date(eventDatePicker)).toLocaleString();
    const preferredContacttime = convertToUTC(new Date(contactDatePicker)).toLocaleString();




  console.log("data11"+lastServiceDate);
  console.log("data222222"+preferredContacttime);
  console.log("selectedModeContact"+selectedModeContact?.label);
  
  if(product?.value==undefined){
    
    setproductErrMsg("Please select Manufacturer");
    setDynamicError('');
    setDynamicError1('');
    setDynamicError2('');
    setModelErrMsg('');
    window.scrollTo(0, 0)
    return;
   } else if(product?.value==undefined){
    
    setModelErrMsg("Please select Model");
    setDynamicError('');
    setDynamicError1('');
    setproductErrMsg('');
    setDynamicError2('');
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
    setModelErrMsg('');


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
    setModelErrMsg('');

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
    setModelErrMsg('');


    return;
  }else{
    setDynamicError('');
    setDynamicError1('');
    setproductErrMsg('');
    setDynamicError2('');
    setModelErrMsg('');


  }
   
    
    
    setValue('lastServiceDate', lastServiceDate);
    setValue('preferredContactTime', preferredContacttime);
    setValue('isUnderWarranty', selectedIsCuWarranty.label === 'Yes');
    setValue('preferredContactMode', selectedModeContact.label);
    setValue('underWarrantyUserName', getValues('underWarrantyUserName') === '' ? ' ' : getValues('underWarrantyUserName'));
    
    setValue('manufacturer',selectedCompany?.label || '');
    setValue('model',product?.value || '');
    setValue('productIamgeFile', files?.length === 0 ? null : files);
    console.log(getValues())
    fields.forEach((field) => formData.append(field, getValues(field)));
   

   
    try {
      setProcessing(true);
      await updateWarranty(id, formData);
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Warranty updated
        </>, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
        }
      );
      setProcessing(false);
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setApiErrors({ data: 'Warranty add error' });
      } else {
        setApiErrors(err.response ? err.response : { data: err.response });
      }
      setProcessing(false);
    }
  };

  const handleButtonClick = () => {
    clearErrors();
    handleSubmit(onSubmit)();
  };

  return (
    <FullLayout>
      <div className="table-header pt-3">
        <Button color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button>
        <h3 className="sentient-contenttitle px-3" style={{ color: '#4DAC00'}}>Edit Warranty</h3>
      </div>
      <Row className="p-3">
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

                       /><span style={{ fontWeight: 'bold', color: 'red' }}>{productErrMsg}</span>


                          
                        </div>
                        <div className="col-sm-3 d-flex align-items-center">
                          {selectedWarranty?.contactId ? (
                            <Link className="d-flex align-items-center" passHref href={`/admin/contacts/edit/${selectedWarranty?.contactId}`}>
                              <Label style={{ cursor: 'pointer' }}>
                                [ edit Contact ]
                              </Label>
                            </Link>
                          ) : (
                            <Link className="d-flex align-items-center" passHref href="/#/">
                              <Label style={{ cursor: 'pointer' }}>
                                [ edit Contact ]
                              </Label>
                            </Link>
                          )}
                        </div>
                      </div>
                    </FormGroup>

                    <div className="row">
                      <div className="col-sm-7">
                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Model *:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                            
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
                      <span style={{ fontWeight: 'bold', color: 'red' }}>{modelErrMsg}</span>
                             
                    </div>
                  </div>
              </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Year *:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Year of Manufacture"
                                id="year"
                                name="year"
                                autoComplete='off'
                                onKeyPress={(event) => {
                                  if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }}
                                onPaste={(e)=>{
                                  e.preventDefault()
                                  return false;
                                }} onCopy={(e)=>{
                                  e.preventDefault()
                                  return false;
                                }}
                                className={classnames({ 'is-invalid': errors && errors.year }, 'form-control')}
                                {...register('year', { required: true })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Issues / Error Codes *:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Issues / Error Codes"
                                id="issues"
                                name="issues"
                                className={classnames({ 'is-invalid': errors && errors.issues }, 'form-control')}
                                {...register('issues', { required: true })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Description *:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <textarea
                                type="textarea"
                                placeholder="Description"
                                id="description"
                                name="description"
                                rows={5}
                                className={classnames({ 'is-invalid': errors && errors.description }, 'form-control')}
                                {...register('description', { required: true })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Date of last service *
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <Flatpickr
                                value={eventDatePicker}
                                placeholder="Date of last service"
                                id="lastServiceDate"
                                name="lastServiceDate"
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
                              <span style={{ fontWeight: 'bold', color: 'red' }}>{dynamicError}</span>
                            </div>
                          </div>
                        </FormGroup>

                       
                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label >
                                Is your device currently under warranty ? 
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <Select
                                as={Select}
                                options={blooleanValue}
                                name="isUnderWarranty"
                                placeholder="Is your device currently under warranty?"
                                isClearable={false}
                                control={control}
                                className={`react-select ${classnames({ 'is-invalid': errors && errors.isUnderWarranty }, 'sentient-content')}`}
                                classNamePrefix="select"
                                defaultValue={blooleanValue[0]}
                                value={selectedIsCuWarranty}
                                onChange={(value) => (setSelectedIsCuWarranty(value))}
                                style={{ border: '1px solid #646464' }}
                                {...register('isUnderWarranty').label} 
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                With whom is the device under warranty ? *
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                id="underWarrantyUserName"
                                name="underWarrantyUserName"
                                placeholder="With whom is the device under warranty?"
                                className={classnames({ 'is-invalid': errors && errors.underWarrantyUserName }, 'form-control sentient-content')}
                                {...register('underWarrantyUserName', { required: true })}
                                style={{ border: '1px solid #646464' }}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Length of current warranty plan *
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Length of current warranty plan"
                                id="warrantyPlanPeriod"
                                name="warrantyPlanPeriod"
                                className={classnames({ 'is-invalid': errors && errors.warrantyPlanPeriod }, 'form-control')}
                                {...register('warrantyPlanPeriod', { required: true })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Cost of current warranty plan *
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Cost of current warranty plan"
                                id="warrantyPlanCost"
                                name="warrantyPlanCost"
                                className={classnames({ 'is-invalid': errors && errors.warrantyPlanCost }, 'form-control')}
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
                                {...register('warrantyPlanCost', { required: true })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Preferred mode of contact *
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <Select
                                as={Select}
                                options={modeContactValue}
                                name="preferredContactMode"
                                placeholder="Preferred mode of contact"
                                isClearable={false}
                                control={control}
                                className={`react-select ${classnames({ 'is-invalid': errors && errors.preferredContactMode }, 'sentient-content')}`}
                                classNamePrefix="select"
                                defaultValue={blooleanValue[0]}
                                value={selectedModeContact}
                                onChange={(value) => (setSelectedModeContact(value))}
                                style={{ border: '1px solid #646464' }}
                                {...register('preferredContactMode').label}
                              />
                              <span style={{ fontWeight: 'bold', color: 'red' }}>{dynamicError2}</span>
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Preferred time of contact (default Eastern Standard Time) *
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <Flatpickr
                                value={contactDatePicker}
                                id="preferredContactTime"
                                name="preferredContactTime"
                                placeholder="Preferred time of contact (default Eastern Standard Time)"
                                onChange={(date) => { setContactDatePicker(date[0]); }}
                                style={{ border: '1px solid #646464' }}
                                className={`form-control ${classnames({ 'is-invalid': errors && errors.preferredContactTime })}`}
                                rules={{ required: true }}
                                options={{
                                  mode: 'single',
                                  dateFormat: 'Y-m-d H:i:S',
                                  enableTime: true, // Enable manual time input
                                }}
                              />
                              <span style={{ fontWeight: 'bold', color: 'red' }}>{dynamicError1}</span>
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                What was performed last service ? *
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="What was performed at last service ?"
                                id="lastServiceAction"
                                name="lastServiceAction"
                                className={classnames({ 'is-invalid': errors && errors.lastServiceAction }, 'form-control')}
                                {...register('lastServiceAction', { required: true })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Who serviced the device most recently ? *
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Who serviced the device most recently ?"
                                id="recentServiceUserName"
                                name="recentServiceUserName"
                                className={classnames({ 'is-invalid': errors && errors.recentServiceUserName }, 'form-control')}
                                {...register('recentServiceUserName', { required: true })}
                              />
                            </div>
                          </div>
                        </FormGroup>


                      </div>

                      <div className="col-sm-5">
                        <FormGroup>
                          <Label>
                            product Image/Video
                          </Label>
                          {productImage && !showDropzoneImage ? (
                            <>
                             {/* <  */}
                             {productImageType==="image" && (
                             <img src={productImage} className="img-fluid " alt="logo" />
                             )}
                               {productImageType==="video" && (
                              <ReactPlayer url={productImage} width="60%" height="30%" controls={true} />  
                              )}
                              <Button onClick={() => setShowDropzoneImage(true)} className="btn-sm float-right" color="flat-info">Change</Button>
                                   
                            
                            </>
                          ) : (<></>)}

                          {!productImage || showDropzoneImage ? (

                            <Controller
                              control={control}
                              name="ProductIamgeFile"
                              render={({ onChange }) => (
                                // <Dropzone
                                //   accept={acceptedImageFormats}
                                //   multiple={false}
                                //   maxFiles={1}
                                //   maxSizeBytes={(1024 * 1024) * 20} // 2MB
                                //   inputContent={(files, extra) => (extra.reject ? `Only ${acceptedImageFormats} allowed` : 'Drop image here or click to browse')}
                                //   styles={{
                                //     dropzoneReject: { borderColor: '#F19373 !important', backgroundColor: '#F1BDAB' },
                                //     inputLabel: (files, extra) => (extra.reject ? { color: '#A02800 !important' } : {}),
                                //   }}
                                //   onChangeStatus={(file, status, allFiles) => {
                                //     handleControlledDropzoneChangeStatusWarranty(status, allFiles, onChange);
                                //   }}
                                // />
                                <input type="file" name="myImage"  accept=".png, .jpg, .jpeg"  onChange={uploadToClient} />

                              )}
                            />

                          ) : (<></>)}
                        </FormGroup>
                      </div>
                    </div>
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

                      </div>
                    </div>
                  </FormGroup>

                  <div>
                    <Button outline size="sm" type="button" color="primary" onClick={handleButtonClick}>
                      Edit Warranty
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

export default WarrantyEdit;
