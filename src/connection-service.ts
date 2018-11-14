import { Params } from '@feathersjs/feathers'
import BaseService, { Service as BaseServiceClass } from './base-service'
import { _select } from './utils'

export class Service extends BaseServiceClass {
	public connections!: any;
	public connectionId!: any;
	public client!: any;
	constructor (options: ServiceOptions) {
		super(options)
		if (!options.client) {
			throw new Error(`${this.getConnectionType()} client must be provided`)
		}
		if (typeof options.client === 'string') {
			this.getConnection(options.client).then((connection: any) => {
				this.connectionId = connection.id
				this.client = connection.client
				console.log(`new ${this.getConnectionType()} using connection: ${this.connectionId}`)
			}).catch((connection: any) => {
				console.log(`error fetching ${this.getConnectionType()} connection id=${options.client}: ${options.client}`)
			})
		} else {
			this.client = options.client
			this.createConnection(
				options.connectionId || this.generateId(),
				this.client
			).then((connection: any) => {
				this.connectionId = connection.id
				console.log(`${this.getConnectionType()} connection created: ${this.connectionId}`)
			}).catch((error: any) => {
				console.log(`${this.getConnectionType()} failed to create connection: ${error.message}`)
			})
		}
	}
	public createConnection (id: any, client: any): any {
		return this.healthCheck().then((status: any) => {
			return this.getInfo().then(((info: any) => {
				const connection = {
					id: id,
					connectionType: this.getConnectionType(),
					serviceTypes: [this.getServiceType()],
					client,
					status: status,
					info: info
				}
				return this.connections.create(connection)
			})).catch((error: any) => {
				throw new Error(`${this.getConnectionType()} failed to collection connection info: ${error.message}`)
			})
		}).catch((error: any) => {
			throw new Error(`${this.getConnectionType()} failed connection healthcheck: ${error.message}`)
		})
	}
	public getConnection (connectionId: any): any {
		return this.connections.get(connectionId)
	}
	public updateConnection (connectionId: any, data: any, params?: Params): any {
		return this.connections.update(connectionId, data, params)
	}
	public patchConnection (connectionId: any, data: any, params?: Params): any {
		return this.connections.patch(connectionId, data, params)
	}
	public removeConnection (connectionId: any): any {
		return this.connections.remove(connectionId)
	}
	public getConnectionId (): any {
		return this.connectionId
	}
	public getConnectionType (): string {
		return 'connection-base'
	}
	public getServiceType (): string {
		return 'connection-service'
	}
	public healthCheck (): any {
		return new Promise((resolve) => {
			resolve('nan')
		})
	}
	public getInfo (): any {
		return new Promise((resolve) => {
			resolve('nan')
		})
	}
	public getInstance (): any {
		return new Promise((resolve) => {
			resolve('nan')
		})
	}
	public setup (app: any, path: string): any {
		this.app = app
		this.path = path
		this.app.use('connections', BaseService({id: 'id'}))
		this.connections = this.app.service('connections')
	}
}

export default function (options: ServiceOptions) {
  return new Service(options)
}
