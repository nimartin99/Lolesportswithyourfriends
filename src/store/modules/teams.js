import * as request from "@/api/request";
import {checkResponseStatus} from "@/util/check";

const defaultState = {
    teams: [],
};

const mutations = {
    setTeams: (state, teams) => {
        state.teams = teams;
    },
};

const getters = {
    teams: state => state.teams,
};

const actions = {
    async getTeams({ commit, dispatch, getters }, update = false) {
        if (!update && getters.teams && getters.teams.length > 0) {
            return getters.teams;
        }
        try {
            const response = await request.getRequest("/teams");
            await checkResponseStatus(200, response);
            const res = await response.json();
            commit('setTeams', res.teams);
            return res.teams;
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
