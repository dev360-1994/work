// ** User List Component
import Table from './Table';
import FullLayout from '@src/layouts/FullLayout'
// ** Styles
// import '@styles/react/apps/app-users.scss';

const ProductsList = () => (
  <FullLayout>
    <div className="app-products-list">
      <Table />
    </div>
  </FullLayout>
);

export default ProductsList;
