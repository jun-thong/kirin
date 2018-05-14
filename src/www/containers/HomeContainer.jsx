/**
 * homepage component.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

import React                        from 'react';
import Home                         from '../pages/Home.jsx';
import { I18nextProvider }          from 'react-i18next';
import i18n                         from '../utils/i18n.jsx';

export default class HomeContainer extends React.Component {
    render(){
        return (
            <I18nextProvider i18n={i18n}>
                <Home />
            </I18nextProvider>
        );
    }
}
