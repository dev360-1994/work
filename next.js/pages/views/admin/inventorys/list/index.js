// ** User List Component
import Table from './Table';
import FullLayout from '@src/layouts/FullLayout'
// ** Styles
// import '@styles/react/apps/app-users.scss';

const InventoryList = () => (
  <FullLayout>
    <div className="app-inventory-list">
      <Table />
    </div>
  </FullLayout>
);

export default InventoryList;
