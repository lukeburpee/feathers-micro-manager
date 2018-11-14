import { assert, expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import ConnectionService, { Service } from '../src/connection-service'
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'

const debug = require('debug')('feathers-service-manager:connection-service:test')

describe('feathers-service-manager:connection-service', () => {
	let serviceOptionsMissingClient, serviceOptions, serviceOptionsConnectionId
	const app = feathers()
	serviceOptionsMissingClient = {
		events: ['testing']
	}
	serviceOptions = {
		connectionId: uuid(),
		client: {},
		events: ['testing']
	}
	serviceOptionsConnectionId = {
		client: serviceOptions.connectionId
	}
	app.use('connections', ConnectionService(serviceOptions))

	const service = app.service('connections')
	const rawService = new Service(serviceOptions)
	rawService.setup(app, '/connection-service-test')
	describe('Initialization', () => {
		describe('Missing client option', () => {
			it('throws an error', () => {
				expect(() => new Service(serviceOptionsMissingClient))
				.to.throw('connection-base client must be provided')
			})
		})
	})
	//describe('Common Service Tests', () => {
	//	base(app, errors, 'connections', 'id')
	//})
	describe('Custom Methods', () => {
		describe('createConnection', () => {
			const createId = uuid()
			it('adds a connection to the connection store and returns the original connection data', () => {
				return rawService.createConnection(createId, 'client').then((result: any) => {
					expect(result.id).to.equal(createId)
					expect(result.client).to.equal('client')
				})
			})
		})

		describe('getConnection', () => {})

		describe('updateConnection', () => {
			it('updates an existing connection with provided data', () => {})
		})

		describe('patchConnection', () => {
			it('patches an existing connection with provided data', () => {})
		})

		describe('getConnectionId', () => {
			it(`returns the current service's connectionId`, () => {
				expect(rawService.getConnectionId()).to.equal(serviceOptions.connectionId)
			})
		})

		describe('getConnectionType', () => {
			it(`returns a promise placeholder for the service connectionType`, () => {
			})
		})

		describe('getServiceType', () => {
			it(`returns a promise placeholder for the serviceType`, () => {})
		})

		describe('healthCheck', () => {
			it(`returns a promise placeholder for the service healthcheck`, () => {})
		})

		describe('getInfo', () => {
			it(`returns a promise placeholder for service info check`, () => {})
		})

		describe('getInstance', () => {
			it(`returns a promise placeholder for the service instance check`, () => {

			})
		})

		describe('removeConnection', () => {
			it('removes a connection from the connection store and returns the removed connection', (() => {
				return rawService.removeConnection(serviceOptions.connectionId).then(result => {
					expect(result.id).to.equal(serviceOptions.connectionId)
				})
			}))
		})
	})
})
