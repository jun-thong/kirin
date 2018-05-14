import React                        from 'react';
import { Provider }                 from 'react-contextual';
import { StaticRouter }             from 'react-router-dom';
import { I18nextProvider }          from 'react-i18next';
import i18n                         from '../../www/utils/i18n.jsx';
import PropTypes                    from 'prop-types';

import DefaultLayout                from '../layouts/DefaultLayout.jsx';
import AdminApp                     from '../AdminApp.jsx';

/**
 * App container component.
 * Server side version.
 * Get initialState from express, and use StaticRouter.
 */
export default class AppContainer extends React.Component {
    static propTypes = {
        initialState: PropTypes.object,
        context: PropTypes.object,
        location: PropTypes.string
    };

    store = {};

    constructor(props){
        super(props);
        this.store = {
            initialState: this.props.initialState,
            actions: {}
        };
    }

    render(){
        return (
            <Provider { ...this.store } >
                <StaticRouter context={this.props.context} location={this.props.location} basename="/w">
                    <I18nextProvider i18n={i18n}>
                        <DefaultLayout>
                            <AdminApp />
                        </DefaultLayout>
                    </I18nextProvider>
                </StaticRouter>
            </Provider>
        );
    }
}
