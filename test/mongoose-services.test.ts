import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { Mongoose } from 'mongoose';
import { connect } from 'mongoose';
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'

import MongooseBaseService, { Service } from '../src/mongoose/mongoose-base-service'
import MongooseDatabaseService, { Service as DatabaseService } from '../src/mongoose/mongoose-database-service'
import MongooseCollectionService, { Service as CollectionService } from '../src/mongoose/mongoose-collection-service'
import MongooseUserService, { Service as UserService } from '../src/mongoose/mongoose-user-service'
import MongooseRoleService, { Service as RoleService } from '../src/mongoose/mongoose-role-service'
import MongooseSessionService, { Service as SessionService } from '../src/mongoose/mongoose-session-service'

const debug = require('debug')('feathers-service-manager:mongoose-services:test')

describe('feathers-service-manager:mongoose-services', () => {
	let client, 
	mongoose, 
	serviceOptions, 
	serviceOptionsConnectionId,
	rawBaseService,
	rawDatabaseService,
	rawCollectionService,
	rawUserService,
	rawRoleService,
	rawSessionService
	const app = feathers()
	const defaultDb = {
		dbName: 'test',
		useNewUrlParser: true,
      	poolSize: 10,
      	autoReconnect: true,
      	keepAlive: true
	}
	before(() => {
		mongoose = new Mongoose()
		mongoose.connect('mongodb://127.0.0.1:27017', defaultDb)
		client = mongoose.connection
		serviceOptions = {
			id: '_id',
			events: ['testing'],
			connectionId: uuid(),
			client: client
		}
		serviceOptionsConnectionId = {
			id: '_id',
			events: ['testing'],
			client: serviceOptions.connectionId
		}

		rawBaseService = new Service(serviceOptions)
		rawBaseService.setup(app, '/base-service')
		rawDatabaseService = new DatabaseService(serviceOptions)
		rawDatabaseService.setup(app, '/database-service')
		rawCollectionService = new CollectionService(serviceOptions)
		rawCollectionService.setup(app, '/collection-service')
		rawUserService = new UserService(serviceOptions)
		rawUserService.setup(app, '/user-service')
		rawRoleService = new RoleService(serviceOptions)
		rawRoleService.setup(app, '/role-service')
		rawSessionService = new SessionService(serviceOptions)
		rawSessionService.setup(app, '/session-service')
	})
	describe('Base Service', () => {
		describe('Connection Methods', () => {
			describe('getConnectionType', () => {
				it(`returns the 'mongoose' connection type`, () => {
					expect(rawBaseService.getConnectionType()).to.equal('mongoose')
				})
			})
			describe('getServiceType', () => {
				it(`returns the 'base-service' service type`, () => {
					expect(rawBaseService.getServiceType()).to.equal('base-service')
				})
			})
			describe('healthCheck', () => {
				it(`returns the results of the mongoose client healthcheck`, () => {
					rawBaseService.healthCheck().then((status: any) => {
						expect(status).to.equal('nan')
					})
				})
			})
			describe('getInfo', () => {
				it(`returns the results of the mongoose info check`, () => {
					rawBaseService.getInfo().then((info: any) => {
						expect(info).to.equal('nan')
					})
				})
			})
			describe('getInstance', () => {
				it(`returns the mongoose client instance`, () => {
					rawBaseService.getInstance().then((instance: any) => {
						expect(instance).to.equal('nan')
					})
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'mongoose', '_id')
		//})
	})
	describe('Database Service', () => {
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'database-service' mongoose service type`, () => {
					expect(rawDatabaseService.getServiceType()).to.equal('database-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'mongoose-databases', '_id')
		//})
	})
	describe('Collection Service', () => {
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'collection-service' mongoose service type`, () => {
					expect(rawCollectionService.getServiceType()).to.equal('collection-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'mongoose-collections', '_id')
		//})
	})
	describe('User Service', () => {
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'user-service' mongoose service type`, () => {
					expect(rawUserService.getServiceType()).to.equal('user-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'mongoose-users', '_id')
		//})
	})
	describe('Role Service', () => {
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'role-service' mongoose service type`, () => {
					expect(rawRoleService.getServiceType()).to.equal('role-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'mongoose-roles', '_id')
		//})
	})
	describe('Session Service', () => {
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'session-service' mongoose service type`, () => {
					expect(rawSessionService.getServiceType()).to.equal('session-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'mongoose-sessions', '_id')
		//})
	})
	after(() => {
		setTimeout(() => {
			mongoose.connection.close()
		}, 3000)
	})
})
