<template>
    <div style="display: flex; flex-direction: column; padding: 1vw; color: white">
        <span style="width: 100%; text-align: center; font-size: xx-large">Evaluate matches:</span>
        <div v-for="day in matchesPerDay"
             :key="day.date"
            style="display: flex; flex-direction: column; justify-content: center"
        >
            <span>{{ `${('0' + day.date.getDate()).slice(-2)}.${('0' + (day.date.getMonth() + 1)).slice(-2)}.${day.date.getFullYear()}` }}</span>
            <div
                v-for="(match) in day.matches"
                :key="match._id"
                style="margin: 2px 0"
            >
                <div style="display: flex; flex-direction: row; justify-content: space-around;">
                    <v-card
                        class="teamCard"
                        :class="isTeamWinner(match, match.team1._id) ? 'teamWon' : 'teamLost'"
                    >
                        <v-card-title
                            class="teamCardTitle"
                            style="display: flex; flex-direction: row; justify-content: center; align-items: center; text-align: center"
                        >
                            {{ `${ match.team1.name } (${ match.team1.abbreviation })` }}
                        </v-card-title>
                    </v-card>
                    <div style="width: 10%; display: flex; flex-direction: column; justify-content: center; align-items: center">
                        <span>{{ `${match.dateTime.getHours()}:${('0' + match.dateTime.getMinutes()).slice(-2)}` }}</span>
                        <v-btn
                            v-if="day.state !== 'finished'"
                            @click="openEvaluateDialog(match)"
                        >
                            Evaluate
                        </v-btn>
                    </div>
                    <v-card
                        class="teamCard"
                        :class="isTeamWinner(match, match.team2._id) ? 'teamWon' : 'teamLost'"
                    >
                        <v-card-title
                            class="teamCardTitle"
                            style="display: flex; flex-direction: row; justify-content: center; align-items: center; text-align: center"
                        >
                            {{ `${ match.team2.name } (${ match.team2.abbreviation })` }}
                        </v-card-title>
                    </v-card>
                </div>
            </div>
            <v-btn
                v-if="day.state !== 'finished'"
                style="margin: 4px 25%"
                @click="matchDayToFinish = day; areYouSureDialog = true"
            >
                Finish Match Day
            </v-btn>
        </div>

        <v-dialog
            v-model="evaluateDialog"
            scrollable
        >
            <div
                style="width: 100%; height: 100%"
            >
                <v-card
                    style="background-color: #494949; width: 100%; height: 100%; border-radius: 8px"
                >
                    <v-card-title
                        style="background-color: #2b2b2b; color: white; display: flex; flex-direction: row; align-items: center"
                    >
                        <v-icon style="margin-right: 8px">mdi-crown</v-icon>
                        <span>Evaluate Match</span>
                        <v-spacer/>
                        <v-btn
                            style="min-width: 0; width: 36px"
                            @click="evaluateDialog = false"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>

                    <EvaluateDialog
                        :teams="teams"
                        :match="evaluationMatch"
                    />
                </v-card>
            </div>
        </v-dialog>

        <v-dialog
            v-model="areYouSureDialog"
            style="width: 50vw"
        >
            <v-card>
                <v-card-title>Are you sure?</v-card-title>
                <v-card-text>This can only be done once per game day and is irreversible. Do you really want to finish the match day?</v-card-text>
                <v-card-actions>
                    <v-btn
                        color="error"
                        @click="areYouSureDialog = false"
                    >
                        Cancel
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="success"
                        @click="finishMatchDay(matchDayToFinish)"
                    >
                        Finish
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
import {reactive} from "vue";
import EvaluateDialog from "@/components/EvaluateDialog";
import {mapActions} from "vuex";

export default {
    name: "Evaluate",
    components: {EvaluateDialog},
    // Properties returned from data() become reactive state
    // and will be exposed on `this`.
    data() {
        return {
            matches: [],
            matchesPerDay: [],
            teams: [],

            now: null,

            matchDayToFinish: null,
            areYouSureDialog: false,

            snackbarActivator: false,
            snackbarText: '',
            snackbarColor: 'error',

            matchStatsRaw: null,
            evaluateDialog: false,
            evaluationMatch: null,
        }
    },

    // Methods are functions that mutate state and trigger updates.
    // They can be bound as event handlers in templates.
    methods: {
        ...mapActions('teams', [ 'getTeams' ]),
        ...mapActions('matches', [ 'getMatchDays' ]),

        async finishMatchDay(matchDay) {
            const response = await request.postRequest("/finishMatchDay", { matchDayId: matchDay._id });
            if(response.status === 200) {
                this.snackbarActivator = true;
                this.snackbarColor = "success";
                this.snackbarText = "Match day was finished successfully."
                await this.requestMatchDays();
            } else if(response.status === 423) {
                    this.snackbarActivator = true;
                    this.snackbarColor = "error";
                    this.snackbarText = "The match day was already finished."
            } else {
                this.snackbarActivator = true;
                this.snackbarColor = "error";
                this.snackbarText = "Something went wrong finishing the match day."
            }
            this.areYouSureDialog = false;
        },

        openEvaluateDialog(match) {
            this.evaluateDialog = !this.evaluateDialog;
            this.evaluationMatch = match;
        },

        async requestMatchDays() {
            this.matchesPerDay = await this.getMatchDays();
        },

        isTeamWinner(match, teamId) {
            return match.evaluation && match.evaluation.winnerTeam && match.evaluation.winnerTeam === teamId;
        },
    },

    // Lifecycle hooks are called at different stages
    // of a component's lifecycle.
    // This function will be called when the component is mounted.
    async mounted() {
        this.now = new Date();
        await this.requestMatchDays();
        this.teams = await this.getTeams();
    }
}
</script>

<style scoped>
.teamWon {
    background-color: #3ac500;
    color: white;
}

.teamLost {
    background-color: #ff4747;
    color: white;
}

.teamCard {
    width: 45%;
}

@media only screen and (max-width: 900px) {
    .teamCard {
        width: calc(50% - 40px);
    }

    .teamCardTitle {
        font-size: 9.5pt;
    }
}

.dialogClass {
    display: flex;
    justify-content: center;
}
</style>
