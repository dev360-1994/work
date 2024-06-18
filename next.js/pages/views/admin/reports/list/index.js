import { useState } from 'react';
import {
  Card, CardBody, Col, FormGroup, Label, Row, Button, Form, Alert, CustomInput,
} from 'reactstrap';
import Select from 'react-select';
import FullLayout from '@src/layouts/FullLayout'

// ** Router Components
import { useForm, Controller } from 'react-hook-form';

// ** Third Party Components
import classnames from 'classnames';

import { toast } from 'react-toastify';
import 'react-dropzone-uploader/dist/styles.css';

import Flatpickr from 'react-flatpickr';
//import '@styles/react/libs/flatpickr/flatpickr.scss';
import 'flatpickr/dist/themes/material_green.css';


import {
  Calendar,
  CheckCircle,
} from 'react-feather';

// import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { getReportContact, getReportInventory, getReportProduct } from '@src/api/report.actions';
import { useRouter } from 'next/router';

const ReportContact = () => {
  const {
    register, errors, handleSubmit, control,
  } = useForm();

  const router = useRouter();
  const { type } = router.query;   

  const [contactType, setContactType] = useState([
    { value: 'all', label: 'ALL' },
    { value: 'buyer offer', label: 'Buyer Offer' },
    { value: 'buyer question', label: 'Buyer Questions' },
    { value: 'standard questions', label: 'Standard Questions' },
    { value: 'sell', label: 'Sellers' },
    { value: 'lease', label: 'Lease' },
    { value: 'watchlist', label: 'WatchLists' },
  ]);
  const [selectedContactType, setSelectedContactType] = useState(contactType[0]);

  const [inventoryType, setInventoryType] = useState([
    { value: '1', label: 'all active' },
    { value: '0', label: 'all inactive' },
  ]);
  const [selectedInventoryType, setSelectedInventoryType] = useState(inventoryType[0]);

  const [apiErrors, setApiErrors] = useState({});
  const [startPicker, setStartPicker] = useState();
  const [endPicker, setEndPicker] = useState();

  const getContactReport = async (data) => {
    if (startPicker === undefined || endPicker === undefined) {
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Select date.
        </>, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
        }
      );
      return;
    }

    data.startDate = `${startPicker.getFullYear()}-${startPicker.getMonth() + 1}-${startPicker.getDate()}`;
    data.endDate = `${endPicker.getFullYear()}-${endPicker.getMonth() + 1}-${endPicker.getDate()}`;
    data.type = selectedContactType.value;
    data.contactType = selectedContactType.value;
    data.fullName = data.fullName ? 1 : 0;
    data.companyName = data.companyName ? 1 : 0;
    data.address = data.address ? 1 : 0;
    data.email = data.email ? 1 : 0;
    data.phone = data.phone ? 1 : 0;
    data.sku = data.sku ? 1 : 0;
    data.comments = data.comments ? 1 : 0;

    try {
      await getReportContact(data);
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Contact report file created.
        </>, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
        }
      );
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setApiErrors({ data: 'Product add error' });
      } else {
        setApiErrors(err.response ? err.response : { data: err.response });
      }
    }
  };

  const getProductReport = async (data) => {
    if (startPicker === undefined || endPicker === undefined) {
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Select date.
        </>, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
        }
      );
      return;
    }

    data.startDate = `${startPicker.getFullYear()}-${startPicker.getMonth() + 1}-${startPicker.getDate()}`;
    data.endDate = `${endPicker.getFullYear()}-${endPicker.getMonth() + 1}-${endPicker.getDate()}`;

    data.companyName = data.companyName === true ? 1 : 0;
    data.productModel = data.productModel === true ? 1 : 0;
    data.type = data.type === true ? 1 : 0;
    data.waveLength = data.waveLength === true ? 1 : 0;
    data.description = data.description === true ? 1 : 0;
    try {
      await getReportProduct(data);
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Product report file created.
        </>, {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        }
      );
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setApiErrors({ data: 'Product add error' });
      } else {
        setApiErrors(err.response ? err.response : { data: err.response });
      }
    }
  };

  const getInventoryReport = async (data) => {
    if (startPicker === undefined || endPicker === undefined) {
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Select date.
        </>, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
        }
      );
      return;
    }

    data.startDate = `${startPicker.getFullYear()}-${startPicker.getMonth() + 1}-${startPicker.getDate()}`;
    data.endDate = `${endPicker.getFullYear()}-${endPicker.getMonth() + 1}-${endPicker.getDate()}`;

    data.active = selectedInventoryType.value;
    data.contactFullName = data.contactFullName === true ? 1 : 0;
    data.contactCompanyName = data.contactCompanyName === true ? 1 : 0;
    data.contactAddress = data.contactAddress === true ? 1 : 0;
    data.contactEmail = data.contactEmail === true ? 1 : 0;
    data.contactPhone = data.contactPhone === true ? 1 : 0;
    data.sku = data.sku === true ? 1 : 0;
    data.contactComments = data.contactComments === true ? 1 : 0;
    data.productCompany = data.productCompany === true ? 1 : 0;
    data.productModel = data.productModel === true ? 1 : 0;
    data.productYear = data.productYear === true ? 1 : 0;
    data.include30DayWarranty = data.include30DayWarranty === true ? 1 : 0;

    try {
      await getReportInventory(data);
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Inventory report file created.
        </>, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
        }
      );
    } catch (err) {
      if (err.response && err.response.status === 500) {
        // setApiErrors({ data: 'Product add error' });
      } else {
        setApiErrors(err.response ? err.response : { data: err.response });
      }
    }
  };

  const onSubmit = async (data) => {
    if (type === 'contact') {
      getContactReport(data);
    } else if (type === 'product') {
      getProductReport(data);
    } else {
      getInventoryReport(data);
    }
  };

  const ContactReport = () => (
    <>
      <FormGroup>
        <div className="row">
          <div className="col-sm-3">
            <Label>
              Contact Type:
            </Label>
          </div>
          <div className="col-sm-6">
            <Select
              as={Select}
              style={{ menu: (provided) => ({ ...provided, zIndex: 9999 }) }}
              options={contactType}
              name="type"
              value={selectedContactType}
              isClearable={false}
              control={control}
              defaultvalue={selectedContactType || ''}
              className={`react-select ${classnames({ 'is-invalid':errors && errors.type })}`}
              classNamePrefix="select"
              onChange={(value) => (setSelectedContactType(value))}
              {...register('type').label}
            />
          </div>
        </div>
      </FormGroup>
      <FormGroup>
        <div className="row">
          <div className="col-sm-3">
            <Label>
              Starting Date:
            </Label>
          </div>
          <div className="col-sm-7 d-flex align-items-center">
            <Flatpickr
              value={startPicker}
              id="startDate"
              name="startDate"
              onChange={(date) => { setStartPicker(date[0]); }}
              className={`form-control ${classnames({ 'is-invalid': errors && errors.startDate })}`}
              rules={{ required: true }}
              options={{
                mode: 'single',
              }}
            />
            <Calendar size={22} className="ml-1" />
          </div>
        </div>
      </FormGroup>
      <FormGroup>
        <div className="row">
          <div className="col-sm-3">
            <Label>
              Ending Date:
            </Label>
          </div>
          <div className="col-sm-7 d-flex align-items-center">
            <Flatpickr
              value={endPicker}
              id="endDate"
              name="endDate"
              className={`form-control ${classnames({ 'is-invalid': errors && errors.endDate })}`}
              onChange={(date) => { setEndPicker(date[0]); }}
              rules={{ required: true }}
              options={{
                mode: 'single',
              }}
            />
            <Calendar size={22} className="ml-1" />
          </div>
        </div>
      </FormGroup>
      <FormGroup>
        <div className="row">
          <div className="col-sm-3">
            <Label>
              Fields:
            </Label>
          </div>
          <div className="col-sm-8">
            <div className="row">
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='fullName'
                  id='fullName'
                  label='fullName'
                  className={classnames('form-check-input')}
                  {...register('fullName', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Name
                </Label>
              </div>
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='companyName'
                  id='companyName'
                  label='companyName'
                  className={classnames('form-check-input')}
                  {...register('companyName', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Company Name
                </Label>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='address'
                  id='address'
                  label='address'
                  className={classnames('form-check-input')}
                  {...register('address', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Address
                </Label>
              </div>
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='email'
                  id='email'
                  label='email'
                  className={classnames('form-check-input')}
                  {...register('email', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Email
                </Label>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='phone'
                  id='phone'
                  label='phone'
                  className={classnames('form-check-input')}
                  {...register('phone', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Phone
                </Label>
              </div>
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='sku'
                  id='sku'
                  label='sku'
                  className={classnames('form-check-input')}
                  {...register('sku', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  SKU
                </Label>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='comments'
                  id='comments'
                  label='comments'
                  className={classnames('form-check-input')}
                  {...register('comments', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Comments
                </Label>
              </div>
            </div>
          </div>
        </div>
      </FormGroup>
    </>
  );

  const ProductReport = () => (
    <>
      <FormGroup>
        <div className="row">
          <div className="col-sm-3">
            <Label>
              Starting Date:
            </Label>
          </div>
          <div className="col-sm-7 d-flex align-items-center">
            <Flatpickr
              value={startPicker}
              id="startDate"
              name="startDate"
              className={`form-control ${classnames({ 'is-invalid': errors && errors.startDate })}`}
              onChange={(date) => { setStartPicker(date[0]); }}
              rules={{ required: true }}
              options={{
                mode: 'single',
              }}
            />
            <Calendar size={22} className="ml-1" />
          </div>
        </div>
      </FormGroup>
      <FormGroup>
        <div className="row">
          <div className="col-sm-3">
            <Label>
              Ending Date:
            </Label>
          </div>
          <div className="col-sm-7 d-flex align-items-center">
            <Flatpickr
              value={endPicker}
              id="endDate"
              name="endDate"
              className={`form-control ${classnames({ 'is-invalid': errors && errors.endDate })}`}
              onChange={(date) => { setEndPicker(date[0]); }}
              rules={{ required: true }}
              options={{
                mode: 'single',
              }}
            />
            <Calendar size={22} className="ml-1" />
          </div>
        </div>
      </FormGroup>
      <FormGroup>
        <div className="row">
          <div className="col-sm-3">
            <Label>
              Fields:
            </Label>
          </div>
          <div className="col-sm-8">
            <div className="row">
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='companyName'
                  id='companyName'
                  label='companyName'
                  className={classnames('form-check-input')}
                  {...register('companyName', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Company Name
                </Label>
              </div>
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='productModel'
                  id='productModel'
                  label='productModel'
                  className={classnames('form-check-input')}
                  {...register('productModel', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Product Model
                </Label>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='type'
                  id='type'
                  label='type'
                  className={classnames('form-check-input')}
                  {...register(type, { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Type
                </Label>
              </div>
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='waveLength'
                  id='waveLength'
                  label='waveLength'
                  className={classnames('form-check-input')}
                  {...register('waveLength', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  WaveLength
                </Label>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='description'
                  id='description'
                  label='description'
                  className={classnames('form-check-input')}
                  {...register('description', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Description
                </Label>
              </div>
            </div>
          </div>
        </div>
      </FormGroup>
    </>
  );

  const InventoryReport = () => (
    <>
      <FormGroup>
        <div className="row">
          <div className="col-sm-3">
            <Label>
              Contact Type:
            </Label>
          </div>
          <div className="col-sm-6">
            <Select
              as={Select}
              style={{ menu: (provided) => ({ ...provided, zIndex: 9999 }) }}
              options={inventoryType}
              name="active"
              value={selectedInventoryType}
              isClearable={false}
              control={control}
              defaultvalue={selectedInventoryType || ''}
              className={`react-select ${classnames({ 'is-invalid':errors && errors.active })}`}
              classNamePrefix="select"
              onChange={(value) => (setSelectedInventoryType(value))}
              {...register('active').label}
            />
          </div>
        </div>
      </FormGroup>
      <FormGroup>
        <div className="row">
          <div className="col-sm-3">
            <Label>
              Starting Date:
            </Label>
          </div>
          <div className="col-sm-7 d-flex align-items-center ">
            <Flatpickr
              value={startPicker}
              id="startDate"
              name="startDate"
              className={`form-control ${classnames({ 'is-invalid': errors && errors.startDate })}`}
              onChange={(date) => { setStartPicker(date[0]); }}
              rules={{ required: true }}
              options={{
                mode: 'single',
              }}
            />
            <Calendar size={22} className="ml-1" />
          </div>
        </div>
      </FormGroup>
      <FormGroup>
        <div className="row">
          <div className="col-sm-3">
            <Label>
              Ending Date:
            </Label>
          </div>
          <div className="col-sm-7 d-flex align-items-center">
            <Flatpickr
              value={endPicker}
              id="endDate"
              name="endDate"
              className={`form-control ${classnames({ 'is-invalid': errors && errors.endDate })}`}
              onChange={(date) => { setEndPicker(date[0]); }}
              rules={{ required: true }}
              options={{
                mode: 'single',
              }}
            />
            <Calendar size={22} className="ml-1" />
          </div>
        </div>
      </FormGroup>
      <FormGroup>
        <div className="row">
          <div className="col-sm-3">
            <Label>
              Fields:
            </Label>
          </div>
          <div className="col-sm-8">
            <div className="row">
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='productCompany'
                  id='productCompany'
                  label='productCompany'
                  className={classnames('form-check-input')}
                  {...register('productCompany', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Product Company
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
              <div className="col-sm-5">
                <Label>
                  Include30DayWarranty
                </Label>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='productModel'
                  id='productModel'
                  label='productModel'
                  className={classnames('form-check-input')}
                  {...register('productModel', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Product Model
                </Label>
              </div>
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='productYear'
                  id='productYear'
                  label='productYear'
                  className={classnames('form-check-input')}
                  {...register('productYear', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Year
                </Label>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='sku'
                  id='sku'
                  label='sku'
                  className={classnames('form-check-input')}
                  {...register('sku', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  SKU
                </Label>
              </div>
            </div>
          </div>
        </div>
      </FormGroup>
      <FormGroup>
        <div className="row">
          <div className="col-sm-3">
            <Label>
              Contact Info:
            </Label>
          </div>
          <div className="col-sm-8">
            <div className="row">
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='contactFullName'
                  id='contactFullName'
                  label='contactFullName'
                  className={classnames('form-check-input')}
                  {...register('contactFullName', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Name
                </Label>
              </div>
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='contactCompanyName'
                  id='contactCompanyName'
                  label='contactCompanyName'
                  className={classnames('form-check-input')}
                  {...register('contactCompanyName', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Company
                </Label>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='contactAddress'
                  id='contactAddress'
                  label='contactAddress'
                  className={classnames('form-check-input')}
                  {...register('contactAddress', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Address
                </Label>
              </div>
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='contactEmail'
                  id='contactEmail'
                  label='contactEmail'
                  className={classnames('form-check-input')}
                  {...register('contactEmail', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Email
                </Label>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='contactPhone'
                  id='contactPhone'
                  label='contactPhone'
                  className={classnames('form-check-input')}
                  {...register('contactPhone', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Phone
                </Label>
              </div>
              <div className="col-sm-1">
                <input
                  type="checkbox"
                  name='contactComments'
                  id='contactComments'
                  label='contactComments'
                  className={classnames('form-check-input')}
                  {...register('contactComments', { required: false })}
                />
              </div>
              <div className="col-sm-5">
                <Label>
                  Comments
                </Label>
              </div>
            </div>
          </div>
        </div>
      </FormGroup>
    </>
  );

  return (
    <FullLayout>
      <div className="table-header pt-3">
      <h3 className="sentient-contenttitle" style={{ color: '#4DAC00' }} >
          {' '}
          {`${type} Report`}
          {' '}
        </h3>
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

                {type === 'contact' && ContactReport()}
                {type === 'product' && ProductReport()}
                {type === 'inventory' && InventoryReport()}

                <div>
                  <Button outline size="sm" type="submit" color="primary">
                    submit
                  </Button>
                </div>

              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </FullLayout>
  );
};

export default ReportContact;
