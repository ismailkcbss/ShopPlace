import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { StyleProvider } from '@ant-design/cssinjs';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StyleProvider hashPriority="high">
        <Provider store={store}>
            <App />
        </Provider>
    </StyleProvider>
);

