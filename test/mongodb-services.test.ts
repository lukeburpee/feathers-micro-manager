import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { connect } from 'mongodb';
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'

import { Service } from '../src/mongodb/mongodb-base-service'
import { Service as DatabaseService } from '../src/mongodb/mongodb-database-service'

const debug = require('debug')('feathers-service-manager:mongodb-services:test')

describe('feathers-service-manager:mongodb-services', () => {
	let conn
	const app = feathers()
	const db = {
		useNewUrlParser: true,
      	poolSize: 10,
      	autoReconnect: true,
      	keepAlive: true
	}

	const connection = () => {
		return connect('mongodb://127.0.0.1:27017', db).then((connection: any) => {
			conn = connection
			return connection
		}).catch(error => {
			console.log(`error connecting to mongodb: ${error.message}`)
		});
	}

	const serviceOptions = {
		events: ['testing'],
		client: connection(),
		defaultDb: 'test'
	}
	describe('Base Service', () => {
		const rawBaseService = new Service(serviceOptions)
		rawBaseService.setup(app, '/mongoose-service')
		describe('Connection Methods', () => {
			describe('getConnectionType', () => {
				it(`returns the 'mongodb' connection type`, () => {
					expect(rawBaseService.getConnectionType()).to.equal('mongodb')
				})
			})
			describe('getServiceType', () => {
				it(`returns the 'base-service' mongodb service type`, () => {
					expect(rawBaseService.getServiceType()).to.equal('base-service')
				})
			})
			describe('healthCheck', () => {
				it(`returns the results of the mongodb client healthcheck`, () => {
					return rawBaseService.healthCheck().then((status: any) => {
						expect(status.ok).to.equal(1)
					})
				})
			})
			describe('getInfo', () => {
				it(`returns the results of the mongodb info check`, () => {
					return rawBaseService.getInfo().then((info: any) => {
						expect(info).to.have.property('version')
					})
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'mongoose', '_id')
		//})
	})
	describe('Database Service', () => {
		const rawDbService = new DatabaseService(serviceOptions)
		rawDbService.setup(app, '/mongoose-service')
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'base-service' mongodb service type`, () => {
					expect(rawDbService.getServiceType()).to.equal('database-service')
				})
			})
		})
	})
	after(() => {
		setTimeout(() => {
			conn.close()
		}, 3000)
	})
})