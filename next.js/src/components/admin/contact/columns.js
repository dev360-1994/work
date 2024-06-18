/* eslint-disable react-hooks/rules-of-hooks */
// ** Third Party Components
import {
  Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import {
  MoreVertical, Archive, Trash2, CheckCircle,
} from 'react-feather';
import { useState } from 'react';

import {
   Edit3, Trash,
} from 'react-feather';

import { deleteContact } from '@src/api/contact.actions';
import { toast } from 'react-toastify';
import Link from 'next/link';

const columns = (type) => [
  {
    name: 'Name',
    maxWidth: '250px',
    sortable: true,
    selector: (row) => `${row.lastName} ${row.firstName}`,
  },
  {
    name: 'Address',
    maxWidth: '250px',
    sortable: true,
    selector: (row) => `${row.address}`,
  },
  {
    name: 'Email',
    maxWidth: '350px',
    selector: (row) => `${row.email}`,
    sortable: true,
  },
  (type === 'sell') && {
    name: 'Product',
    maxWidth: '400px',
    selector: (row) => row.productName,
    sortable: true,
  },
  (type === 'sell' || type === 'lease') && {
    name: 'SKU',
    maxWidth: '150px',
    selector: (row) => row.sku,
    sortable: true,
  },
  {
    name: 'Actions',
    width: '120px',
    cell: (row) => {
      const [modalVisibility, setModalVisibility] = useState(false);
      const [apiErrors, setApiErrors] = useState({});

      const handleDeleteContact = async (contactId) => {
        console.log("contactId"+contactId)
        try {
          await deleteContact(`${contactId}`);
          toast.success(
            <>
              <CheckCircle className="mr-1 text-success" />
              Contact successfully deleted
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
        
		  
		   <div className="row">
          <div className="col-sm-2">
            <Link
            passHref
              href={`/admin/contacts/edit/${row.contactId}?type=${type}`}
            >
              <Edit3 size={14} />
            </Link>
          </div>
          <div className="col-sm-2">
           
			<span className="align-middle"><Trash2 size={14} className="mr-50" onClick={() => setModalVisibility(!modalVisibility)} /></span>

          </div>
        </div>
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
              <div><strong>{row.email}</strong></div>
            </ModalBody>
            <ModalFooter className="justify-content-start">
              <Button color="primary" onClick={() => handleDeleteContact(row.contactId)}>
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
