<template>
    <v-app-bar flat style="background-color: #2b2b2b;">
        <template v-slot:prepend>
            <v-app-bar-nav-icon
                @click="navDrawer = !navDrawer"
                style="color: white"
            />
        </template>
        <v-app-bar-title style="color: white">
            <b>Lolesportswithyourfriends</b>
        </v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer
        v-model="navDrawer"
        location="left"
        temporary
        style="color: white; background-color: #2B2B2BFF"
    >
        <v-list>
            <v-list-item prepend-icon="mdi-sword-cross" title="Bet" @click="setRouterPath('Bet')"></v-list-item>
            <v-list-item prepend-icon="mdi-table" title="Leaderboard" @click="setRouterPath('Leaderboard')"></v-list-item>
            <v-list-item prepend-icon="mdi-plus" title="Create Matches" @click="setRouterPath('Matches')"></v-list-item>
            <v-list-item prepend-icon="mdi-crown" title="Evaluate Matches" @click="setRouterPath('Evaluate')"></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    name: "AppBar",
    // Properties returned from data() become reactive state
    // and will be exposed on `this`.
    data() {
        return {
            navDrawer: false,
        }
    },

    // Methods are functions that mutate state and trigger updates.
    // They can be bound as event handlers in templates.
    methods: {
        setRouterPath(path) {
            this.$router.push({ path });
        },
    },
}
</script>

<style scoped>
    .navButton {
        color: white;
        margin: 4px;
    }

    .navButtonContent {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
