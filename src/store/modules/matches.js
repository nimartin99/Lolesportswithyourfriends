import * as request from "@/api/request";
import {checkResponseStatus} from "@/util/check";

const defaultState = {
    matches: [],
};

const mutations = {
    setMatches: (state, matches) => {
        state.matches = matches;
    },
};

const getters = {
    matches: state => state.matches,
};

const actions = {
    async getMatches({ commit, dispatch, getters }) {
        if (getters.matches && getters.matches.length > 0) {
            return getters.matches;
        }
        try {
            const response = await request.getRequest("/matches");
            await checkResponseStatus(200, response);
            const res = await response.json();
            commit('setMatches', res.matches);
            return res.matches;
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
