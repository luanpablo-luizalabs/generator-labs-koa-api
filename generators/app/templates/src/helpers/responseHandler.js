const boom = require('boom')
const qs = require('querystring')
const commons = require('labs-standard-errors')

const buildJoiError = commons.buildJoiError
const buildGenericErrors = commons.buildGenericErrors
const errorParser = commons.errorParser

/**
 * Apigee error catalog
 */
const errorCatalog = {
  recordNotFound: 20023,
  resourceNotFound: 20022,
  badRequest: 20001,
  badRequestUniqueViolation: 20043,
  internalServerError: 10000,
  unauthorized: 30001
}

const errorSource = {
  payload: 'payload',
  params: 'params',
  query: 'query'
}

const ResponseHandler = () => {}

ResponseHandler.errorHandler = () => {}
ResponseHandler.errorCatalog = errorCatalog
ResponseHandler.errorSource = errorSource

/**
 * Method: Create an error object to throw, with luizalabs-commons pattern
 * @param {Object} error Error
 * @param {Number} apigeeErrorCode Apigee error code for chosen body content response
 * @param {String} sourceValidation Type of validation, can be payload, path, query or undefined
 */
ResponseHandler.parser = (error, apigeeErrorCode, sourceValidation) => {
  error.output = {}

  error.output = {
    payload: {
      validation: {
        source: sourceValidation
      }
    }
  }

  error.errorCode = apigeeErrorCode
  return error
}

/**
 * Method: Apply apigee error body response patterns
 * @param {Object} request - Current Request
 */
ResponseHandler.errorHandler.errorResponse = (error) => {
  let newResponse = {}

  if (error.data && (error.data.details || (error.data.parameters && error.data.parameters.details))) {
    newResponse = buildJoiError(error)
  } else if (error.data && error.data.errorCode) {
    newResponse = errorParser(error.data.errorCode, error.data.parameters)
  } else {
    newResponse = buildGenericErrors(error)
  }
  return newResponse
}

/**
 * Method: Create a record not found error object to raise
 * @param {String} message - Text to display that was not found
 */
ResponseHandler.errorHandler.recordNotFound = (message) => {
  const data = {
    errorCode: errorCatalog.recordNotFound,
    parameters: message
  }

  return boom.notFound('Record not found', data)
}

/**
 * Method: access unauthorized
 */
ResponseHandler.errorHandler.unauthorized = (message) => {
  const data = {
    errorCode: errorCatalog.unauthorized,
    parameters: message
  }

  return boom.unauthorized(message, data)
}

ResponseHandler.errorHandler.resourceNotFound = () => {
  const data = {
    errorCode: errorCatalog.recordNotFound,
    parameters: 'Resource'
  }

  return boom.notFound('Resource not found', data)
}

/**
 * Method: Create a bad request error object to raise
 * @param {Object} error - Error to raise
 * @param {String} source - Type of validation, can be payload, path, query or undefined
 */
ResponseHandler.errorHandler.badRequest = (error, source) => {
  let result = boom.badRequest('Bad request', error)
  let parsedError = ResponseHandler.parser(result, errorCatalog.badRequest, source)

  return parsedError
}

/**
 * Method: Create an internal server error object to be raised
 * @param {Object} message - Message to be displayed on error
 * @param {Object} error - Error to raise
 */
ResponseHandler.errorHandler.internal = (message, error) => {
  const data = {
    errorCode: errorCatalog.internalServerError,
    parameters: message
  }

  return boom.internal(message, data)
}

/**
 * Method: Apply apigee success body response patterns
 * @param {Object} request - Current Request
 */
ResponseHandler.successResponse = (request) => {
  const payload = Array.isArray(request.body) ? request.body : [request.body]
  const qsParams = qs.parse(request.querystring)

  const meta = {
    server: request.req.domain || request.req.headers.host,
    limit: qsParams.limit || payload.length,
    offset: qsParams.offset || 0,
    recordCount: payload.length
  }

  return {
    meta: meta,
    records: payload
  }
}

module.exports = ResponseHandler
