/**
 * Profile component.
 *
 * @author jun.thong@me.com (Jun Thong)
 */
import React                from 'react';
import PropTypes            from 'prop-types';
import { subscribe }        from 'react-contextual';
import { translate }        from 'react-i18next';

@translate(['commons', 'profile'])
@subscribe(store => ({
    feed: store.feed
}))
export default class Dashboard extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        feed: PropTypes.array.isRequired
    };

    render() {
        const { feed } = this.props;
        console.log('render()');

        return (
            <div>
                <h1>Profile</h1>
                {JSON.stringify(feed)}
            </div>
        );
    }
}
