import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { _ } from '@feathersjs/commons';
import BaseService, { Service } from '../src/base-service'
import * as assert from 'assert'

const debug = require('debug')('feathers-service-manager:base-service:test')

describe('feathers-service-manager:base-service', () => {
	const app = feathers()
	const options = {
		events: ['testing']
	}
	const customidOptions = {
		id: 'customid',
		events: ['testing']
	}
	app.use('base', BaseService(options))
	app.use('base-customid', BaseService(customidOptions))

	describe('Initialization', () => {
		describe('Missing Options', () => {
			it('throws an error', () => {
				expect(() => new Service(null)).to.throw('service requires options')
			})
		})
		it('attaches application to service', () => {
			const attachService = new Service(options)
			attachService.setup(app, '/attach')
			expect(attachService).to.have.property('app')
		})
		it('attaches path to service', () => {
			const attachService = new Service(options)
			attachService.setup(app, '/attach')
			expect(attachService).to.have.property('path')
		})
	})
	describe('Requiring', () => {
		const lib = require('../src/base-service')
		it('exposes the Service Constructor', () => {
			expect(typeof Service).to.equal('function')
		})
	})

	describe('Common Service Tests', () => {
		base(app, errors, 'base', 'id')
		base(app, errors, 'base-customid', 'customid')
	})

	describe('Custom Options', () => {
		it('allows custom sorter', () => {
			let sorterCalled = false
			app.use('/sorter', BaseService({
				sorter () {
					sorterCalled = true
					return function () {
						return 0
					}
				}
			}))
			return app.service('sorter').find({
				query: { $sort: { something: 1 } }
			}).then(() => {
				assert.ok(sorterCalled, 'sorter called')
			}).catch(error => console.log(error))
		})
		it('allows custom matcher', () => {
			let matcherCalled = false
			app.use('/matcher', BaseService({
				matcher () {
					matcherCalled = true
					return function () {
					return true
					}
				}
			}))
			return app.service('matcher').find({
				query: { $sort: { something: 1 } }
			}).then(() => {
				assert.ok(matcherCalled, 'matcher called')
			}).catch(error => console.log(error))
		})
	})
})
