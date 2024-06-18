/* eslint-disable react-hooks/rules-of-hooks */
// ** React Imports
import {
  Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import {
  MoreVertical, Archive, Trash2, CheckCircle,
} from 'react-feather';
import { useState } from 'react';

import { toast } from 'react-toastify';
import { deleteWarranty } from '@src/api/warranty.actions';
import Link from 'next/link';

const columns = (type) => [
  {
    name: 'Model',
    sortable: true,
    maxWidth: '350px',
    selector: (row) => `${row.warranty.model}`,
  },
  {
    name: 'Manufacturer',
    maxWidth: '350px',
    sortable: true,
    selector: (row) => `${row.warranty.manufacturer}`,
  },
  {
    name: 'Year',
    maxWidth: '150px',
    selector: (row) => `${row.warranty.year}`,
    sortable: true,
  },
  {
    name: 'Issues/Error Codes',
    maxWidth: '250px',
    selector: (row) => `${row.warranty.issues}`,
    sortable: true,
  },
  {
    name: 'Preferred mode of contact',
    maxWidth: '250px',
    selector: (row) => `$${row.warranty.preferredContactMode}`,
    sortable: true,
  },
  {
    name: 'Action',
    width: '120px',
    cell: (row) => {
      const [modalVisibility, setModalVisibility] = useState(false);
      const [apiErrors, setApiErrors] = useState({});

      const handleDeleteWarranty = async (warrantyId) => {
        try {
          await deleteWarranty(`${warrantyId}`);
          toast.success(
            <>
              <CheckCircle className="mr-1 text-success" />
              Warranty successfully deleted
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
          <UncontrolledDropdown className="sentient-drop" style={{ zIndex: '1000'}}>
            <DropdownToggle tag="div" className="btn btn-sm">
              <MoreVertical size={14} className="cursor-pointer action-btn" />
            </DropdownToggle>
            <DropdownMenu container="body">
              <DropdownItem
                tag={Link}
                href={`/admin/warranty/edit/${row.warranty.warrantyId}`}
                className="w-100"
              >
                <span className="align-middle px-3"><Archive size={14} className="mr-50" />&nbsp; Edit</span>
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
              <Button color="primary" onClick={() => handleDeleteWarranty(row.warranty.warrantyId)}>
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