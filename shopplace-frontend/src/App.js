import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom/cjs/react-router-dom.min';
import HomePage from './mainComponents/HomePage';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import * as storage from './storage.helper';
import { useSelector, useDispatch } from 'react-redux';
import { axiosInstance } from './axios.util';
import { userActions } from './redux/slice/userSlice';
import { useEffect } from 'react';
import { ProtectedReturnPage } from './protected.route';
import NewPassword from './auth/NewPassword';
import ContactUs from './mainComponents/ContactUs';
import ClothesProductCardItem from './ClothesComponents/ClothesComponentsItem/ClothesProductCardItem';
import ClothesAddProduct from './ClothesComponents/ClothesAddProduct';
import MyProfile from './mainComponents/MyProfile';
import MyCart from './mainComponents/MyCart';
import MyFavorites from './mainComponents/MyFavorites';
import ClothesProductViewer from './ClothesComponents/ClothesProductViewer';
import CategoryList from './mainComponents/CategoryList';
import ShoesAddProduct from './ShoesComponents/ShoesAddProduct';
import ShoesProductCardItem from './ShoesComponents/ShoesComponentsItem/ShoesProductCardItem';
import ShoesProductViewer from './ShoesComponents/ShoesProductViewer';
import PayPage from './mainComponents/PayPage';



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
      console.log("App = ", error);
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


          <Route exact path='/ClothesProductViewer/:id' component={ClothesProductViewer} />
          <Route exact path='/ShoesProductViewer/:id' component={ShoesProductViewer} />


          <Route exact path='/ClothesAddProduct' component={ClothesAddProduct} />
          <Route exact path='/ClothesAddProduct/:id' component={ClothesAddProduct} />
          <Route exact path='/ShoesAddProduct' component={ShoesAddProduct} />
          <Route exact path='/ShoesAddProduct/:id' component={ShoesAddProduct} />


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
