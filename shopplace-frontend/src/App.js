import './App.css';
import 'antd/dist/reset.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom/cjs/react-router-dom.min';
import * as storage from './storage.helper';
import { useSelector, useDispatch } from 'react-redux';
import { axiosInstance } from './axios.util';
import { userActions } from './redux/slice/userSlice';
import { useEffect } from 'react';
import { ProtectedReturnPage } from './protected.route';

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


function App() {

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Refresh page is not lose data
  const userData = async () => {
    const token = storage.getValueByKey('userdt');
    try {
      if (token) {
        const { data } = await axiosInstance.get('/User/UserMe');
        dispatch(userActions.set(data))
      }
    } catch (error) {
      alert(error);
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


          <Route exact path='/MyProfile' component={MyProfile} />
          <Route exact path='/MyCart' component={MyCart} />
          <Route exact path='/MyFavorites' component={MyFavorites} />
          <Route exact path='/PayPage' component={PayPage} />


          <Route exact path='/ClothesProductCardItem/:id' component={ClothesProductCardItem} />
          <Route exact path='/ShoesProductCardItem/:id' component={ShoesProductCardItem} />
          <Route exact path='/ElectronicProductCardItem/:id' component={ElectronicProductCardItem} />
          <Route exact path='/PersonalCareProductCardItem/:id' component={PersonalCareProductCardItem} />
          <Route exact path='/BagProductCardItem/:id' component={BagProductCardItem} />



          <Route exact path='/ClothesProductViewer/:id' component={ClothesProductViewer} />
          <Route exact path='/ShoesProductViewer/:id' component={ShoesProductViewer} />
          <Route exact path='/ElectronicProductViewer/:id' component={ElectronicProductViewer} />
          <Route exact path='/PersonalCareProductViewer/:id' component={PersonalCareProductViewer} />
          <Route exact path='/BagProductViewer/:id' component={BagProductViewer} />



          <Route exact path='/ClothesAddProduct' component={ClothesAddProduct} />
          <Route exact path='/ShoesAddProduct' component={ShoesAddProduct} />
          <Route exact path='/ElectronicAddProduct' component={ElectronicAddProduct} />
          <Route exact path='/PersonalCareAddProduct' component={PersonalCareAddProduct} />
          <Route exact path='/BagAddProduct' component={BagAddProduct} />



          <Route exact path='/ClothesAddProduct/:id' component={ClothesAddProduct} />
          <Route exact path='/ShoesAddProduct/:id' component={ShoesAddProduct} />
          <Route exact path='/ElectronicAddProduct/:id' component={ElectronicAddProduct} />
          <Route exact path='/PersonalCareAddProduct/:id' component={PersonalCareAddProduct} />
          <Route exact path='/BagAddProduct/:id' component={BagAddProduct} />




          <ProtectedReturnPage exact path='/Login' component={Login} />
          <ProtectedReturnPage exact path='/Register' component={Register} />
          <ProtectedReturnPage exact path='/ForgotPassword' component={ForgotPassword} />
          <ProtectedReturnPage exact path='/NewPassword' component={NewPassword} />



        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
