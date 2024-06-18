
// ** React Imports
import { useState, useEffect, useCallback } from 'react';
import {
  ChevronDown, Plus, Search,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, Row, Col, Button, InputGroup, InputGroupAddon, InputGroupText, Input,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import Spinner from '@src/components/spinner/Loading-spinner';

import { getInventorys } from '@src/api/inventory.actions';
import { useRouter } from 'next/router';
import Link from 'next/link';
import columns from '../../../../../src/components/admin/inventory/columns';
import UILoader from '@src/components/ui-loader';


const ContentList = () => {
  var type='';
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState([]);
  const [originData, setOriginData] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const handleFilter = (filterQuery) => {
    setSearchTerm(filterQuery);
    setTableData(originData?.filter((x) => (x?.productModel?.toLowerCase() || '').includes(filterQuery.toLowerCase())
                                          || (x?.productCompany?.toLowerCase() || '').includes(filterQuery.toLowerCase())
                                          || ((x?.lastName && x?.firstName) && (x.lastName + x.firstName).toLowerCase().includes(filterQuery.toLowerCase()))
                                          || (x?.sku?.toLowerCase() || '').includes(filterQuery.toLowerCase())));
  };

  //const { type } = router.query;   

  if(router.asPath.split("=").length>1){
    type=router.asPath.split("=")[1];
  }

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      const dispatchParams = {
        type: type ? type.toLowerCase() : '',
      };

      const inventorydata = await getInventorys(dispatchParams);
      if(inventorydata) {
        setTableData(inventorydata || []);
        setOriginData(inventorydata || []);
      }
    };
    fetchData().finally(() => setLoading(false));;
    //setLoading(false);
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
      highlightOnHoverStyle: {
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
        <Col>
          <h3 className="sentient-contenttitle" style={{ color: '#4DAC00'}}>{`All ${type} Inventorys (${tableData?.length > 0 ? tableData?.length : 0})`}</h3>
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
          className="d-flex justify-content-end px-4 pt-xl-0 py-3"
        >
          <Link href="/admin/inventorys/add" passHref={true}>
            <a className="navbar-brand">              
              <span className="align-middle sentient-content sentient-button p-2"><Plus size={14} /> &nbsp;Add Inventory</span>
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
