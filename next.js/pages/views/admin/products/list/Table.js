// ** React Imports
import { useState, useEffect } from 'react';
import {
  ChevronDown, Plus, Search,
} from 'react-feather';

import DataTable from 'react-data-table-component';
//import Document, { Html, Head, Main, NextScript } from 'next/document'

import {
  Card, Row, Col, Button, InputGroup, InputGroupAddon, InputGroupText, Input,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { getProducts } from '@src/api/product.actions';
import Spinner from '@src/components/spinner/Loading-spinner';

import Link from 'next/link';
import { useRouter } from 'next/router';
import columns from '../../../../../src/components/admin/product/columns';
import UILoader from '@src/components/ui-loader';


const ContentList = () => {
  // ** Store Vars
  var type='';
  const router = useRouter();
  //const { type } = router.query

  if(router.asPath.split("=").length>1){
    type=router.asPath.split("=")[1];
  }
  
  //console.log("<<<<<<<>>>>>>>>>>>"+router.query.type);

  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState([]);
  const [originData, setOriginData] = useState([]);
  const [loading, setLoading] = useState(false);
  //const latLong='17.421874,78.332089';

  const latlong = [{lat:17.421874, long:78.332089}];
  const mapName='wipro,bangalore';

  const latitude = 17.421874; // Replace with your dynamic latitude
  const longitude = 78.332089;

  //const srcMap = "https://maps.google.com/maps?q="+latlong[0].lat+","+latlong[0].long+"&hl=es;z=14&amp;output=embed";
  
//console.log("url>>>>>>>>>>>>>>>>>"+srcMap)

  //const _url = 'https://www.google.com/maps/embed/v1/place?q=+"${latLong}"+&hl=es;z=14&amp;output=embed';
 //console.log("url issssssssssss"+${process.env.APP_SERVER_URL}/api/public/contact-us);

//  <iframe src="https://maps.google.com/maps?q=17.421874,78.332089&hl=es;z=14&amp;output=embed "  width="100%" height="300px" frameborder="0"></iframe> 


 const _url = 'https://maps.google.com/maps?q=17.421874,78.332089&hl=es;z=14&amp;output=embed';


  const handleFilter = (filterQuery) => {
    setSearchTerm(filterQuery);
    setTableData(originData?.filter((x) => (x?.productName?.toLowerCase() || '').includes(filterQuery.toLowerCase())
                                            || (x?.company?.toLowerCase() || '').includes(filterQuery.toLowerCase())
                                            || (x?.waveLength?.toLowerCase() || '').includes(filterQuery.toLowerCase())
                                            || (x?.type?.toLowerCase() || '').includes(filterQuery.toLowerCase())));
  };

  useEffect(() => {
    async function fetchData() {
      // if (type !== ('active' || 'inactive')) {
      //   console.log
      //   return;
      // }

      //console.log("MAP>>>>>>>>>>>>>>>>"+srcMap)
      //document.getElementById('srcMap1').src=srcMap;

      setLoading(true);
      setTableData( []);
      setOriginData([]);
      const dispatchParams = { type: type?.toLowerCase() };
      //console.log("dispatchParams"+JSON.stringify(dispatchParams))
      const productdata = await getProducts(dispatchParams);
      if(productdata){
        setTableData(productdata || []);
        setOriginData(productdata || []);
      }
    }

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
          <h3 className="sentient-contenttitle px-2" style={{ color: '#4DAC00'}}>
            {`All ${type}  Products(${tableData?.length ?? 0})`}
          </h3>
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
          <Link href="/admin/products/add" passHref={true}>
            <a className="navbar-brand">              
              <span className="align-middle sentient-content sentient-button p-2"><Plus size={14} /> &nbsp;Add Product</span>
            </a>
          </Link>
        </Col>
      </Row>

      <Card>

     {/* <div>

      <iframe  name="gMap1" src={`https://maps.google.com/maps?q=${mapName}&t=&z=14&ie=UTF8&iwloc=&output=embed`}   width="100%" height="300" frameborder="0"></iframe>  
      </div>

      <iframe width="100%" height="255px" name="gMap"src={`https://maps.google.com/maps?q=${latlong[0].lat},${latlong[0].long}&t=&z=14&ie=UTF8&iwloc=&output=embed`} frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe> */}

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
