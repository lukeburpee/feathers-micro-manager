import { Application, Id, NullableId, Paginated, Params, ServiceMethods, SetupMethod } from '@feathersjs/feathers'
import errors from '@feathersjs/errors'
import { filterQuery, sorter, _ } from '@feathersjs/commons'
import { _select } from './utils'
import Proto from 'uberproto'
import sift from 'sift'
import { v4 as uuid } from 'uuid'

export default function init (options: ServiceOptions) {
  return new Service(options)
}

export class Service implements Partial<ServiceMethods<any>>, SetupMethod {
  public app!: any;
  public path!: any;
  public paginate!: Paginated<any>;
  public id!: any;
  public _id!: any;
  public store!: any;
  public Model!: any;
  public events!: any;
  public _matcher!: any;
  public _sorter!: any;
  constructor (options: ServiceOptions) {
    if (!options) {
      throw new Error('service requires options')
    }
    this.paginate = options.paginate ? options.paginate : {};
    this._id = options.id || 'id';
    this.id = options.id || 'id';
    this.store = options.store || {}
    this.Model = options.Model || {};
    this.events = options.events || [];
    this._matcher = options.matcher;
    this._sorter = options.sorter ? options.sorter : sorter;
  }
  public setup (app: Application, path: string) {
    this.app = app
    this.path = path
  }
  
  public extend (obj: any) {
    return Proto.extend(obj, this);
  }
  protected generateId(): any {
    return uuid()
  }
  protected createImplementation (store: any, data: any, params?: Params): any {
    let id = data[this.id] || this.generateId();
    let current = _.extend({}, data, { [this.id]: id });

    return Promise.resolve((store[id] = current))
      .then(_select(params, this.id));
  }

  protected getImplementation (store: any, id: Id, params?: Params): any {
    if (id in store) {
      return Promise.resolve(store[id])
      .then(_select(params, this.id));
    }
    return false
  }

  protected listImplementation (store: any): any {
    return Promise.resolve(_.values(store))
  }

  protected updateImplementation (store: any, id: Id, data: any, params?: Params): any {
    if (id in store) {
      // We don't want our id to change type if it can be coerced
      const oldId = store[id][this.id];

      id = oldId == id ? oldId : id; // eslint-disable-line

      data = _.extend({}, data, { [this.id]: id });
      store[id] = data;

      return Promise.resolve(store[id])
        .then(_select(params, this.id));
    }

    return Promise.reject(
      new errors.NotFound(`No record found for id '${id}'`)
    );
  }

  protected patchImplementation (store: any, id: Id, data: any, params?: Params): any {
    if (id in store) {
      _.extend(store[id], _.omit(data, this._id));

      return Promise.resolve(store[id])
        .then(_select(params, this.id));
    }

    return Promise.reject(
      new errors.NotFound(`No record found for id '${id}'`)
    );
  }

  protected removeImplementation(store: any, id: Id, params?: Params): any {
    if (id in store) {
      const deleted = store[id];
      delete store[id];

      return Promise.resolve(deleted)
        .then(_select(params, this.id));
    }

    return Promise.reject(
      new errors.NotFound(`No record found for id '${id}'`)
    );
  }
  protected processParams (params?: any, getFilter = filterQuery): any {
    return getFilter(params)
  }
  protected formatListValues (values: any): any {
    return values
  }
  protected filterListValues (query: any, filters: any, values: any): any {
    if (this._matcher) {
      values = values.filter(this._matcher(query));
    }
    
    values = sift(query, values);

    const total = values.length;

    if (filters.$sort) {
      values.sort(this._sorter(filters.$sort));
    }

    if (filters.$skip) {
      values = values.slice(filters.$skip);
    }

    if (typeof filters.$limit !== 'undefined') {
      values = values.slice(0, filters.$limit);
    }
    return { total, filteredValues: values }
  }
  // Find without hooks and mixins that can be used internally and always returns
  // a pagination object
  public async _find (params: Params | any, getFilter = filterQuery) {
    const { query, filters } = this.processParams(params.query || {}, getFilter)
    const map = _select(params);
    return this.listImplementation(this.store)
    .then((items: any) => {
      const values = this.formatListValues(items)
      const { total, filteredValues } = this.filterListValues(query, filters, values)

      return {
        total,
        limit: filters.$limit || 0,
        skip: filters.$skip || 0,
        data: map(filteredValues)
      }
    })
  }

  public async find (params: Params | any): Promise<any> {

    const paginate = typeof params.paginate !== 'undefined' ? params.paginate : this.paginate;
    // Call the internal find with query parameter that include pagination
    const result = this._find(params, (query: any) => filterQuery(query, { paginate }));

    if (!(paginate && paginate.default)) {
      return result.then((page: any) => page.data);
    }

    return result;
  }

  public async get (id: Id, params?: Params): Promise<any> {
    const results = this.getImplementation(this.store, id, params)
    if (!results) {
      return Promise.reject(
        new errors.NotFound(`No record found for id '${id}'`)
      )
    }
    return results
  }

  // Create without hooks and mixins that can be used internally
  protected async _create (data: any, params?: Params): Promise<any> {
    return this.createImplementation(this.store, data, params)
  }

  public async create (data: any, params?: Params): Promise<any> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current: any) => this._create(current)));
    }

    return this._create(data, params);
  }

  // Update without hooks and mixins that can be used internally
  protected async _update (id: Id, data: any, params: Params | undefined): Promise<any> {
    return this.updateImplementation(this.store, id, data, params)
  }

  public async update (id: Id, data: any, params?: Params): Promise<any> {
    if (id === null || Array.isArray(data)) {
      return Promise.reject(new errors.BadRequest(
        `You can not replace multiple instances. Did you mean 'patch'?`
      ));
    }

    return this._update(id, data, params);
  }

  // Patch without hooks and mixins that can be used internally
  protected async _patch (id: Id, data: any, params?: Params): Promise<any> {
    return this.patchImplementation(this.store, id, data, params)
  }

  public async patch (id: Id, data: any, params?: Params): Promise<any> {
    if (id === null) {
      return this._find(params).then(page => {
        return Promise.all(page.data.map(
          (current: any) => this._patch(current[this._id], data, params))
        );
      });
    }

    return this._patch(id, data, params);
  }

  // Remove without hooks and mixins that can be used internally
  protected async _remove (id: Id, params?: Params): Promise<any> {
    return this.removeImplementation(this.store, id, params)
  }

  public async remove (id: Id, params?: Params): Promise<any> {
    if (id === null) {
      return this._find(params).then((page: any) =>
        Promise.all(page.data.map((current: any) =>
          this._remove(current[this._id], params)
        )));
    }

    return this._remove(id, params);
  }
}
