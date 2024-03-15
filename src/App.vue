<template>
  <router-view id="app"/>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: "App",
    // Properties returned from data() become reactive state
    // and will be exposed on `this`.
    data() {
        return {

        }
    },

    // Methods are functions that mutate state and trigger updates.
    // They can be bound as event handlers in templates.
    methods: {
        ...mapActions('teams', [ 'getTeams' ]),
        ...mapActions('matches', [ 'getMatches', 'getMatchDays' ]),
    },

    // Lifecycle hooks are called at different stages
    // of a component's lifecycle.
    // This function will be called when the component is mounted.
    async mounted() {
        await this.getTeams();
        await this.getMatches();
        await this.getMatchDays();
    }
}
</script>

<style scoped>
    #app {
        background-image: url('../src/assets/lec_logo.png');
        background-color: #3c3f40;
        background-repeat: no-repeat;
        background-position: center center;
    }
</style>
