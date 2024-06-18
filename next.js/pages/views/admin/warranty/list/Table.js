import { useState, useEffect } from 'react';
import {
  ChevronDown, Search,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, Row, Col, Button, InputGroup, InputGroupAddon, InputGroupText, Input,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import Spinner from '@src/components/spinner/Loading-spinner';

import { getWarrants } from '@src/api/warranty.actions';
import columns from '@src/components/admin/warranty/columns';
import { useRouter } from 'next/router';
import UILoader from '@src/components/ui-loader';


const ContentList = () => {
  var type='';

  const router = useRouter();
  //const { type } = router.query;

  if(router.asPath.split("=").length>1){
    type=router.asPath.split("=")[1];
  }
  // ** Store Vars
  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inventorys, setInventorys] = useState([]);

  const handleFilter = (filterQuery) => {
    setSearchTerm(filterQuery);
    setTableData(inventorys?.filter((x) => (x?.warranty?.model?.toLowerCase() || '').includes(filterQuery.toLowerCase())
                                          || (x?.warranty?.manufacturer?.toLowerCase() || '').includes(filterQuery.toLowerCase())
                                          || (x?.warranty?.issues?.toLowerCase() || '').includes(filterQuery.toLowerCase())
                                          || ((x?.fullName || '').toLowerCase().includes(filterQuery.toLowerCase()))
                                          || (x?.warranty?.year?.toLowerCase() || '').includes(filterQuery.toLowerCase())));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const Params = { type: 'active' };
      const data = await getWarrants(Params);

      if (data) {
        setInventorys(data || []);
        setTableData(data || []);
      }
    };
    setLoading(true);
    fetchData().finally(() => setLoading(false));
    //setLoading(false);
  }, []);

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
      <Row className="table-header pt-3 pb-1">
        <Col>
          <h3 className="sentient-contenttitle px-3" style={{ color: '#4DAC00'}}>{`All Warrantys (${inventorys?.length > 0 ? inventorys?.length : 0})`}</h3>
        </Col>
        <Col
          xl="3"
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
      </Row>

      <Card>
      {loading ? <div className="land-content" style={{paddingTop:'38px'}}>    <UILoader blocking={loading}/></div> : (
          <DataTable
            data={tableData}
            responsive
            className="react-dataTable"
            noHeader
            pagination
            style={{ border: '2px solid #3f3', position: 'relative', zIndex: '2000' }}
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
