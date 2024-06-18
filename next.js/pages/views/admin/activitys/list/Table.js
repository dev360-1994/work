import { useState, useEffect } from 'react';
import {
  ChevronDown, Search,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, Row, Col, Button, InputGroup, InputGroupAddon, InputGroupText, Input,
} from 'reactstrap';
import moment from 'moment';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import Flatpickr from 'react-flatpickr';
import { FaCalendar } from 'react-icons/fa';
import 'flatpickr/dist/themes/material_green.css';
import Spinner from '@src/components/spinner/Loading-spinner';
import { columns } from '@src/components/admin/activity/columns';

import { getRecentContacts } from '@src/api/contact.actions';
import UILoader from '@src/components/ui-loader';

import { useRouter } from 'next/router';

const ContentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState([]);
  const [originData, setOriginData] = useState([]);
  const [selectedDates, setSelectedDates] = useState(null);
  const [loading, setLoading] = useState(false);
  var type='';

  
  const router = useRouter();
  //const {type} = router.query || {type:''};
  //console.log("router.length>>"+router.asPath);
  if(router.asPath.split("=").length>1){
    type=router.asPath.split("=")[1].replace("%20"," ");
  }


  // const { type } =router.query || { type: '' };
  //console.log("startDateObj"+selectedDates);


  const handleFilter = (filterQuery) => {
    setSearchTerm(filterQuery);
    setTableData(originData?.filter((x) => ((x?.lastName && x?.firstName) && (x.lastName + x.firstName).toLowerCase().includes(filterQuery.toLowerCase()))
                                          || x.companyName.toLowerCase().includes(filterQuery.toLowerCase())
                                          || x.productName.toLowerCase().includes(filterQuery.toLowerCase())
                                          || x.phone.toLowerCase().includes(filterQuery.toLowerCase())));
  };

 

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

 
const today = new Date();
let startDateObj = new Date();
startDateObj.setDate(today.getDate() - 90);

  async function fetchDatatype() {
    setLoading(true);

    //console.log("type....."+type);
    //console.log("selectedDates....."+selectedDates);
    //console.log("selectselectedDates?.length....."+selectedDates?.length)

    const startDate =selectedDates?.length >0 ? `${selectedDates?.[0].getFullYear()}-${selectedDates?.[0].getMonth() + 1}-${selectedDates?.[0].getDate()}`: startDateObj;
    const endDate =
      selectedDates?.length === 2
        ? `${selectedDates?.[1].getFullYear()}-${selectedDates?.[1].getMonth() + 1}-${selectedDates?.[1].getDate()}`
        : today;
    const dispatchParams = {
      
      startDate: moment(startDate).format("YYYY-MM-DD") ||  moment(today).format("YYYY-MM-DD"),
      endDate:  moment(endDate).format("YYYY-MM-DD") ||  moment(today).format("YYYY-MM-DD"),
      type: type?.toLowerCase() || ''
    };
    //console.log("payload222"+JSON.stringify(dispatchParams));
    
    try {
      const contactdata = await getRecentContacts(dispatchParams);
     //console.log("payload222 contactdata"+JSON.stringify(contactdata));

      if (contactdata) {
        setTableData(contactdata);
        setOriginData(contactdata)
      }
      setLoading(false);

    } catch (error) {
      setLoading(false);

      console.error(error);
    }
  }

  useEffect(() => {
   
    setLoading(true);
    fetchDatatype().finally(() => setLoading(false));
  }, [type, selectedDates]);
  

  async function fetchData() {
    const dispatchParams = {
      type: type?.toLowerCase() || '',
      startDate:  moment(startDateObj).format("YYYY-MM-DD"),
      endDate:  moment(today).format("YYYY-MM-DD")
    };
    setSelectedDates([startDateObj, today]);
    //console.log("payload111"+JSON.stringify(dispatchParams));
    const contactdata = await getRecentContacts(dispatchParams);
   // console.log("response"+JSON.stringify(contactdata));
    if (contactdata) {
      setTableData(contactdata);
      
    }
  }
  
  useEffect(() => {
   
    setLoading(true);  
    (async () => {
      try {
        await fetchData();
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    })();
  
  }, []);

  async function  dateChange(date){
    console.log("<>>>>>>>>>>>>>>>>>"+date);
    var myArray = date.toString().includes(",");
    if(myArray){
     var arraycount=date.toString().split(',');
     console.log("<>>>>>>>>>>>"+arraycount[0]+",,,,,,,,,....."+arraycount[1]);
     console.log("DATE is1>>"+formatDate(arraycount[0]));
     console.log("DATE is2>>"+formatDate(arraycount[1]));
    
     const dispatchParams1 = {
       type: type?.toLowerCase() || '',
       startDate:  formatDate(arraycount[0]),
       endDate:  formatDate(arraycount[1]),
     };
   
     console.log("payload2121"+JSON.stringify(dispatchParams1));
     const contactdata = await getRecentContacts(dispatchParams1);
     console.log("response date change"+JSON.stringify(contactdata));
     if (contactdata) {
       setTableData(contactdata);
       setOriginData(contactdata);
     }else{
      setTableData([]);
      
     }
 
    }else{
   
      await fetchData();
    }
 
    
   
   }

  const conditionalRowStyles = [
    {
      when: () => true,
      style: {
        backgroundColor: '#f5f5f5',
        '&:hover': {
          cursor: 'pointer',
          backgroundColor: '#d9d9d9',
        },
      },
    },
  ];

  const customStyles = {
    header: {
      style: {
        backgroundColor: '#007bff',
        color: '#fff',
      },
    },
    rows: {
      style: {
        backgroundColor: '#fff',
      },
      highlightOnHover: {
        backgroundColor: '#f5f5f5',
      },
    },
    cells: {
      style: {
        color: '#000',
      },
    },
  };

  return (
    <>
      <Row className="table-header pt-3">
        <Col md="4" className="d-flex align-items-center py-1">
          <h3 className="sentient-contenttitle px-3" style={{ color: '#4DAC00' }}>
            { type || 'All'}
            {' '}
            Activity
          </h3>
        </Col>
        <Col md="4" className="d-flex align-items-center py-1">
          <Flatpickr
            value={selectedDates}
            id="startDate"
            name="startDate"
            onChange={(date) => { setSelectedDates(date); }}
            className="form-control"
            options={{
              mode: 'range',
              dateFormat: 'Y-m-d',
            }}
          />
          &nbsp;
          <FaCalendar className="calendar-icon" style={{ cursor: 'point' }} onClick={() => { setSelectedDates([startDateObj, today]);}} />
        </Col>
        <Col
          md="4"
          className="d-flex align-items-center py-1"
        >
          <InputGroup>
            {/* <InputGroupAddon addonType="prepend" className="border"> */}
              <InputGroupText>
                <Search size={14} />
              </InputGroupText>
            {/* </InputGroupAddon> */}
            <Input
              className="border"
              id="search-user"
              type="text"
              value={searchTerm}
              onChange={(e) => handleFilter(e.target.value ? e.target.value : '')}
            />
          </InputGroup>
          { searchTerm && (<Button size="sm" className="clear-link d-block" onClick={() => { handleFilter(''); }} color="flat-light"> clear</Button>)}
        </Col>
      </Row>

      <Card>
        {loading ? <div className="land-content" style={{paddingTop:'38px'}}>    <UILoader blocking={loading}/> </div> : (
          <DataTable
            data={tableData}
            responsive
            className="react-dataTable"
            noHeader
            pagination
            style={{ border: '2px solid #3f3' }}
            paginationRowsPerPageOptions={paginationRowsPerPageOptions}
            columns={columns(type)}
            striped
            conditionalRowStyles={conditionalRowStyles}
            customStyles={customStyles}
            sortIcon={<ChevronDown />}
          />
        )} 
      </Card>
    </>
  );
};

export default ContentList;
