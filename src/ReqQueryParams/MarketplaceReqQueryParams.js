import { ReqQueryParams } from './ReqQueryParams'
import { Listing } from '../Listing'
import { LISTING_ASSET_TYPES, LISTING_STATUS } from '../shared/listing'

export const ALLOWED_SORT_VALUES = Object.freeze({
  price: ['ASC'],
  created_at: ['DESC'],
  block_time_updated_at: ['DESC'],
  expires_at: ['ASC']
})
export const DEFAULT_STATUS = LISTING_STATUS.open
export const DEFAULT_ASSET_TYPE = LISTING_ASSET_TYPES.parcel
export const DEFAULT_SORT_VALUE = 'created_at'
export const DEFAULT_SORT = {
  by: DEFAULT_SORT_VALUE,
  order: ALLOWED_SORT_VALUES[DEFAULT_SORT_VALUE][0]
}
export const DEFAULT_PAGINATION = {
  offset: 0,
  limit: 20
}

export class MarketplaceReqQueryParams {
  constructor(req) {
    this.reqQueryParams = new ReqQueryParams(req)
  }

  sanitize() {
    return {
      status: this.getStatus(),
      asset_type: this.getAssetType(),
      sort: this.getSort(),
      pagination: this.getPagination()
    }
  }

  getStatus() {
    // TODO: This query string param should be called `listing_status` but that'd break backwards compatibility
    const status = this.reqQueryParams.get('status', LISTING_STATUS.open)
    return Listing.isValidStatus(status) ? status : LISTING_STATUS.open
  }

  getAssetType() {
    const type = this.reqQueryParams.get('asset_type', '')

    return !type || Listing.isValidAssetType(type)
      ? type
      : LISTING_ASSET_TYPES.parcel
  }

  getSort() {
    let by = this.reqQueryParams.get('sort_by', DEFAULT_SORT.by)
    let order = this.reqQueryParams.get('sort_order', '')

    by = by in ALLOWED_SORT_VALUES ? by : DEFAULT_SORT.by

    return {
      by,
      order: ALLOWED_SORT_VALUES[by].includes(order.toUpperCase())
        ? order
        : ALLOWED_SORT_VALUES[by][0]
    }
  }

  getPagination() {
    const limit = this.reqQueryParams.get('limit', DEFAULT_PAGINATION.limit)
    const offset = this.reqQueryParams.get('offset', DEFAULT_PAGINATION.offset)

    return {
      limit: Math.max(Math.min(100, limit), 0),
      offset: Math.max(offset, 0)
    }
  }
}
