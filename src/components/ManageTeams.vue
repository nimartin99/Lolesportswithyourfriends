<template>
    <div style="display: flex; flex-direction: column; padding: 1vw; color: white">
        <v-expansion-panels>
            <v-expansion-panel
                v-for="team in teams"
                :title="team.name"
            >
                <v-expansion-panel-text>
                    <div class="rowWithTextField">
                        <span class="roleSpan">Coach</span>
                        <v-text-field
                            v-model="team.players.find(player => player.role === 'coach').name"
                            hide-details
                            single-line
                            variant="outlined"
                            class="textField shrink"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span class="roleSpan">Top</span>
                        <v-text-field
                            v-model="team.players.find(player => player.role === 'top').name"
                            hide-details
                            single-line
                            variant="outlined"
                            class="textField shrink"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span class="roleSpan">Jungle</span>
                        <v-text-field
                            v-model="team.players.find(player => player.role === 'jungle').name"
                            hide-details
                            single-line
                            variant="outlined"
                            class="textField shrink"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span class="roleSpan">Mid</span>
                        <v-text-field
                            v-model="team.players.find(player => player.role === 'mid').name"
                            hide-details
                            single-line
                            variant="outlined"
                            class="textField shrink"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span class="roleSpan">Bot</span>
                        <v-text-field
                            v-model="team.players.find(player => player.role === 'bot').name"
                            hide-details
                            single-line
                            variant="outlined"
                            class="textField shrink"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span class="roleSpan">Support</span>
                        <v-text-field
                            v-model="team.players.find(player => player.role === 'support').name"
                            hide-details
                            single-line
                            variant="outlined"
                            class="textField shrink"
                        />
                    </div>
                    <div class="rowWithTextField" style="margin-top: 4px">
                        <v-spacer></v-spacer>
                        <v-btn
                            color="success"
                            @click="updateTeam(team)"
                        >
                            Save</v-btn>
                    </div>

                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>

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
import winningSymbol from "@/assets/lec_logo_yellow_whiteborder.png";
import {mapActions} from "vuex";

export default {
    name: "ManageTeams",
    // Properties returned from data() become reactive state
    // and will be exposed on `this`.
    data() {
        return {
            teams: [],

            snackbarActivator: false,
            snackbarText: '',
            snackbarColor: 'error',
        }
    },

    // Methods are functions that mutate state and trigger updates.
    // They can be bound as event handlers in templates.
    methods: {
        ...mapActions('teams', [ 'getTeams' ]),

        async updateTeam(team) {
            console.log(team);
            const response = await request.patchRequest("/team", team);
            if(response.status === 200) {
                this.snackbarActivator = true;
                this.snackbarText = 'Updated Team';
                this.snackbarColor = 'success';
                this.teams = await this.getTeams(true);
            } else {
                this.snackbarActivator = true;
                this.snackbarText = 'Something went wrong';
                this.snackbarColor = 'error';
            }

        },
    },

    // Lifecycle hooks are called at different stages
    // of a component's lifecycle.
    // This function will be called when the component is mounted.
    async mounted() {
        this.teams = await this.getTeams();
    }
}
</script>

<style scoped lang="scss">
.teamSelected {
    background-color: #00e8c3;
    color: white;
}

.teamCard {
    width: 47.5%;
}

@media only screen and (max-width: 900px) {
    .teamCard {
        width: calc(50% - 40px);
    }

    .teamCardTitle {
        font-size: 9.5pt;
    }
}

.rowWithTextField {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.roleSpan {
    min-width: 20%;
}
</style>
