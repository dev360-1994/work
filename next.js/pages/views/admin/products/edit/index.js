/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import {
  Card, CardBody, Col, FormGroup, Label, Row, Input, Button, Form, Alert, CustomInput,
} from 'reactstrap';

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
import { acceptedImageFormats } from '@src/configs/dropzoneUploader';
import { getLookupProductOption, getProduct, updateProduct } from '@src/api/product.actions';
import { useRouter } from 'next/router';
import FullLayout from '../../../../../src/layouts/FullLayout';
import UILoader from '@src/components/ui-loader';

const ProductEdit = () => {
  const {
    register, errors, handleSubmit, control, setValue, getValues, clearErrors,
  } = useForm();

  const router = useRouter();
  const { id } = router.query || { id: null };

  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);
  const [showDropzone, setShowDropzone] = useState(false);
  const [productImage, setProductImage] = useState();
  const [productOption, setProductOption] = useState([]);

  const [files, setFiles] = useState([]); // product imagefile

  const fields = [
    'productId', 'company', 'productName', 'metaTitle', 'metaKeywords', 'metaDescription', 'type', 'msrp',
    'waveLength', 'energyOutput', 'pulseLength', 'productOptions', 'askingPrice', 'highPrice', 'productImage',
    'description', 'productImageFile', 'approved', 'approvedBy', 'insertBy', 'videoLink', 'createdAt', 'updatedAt',
    'active', 'fluence', 'accessories',
  ];

  const handleControlledDropzoneChangeStatus = (status, allFiles) => {
    setTimeout(() => {
      if (['done', 'removed'].includes(status)) {
        setFiles([...allFiles]);
      }
    }, 0);
  };

  const fetchData = async () => {
    const selectedProduct = await getProduct(id);
    console.log(selectedProduct);
    if(selectedProduct){
      const imageUrl = `${process.env.APP_SERVER_URL}/uploads/products/${selectedProduct.productImage}`;
      setProductImage(imageUrl);

      fields.forEach((field) => setValue(field, selectedProduct[field]));
      // fields.forEach((field) => register(field, selectedProduct[field]));

      const optionData = (await getLookupProductOption()).map((option) => ({
        ...option,
        active: false,
      }));

      if (selectedProduct.productOptions) {
        const optionArray = selectedProduct.productOptions?.split(',');
        const productOption = optionData.map((option) => {
          if (optionArray?.includes(option.productOptionId?.toString())) {
            return { ...option, active: 'true' };
          }
          return option;
        });
        setProductOption(productOption);
        productOption.forEach((item) => setValue(item.name, item.active));
      }
    }

  };

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

     
      console.log("URL.createObjectURL(i)",i);
      setFiles(i);
      //setCreateObjectURL(URL.createObjectURL(i));
    }
  };
  useEffect( () => {
    fetchData();
  }, [id]);

  const onSubmit = async (data) => {
    console.log("inside submit>>>");
    const options = productOption
      .filter((item) => data[item.name] === 'false' || data[item.name] === 'true')
      .map((item) => item.productOptionId)
      .join(',');

    const formData = new FormData();
    // setValue('productImageFile', data.productImage?.[0]?.file ?? null);
    setValue('productImageFile', files?.length === 0 ? null : files);
    setValue('productOptions', options);
    setValue('askingPrice', getValues('askingPrice') || 0);
    setValue('highPrice', getValues('highPrice') ?? 0);
    setValue('insertBy', 0);
    setValue('description', getValues('description') || '');
    setValue('energyOutput', getValues('energyOutput') || '');
    // setValue('askingPrice', getValues('askingPrice') || '');
    fields.forEach((field) => formData.append(field, getValues(field)));

    for (var pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
  }

    try {
      setProcessing(true);
      console.log("formData"+JSON.stringify(formData));
      await updateProduct(id, formData);
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Product updated
        </>, {
          position: 'top-center',
          autoClose: 1000,
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

  const handleButtonClick = () => {
    console.log("SSSSSSSSSSS")
    clearErrors();
    console.log("SSSSSSSSSSS11")
    handleSubmit(onSubmit)();
  };

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

  return (
    <FullLayout>
      <div className="table-header pt-3">
        <Button color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button>
        <h3 className="sentient-contenttitle" style={{ color: '#4DAC00'}}>Edit Product</h3>
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
                          {productImage && !showDropzone ? (
                            <>
                              <img src={productImage} className="img-fluid " alt="logo" />
                              <Button onClick={() => setShowDropzone(true)} className="btn-sm float-right" color="flat-info">Change</Button>
                            </>
                          ) : (<></>)}

                          {!productImage || showDropzone ? (

                            <Controller
                              control={control}
                              name="productImageFile"
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
                          label='active'
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
                    <Button outline size="sm" type="button" color="primary" onClick={handleButtonClick}>
                      Edit Product
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

export default ProductEdit;
