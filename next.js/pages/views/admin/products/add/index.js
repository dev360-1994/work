/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import {
  Card, CardBody, Col, FormGroup, Label, Row, Input, Button, Form, Alert, CustomInput,
} from 'reactstrap';

import { useForm, Controller } from 'react-hook-form';
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
import { acceptedImageFormats } from '@src/configs/dropzoneUploader';
import { addProduct, getLookupProductOption } from '@src/api/product.actions';
import FullLayout from '@src/layouts/FullLayout';
import UILoader from '@src/components/ui-loader';
const ProductAdd = () => {
  const {
    register, errors, handleSubmit, control, setValue, getValues, clearErrors,
  } = useForm();

  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);
  const [showDropzone, setShowDropzone] = useState(false);
  const [productOption, setProductOption] = useState([]);

  const [files, setFiles] = useState(null);

  const fields = [
    'productId', 'company', 'productName', 'metaTitle', 'metaKeywords', 'metaDescription', 'type', 'msrp',
    'waveLength', 'energyOutput', 'pulseLength', 'productOptions', 'askingPrice', 'highPrice', 'productImageFile',
    'description', 'approved', 'approvedBy', 'insertBy', 'videoLink', 'createdAt', 'updatedAt', 'active',
    'fluence', 'accessories',
  ];




  

  
  

  const handleControlledDropzoneChangeStatus =  (status, allFiles) => {
   
      console.log("<<<>>>>>>>>>>>>",allFiles[0]);
      const i = allFiles[0];
      console.log("<>>>>>>>>>>>>>>>>>>>>"+i);
      setFiles(i);
      
      //setFiles(allFiles[0]);
  
    // setTimeout(() => {
    //   if (['done', 'removed'].includes(status)) {
    //     setFiles(...allFiles);
    //   }
    // }, 0);

    console.log("<<<<<<<<<<<"+files)
  };

  useEffect(() => {
    const fetchData = async () => {
      fields.forEach((field) => setValue(field, ''));
      fields.forEach((field) => register(field, ''));
  
      const optionData = await getLookupProductOption();
      setProductOption(optionData);
      setValue('productOption', optionData);
    };
  
    fetchData();
  }, []);
  

  const DynamicProduct = () => (
    <>
      <Label>
        Indicated Uses:
      </Label>

      <FormGroup>
        <div className="row col-12 px-5">
          {productOption.map((item) => (
            <div className="col-sm-6" key={item.productOptionId}>
              <input                
                type="checkbox"
                name={item.name}
                value={item.active}
                id={item.productOptionId}
                label={item.name}
                className={classnames('form-check-input')}
                {...register(item.name, { required: false })}
              /> &nbsp;
              <Label className="sentient-content">{item.name}</Label>
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
  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

     
      console.log("URL.createObjectURL(i)",i);
      setFiles(i);
      //setCreateObjectURL(URL.createObjectURL(i));
    }
  };
  const onSubmit = async (data) => {
    const options = productOption
      .filter((item) => data[item.name] === 'true')
      .map((item) => item.productOptionId)
      .join(',');

    const formData = new FormData();
   
    setValue('insertBy', 0);
   // setValue('askingPrice', 0);
    setValue('highPrice', 0);
    setValue('productOptions', options);
    setValue('productImageFile', files?.length === 0 ? null : files);

    setValue('active', getValues('active') || false);
    setValue('approved', getValues('approved') || false);
    //setValue('metaTitle', getValues('metaTitle') || '');
    setValue('description', getValues('description') || '');
    setValue('energyOutput', getValues('energyOutput') || '');
    setValue('askingPrice', getValues('askingPrice') || 0);


    fields.forEach((field) => formData.append(field, getValues(field)));
    try {
      setProcessing(true);
      await addProduct(formData);
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Product added
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
      <div className="table-header px-3 pt-3">
        <Button color="flat-light px-3 p-3" onClick={() => window.history.back()}>
          &lt; back to list
        </Button>
        <h3 className="sentient-contenttitle" style={{ color: '#4DAC00'}}>Add Product</h3>
      </div>
      <Row>
        <Col md="12" sm="12" lg="12" className="px-3">
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
                    <div className="row">
                      <div className="col-sm-8">
                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Product *:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Input productName"
                                id="productName"
                                name="productName"
                                className={classnames({ 'is-invalid': errors && errors.productName }, 'form-control')}
                                {...register('productName', { required: true })} 
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Company *:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Input company"
                                id="company"
                                name="company"
                                className={classnames({ 'is-invalid': errors && errors.company }, 'form-control')}
                                {...register('company', { required: true })} 
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Type:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Input type"
                                id="type"
                                name="type"
                                className={classnames({ 'is-invalid': errors && errors.type }, 'form-control')}
                                {...register('type', { required: false })} 
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                WaveLength:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Input waveLength"
                                id="waveLength"
                                name="waveLength"
                                className={classnames({ 'is-invalid': errors && errors.waveLength }, 'form-control')}
                                {...register('waveLength', { required: false })} 
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Fluence (J/cm2):
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Input fluence"
                                id="energyOutput"
                                name="energyOutput"
                                className={classnames({ 'is-invalid': errors && errors.energyOutput },'form-control')}
                                {...register('energyOutput', { required: false })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                Pulse Length (ms) or Rep Rate(Hz):
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Input pulseLength"
                                id="pulseLength"
                                name="pulseLength"
                                className={classnames({ 'is-invalid': errors && errors.pulseLength }, 'form-control')}
                                {...register('pulseLength', { required: false })}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-sm-4">
                              <Label>
                                MSRP:
                              </Label>
                            </div>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                placeholder="Input msrp"
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
                                {...register('askingPrice', { required: false })}
                              />
                            </div>
                          </div>
                        </FormGroup>
                      </div>

                      <div className="col-sm-4">
                        <FormGroup>
                          <Label>
                            Image Logo
                          </Label>
                          {register.productImageFile && !showDropzone ? (
                            <>
                              <img src={register.productImageFile} className="img-fluid " alt="logo" />
                              <Button onClick={() => setShowDropzone(true)} className="btn-sm float-right" color="flat-info">Change</Button>
                            </>
                          ) : (<></>)}

                         


                          {!register.productImageFile || showDropzone ? (

                            <Controller
                              control={control}
                              name="productImageFile"
                              id="myfile"
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
                                //     handleControlledDropzoneChangeStatus(status, allFiles, onChange);
                                //   }}
                                  
                                // />
                                <input type="file" name="myImage" accept=".png, .jpg, .jpeg"  onChange={uploadToClient} />
                              )}
                            />

                          ) : (<></>)}
                        </FormGroup>
                      </div>
                    </div>
                  </FormGroup>

                  {DynamicProduct()}

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>
                          Active :
                        </Label>
                      </div>
                      <div className="col-sm-1">
                        <input
                          type="checkbox"
                          name='active'
                          id='active'
                         checked="true"
                          className={classnames('form-check-input')}
                          {...register('active', { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
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
                      <div className="col-sm-12">
                        <Label>
                          Video Link: Enter the full YouTube.com embed code (iFrame code):
                        </Label>
                      </div>
                      <div className="col-sm-12">
                        <textarea
                          type="textarea"
                          placeholder=""
                          id="videoLink"
                          name="videoLink"
                          rows={5}
                          className={classnames({ 'is-invalid': errors && errors.videoLink }, 'form-control')}
                          {...register('videoLink', { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-3">
                        <Label>
                          Accessories/Comments
                        </Label>
                      </div>
                      <div className="col-sm-9">
                        <textarea
                          type="textarea"
                          placeholder=""
                          id="description"
                          name="description"
                          rows={5}
                          className={classnames({ 'is-invalid': errors && errors.description }, 'form-control')}
                          {...register('description', { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <div>
                    <Button outline size="sm" type="button" onClick={handleButtonClick} color="primary">
                      Add Product
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

export default ProductAdd;
