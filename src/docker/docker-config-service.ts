import { Application, Id, NullableId, Paginated, Params, ServiceMethods, SetupMethod } from '@feathersjs/feathers'
import errors from '@feathersjs/errors'
import { _ } from '@feathersjs/commons'
import { _select } from '../utils'

import { Service as DockerBaseService } from './docker-base-service'

export default function (options: ServiceOptions) {
  return new Service(options)
}

export class Service extends DockerBaseService {
  constructor (options: ServiceOptions) {
    super(options)
  }
  public getServiceType (): any {
  	return 'config-service'
  }
}