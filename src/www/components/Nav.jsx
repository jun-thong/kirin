/**
 * NavBar component.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

import React                        from 'react';
import PropTypes                    from 'prop-types';
import { NavLink }                  from 'react-router-dom';
import { translate }    from 'react-i18next';

@translate(['commons', 'nav'])
export default class Nav extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired
    };

    render(){
        let { t } = this.props;

        return (
            <nav>
                <ul>
                    <li>
                        <NavLink to="/" className="nav-el"><span className="icon-home icon-large" /></NavLink>
                    </li>

                    <li>
                        <NavLink to="/profile" className="nav-el"><span className="icon-user icon-large" /></NavLink>
                    </li>

                    <li>
                        <a href="/channels" className="nav-el"><span className="icon-channel icon-large" /></a>
                    </li>

                    <li>
                        <a href="/channels" className="nav-el"><span className="icon-notification icon-large" /></a>
                    </li>

                    <li>
                        <a href="/chat" className="nav-el"><span className="icon-chat icon-large" /></a>
                    </li>

                    <li>
                        <a href="/settings" className="nav-el"><span className="icon-cog icon-large" /></a>
                    </li>

                    <li>
                        <a href="/logout" className="nav-el"><span className="icon-logout icon-large" /></a>
                    </li>
                </ul>
            </nav>
        );
    }
}
