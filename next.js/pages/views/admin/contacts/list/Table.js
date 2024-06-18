// ** React Imports
import { useState, useEffect } from 'react';
// ** Store & Actions
import {
  ChevronDown, Plus, Search,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, Row, Col, Button, InputGroup, InputGroupAddon, InputGroupText, Input,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { getContacts } from '@src/api/contact.actions';
import Spinner from '@src/components/spinner/Loading-spinner';
import columns from '@src/components/admin/contact/columns';
import UILoader from '@src/components/ui-loader';


import { useRouter } from 'next/router';
import Link from 'next/link';

const ContentList = () => {
  // ** Store Vars
  var type='';
  const router = useRouter();

  if(router.asPath.split("=").length>1){
    type=router.asPath.split("=")[1].replace("%20"," ");
  }
 console.log("path>>>"+type);
  const dispatchParams = {
    type: type ? type.toLowerCase() : 'sell',
  };

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState([]);
  const [originData, setOriginData] = useState([]);

  const handleFilter = (filterQuery) => {
    setSearchTerm(filterQuery);
    setTableData(originData?.filter((x) => ((x?.lastName && x?.firstName) && (x.lastName + x.firstName).toLowerCase().includes(filterQuery.toLowerCase()))
                                          || (x?.email && x.email.toLowerCase().includes(filterQuery.toLowerCase()))
                                          || (x?.address && x.address.toLowerCase().includes(filterQuery.toLowerCase()))));
  };

  async function fetchDatatype() {
    try {
      const contactdata = await getContacts(dispatchParams);
      if (contactdata) {
        setTableData(contactdata);
        setOriginData(contactdata);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchDatatype().finally(() => setLoading(false));
  }, [type]);

  const conditionalRowStyles = [
    {
      when: (row) => true,
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
      <Row className="table-header pt-3 pb-2 d-flex align-items-center">
        <Col   xl="4"  className="d-flex align-items-center">
          <h3 className="sentient-contenttitle px-2" style={{ color: '#4DAC00'}}>Contact/{type}</h3>
        </Col>
        <Col
          xl="4"
          className="d-flex align-items-center"
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
        <Col
          xl="4"
          className="d-flex justify-content-right px-4 pt-xl-0 py-3 col-xl-4"
        > 
          <Link href="/admin/contacts/add" passHref={true}>
            <a className="navbar-brand">              
              <span className="align-middle sentient-content sentient-button p-2"><Plus size={14} />Add Contact</span>
            </a>
          </Link>
        </Col>
      </Row>

      <Card>
        {loading ? <div className="land-content" style={{paddingTop:'38px'}}>    <UILoader blocking={loading}/></div> : (
          <DataTable
          data={tableData}
          responsive
          className="react-dataTable"
          noHeader
          pagination
          paginationRowsPerPageOptions={paginationRowsPerPageOptions}
          columns={columns(type)}
          style={{ border: '2px solid #3f3' }} // Fixed style prop placement
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
