import Vuex from 'vuex';
import teams from "@/store/modules/teams";
import matches from "@/store/modules/matches";
// import createPersistedState from 'vuex-persistedstate';


// https://dev.to/simo_benhida/tip---import-vuejs-modules-at-once-58dl
// Import all modules at once.
// const requireModule = require.context('./modules', false, /\.js$/);
// const getModules = (moduleFilenames) => moduleFilenames.reduce((pv, filename) => {
//     const moduleName = filename.replace(/(\.\/|\.js)/g, '');
//     return {
//         ...pv,
//         [moduleName]: requireModule(filename).default,
//     };
// }, {});
// const moduleFilenames = requireModule.keys();
// const moduleNames = moduleFilenames.map((fileName) => fileName.replace(/(\.\/|\.js)/g, ''));
// const modules = getModules(moduleFilenames);

// const noPersistenModuls = [];
// let persistedStatePlugin;
// // if(checkCookieAccepted()) {
// // https://github.com/robinvdvleuten/vuex-persistedstate
// // Persist and rehydrate your Vuex state between page reloads.
// persistedStatePlugin = createPersistedState({
//     paths: moduleNames.filter((el) => !noPersistenModuls.includes(el)), // Modules to be persisted
// });
// }

const store = new Vuex.Store({
    plugins: [],
    modules: {
        teams,
        matches,
    },
    strict: process.env.NODE_ENV !== 'production',
});

export default store;
