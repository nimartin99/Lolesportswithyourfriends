<template>
    <div class="outerContainer">
        <v-card class="matchCreateCard">
            <v-card-title>Create Match</v-card-title>
            <div style="display: flex; flex-direction: row; justify-content: space-around; padding: 12px">
                <v-select
                    v-model="selectedTeam1"
                    :items="teams"
                    :item-title="team =>`${team.name} (${team.abbreviation})`"
                    :return-object="true"
                />
                <span style="display: flex; justify-content: center; align-items: center; width: 20%"> vs. </span>
                <v-select
                    v-model="selectedTeam2"
                    :items="teams"
                    :item-title="team =>`${team.name} (${team.abbreviation})`"
                    :return-object="true"
                />
            </div>
            <div style="display: flex; justify-content: center; padding: 12px">
                <v-sheet rounded elevation="4">
                    <input v-model="matchDateTime" type="datetime-local" id="birthdaytime" name="birthdaytime" style="padding: 4px 12px">
                </v-sheet>
            </div>
            <div style="display: flex; justify-content: center; padding: 12px; width: 100%">
                <v-select
                    v-model="matchType"
                    :items="['Bo1', 'Bo3', 'Bo5']"
                    style="max-width: 20%"
                >

                </v-select>
            </div>
            <div style="display: flex; justify-content: center; padding: 12px">
                <v-btn @click="createMatch">
                    Create
                </v-btn>
            </div>
        </v-card>
        <v-snackbar
            v-model="snackbarActivator"
            bottom
            timeout="5000"
            :color="snackbarColor"
            style="bottom: 9vh"
        >{{ snackbarText }}</v-snackbar>
    </div>
</template>

<script>
import * as request from "@/api/request";

export default {
    name: "CreateMatches",
    // Properties returned from data() become reactive state
    // and will be exposed on `this`.
    data() {
        return {
            teams: [],
            selectedTeam1: null,
            selectedTeam2: null,
            matchDateTime: null,
            matchType: 'Bo1',

            snackbarActivator: false,
            snackbarText: '',
            snackbarColor: 'error',
        }
    },

    // Methods are functions that mutate state and trigger updates.
    // They can be bound as event handlers in templates.
    methods: {
        async createMatch() {
            const body = {
                team1: this.selectedTeam1._id,
                team2: this.selectedTeam2._id,
                dateTime: this.matchDateTime,
                matchType: this.matchType,
            }
            const response = await request.postRequest("/match", body);
            this.snackbarActivator = true;
            if(response && response.status === 201) {
                this.snackbarText = 'Match created successfully!';
                this.snackbarColor = 'success';
            } else {
                this.snackbarText = 'Something went wrong creating the match.'
                this.snackbarColor = 'error';
            }
        },
    },

    // Lifecycle hooks are called at different stages
    // of a component's lifecycle.
    // This function will be called when the component is mounted.
    async mounted() {
        const response = await request.getRequest("/teams");
        const res = await response.json();
        this.teams = res.teams;
    }
}
</script>

<style scoped>
    .outerContainer {
        display: flex;
        flex-direction: column;
    }

    .matchCreateCard {
        margin: auto;
        width: 85vw;
        max-width: 1000px;
    }
</style>
