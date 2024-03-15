import * as request from "@/api/request";
import {checkResponseStatus} from "@/util/check";

const defaultState = {
    matches: [],
    matchDays: [],
};

const mutations = {
    setMatches: (state, matches) => {
        state.matches = matches;
    },
    setMatchDays: (state, matchDays) => {
        state.matchDays = matchDays;
    },
};

const getters = {
    matches: state => state.matches,
    matchDays: state => state.matchDays,
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
            res.matches.forEach((match) => {
                match.dateTime = new Date(match.dateTime);
            });
            commit('setMatches', res.matches);
            return res.matches;
        }
        catch(err) {
            console.error(err);
            return err?.response?.status;
        }
    },
    async getMatchDays({ commit, dispatch, getters }) {
        if (getters.matchDays && getters.matchDays.length > 0) {
            return getters.matchDays;
        }
        try {
            const response = await request.getRequest("/matchDays");
            await checkResponseStatus(200, response);
            const res = await response.json();
            // Convert date strings to date objects
            res.matchDays.forEach((matchDay) => {
                matchDay.date = new Date(matchDay.date);
                matchDay.matches.forEach((match) => {
                    match.dateTime = new Date(match.dateTime);
                });
            });
            // Sort after date
            res.matchDays.sort((a, b) => {
                if (a.date.getTime() < b.date.getTime()) return -1;
                else return 1;
            })
            commit('setMatchDays', res.matchDays);
            return res.matchDays;
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
