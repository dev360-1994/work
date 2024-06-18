/* eslint-disable @next/next/no-img-element */
// ** React Imports
import { useState, useEffect } from 'react';
import {
  ChevronDown, Search,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, Row, Button, InputGroup, InputGroupAddon, InputGroupText, Input, CustomInput,
} from 'reactstrap';
import Select from 'react-select';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { useRouter } from 'next/router';

import BludDotIcon from '@src/assets/images/icons/file-icons/blueDot32.png';

import {
  getBuySearch, getCompanyManufacturer, getPriceRange, getProductModel,
} from '@src/api/buy.action';
import { getLookupProductOption } from '@src/api/product.actions';

const TableDaily = (props) => {
  const router = useRouter();
  
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

  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState([]);
  const [originData, setOriginData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (row) => {
    const isSelected = selectedRows.includes(row);
    setSelectedRows((prevState) => (isSelected ? prevState.filter((selectedRow) => selectedRow !== row) : [...prevState, row]));
  };

  // ---------------------------------------------------------------

  // direct funtions
  const handleCurrentRowChange = (selCurrentRow) => {
    router.push(`/product-details/${selCurrentRow.inventoryId}`);
    window.scrollTo(0, 0);
  };

  // -------------------------------------------------------------------

  const columns = () => [
    {
      width: '10%',
      cell: (row) => {
        const imageUrl = `${process.env.APP_SERVER_URL}/uploads/products/${row.productImage}`;
        return (
          <>
            <a href={`/product-details/${row.inventoryId}`}><img src={imageUrl} className="w-100" alt={row.productImage || ''} /></a>
          </>
        );
      },
    },
    {
      name: <span style={{ color: 'blue' }} className="text-center"> Product/Model </span>,
      width: '15%',
      sortable: true,
      selector: (row) => (
        <div className="style={{ height: '30px', width: '44px' }}">
          <a href={`/product-details/${row.inventoryId}`} style={{ color: '#000000' }}>
            {row.blueDot && (
            <img
              border="0"
              src={BludDotIcon}
              style={{ height: '30px', width: '44px' }}
              alt="Blue Dot Icon"
            />
            )}
            &nbsp;
            {row.productModel}
          </a>
        </div>
      ),
    },
    {
      name: <span style={{ color: 'blue' }}>Company/Mfg</span>,
      width: '15%',
      sortable: true,
      selector: (row) => `${row.productCompany}`,
    },
    {
      name: <span style={{ color: 'blue' }}>WaveLength</span>,
      width: '10%',
      sortable: true,
      selector: (row) => `${row.waveLength}`,
    },
    {
      name: <span style={{ color: 'blue' }}>Year</span>,
      width: '10%',
      selector: (row) => `${row.productYear}`,
      sortable: true,
    },
    {
      name: <span style={{ color: 'blue' }}>SKU</span>,
      width: '10%',
      selector: (row) => `${row.sku}`,
      sortable: true,
    },
    {
      name: (
        <span style={{ color: 'blue' }}>Selling Price</span>
      ),
      width: '15%',
      selector: (row) => (row.bestOffer ? `$${row.askingPrice?.toLocaleString() ?? 0} / OBO` : `$${row.askingPrice?.toLocaleString() ?? 0}`),
      sortable: true,
    },
    {
      name: (
        <span style={{ color: 'blue' }}>Date</span>
      ),
      width: '15%',
      selector: (row) => `${row.createdAt}`,
      sortable: true,
    },
  ];

  return (
    <>
      <div className="row col-12 px-md-3 px-2 pt-2 m-0 p-0" style={{ cursor: 'pointer' }}>
        <Card className="pt-2 pb-1 m-0 p-0">
          <DataTable
            data={props.tableData}
            responsive
            className="react-dataTable table-hover"
            noHeader
            pagination
            paginationRowsPerPageOptions={paginationRowsPerPageOptions}
            columns={columns(selectedRows)}
            striped
            conditionalRowStyles={conditionalRowStyles}
            customStyles={customStyles}
            selectableRows
            onSelectedRowsChange={(setState) => handleRowSelected(setState.selectedRows)}
            sortIcon={<ChevronDown />}
            onRowClicked={(row) => handleCurrentRowChange(row)}
          />
        </Card>
      </div>
    </>
  );
};

export default TableDaily;
