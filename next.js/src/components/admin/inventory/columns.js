/* eslint-disable react-hooks/rules-of-hooks */

import {
  Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import {
  MoreVertical, Archive, Trash2, CheckCircle,
} from 'react-feather';
import { useState } from 'react';

import { deleteInventory } from '@src/api/inventory.actions';
import { toast } from 'react-toastify';
import Link from 'next/link';
const styles = {
  spacer: {
        flex: '1 1 50% 50%',
        border: '1px solid black',
        
  }
}
const columns = (type) =>  [
  {
    name: 'Product',
    sortable: true,
    maxWidth: '350px',
    selector: (row) => `${row.productModel}`,
  },
  {
    name: 'Company',
    maxWidth: '350px',
    sortable: true,
    selector: (row) => `${row.productCompany}`,
  },
  {
    name: 'Sku',
    maxWidth: '150px',
    selector: (row) => `${row.sku}`,
    sortable: true,
  },
  {
    name: 'Contact',
    maxWidth: '250px',
    selector: (row) => `${row.lastName} ${row.firstName}`,
    sortable: true,
  },
  {
    name: 'Asking Price',
    maxWidth: '250px',
    selector: (row) => `$${row.askingPrice}`,
    sortable: true,
  },
  {
    name: 'Action',
    width: '120px',
    cell: (row) => {
      const [modalVisibility, setModalVisibility] = useState(false);
      const [apiErrors, setApiErrors] = useState({});

      const handleDeleteInventory = async (inventoryId) => {
        try {
          await deleteInventory(`${inventoryId}`);
          toast.success(
            <>
              <CheckCircle className="mr-1 text-success" />
              Inventory successfully deleted
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
          <UncontrolledDropdown className="sentient-drop" style={{ cursor: 'pointer'}}>
            <DropdownToggle tag="div" className="btn btn-sm">
              <MoreVertical size={14} className="cursor-pointer action-btn" />
            </DropdownToggle>
            <DropdownMenu container="body">
              <DropdownItem 
                tag={Link}
                href={`/admin/inventorys/edit/${row.inventoryId}`}
                className="w-100"
              >
                
                <span className="align-middle px-3"><Archive size={14} className="mr-50" /> &nbsp; Edit</span>
              </DropdownItem>
              <DropdownItem className="w-100" onClick={() => setModalVisibility(!modalVisibility)}>
                <Trash2 size={14} className="mr-50" />
                <span className="align-middle">&nbsp; Delete</span>
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
              <div><strong>{row.inventoryName}</strong></div>
            </ModalBody>
            <ModalFooter className="justify-content-start">
              <Button color="primary" onClick={() => handleDeleteInventory(row.inventoryId)}>
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
