/**
 * Main app component.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

import React            from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';

import Dashboard        from './pages/Dashboard.jsx';
import Profile          from './pages/Profile.jsx';

export default class App extends React.Component {
    render(){
        return (
            <Switch>
                <Route path="/" exact component={Dashboard} />
                <Route path="/profile" component={Profile} />
                <Route path="/profile/:slug" component={Profile} />
            </Switch>
        );
    }
}
