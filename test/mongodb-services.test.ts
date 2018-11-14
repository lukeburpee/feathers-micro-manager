import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { MongoClient, ObjectId } from 'mongodb'
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'
import containerized from 'containerized'

import MongoDBBaseService, { Service } from '../src/mongodb/mongodb-base-service'
import MongoDBDatabaseService, { Service as DatabaseService } from '../src/mongodb/mongodb-database-service'
import MongoDBCollectionService, { Service as CollectionService } from '../src/mongodb/mongodb-collection-service'
import MongoDBUserService, { Service as UserService } from '../src/mongodb/mongodb-user-service'
import MongoDBRoleService, { Service as RoleService } from '../src/mongodb/mongodb-role-service'
import MongoDBSessionService, { Service as SessionService } from '../src/mongodb/mongodb-session-service'

const debug = require('debug')('feathers-service-manager:mongodb-services:test')

describe('feathers-service-manager:mongodb-services', () => {
	let client, 
	db, 
	adminDb, 
	serviceOptions, 
	serviceOptionsConnectionId,
	rawBaseService,
	rawDatabaseService,
	rawCollectionService,
	rawUserService,
	rawRoleService,
	rawSessionService
	const app = feathers()
	const dbUrl = containerized ? 'mongodb://mongodb:27017' : 'mongodb://127.0.0.1:27017'
	const noClientOptions = {
		events: ['testing']
	}
	const defaultDb = {
		dbName: 'test',
		options: {
      		useNewUrlParser: true,
      		poolSize: 10,
      		autoReconnect: true,
      		keepAlive: true
      	}
    }
    before(() => {
		return MongoClient.connect(dbUrl, defaultDb.options).then(mongo => {
			client = mongo
			db = mongo.db('test')
			serviceOptions = {
				id: '_id',
				connectionId: uuid(),
				client: mongo,
				events: ['testing']
			}
			serviceOptionsConnectionId = {
				id: '_id',
				client: serviceOptions.connectionId
			}
			rawBaseService = new Service(serviceOptions)
			rawBaseService.setup(app, '/mongodb')
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
	})
	describe('Base Service', () => {
		describe('Connection Methods', () => {
			describe('getConnectionType', () => {
				it(`returns the 'mongodb' connection type`, () => {
					expect(rawBaseService.getConnectionType()).to.equal('mongodb')
				})
			})
			describe('getServiceType', () => {
				it(`returns the mongodb 'base-service' service type`, () => {
					expect(rawBaseService.getServiceType()).to.equal('base-service')
				})
			})
			describe('healthCheck', () => {
				it(`returns the result of the mongodb client healthcheck`, () => {
					rawBaseService.healthCheck().then((status: any) => {
						expect(status).to.equal(true)
					})
				})
			})
			describe('getInfo', () => {
				it(`returns the results of the monodb client info check`, () => {
					rawBaseService.getInfo().then((info: any) => {
						expect(info).to.equal('nan')
					})
				})
			})
			describe('getInstance', () => {
				it(`returns the mongodb client instance`, () => {
					rawBaseService.getInstance().then((instance: any) => {
						expect(instance).to.equal('nan')
					})
				})
			})
		})
		//describe('Common Service Tests', () => {
			//base(app, errors, 'mongodb', '_id')
		//})
	})
	describe('Database Service', () => {
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'database-service' mongodb service type`, () => {
					expect(rawDatabaseService.getServiceType()).to.equal('database-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
			//base(app, errors, 'mongodb-databases', '_id')
		//})
	})
	describe('Collection Service', () => {
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'collection-service' mongodb service type`, () => {
					expect(rawCollectionService.getServiceType()).to.equal('collection-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
			//base(app, errors, 'mongodb-collections', '_id')
		//})
	})
	describe('User Service', () => {
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'user-service' mongodb service type`, () => {
					expect(rawUserService.getServiceType()).to.equal('user-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
			//base(app, errors, 'mongodb-users', '_id')
		//})
	})
	describe('Role Service', () => {
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'role-service' mongodb service type`, () => {
					expect(rawRoleService.getServiceType()).to.equal('role-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'mongodb-roles', '_id')
		//})
	})
	describe('Session Service', () => {
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'session-service' mongodb service type`, () => {
					expect(rawSessionService.getServiceType()).to.equal('session-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'mongodb-sessions', '_id')
		//})
	})
	// Cleanup
	after(() => {
		setTimeout(() => {
			client.close()
		}, 3000)
	})
})
