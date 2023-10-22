import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { userActions } from '../redux/slice/userSlice';
import * as storage from '../storage.helper';

export default function Navbar() {

  const user = useSelector((state) => state.user)
  const history = useHistory();
  const dispatch = useDispatch();


  const ClickLogout = async () => {
    dispatch(userActions.logout());
    storage.setKeyWithValue("userdt", "");
    storage.RemoveCookie('userdt')
    history.push('/Login');
  }

  return (
    <div className='Navbar'>
      <div className='HeaderDiv'>
        <p onClick={() => history.push('/')}>Shop Place</p>
      </div>
      <div className='InteractDiv'>
        <button className='NavbarButton' onClick={() => history.push('/ContactUs')}>Contact</button>
        <button className='NavbarButton' onClick={() => history.push('/MyFavorites')}>Favorites</button>
        <button className='NavbarButton' onClick={() => history.push('/MyCart')}>My Cart</button>
      </div>
      <div className='InoutDiv'>
        {
          user.isAuth ? (
            <div>
              <button className='NavbarButton' onClick={() => history.push('/MyProfile')}>{user.user.username}</button>
              <button className='NavbarButton' onClick={ClickLogout}>Logout</button>
            </div>
          ) : (
            <button className='NavbarButton' onClick={() => history.push('/Login')}>Login</button>
          )
        }
      </div>
    </div>
  )
}
