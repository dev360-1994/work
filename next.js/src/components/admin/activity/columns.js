import {
  CheckCircle, Edit3, Trash,
} from 'react-feather';

import { toast } from 'react-toastify';
import { updateSetInActive } from '@src/api/contact.actions';
import Link from 'next/link';

export const columns = (type) => [
  {
    name: 'Name',
    maxWidth: '500px',
    sortable: true,
    selector: (row) => `${row.lastName} ${row.firstName}`,
  },
  {
    name: 'CompanyName',
    sortable: true,
    maxWidth: '250px',
    selector: (row) => `${row.companyName}`,
  },
  {
    name: 'Address',
    maxWidth: '250px',
    sortable: true,
    selector: (row) => `${row.address}`,
  },
  {
    name: 'Product',
    maxWidth: '400px',
    selector: (row) => `${row.productName}`,
    sortable: true,
  },
  {
    name: 'SKU',
    maxWidth: '150px',
    selector: (row) => `${row.sku}`,
    sortable: true,
  },
  {
    name: 'Phone',
    maxWidth: '150px',
    selector: (row) => `${row.phone}`,
    sortable: true,
  },
  {
    name: 'UpdatedAt',
    maxWidth: '250px',
    selector: (row) => `${row.updatedAt}`,
    sortable: true,
  },
  {
    name: 'Actions',
    width: '120px',
    cell: (row) => {
      const handleCliks = async (contactId) => {
        try {
          console.log("${row.contactId}"+`${row.contactId}`);
          await updateSetInActive(`${row.contactId}`, `${row.contactType}`);
          toast.success(
            <>
              <CheckCircle className="mr-1 text-success" />
              Contact successfully inactived.
            </>, {
              hideProgressBar: true,
            }
          );
       window.location.reload();
        } catch (err) {
         console.log(err);
        }
      };

      return (
        <div className="row">
          <div className="col-sm-2">
            <Link
            passHref
              href={`/admin/contacts/edit/${row.contactId}?type=${row.contactType}`}
            >
              <Edit3 size={14} />
            </Link>
          </div>
          <div className="col-sm-2">
            <Trash size={14} style={{ cursor: 'pointer' }} onClick={() => handleCliks(row.contactId)} />
          </div>
        </div>
      );
    },
  },
];
