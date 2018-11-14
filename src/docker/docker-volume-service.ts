import { Application, Id, NullableId, Paginated, Params, ServiceMethods, SetupMethod } from '@feathersjs/feathers'
import errors from '@feathersjs/errors'
import { _ } from '@feathersjs/commons'
import { _select } from '../utils'

import { Service as DockerBaseService } from './docker-base-service'

export default function (options: ServiceOptions) {
  return new Service(options)
}

export class Service extends DockerBaseService {
  constructor (private options: ServiceOptions) {
    super(options)
  }
  public getServiceType(): any {
  	return 'volume-service'
  }
}