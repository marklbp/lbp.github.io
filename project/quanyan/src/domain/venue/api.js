import * as http from '@/services/request.js'
import {merge} from '@/utils/lang'
import * as DATA from './mock'
let preRequest = {
  getTranningList: {
    url: 'outplace.searchTraining',
    method: 'get',
    params: {
      trainingListQuery: {
        // 'uid': '',
        'cityCode': '',
        'districtCode': '',
        'categoryId': '',
        // 'key': '',
        // 'name': null,
        // 'currentLat': '',
        // 'currentLng': '',
        'pageSize': '',
        'pageNo': '',
        'sortType': '',
        'isSign': '1',
        'isShelves': '1'// ,
        // placeTrainingId: null
      }
    }
  },
  postTranningList: {
    url: 'outplace.DistinctCategoryListResult',
    method: 'get',
    params: {
      cityCode: null
    }
  },
  getTrainingDetailByOrgId: {
    url: 'outplace.getTrainingDetailByOrgId',
    method: 'get',
    params: {
      orgId: null
    }
  },
  getNearTrainPlace: {
    url: 'outplace.searchUserNearTrainPlace',
    method: 'get',
    params: {
      trainingListQuery: {
        lat: '',
        lng: ''
      }
    }
  },
  getCourseById: {
    url: 'outplace.getCourseById',
    method: 'get',
    params: {
      id: ''
    }
  },
  getOtherStores: {
    url: 'outplace.searchPlaceTrainingByTrainingId',
    method: 'get',
    params: {
      trainingListQuery: {
        placeTrainingId: ''
      }
    }
  },
  getProperShops: {
    url: 'outplace.searchPlaceTrainingByCourseId',
    method: 'get',
    params: {
      trainingCourseId: ''
    }
  },
  toggleCollect: {
    url: 'outplace.collect',
    method: 'get',
    params: {
      Collect: {
        uid: '',
        orgId: 0,
        placeId: '',
        status: '', // 1-> 收藏，2->取消
        collectSort: 2 // 收藏分类， 1->场馆，2->培训机构
      }
    }
  }
}
export default Object.keys(preRequest).reduce((r, n) => {
  r[n] = params => {
    let p = http[preRequest[n].method](preRequest[n].url, merge({}, preRequest[n].params, params))
    return p.then(r => {
      if (window.location.href.indexOf('localhost') > -1 && (!r.content || !(r.content instanceof Array) || r.content.length <= 0 || JSON.stringify(r.content[0]) === '{}')) return DATA[n]
      return DATA[n] ? DATA[n] : r
    }).catch(e => {
      return window.location.href.indexOf('localhost') > -1 ? DATA[n] : e
    })
  }
  return r
}, {})
