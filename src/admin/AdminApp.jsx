/**
 * Main admin app component.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

import React            from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';

import Alerts                       from './pages/Alerts.jsx';

export default class AdminApp extends React.Component {
    render(){
        return (
            <Switch>
                <Route path="/" exact component={Alerts} />
            </Switch>
        );
    }
}
