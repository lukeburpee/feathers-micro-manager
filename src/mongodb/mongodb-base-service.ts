import { Application, Id, NullableId, Paginated, Params, ServiceMethods, SetupMethod } from '@feathersjs/feathers'
import errors from '@feathersjs/errors'
import { filterQuery, sorter, select, _ } from '@feathersjs/commons';
import sift from 'sift'

import { Service as ConnectionService } from '../connection-service'

export default function (options: ServiceOptions) {
  return new Service(options)
}

export class Service extends ConnectionService {
  constructor (options: ServiceOptions) {
    super(options)
  }
  public getConnectionType (): string {
    return 'mongodb'
  }
  public getServiceType (): string {
    return 'base-service'
  }
  public healthCheck (): any {
    return new Promise((resolve) => {
      resolve(this.client.isConnected())
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
  public close (): any {
    return new Promise((resolve) => {
      resolve(this.client.close())
    })
  }
}