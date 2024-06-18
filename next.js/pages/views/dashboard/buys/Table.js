// ** React Imports
import { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'react-feather';
import DataTable from 'react-data-table-component';
import {useRouter} from 'next/router';

import { Card, InputGroup, InputGroupText, InputGroupAddon, Row, Input, Button } from 'reactstrap';
import Select from 'react-select';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';

import BludDotIcon from '@src/assets/images/pages/buy/blueDot32.png';
import Image from 'next/image';
import Link from 'next/link';

import {
  getBuySearch, getCompanyManufacturer, getPriceRange, getProductModel,
} from '@src/api/buy.action';
import { getLookupProductOption } from '@src/api/product.actions';

const BuyList = () => {

  const router = useRouter();

  const { query } = router;
  const type = query.type || '';
  const searchData = (router.query && router.query.setdata) || {};

  const searchType = [
    { value: 0, label: 'Models' },
    { value: 1, label: 'Manufacturer' },
    { value: 2, label: 'Indicated Uses' },
    { value: 3, label: 'Price Range' },
  ];

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
  const [selData, setSelData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [originData, setOriginData] = useState([]);
  const [searchValue, setSearchValue] = useState(searchType[0] || null);
  const [selSearchText, setSelSearchText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  const handleFilter = (filterQuery) => {
    setSearchTerm(filterQuery);
    setTableData(originData.filter((x) => ((x?.productCompany && x?.productCompany).toLowerCase().includes(filterQuery.toLowerCase()))
                          || (x?.companyName && x.companyName.toLowerCase().includes(filterQuery.toLowerCase()))
                          || (x?.waveLength && x.waveLength.toLowerCase().includes(filterQuery.toLowerCase()))
                          || (x?.productYear && x.waveLength.toLowerCase().includes(filterQuery.toLowerCase()))
                          || (x?.sku && x.sku.toLowerCase().includes(filterQuery.toLowerCase()))));
  };

  const showSelSearchText = (data) => {
    if (searchValue?.value === 3 && data) {
      setSelSearchText(`$${data?.rangeStart} - $${data?.rangeEnd}` || '');
    } else if (searchValue?.value === 0) {
      setSelSearchText(data?.productName || '');
    } else if (searchValue?.value === 1) {
      setSelSearchText(data?.companyName || '');
    } else {
      setSelSearchText('');
    }
  };

  const getSelData = async () => {
    const data = {
      type: type || '',
    };
    if (searchValue.value === 3) {
      setSelData(await getPriceRange(data));
    } else if (searchValue.value === 0) {
      setSelData(await getProductModel(data));
    } else if (searchValue.value === 1) {
      setSelData(await getCompanyManufacturer(data));
    } else {
      setSelData(await getLookupProductOption(data));
    }
    setSelectedRows([]);
  };

  // ---------------------------------------------------------

  useEffect(() => {
    async function fetchData() {
      if (Object.keys(searchData).length === 0 && selData.length > 0) {
        let data = {};
        if (searchValue.value === 3) {
          data = {
            rangeStart: selData[0]?.rangeStart || 0,
            rangeEnd: selData[0]?.rangeEnd || 0,
          };
        }
        if (searchValue.value === 0) {
          data = {
            productName: selData[0]?.productName || '',
          };
        }
        if (searchValue.value === 1) {
          data = {
            companyName: selData[0]?.companyName || '',
          };
        }
        if (data) {
          type === 'bluedot' ? (data = {
            ...data,
            blueDot: type === 'bluedot',
          }) : (data = { ...data });

          const updateData = await getBuySearch(data) || [];
          updateData.sort((a, b) => b.blueDot - a.blueDot);
          setOriginData(updateData);
          setTableData(updateData);
          showSelSearchText(selData[0]);
        }
      }
    }
    fetchData();
  }, [selData]);

  useEffect(() => {
    async function fetchData() {
      getSelData();
    }
    fetchData();
  }, [searchValue, type]);

  useEffect(() => {
    async function fetchData() {
      if (Object.keys(searchData).length > 0) {
        let data = {};
        type === 'bluedot' ? (data = {
          ...searchData,
          blueDot: type === 'bluedot',
        }) : (data = { ...searchData });

        const updateData = await getBuySearch(data) || [];
        updateData.sort((a, b) => b.blueDot - a.blueDot);
        setOriginData(updateData);
        setTableData(updateData);
        setSelSearchText('Advanced Search');
      }
    }
    fetchData();
  }, [Object.keys(searchData).length]);

  // ---------------------------------------------------------

  const handleSearchChange = (value) => {
    setSelData([]);
    setSearchValue(value);
  };

  const handleListClick = async (e) => {
    if (searchValue.value === 2) {
      return;
    }

    const selectedItem = JSON.parse(e.currentTarget.getAttribute('data-value'));
    let data = {};
    if (searchValue.value === 3) {
      data = {
        rangeStart: selectedItem?.rangeStart || 0,
        rangeEnd: selectedItem?.rangeEnd || 0,
      };
    } else if (searchValue.value === 0) {
      data = {
        productName: selectedItem?.productName || '',
      };
    } else if (searchValue.value === 1) {
      data = {
        companyName: selectedItem?.companyName || '',
      };
    }
    if (data) {
      type === 'bluedot' ? (data = {
        ...data,
        blueDot: type === 'bluedot',
      }) : (data = { ...data });

      const updateData = await getBuySearch(data) || [];
      updateData.sort((a, b) => b.blueDot - a.blueDot);
      setOriginData(updateData);
      setTableData(updateData);
      showSelSearchText(selectedItem);
    }
  };

  const handleCheckboxChange = async (e) => {
    const updateData = selData.map((item) => {
      if (item.productOptionId.toString() === e.target.id) {
        return { ...item, active: !e.target.checked };
      }
      return item;
    });
    setSelData(updateData);
    const options = updateData.filter((item) => item.active === false)
      .map((item) => item.productOptionId)
      .join(',');
    let data = {
      productOption: options || '',
    };

    type === 'bluedot' ? (data = {
      ...data,
      blueDot: type === 'bluedot',
    }) : (data = { ...data });

    const response = await getBuySearch(data);
    setTableData(response);
    setSelSearchText(searchValue.label || '');
  };

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

  const handleButtonClick = (selectedRows) => {
    const { length } = selectedRows;
    if (length > 0) {
      const options = selectedRows[length - 1]
        .map((item) => item.inventoryId)
        .join(',');

      const compareData = {
        inventoryIds: options || '',
      };

      router.push({
        pathname: '/product-comparison',
        state: { compareData },
      });
      window.scrollTo(0, 0);
    }
  };

  const handleWatchList = () => {
    router.push('/watchlist');
    window.scrollTo(0, 0);
  };

  // -------------------------------------------------------------------

  const element = (
    <div style={{ minHeight: '50px', maxHeight: '650px', overflowY: 'auto' }}>
      <ul className="list-group">
        {selData?.length > 0 && selData.map((item, index) => (
          <li
            className="list-group-item"
            key={index}
            data-value={JSON.stringify(item)}
            onClick={(e) => handleListClick(e)}
          >

            { searchValue.value === 2 ? (
              <div>
                <input
                  type="checkbox"
                  key={item.productOptionId}
                  name={item.name}
                  value={item.active}
                  id={item.productOptionId}
                  label={item.name}
                  onChange={(e) => handleCheckboxChange(e)}
                />
                <label htmlFor="" className="form-check-label sentient-content px-3 ">{item.name}</label>
              </div>              
            ) : (
              <span>
                {searchValue.value === 3 ? `$${item.rangeStart}-$${item.rangeEnd} (${item.cnt})` : searchValue.value === 0 ? `${item.productName} (${item.cnt})` : searchValue.value === 1 ? (`${item.companyName} (${item.cnt})`) : (`${item.name}`)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const columns = (selectedRows) => [
    {
      name: <button type="button" className="" style={{ backgroundColor: '#4DAC00', height: '30px' }} onClick={() => handleButtonClick(selectedRows)}> Compare </button>,
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
      width: '20%',
      sortable: true,
      selector: (row) => (
        <div className="style={{ height: '30px', width: '44px' }}">
          <a href={`/product-details/${row.inventoryId}`} style={{ color: '#000000' }}>
            {row.blueDot && (
            <Image
              border="0"
              src={BludDotIcon}
              width={30}
              height={30}
              // style={{ height: '30px', width: '44px' }}
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
      width: '20%',
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
      width: '20%',
      selector: (row) => (row.bestOffer ? `$${row.askingPrice?.toLocaleString() ?? 0} / OBO` : `$${row.askingPrice?.toLocaleString() ?? 0}`),
      sortable: true,
    },

  ];

  return (
    <>
      <Row className="col-12 table-header py-sm-5  py-3 m-0 p-0">
        <div className="py-3 px-3 m-0 p-0 d-flex justify-content-center align-items-center ">
          <h3 className="px-3 sentient-subtitle d-sm-flex d-none m-0 p-0"> Pre-Owned Aesthetic Device Inventory </h3>
          {/* mobile */}
          <h3 className="sentient-contenttitle d-sm-none d-flex m-0 p-0"> Pre-Owned Aesthetic Device Inventory </h3>
        </div>
      </Row>
      <div className="row col-12 px-md-5 px-3 m-0 p-0" style={{ cursor: 'pointer' }}>
        <div className="col-lg-3 col-12 m-0 p-0">
          <div className="d-flex pb-2">
            <Link href="/buy-lasers-inventory-search" passHref onClick={() => { window.scrollTo(0, 0); }}>
              <h4 className="sentient-button sentient-footer px-3 p-2 text-center">Advanced Search</h4>
            </Link>
          </div>
          <div className="rounded list-group pb-2">
            <Select
              as={Select}
              options={searchType}
              name="searchType"
              value={searchValue}
              isClearable={false}
              classNamePrefix="select"
              onChange={(value) => { handleSearchChange(value); }}
            />
            {element}
          </div>
        </div>
        <div className="col-lg-9 col-12 px-2 m-0 p-0">
          <div className="rounded">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="px-md-3 sentient-contenttitle d-sm-flex d-none" style={{ color: '#65CF10',  textDecoration: 'underline dotted #a5a5a5', textDecorationThickness: '2px' }}>
                  {selSearchText}
                </h4>
                {/* mobile */}
                <h4 className="sentient-content d-sm-none d-flex" style={{ textDecoration: 'underline dotted #a5a5a5', textDecorationThickness: '2px' }}>
                  {selSearchText}
                </h4>
              </div>
              <div className="d-flex align-items-left">
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
                { searchTerm && (
                <Button
                  size="sm"
                  className="clear-link d-block"
                  onClick={() => { handleFilter(''); }}
                  color="flat-light"
                >
                  clear
                </Button>
                )}
              </div>
            </div>
            <Card className="px-md-1 pt-2 pb-1">
              <DataTable
                data={tableData}
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
          {/* <div className="d-flex justify-content-end">
            {tableData.length === 0
            && (
            <Button color="flat-light" onClick={() => handleWatchList()}>
              <p className="sentient-content sentient-color-change">
                Watch list &gt;
              </p>
            </Button>
            )}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default BuyList;
