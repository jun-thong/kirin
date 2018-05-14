'use strict';

/**
 *  Errors factory
 * Refactored to use ES2016 Classes.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

/**
 * Errors.
 *
 * @type {{name: string, httpError: number, code: string, msg: string}[]}
 */
let errors = [
    // error 40x
    { name: 'BadRequest', httpError: 400, code: '400', defaultMsg: 'The request cannot be fulfilled due to bad syntax.' },
    { name: 'Unauthorized', httpError: 401, code: '401', defaultMsg: 'Authentication is required.' },
    { name: 'PaymentRequired', httpError: 402, code: '402', defaultMsg: 'Payment is required.' },
    { name: 'Forbidden', httpError: 403, code: '403', defaultMsg: 'Forbidden, authenticating will make no difference.' },
    { name: 'InvalidParameters', httpError: 403, defaultMsg: 'Invalid request parameters' },
    { name: 'NotFound', httpError: 404, defaultMsg: 'Requested data can\'t be found.' },

    // error 50x
    { name: 'InternalServerError', httpError: 500, code: '500', defaultMsg: 'Internal server error.' },
    { name: 'ServiceUnavailable', httpError: 503, code: '503', defaultMsg: 'The server is currently unavailable.' },
    { name: 'UploadFail', httpError: 503, code: '503', defaultMsg: 'Uploading file had failed.' },
    { name: 'UploadAborted', httpError: 200, code: '200', defaultMsg: 'Uploading file had been aborted or timed-out' },

    // application specific error
    { name: 'InviteAlreadySent', httpError: 403, code: '403', defaultMsg: 'Invite already sent by user.' },
    { name: 'InviteAlreadySentSomeoneElse', httpError: 403, code: '403', defaultMsg: 'Invite already sent by an other user.' },
    { name: 'InviteBanned', httpError: 403, code: '403', defaultMsg: 'User tries to invite a banned mail.' }
];

/**
 * An abstract error.
 */
class AbstractError extends Error {
    /**
     * Build the error object.
     *
     * @constructor
     * @param {String} message
     * @param {String} name
     * @param {Number} httpError
     * @param {Error} originalError original source error, if needed.
     */
    constructor(message, name, httpError, originalError){
        super(message);
        Object.assign(this, {
            name, httpError, causedBy: originalError
        });
    }
}

/**
 * Error classes's factory.
 *
 * @type {{}}
 * @private
 */
let _errorClasses = Object.keys(errors).reduce((acc, current) => {
    let { name, httpError, defaultMsg } = errors[current];
    return {
        ...acc,
        [name]: class extends AbstractError {
            constructor(message = null, originalError = null){
                super((message || defaultMsg), name, httpError, originalError);
            }
        }
    };
}, {});

/**
 * @type {{}}
 *
 * 40X errors :
 * @property {Function} BadRequest
 * @property {Function} Unauthorized
 * @property {Function} PaymentRequired
 * @property {Function} Forbidden
 * @property {Function} InvalidParameters
 * @property {Function} NotFound
 *
 * 50X errors :
 * @property {Function} InternalServerError
 * @property {Function} ServiceUnavailable
 * @property {Function} UploadFail
 * @property {Function} UploadAborted
 *
 * application specific error
 * @property {Function} InviteAlreadySent
 * @property {Function} InviteAlreadySentSomeoneElse
 * @property {Function} InviteBanned
 */
module.exports = _errorClasses;
