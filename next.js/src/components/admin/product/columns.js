/* eslint-disable react-hooks/rules-of-hooks */
// ** React Imports
import {
  Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import {
  MoreVertical, Archive, Trash2, CheckCircle,
} from 'react-feather';
import { useState } from 'react';

import { deleteProduct } from '@src/api/product.actions';
import { toast } from 'react-toastify';
import Link from 'next/link';

const columns = (type) => [
  {
    name: 'Product',
    maxWidth: '350px',
    sortable: true,
    selector: (row) => `${row.productName}`,
  },
  {
    name: 'Company',
    maxWidth: '250px',
    sortable: true,
    selector: (row) => `${row.company}`,
  },
  {
    name: 'Type',
    maxWidth: '150px',
    selector: (row) => `${row.type}`,
    sortable: true,
  },
  {
    name: 'WaveLength',
    maxWidth: '350px',
    selector: (row) => `${row.waveLength}`,
    sortable: true,
  },
  {
    name: 'Actions',
    width: '120px',
    cell: (row) => {
      const [modalVisibility, setModalVisibility] = useState(false);
      const [apiErrors, setApiErrors] = useState({});

      const handleDeleteProduct = async (productId) => {
        try {
          await deleteProduct(`${productId}`);
          toast.success(
            <>
              <CheckCircle className="mr-1 text-success" />
              Product successfully deleted
            </>, {
              hideProgressBar: true,
            }
          );
          setModalVisibility(!modalVisibility);
          window.location.reload();
        } catch (err) {
          setApiErrors(err.response ? err.response : { data: err.response.data });
        }
      };

      return (
        <>
          <UncontrolledDropdown className="sentient-drop">
            <DropdownToggle tag="div" className="btn btn-sm">
              <MoreVertical size={14} className="cursor-pointer action-btn" />
            </DropdownToggle>
            <DropdownMenu container="body">
              <DropdownItem
                tag={Link}
                href={`/admin/products/edit/${row.productId}`}
                className="w-100"
              >                
                <span className="align-middle px-3"><Archive size={14} className="mr-50 " /> &nbsp; Edit</span>
              </DropdownItem>
              <DropdownItem className="w-100" onClick={() => setModalVisibility(!modalVisibility)}>
                
                <span className="align-middle"> <Trash2 size={14} className="mr-50" /> &nbsp;Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Modal isOpen={modalVisibility} toggle={() => setModalVisibility(!modalVisibility)}>
            <ModalHeader toggle={() => setModalVisibility(!modalVisibility)}>Confirm Delete?</ModalHeader>
            <ModalBody>
              { apiErrors.data ? (
                <Alert color="danger">
                  <div className="alert-body">
                    <span>{`Error: ${apiErrors.data}`}</span>
                  </div>
                </Alert>
              ) : <></>}
              Are you sure you want to delete?
              <div><strong>{row.productName}</strong></div>
            </ModalBody>
            <ModalFooter className="justify-content-start">
              <Button color="primary" onClick={() => handleDeleteProduct(row.productId)}>
                Yes, Please Delete
              </Button>
              <Button color="secondary" onClick={() => setModalVisibility(!modalVisibility)} outline>
                No
              </Button>
            </ModalFooter>
          </Modal>
        </>
      );
    },
  },
];
export default columns;