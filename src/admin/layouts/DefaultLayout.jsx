/**
 * Default layout as a component.
 *
 * @author jun.thong@me.com (Jun Thong)
 */
import React            from 'react';
import PropTypes        from 'prop-types';

export default class DefaultLayout extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]).isRequired
    };

    render(){
        const { children } = this.props;

        return (
            <div id="container">
                {children}
            </div>
        );
    }
}
