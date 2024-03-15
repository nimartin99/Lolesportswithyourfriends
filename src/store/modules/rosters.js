import * as request from "@/api/request";
import {checkResponseStatus} from "@/util/check";

const defaultState = {
    myRoster: {},
};

const mutations = {
    setMyRoster: (state, myRoster) => {
        state.myRoster = myRoster;
    },
};

const getters = {
    myRoster: state => state.myRoster,
};

const actions = {
    async getMyRoster({ commit, dispatch, getters }, params) {
        if (!params.update && Object.keys(getters.myRoster).length > 0) {
            return getters.myRoster;
        }
        try {
            const response = await request.getRequest("/myRoster/" + params.matchDay);
            await checkResponseStatus(200, response);
            const res = await response.json();
            console.log(res);
            commit('setMyRoster', res);
            return res;
        }
        catch(err) {
            console.error(err);
            return err?.response?.status;
        }
    },
};

export default {
    namespaced: true,
    state: defaultState,
    mutations,
    actions,
    getters,
};
