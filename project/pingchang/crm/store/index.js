/**
 * store/index.js
 */
import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import * as mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';



import global from './common/global';
// import user from './common/user';
import select from './common/select';

import user from './modules/user';
import outer from './modules/outer';
import lender from './modules/lender';
import guarantor from './modules/guarantor';
import sp from './modules/sp';
import org from './modules/org';
import ext_org from './modules/ext_org';
import role from './modules/role';
import agency from './modules/agency';
import reviewEnter from './modules/reviewEnter';

import Storage from '../plugins/storage'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

let admin = Storage.get("ADMIN") || {};
let menus = Storage.get("MENUS") || [];

const store = () => {
  return new Vuex.Store({
    modules: {
      outer,
      global,
      lender,
      guarantor,
      sp,
      user,
      org,
      ext_org,
      role,
      select
      ,agency,
      reviewEnter
    },
    state: {
      isAuthenticated: undefined,
      menus: menus,
      admin: admin
    },
    getters,
    mutations,
    actions,
    strict: false,
    // strict: debug,
    //plugins: debug ? [createLogger()] : []
  })
}

export default store
