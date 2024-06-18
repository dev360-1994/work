// ** React Imports
import { useState, useEffect } from 'react';
import {
  ChevronDown, Search,
} from 'react-feather';
import DataTable from 'react-data-table-component';
import Image from 'next/image';

import {  Card } from 'reactstrap';
import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { useRouter } from 'next/router';

import BludDotIcon from '@src/assets/images/icons/file-icons/blueDot32.png';

const BuyDataShow = (props) => {
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
    history.push(`/product-details/${selCurrentRow.inventoryId}`);
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
            <a className="py-1 d-flex justify-content-center align-items-center" href={`/product-details/${row.inventoryId}`}>
              <img
                src={imageUrl}
                className="w-100"
                style={{ backgroundSize: 'contain', width: 'auto' }}
                alt={row.productImage || ''}
              />
            </a>
          </>
        );
      },
    },
    {
      name: <span className="sentient-content text-center">content</span>,
      width: '85%',
      sortable: true,
      selector: (row) => (
        <div className="col-12 m-0 p-0" >
          <div className="d-flex justify-content-between">
            <div className="sentient-contenttitle pt-2 d-flex justify-content-center" style={{ color: '#4DAC00' }}>
              {row.blueDot && (
              <Image
                src={BludDotIcon}
                width={44}
                height={30}
                alt="Blue Dot Icon"
              />
              )}
              &nbsp;
              {row.productModel}
            </div>
            <div className="sentient-contenttitle pt-2" style={{ color: '#0000FF' }}>
              $
              {row.askingPrice?.toLocaleString()}
            </div>
          </div>

          <hr className="sentient-underline w-100" />

          <pre className="sentient-content w-100" style={{ color: '#000000', whiteSpace: 'pre-wrap' }}>
            {row.description}
          </pre>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="row col-12 px-md-5 px-3 pt-3 m-0 p-0" style={{ cursor: 'pointer' }}>
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

export default BuyDataShow;
