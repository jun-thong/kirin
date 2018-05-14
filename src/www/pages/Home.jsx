/**
 * Index page content.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

import React from 'react';
import PropTypes            from 'prop-types';
import { translate }        from 'react-i18next';
import wretch               from 'wretch';

@translate(['commons', 'index'])
export default class Home extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired
    };

    /**
     * Override constructor to défine a default local state.
     * @constructor
     * @param {Object} props
     */
    constructor(props) {
        super(props);

        this.state = {
            mail: '',
            password: '',
            isLoading: false,
            hasError: false
        };
    }

    /**
     * Map actual inputs to local state.
     * @param {SyntheticEvent} e
     */
    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({
            isLoading: true
        });

        await this.login();
    };

    login = () => {
        const loginUrl = document.querySelector('#login').getAttribute('action');
        const loginForm = {
            mail: document.querySelector('input[name="mail"]').value,
            password: document.querySelector('input[name="password"]').value
        };

        wretch(loginUrl)
            .options({ credentials: 'same-origin' })
            .formUrl(loginForm)
            .post()
            .error(400, () => {
                this.setState({ hasError: true, isLoading: false });
            })
            .json(() => {
                // TODO check for success.
                location.href = '/w';
            })
            .catch(() => {
                this.setState({ hasError: true, isLoading: false });
            });
    };

    render(){
        const { t } = this.props;

        return (
            <form id={'login'} action="/login" method="POST" noValidate  onSubmit={this.handleSubmit}>
                <img src="http://via.placeholder.com/260x390" width="260" height="390" alt=""/>

                {this.state.hasError &&
                <div className="callout alert">
                    {t('callout:invalidLogin')}
                </div>
                }

                <input
                    type="email"
                    name="mail"
                    placeholder={t('index:mailPlaceholder')}
                    onChange={this.handleInputChange}
                    disabled={this.state.isLoading}
                    className={`${this.state.hasError ? 'error' : ''}`}
                    autoComplete="on" />

                <input
                    type="password"
                    name="password"
                    placeholder={t('index:pwdPlaceholder')}
                    onChange={this.handleInputChange}
                    disabled={this.state.isLoading}
                    className={`${this.state.hasError ? 'error' : ''}`}
                    autoComplete="off" />

                <input
                    type="submit"
                    value={t('index:submit')}
                    disabled={this.state.isLoading} />
            </form>
        );
    }
}
