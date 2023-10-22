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

const ProtectedAdminPage = ({ component: Component, ...rest }) => {
    const adminData = storage.GetCookie("userdt")
    let data = jwtDecode(adminData);
    let admin = data.admin;
    return (
        <Route {...rest}
            render={(props) => admin ? (
                <Component />
            ) : (
                <Redirect to="/" />
            )
            }
        />
    )
}

export { ProtectedPageRoute, ProtectedReturnPage, ProtectedAdminPage }