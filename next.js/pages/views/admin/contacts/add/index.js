import { useEffect, useState } from 'react';
import {
  Card, CardBody, Col, FormGroup, Label, Row, Input, Button, Form, Alert,
} from 'reactstrap';
import Select from 'react-select';

import { useForm, Controller } from 'react-hook-form';
import classnames from 'classnames';

import UILoader from '@src/components/ui-loader';
import {
  CheckCircle, Trash2,
} from 'react-feather';
import { toast } from 'react-toastify';
import 'react-dropzone-uploader/dist/styles.css';
import { addContact, getLookupCountry, getLookupState } from '@src/api/contact.actions';
import FullLayout from '@src/layouts/FullLayout';

const ContactAdd = () => {
  const {
    register, errors, handleSubmit, control,
  } = useForm();

  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const [contactType, setContactType] = useState([
    { value: 'question', label: 'question' },
    { value: 'buyer offer', label: 'buyer offer' },
    { value: 'buyer question', label: 'buyer question' },
    { value: 'sell', label: 'sell' },
    { value: 'watchlist', label: 'watchlist' },
    { value: 'lease', label: 'lease' },
    { value: 'maintenance', label: 'maintenance' },
    { value: 'inquiry', label: 'inquiry' },
  ]);

  const [states, setStates] = useState([]);
  const [countriesInfo, setCountriesInfo] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [phoneError, setPhoneError] = useState('');
  
  const fetchData = async () => {
    const data = await getLookupCountry();
    if (data?.length > 0) {
      const updatedData = data.map((item) => ({
        label: item.countryName,
        value: item.countryId,
      }));
      setCountries(updatedData);
      setCountriesInfo(data);

      //console.log("data>>>>>>>>"+JSON.stringify(data))

   
    } else {
      setCountries([]);
      setCountriesInfo([]);
    }
  
    const data1 = await getLookupState("US");
    if (data1?.length > 0) {
      console.log("data1?.length"+data1?.length);
      const updateddata1= data1?.map((item) => ({
        label: item.stateName,
        value: item.stateId,
      }));
      setStates(updateddata1);
      //setSelectedState(updateddata1[0]);
    }else{
      setStates([]);
      setSelectedState({});
    }
  };
  
  // Inside your component
  useEffect(() => {
    fetchData();
  }, []);

  const validatePhone = (e) => {
    //console.log("phone value"+e.target.value);

     if(e.target.value.length>0 && !/^\d{3}-\d{3}-\d{4}$/.test(e.target.value)) {
      setPhoneError('Please enter a valid phone number in the format 987-654-3210');
    }else{
      setPhoneError('');
    }
}

  const onSubmit = async (data) => {
    
    data.type = selectedType?.value ? selectedType.value : 0;
    data.country = selectedCountry?.value ? selectedCountry.value : 0;
    data.state = selectedState?.value ? selectedState.value : 0;
    //console.log("companyName>>>"+JSON.stringify(data));
    try {
      setIsProcessing(true);
      if(data.phone.length>0 && !/^\d{3}-\d{3}-\d{4}$/.test(data.phone)){
        setPhoneError('Please enter a valid phone number in the format 987-654-3210');
        setIsProcessing(false);
        return false;

      }else{
        setPhoneError('');
        setIsProcessing(true);
      await addContact(data);

      // toast.success("success", {
      //   theme: "colored"
      // })
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Contact added
        </>, {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
        }
      );
      setIsProcessing(false);
    } }catch (err) {
      if (err.response && err.response.status === 500) {
        setApiErrors({ data: 'Contact add error' });
      } else {
        setApiErrors(err.response ? err.response : { data: err.response });
      }
      setIsProcessing(false);
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

  useEffect(() => {
    setSelectedCountry(countries?.length > 0 ? countries[225] : null);
  }, [countries]);

  useEffect(() => {
    setSelectedState(states?.length > 0 ? states[0] : null);
  }, [states]);

  return (
    <FullLayout>
      <div className="table-header pt-3 px-3">
        <Button color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button>
        <h3 className="sentient-contenttitle" style= {{ color: '#4DAC00'}}>Add Contact</h3>
      </div>
      <Row>
        <Col md="12" sm="12" lg="12" className="px-3">
          <Card className="p-3">
            <CardBody>
              <Form onSubmit={handleSubmit(onSubmit)}>
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
                      <div className="col-sm-2">
                        <Label>
                          Contact Type:
                        </Label>
                      </div>
                      <div className="col-sm-6">
                        <Select
                          as={Select}
                          options={contactType}
                          name="type"
                          id="type"
                          required
                          value={selectedType}
                          isClearable={false}
                          control={control}
                          defaultvalue={contactType?.length > 0 ? contactType[0] : null}
                          className={`react-select ${classnames({ 'is-invalid': errors && errors.type })}`}
                          classNamePrefix="select"
                          onChange={(value) => { setSelectedType(value); }}
                          {...register('type').label}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>
                          First Name *:
                        </Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input firstName"
                          id="firstName"
                          name="firstName"
                          className={classnames({ 'is-invalid': errors && errors.firstName }, 'form-control')}
                          {...register('firstName', { required: true })} 
                        />
                      </div>
                      <div className="col-sm-2">
                        <Label>
                          Last Name *:
                        </Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input lastName"
                          id="lastName"
                          name="lastName"
                          className={classnames({ 'is-invalid': errors && errors.lastName }, 'form-control')}
                          {...register('lastName', { required: true })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>
                          Company Name *:
                        </Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input CompanyName"
                          id="companyName"
                          name="companyName"
                          className={classnames({ 'is-invalid': errors && errors.companyName }, 'form-control')}
                          {...register('companyName', { required: true })}
                        />
                      </div>
                      <div className="col-sm-2">
                        <Label mb="10px">
                          Address1 *:
                        </Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input address1"
                          id="address1"
                          name="address1"
                          className={classnames({ 'is-invalid': errors && errors.address1 }, 'form-control')}
                          {...register('address1', { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>
                          Address2:
                        </Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input address2"
                          id="address2"
                          name="address2"
                          className={classnames({ 'is-invalid': errors && errors.address2 }, 'form-control')}
                          {...register('address2', { required: false })}
                        />
                      </div>
                      <div className="col-sm-2">
                        <Label mb="10px">
                          City:
                        </Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input City"
                          id="city"
                          name="city"
                          className={classnames({ 'is-invalid': errors && errors.city }, 'form-control')}
                          {...register('city', { required: true })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>
                          Country:
                        </Label>
                      </div>
                      <div className="col-sm-6">
                        <Select
                          as={Select}
                          options={countries}
                          name="country"
                          value={selectedCountry}
                          isClearable={false}
                          control={control}
                          defaultvalue={countries?.length > 0 ? countries[225] : null}
                          className={`react-select ${classnames({ 'is-invalid': errors && errors.country })}`}
                          classNamePrefix="select"
                          onChange={(value) => { handleCountryChange(value); }}
                          {...register('country').label}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>
                          State:
                        </Label>
                      </div>
                      <div className="col-sm-4">
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
                      <div className="col-sm-2">
                        <Label mb="10px">
                          Zip:
                        </Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input Zip"
                          id="zip"
                          name="zip"
                          maxLength={5}

                          autoComplete='off'
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onPaste={(e)=>{
                            e.preventDefault()
                            return false;
                          }} 
                          className={classnames({ 'is-invalid': errors && errors.zip }, 'form-control')}
                          {...register('zip', { required: true })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>
                          Email *:
                        </Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="email"
                          placeholder="Input email"
                          id="email"
                          name="email"
                          className={classnames({ 'is-invalid': errors && errors.email }, 'form-control')}
                          {...register('email', { required: true })}
                        />
                      </div>
                      <div className="col-sm-2">
                        <Label>
                          International Prefix:
                        </Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input international Prefix"
                          id="itlPrefix"
                          name="itlPrefix"
                          className={classnames({ 'is-invalid': errors && errors.itlPrefix }, 'form-control')}
                          {...register('itlPrefix', { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>
                          Phone:
                        </Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input phone"
                          id="phone"
                          name="phone"
                          autoComplete='off' 
                          maxLength={12}
                          onKeyUp={(e) => validatePhone(e)}
                          onPaste={(e)=>{
                            e.preventDefault()
                            return false;
                          }} 
                          className={classnames({ 'is-invalid': errors && errors.phone }, 'form-control')}
                          {...register('phone', { required: true })}
                          
                        />
                         <span style={{ fontWeight: 'bold', color: 'red' }}>{phoneError}</span>
                      </div>
                      <div className="col-sm-2">
                        <Label>
                          Fax:
                        </Label>
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          placeholder="Input fax"
                          id="fax"
                          name="fax"
                          className={classnames({ 'is-invalid': errors && errors.fax }, 'form-control')}
                          {...register('fax', { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <div className="row">
                      <div className="col-sm-2">
                        <Label>
                          Active:
                        </Label>
                      </div>
                      <div className="col-sm-4">
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
                      <div className="col-sm-2">
                        <Label>
                          Comments:
                        </Label>
                      </div>
                      <div className="col-sm-10">
                        <textarea
                          type="textarea"
                          placeholder=""
                          id="comments"
                          name="comments"
                          rows={5}
                          className={classnames({ 'is-invalid': errors && errors.comments }, 'form-control')}
                          {...register('comments', { required: false })}
                        />
                      </div>
                    </div>
                  </FormGroup>
                  <div>
                    <Button outline size="sm" type="submit" color="primary">
                      Add Contact
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

export default ContactAdd;
