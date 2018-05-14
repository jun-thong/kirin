/**
 * Alerts page component.
 *
 * @author jun.thong@me.com (Jun Thong)
 */
import React                from 'react';
import PropTypes            from 'prop-types';
import { subscribe }        from 'react-contextual';
import { translate }        from 'react-i18next';

export default class Dashboard extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        cases: PropTypes.array.isRequired
    };

    render() {
        return (
            <div>
                <h1>Alerts</h1>
            </div>
        );
    }
}
