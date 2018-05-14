import React                        from 'react';
import { Provider }                 from 'react-contextual';
import { I18nextProvider }          from 'react-i18next';
import i18n                         from '../../www/utils/i18n.jsx';
import { BrowserRouter }            from 'react-router-dom';

import DefaultLayout                from '../layouts/DefaultLayout.jsx';
import AdminApp                     from '../AdminApp.jsx';

/**
 * App container component.
 * Browser side version.
 * Get initialState from global scope and use BrowserRouter.
 */
export default class AdminContainer extends React.Component {
    render(){
        return (
            <Provider { ...window.__INITIAL_STORE__ } >
                <BrowserRouter basename="/w">
                    <I18nextProvider i18n={i18n}>
                        <DefaultLayout>
                            <AdminApp />
                        </DefaultLayout>
                    </I18nextProvider>
                </BrowserRouter>
            </Provider>
        );
    }
}
