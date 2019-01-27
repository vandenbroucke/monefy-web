
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
  		rawData:{}
	},
	mutations: {
        SET_RAW_DATA(status,data){
            status.rawData = data;
        }
	},
	actions: {
		set_raw_data({commit}, raw_data){
			commit('SET_RAW_DATA',raw_data);
		}
	},
	getters : {
	  rawData: state => state.rawData
	}
})