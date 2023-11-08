import './App.css';
import 'antd/dist/reset.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom/cjs/react-router-dom.min';
import * as storage from './storage.helper';
import { useSelector, useDispatch } from 'react-redux';
import { axiosInstance } from './axios.util';
import { userActions } from './redux/slice/userSlice';
import { useEffect } from 'react';
import { ProtectedReturnPage, ProtectedPageRoute, ProtectedSellerPage } from './protected.route';

import HomePage from './mainComponents/HomePage';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import NewPassword from './auth/NewPassword';
import ContactUs from './mainComponents/ContactUs';
import MyProfile from './mainComponents/MyProfile';
import MyCart from './mainComponents/MyCart';
import MyFavorites from './mainComponents/MyFavorites';
import CategoryList from './mainComponents/CategoryList';
import PayPage from './mainComponents/PayPage';

import ClothesAddProduct from './ClothesComponents/ClothesAddProduct';
import ShoesAddProduct from './ShoesComponents/ShoesAddProduct';
import ElectronicAddProduct from './ElectronicComponents/ElectronicAddProduct';
import PersonalCareAddProduct from './PersonalCareComponents/PersonalCareAddProduct';
import BagAddProduct from './BagComponents/BagAddProduct';

import ClothesProductViewer from './ClothesComponents/ClothesProductViewer';
import ShoesProductViewer from './ShoesComponents/ShoesProductViewer';
import ElectronicProductViewer from './ElectronicComponents/ElectronicProductViewer';
import PersonalCareProductViewer from './PersonalCareComponents/PersonalCareProductViewer';
import BagProductViewer from './BagComponents/BagProductViewer';

import ClothesProductCardItem from './ClothesComponents/ClothesComponentsItem/ClothesProductCardItem';
import ShoesProductCardItem from './ShoesComponents/ShoesComponentsItem/ShoesProductCardItem';
import ElectronicProductCardItem from './ElectronicComponents/ElectronicComponentsItem/ElectronicProductCardItem';
import PersonalCareProductCardItem from './PersonalCareComponents/PersonalCareComponentsItem/PersonalCareProductCardItem';
import BagProductCardItem from './BagComponents/BagComponentsItem/BagProductCardItem';


import { notification } from 'antd';



function App() {

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();


  const showNotification = (icon, message) => {
    if (icon === 'error') {
      let notificationClass = 'custom-error-notification';
      notification.error({
        message: 'Error',
        description: message,
        placement: 'topRight',
        className: notificationClass,
      });
    } else if (icon === 'success') {
      let notificationClass = 'custom-success-notification';
      notification.success({
        message: 'Success',
        description: `${message}`,
        placement: 'topRight',
        className: notificationClass
      });
    }
  };


  // Refresh page is not lose data
  const userData = async () => {
    const token = storage.getValueByKey('userdt');
    try {
      if (token) {
        const { data } = await axiosInstance.get('/User/UserMe');
        dispatch(userActions.set(data))
      }
    } catch (error) {
      showNotification('error', "Not Found user")
    }
  }

  useEffect(() => {
    if (!user.isAuth) userData();
  }, [user.isAuth])

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>


          <Route exact path='/' component={HomePage} />
          <Route exact path='/ContactUs' component={ContactUs} />
          <Route exact path='/CategoryList/:productType' component={CategoryList} />


          <Route exact path='/ClothesProductCardItem/:id' component={ClothesProductCardItem} />
          <Route exact path='/ShoesProductCardItem/:id' component={ShoesProductCardItem} />
          <Route exact path='/ElectronicProductCardItem/:id' component={ElectronicProductCardItem} />
          <Route exact path='/PersonalCareProductCardItem/:id' component={PersonalCareProductCardItem} />
          <Route exact path='/BagProductCardItem/:id' component={BagProductCardItem} />


          <ProtectedReturnPage exact path='/Login' component={Login} />
          <ProtectedReturnPage exact path='/Register' component={Register} />
          <ProtectedReturnPage exact path='/ForgotPassword' component={ForgotPassword} />
          <ProtectedReturnPage exact path='/NewPassword' component={NewPassword} />


          <ProtectedPageRoute exact path='/MyProfile' component={MyProfile} />
          <ProtectedPageRoute exact path='/MyCart' component={MyCart} />
          <ProtectedPageRoute exact path='/MyFavorites' component={MyFavorites} />
          <ProtectedPageRoute exact path='/PayPage' component={PayPage} />


          <ProtectedPageRoute exact path='/ClothesAddProduct' component={ClothesAddProduct} />
          <ProtectedPageRoute exact path='/ShoesAddProduct' component={ShoesAddProduct} />
          <ProtectedPageRoute exact path='/ElectronicAddProduct' component={ElectronicAddProduct} />
          <ProtectedPageRoute exact path='/PersonalCareAddProduct' component={PersonalCareAddProduct} />
          <ProtectedPageRoute exact path='/BagAddProduct' component={BagAddProduct} />


          <ProtectedPageRoute exact path='/ClothesAddProduct/:id' component={ClothesAddProduct} />
          <ProtectedPageRoute exact path='/ShoesAddProduct/:id' component={ShoesAddProduct} />
          <ProtectedPageRoute exact path='/ElectronicAddProduct/:id' component={ElectronicAddProduct} />
          <ProtectedPageRoute exact path='/PersonalCareAddProduct/:id' component={PersonalCareAddProduct} />
          <ProtectedPageRoute exact path='/BagAddProduct/:id' component={BagAddProduct} />


          <ProtectedSellerPage exact path='/ClothesProductViewer/:id' component={ClothesProductViewer} />
          <ProtectedSellerPage exact path='/ShoesProductViewer/:id' component={ShoesProductViewer} />
          <ProtectedSellerPage exact path='/ElectronicProductViewer/:id' component={ElectronicProductViewer} />
          <ProtectedSellerPage exact path='/PersonalCareProductViewer/:id' component={PersonalCareProductViewer} />
          <ProtectedSellerPage exact path='/BagProductViewer/:id' component={BagProductViewer} />


        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
