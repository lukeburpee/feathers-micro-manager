import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import  Docker from 'dockerode/lib/docker'
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'

import DockerBaseService, { Service } from '../src/docker/docker-base-service'
import DockerSwarmService, { Service as SwarmService } from '../src/docker/docker-swarm-service'
import DockerConfigService, { Service as ConfigService } from '../src/docker/docker-config-service'
import DockerNetworkService, { Service as NetworkService } from '../src/docker/docker-network-service'
import DockerContainerService, { Service as ContainerService } from '../src/docker/docker-container-service'
import DockerImageService, { Service as ImageService } from '../src/docker/docker-image-service'
import DockerVolumeService, { Service as VolumeService } from '../src/docker/docker-volume-service'
import DockerTaskService, { Service as TaskService } from '../src/docker/docker-task-service'
import DockerSecretService, { Service as SecretService } from '../src/docker/docker-secret-service'

const debug = require('debug')('feathers-service-manager:docker-services:test')

describe('feathers-service-manager:docker-services', () => {
	const client = Docker()
	const serviceOptions = {
		connectionId: uuid(),
		client: client,
		events: ['testing']
	}
	const serviceOptionsConnectionId = {
		client: serviceOptions.connectionId,
		events: ['testing']
	}
	const app = feathers()
	describe('Base Service', () => {
		const rawService = new Service(serviceOptions)
		rawService.setup(app, '/docker-service')
		describe('Connection Methods', () => {
			describe('getConnectionType', () => {
				it(`returns the 'docker' connection type`, () => {
					expect(rawService.getConnectionType()).to.equal('docker')
				})
			})
			describe('getServiceType', () => {
				it(`returns the 'base-service' docker service type`, () => {
					expect(rawService.getServiceType()).to.equal('base-service')
				})
			})
			describe('healthCheck', () => {
				it(`returns the results of the docker server health check`, () => {
					return rawService.healthCheck().then((status: any) => {
						expect(status).to.equal('OK')
					})
				})
			})
			describe('getInfo', () => {
				it(`returns the results of the docker info check`, () => {
					return rawService.getInfo().then((info: any) => {
						expect(info).to.have.property('Containers')
					})
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'docker', 'id')
		//})
	})
	describe('Swarm Service', () => {
		const rawSwarmService = new SwarmService(serviceOptions)
		rawSwarmService.setup(app, '/swarm-service')
		describe('Connection Methods', () => {
			describe('getConnectionType', () => {
				expect(rawSwarmService.getConnectionType()).to.equal('docker')
			})
			describe('getServiceType', () => {
				it(`returns the 'swarm-service' docker service type`, () => {
					expect(rawSwarmService.getServiceType()).to.equal('swarm-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'docker-swarm', 'id')
		//})
	})
	describe('Config Service', () => {
		const rawConfigService = new ConfigService(serviceOptions)
		rawConfigService.setup(app, '/config-service')
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'config-service' docker service type`, () => {
					expect(rawConfigService.getServiceType()).to.equal('config-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'docker-configs', 'id')
		//})
	})
	describe('Network Service', () => {
		const rawNetworkService = new NetworkService(serviceOptions)
		rawNetworkService.setup(app, '/network-service')
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'network-service' docker service type`, () => {
					expect(rawNetworkService.getServiceType()).to.equal('network-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'docker-networks', 'id')
		//})
	})
	describe('Container Service', () => {
		const rawContainerService = new ContainerService(serviceOptions)
		rawContainerService.setup(app, '/container-service')
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'container-service' docker service type`, () => {
					expect(rawContainerService.getServiceType()).to.equal('container-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'docker-containers', 'id')
		//})
	})
	describe('Image Service', () => {
		const rawImageService = new ImageService(serviceOptions)
		rawImageService.setup(app, '/image-service')
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'image-service' docker service type`, () => {
					expect(rawImageService.getServiceType()).to.equal('image-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'docker-images', 'id')
		//})
	})
	describe('Volume Service', () => {
		const rawVolumeService = new VolumeService(serviceOptions)
		rawVolumeService.setup(app, '/volume-service')
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'volume-service' docker service type`, () => {
					expect(rawVolumeService.getServiceType()).to.equal('volume-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'docker-volumes', 'id')
		//})
	})
	describe('Task Service', () => {
		const rawTaskService = new TaskService(serviceOptions)
		rawTaskService.setup(app, '/task-service')
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'task-service' docker service type`, () => {
					expect(rawTaskService.getServiceType()).to.equal('task-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'docker-tasks', 'id')
		//})
	})
	describe('Secret Service', () => {
		const rawSecretService = new SecretService(serviceOptions)
		rawSecretService.setup(app, '/secret-service')
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'secret-service' docker service type`, () => {
					expect(rawSecretService.getServiceType()).to.equal('secret-service')
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'docker-secrets', 'id')
		//})
	})
})
