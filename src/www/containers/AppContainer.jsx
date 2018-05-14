import React                        from 'react';
import { Provider }                 from 'react-contextual';
import { BrowserRouter }            from 'react-router-dom';
import { I18nextProvider }          from 'react-i18next';
import i18n                         from '../utils/i18n.jsx';

import DefaultLayout                from '../layouts/DefaultLayout.jsx';
import App                          from '../App.jsx';

/**
 * App container component.
 * Browser side version.
 * Get initialState from global scope and use BrowserRouter.
 */
export default class AppContainer extends React.Component {
    render(){
        return (
            <Provider { ...window.__INITIAL_STORE__ } >
                <BrowserRouter basename="/w">
                    <I18nextProvider i18n={i18n}>
                        <DefaultLayout>
                            <App />
                        </DefaultLayout>
                    </I18nextProvider>
                </BrowserRouter>
            </Provider>
        );
    }
}
