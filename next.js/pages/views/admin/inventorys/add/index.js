/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import {
  Card, CardBody, Col, FormGroup, Label, Row, Input, Button, Form, Alert, CustomInput,
} from 'reactstrap';
import Select from 'react-select';

// ** Router Components
import { useForm, Controller } from 'react-hook-form';
import classnames from 'classnames';
import { CheckCircle } from 'react-feather';
import { toast } from 'react-toastify';
import 'react-dropzone-uploader/dist/styles.css';
import UILoader from '@src/components/ui-loader';

import Dropzone, {
  IFileWithMeta,
  StatusValue,
} from 'react-dropzone-uploader';
import { acceptedImageFormats } from '@src/configs/dropzoneUploader';

import { addInventory } from '@src/api/inventory.actions';
import { getProductActive } from '@src/api/product.actions';
import FullLayout from '../../../../../src/layouts/FullLayout';
import Link from 'next/link';

const InventoryAdd = () => {
  const {
    register, errors, handleSubmit, control, setValue, getValues, clearErrors,
  } = useForm();

  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const [showDropzoneImage, setShowDropzoneImage] = useState(false);
  const [showDropzoneUser, setShowDropzoneUser] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState();
  const [productCompany, setProductCompany] = useState([]);

  const [inventoryFiles, setInventoryFiles] = useState();
  const [userFiles, setUserFiles] = useState();

  const fields = [
    'productName', 'sku', 'productYear', 'askingPrice', 'bestOffer', 'serialNumber', 'reasonForSelling',
    'active', 'hotDeal', 'blueDot', 'include30DayWarranty', 'videoLink', 'description', 'inventoryImageFile',
    'userImageFile', 'approved', 'approvedBy', 'insertedBy', 'sold', 'views',
    'videoApproved', 'userImageApproved', 'notes', 'productId',
  ];

  const handleControlledDropzoneChangeStatusInventory = (status, allFiles) => {
    setTimeout(() => {
      if (['done', 'removed'].includes(status)) {
        setInventoryFiles([...allFiles]);
      }
    }, 0);
  };

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

     
      console.log("URL.createObjectURL(i)",i);
      setInventoryFiles(i);
      //setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const uploadToUserClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

     
      console.log("URL.createObjectURL(i)",i);
      setUserFiles(i);
      //setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const handleControlledDropzoneChangeStatusUserImage = (status, allFiles) => {
    setTimeout(() => {
      if (['done', 'removed'].includes(status)) {
        setUserFiles([...allFiles]);
      }
    }, 0);
  };

  useEffect(() => {
    async function fetchData() {
      const products = await getProductActive({ type: ' ' });
      if(products){
        const minus = '-';
        const data = products?.map((item) => ({
          label: item.productName + minus + item.company,
          value: item.productId ?? '',
        })) ?? [];
    
        if (data && data.length > 0) {
          setProductCompany(data);
          setSelectedProduct(data[0]);
        }
      }      
  
      fields.forEach((field) => setValue(field, ''));

      setValue('active',true);
    }
  
    fetchData();
  }, []);
  

  const handleButtonClick = () => {
    clearErrors();
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    setValue('approved', true);
    setValue('approvedBy', 0);
    setValue('insertedBy', 0);
    setValue('sold', false);
    setValue('views', 0);
    setValue('videoApproved', false);
    setValue('userImageApproved', false);
    setValue('notes', '');
    setValue('productId', selectedProduct.value);

    // setValue('inventoryImageFile', data.inventoryImageFile?.[0]?.file ?? null);
    // setValue('userImageFile', data.userImageFile?.[0]?.file ?? null);
    setValue('inventoryImageFile', inventoryFiles?.length === 0 ? null : inventoryFiles);
    setValue('userImageFile', userFiles?.length === 0 ? null : userFiles);

    setValue('active', getValues('active') || false);
    setValue('bestOffer', getValues('bestOffer') || false);
    setValue('blueDot', getValues('blueDot') || false);
    setValue('hotDeal', getValues('hotDeal') || false);
    setValue('include30DayWarranty', getValues('include30DayWarranty') || false);
    setValue('productYear', getValues('productYear') || 0);


    const dataValue = getValues();
    Object.keys(dataValue).forEach((key) => {
      formData.append(key, dataValue[key]);
    });
    try {
      setProcessing(true);
      await addInventory(formData);
      setProcessing(false);
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Inventory added
        </>, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
        }
      );      
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setApiErrors({ data: 'Inventory add error' });
      } else {
        setApiErrors(err.response ? err.response : { data: err.response});
      }
      setProcessing(false);
    }
  };

  return (
    <FullLayout>
      <div className="table-header p-3">
        <Button color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button>
        <h3 className="sentient-contenttitle" style={{ color: '#4DAC00'}}>Add Inventory</h3>
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
                            className={`react-select ${classnames({ 'is-invalid':errors && errors.productName })}`}
                            classNamePrefix="select"
                            onChange={(value) => (setSelectedProduct(value))}
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
                                Year *:
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
                                onPaste={(e)=>{
                                  e.preventDefault()
                                  return false;
                                }} onCopy={(e)=>{
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
                                onPaste={(e)=>{
                                  e.preventDefault()
                                  return false;
                                }} onCopy={(e)=>{
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
                              <input
                                type="text"
                                placeholder="Input reasonForSelling"
                                id="reasonForSelling"
                                name="reasonForSelling"
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
                          {register.inventoryImageFile && !showDropzoneImage ? (
                            <>
                              <img src={register.inventoryImageFile} className="img-fluid " alt="logo" />
                              <Button onClick={() => setShowDropzoneImage(true)} className="btn-sm float-right" color="flat-info">Change</Button>
                            </>
                          ) : (<></>)}

                          {!register.inventoryImageFile || showDropzoneImage ? (

                            <Controller
                              control={control}
                              name="inventoryImageFile"
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
                                //     handleControlledDropzoneChangeStatusInventory(status, allFiles, onChange);
                                //   }}
                                ///>
                                <input type="file" name="myImage" accept=".png, .jpg, .jpeg"  onChange={uploadToClient} />
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
                            <div className="col-sm-2">
                              <input
                                type="checkbox"
                                id="active"
                                name="active"
                                checked="true"
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
                      </div>

                      <div className="col-sm-5">
                        <FormGroup>
                          <Label>
                            User Image
                          </Label>
                          {register.userImageFile && !showDropzoneUser ? (
                            <>
                              <img src={register.userImageFile} className="img-fluid " alt="logo" />
                              <Button onClick={() => setShowDropzoneUser(true)} className="btn-sm float-right" color="flat-info">Change</Button>
                            </>
                          ) : (<></>)}

                          {!register.userImageFile || showDropzoneUser ? (

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
                                <input type="file" name="myImage"  accept=".png, .jpg, .jpeg"  onChange={uploadToUserClient} />

                              )}
                            />

                          ) : (<></>)}
                        </FormGroup>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-6">
                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Description
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <textarea
                                type="textarea"
                                placeholder=""
                                id="description"
                                name="description"
                                rows={5}
                                className={classnames({ 'is-invalid': errors && errors.description }, 'form-control')}
                                {...register('description', { requreid: false })} 
                              />
                            </div>
                          </div>
                        </FormGroup>
                      </div>
                    </div>
                  </FormGroup>

                  <div>
                    <Button outline size="sm" type="button" color="primary" onClick={handleButtonClick}>
                      Add Inventory
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

export default InventoryAdd;
