import { Route, Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import * as storage from './storage.helper';
import jwtDecode from 'jwt-decode';
import { useSelector } from 'react-redux';



const ProtectedPageRoute = ({ component: Component, ...rest }) => {
    const user = storage.GetCookie('userdt');
    return (
        <Route {...rest}
            render={(props) => user ? (
                <Component />
            ) : (
                <Redirect to='/Login' />
            )}
        />
    )
}

const ProtectedReturnPage = ({ component: Component, ...rest }) => {
    const userData = useSelector((state) => state.user)
    return (
        <Route
            {...rest}
            render={(props) => userData.isAuth ? (
                <Redirect to='/' />
            ) : (
                <Component />
            )}
        />
    )
}

const ProtectedSellerPage = ({ component: Component, ...rest }) => {
    const sellerData = storage.GetCookie("userdt")
    let data = jwtDecode(sellerData);
    let seller = data.seller;
    return (
        <Route {...rest}
            render={(props) => seller ? (
                <Component />
            ) : (
                <Redirect to="/" />
            )
            }
        />
    )
}

export { ProtectedPageRoute, ProtectedReturnPage, ProtectedSellerPage }