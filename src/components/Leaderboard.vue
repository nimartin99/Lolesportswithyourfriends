<template>
    <div style="display: flex; flex-direction: column; padding: 1vw">
        <v-tabs
            v-model="tab"
            style="color: white"
            align-tabs="center"
        >
            <v-tab @click="changedTab('season')">
                Season
            </v-tab>
            <v-tab
                v-for="(matchDay, index) in matchesPerDay"
                @click="changedTab(matchDay)"
            >
                {{ index + 1 }}
            </v-tab>
        </v-tabs>
        <v-data-table
            :loading="loadingDayScores"
            style="background-color: transparent; color: white"
            :items="dataTableItems"
            :headers="tableHeader"
        >
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.username }}</td>
                    <td>{{ item.score }}</td>
                    <td v-if="currentMatchDay !== 'season'">
                        <v-btn
                            :icon="true"
                            variant="text"
                            @click="showAccountBet(item)"
                        >
                            <v-icon>
                                {{ expandedAccount && expandedAccount._id === item._id ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                            </v-icon>
                        </v-btn>
                    </td>
                </tr>
                <td
                    v-if="expandedAccount && expandedAccount.bet && expandedAccount._id === item._id"
                    :colspan="1"
                    style="background-color: rgba(43,43,43,0.41); border-radius: 0 0 0 8px"
                >
                    <div
                        style="width: 90%; padding: 12px 5% 12px 5%; display: flex; flex-direction: column"
                    >
                        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center">
                            <span>{{ expandedAccount.bet.topPlayer ? expandedAccount.bet.topPlayer.name : '-' }}</span>
                        </div>
                        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center">
                            <span>{{ expandedAccount.bet.junglePlayer ? expandedAccount.bet.junglePlayer.name : '-' }}</span>
                        </div>
                        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center">
                            <span>{{ expandedAccount.bet.midPlayer ? expandedAccount.bet.midPlayer.name : '-' }}</span>
                        </div>
                        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center">
                            <span>{{ expandedAccount.bet.botPlayer ? expandedAccount.bet.botPlayer.name : '-' }}</span>
                        </div>
                        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center">
                            <span>{{ expandedAccount.bet.supportPlayer ? expandedAccount.bet.supportPlayer.name : '-' }}</span>
                        </div>
                        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center">
                            <span>{{ expandedAccount.bet.coachPlayer ? expandedAccount.bet.coachPlayer.name : '-' }}</span>
                        </div>
                    </div>
                </td>
                <td
                    v-if="expandedAccount && expandedAccount.bet && expandedAccount._id === item._id"
                    :colspan="1"
                >
                    <div
                        style="width: fit-content; padding: 12px 5% 12px 5%; display: flex; flex-direction: column; background-color: rgba(43,43,43,0.41); border-radius: 0 0 8px 0"
                    >
                        <span>{{ findEvaluationForPlayer(expandedAccount.bet.topPlayer._id) }}</span>
                        <span>{{ findEvaluationForPlayer(expandedAccount.bet.junglePlayer._id) }}</span>
                        <span>{{ findEvaluationForPlayer(expandedAccount.bet.midPlayer._id) }}</span>
                        <span>{{ findEvaluationForPlayer(expandedAccount.bet.botPlayer._id) }}</span>
                        <span>{{ findEvaluationForPlayer(expandedAccount.bet.supportPlayer._id) }}</span>
                        <span>{{ findEvaluationForPlayer(expandedAccount.bet.coachPlayer._id) }}</span>
                    </div>
                </td>
                <td
                    v-if="expandedAccount && expandedAccount.bet === undefined && expandedAccount._id === item._id"
                    :colspan="1"
                >
                    <div
                        style="width: fit-content; padding: 12px 5% 12px 5%; display: flex; flex-direction: column; background-color: rgba(43,43,43,0.41); border-radius: 0 0 8px 0"
                    >
                        <span>No Roster was set up</span>
                    </div>
                </td>
            </template>
        </v-data-table>
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
import {mapActions} from "vuex";

export default {
    name: "Leaderboard",
    // Properties returned from data() become reactive state
    // and will be exposed on `this`.
    data() {
        return {
            tab: 'season',
            accounts: [],
            dataTableItems: [],
            matches: [],

            loadingDayScores: false,
            currentMatchDay: 'season',

            matchesPerDay: [],
            betsPerMatchDay: [],

            evaluationsOfMatchDay: [],
            evaluations: [],

            expandedAccount: null,
            expandedAccountBet: null,

            inspectionRoster: [],

            // Table
            tableHeader: [
                { title: 'Username', value: 'username' },
                { title: 'Score', value: 'score' },
            ],

            snackbarActivator: false,
            snackbarText: '',
            snackbarColor: 'error',
        }
    },

    // Methods are functions that mutate state and trigger updates.
    // They can be bound as event handlers in templates.
    methods: {
        ...mapActions('matches', [ 'getMatchDays' ]),

        findEvaluationForPlayer(playerId) {
            const playerEvaluation = this.evaluations.find((evaluation) => evaluation.player === playerId);
            return playerEvaluation && playerEvaluation.basePoints ? playerEvaluation.basePoints : 0;
        },

        async showAccountBet(account) {
            if(this.expandedAccount && this.expandedAccount._id === account._id) {
                this.expandedAccount = null;
            } else {
                this.loadingDayScores = true;
                this.expandedAccount = account;
                const response = await request.getRequest("/bet/matchDay/" + this.currentMatchDay._id + "/account/" + account._id);
                if(response.status === 200) {
                    this.inspectionRoster = await response.json();
                } else if(response.status === 404){
                    this.loadingDayScores = false;
                    return;
                } else {
                    this.snackbarActivator = true;
                    this.snackbarText = "Something went wrong with getting this roster."
                    this.snackbarColor = 'error';
                    this.loadingDayScores = false;
                    return;
                }

                const evaluationOfMatchDay = this.evaluationsOfMatchDay.find((evaluation) => evaluation.matchDay._id === this.currentMatchDay._id);
                if(evaluationOfMatchDay) {
                    this.evaluations = evaluationOfMatchDay.evaluations;
                } else {
                    const response = await request.getRequest("/evaluationsOfMatchDay/" + this.currentMatchDay._id);
                    if(response.status === 200) {
                        const evaluations = await response.json();
                        // Push every player evaluation into the playerEvaluationsOfMatchDay array
                        let evaluationsOfMatchDay = [];
                        evaluations.forEach((evaluation) => {
                            evaluationsOfMatchDay = evaluationsOfMatchDay.concat(evaluation.blueTeam.players);
                            evaluationsOfMatchDay = evaluationsOfMatchDay.concat(evaluation.redTeam.players);
                        });
                        this.evaluationsOfMatchDay.push({ matchDay: this.currentMatchDay, evaluations: evaluationsOfMatchDay })
                        this.evaluations = evaluationsOfMatchDay;
                    } else {
                        this.evaluations = [];
                    }
                }
                this.loadingDayScores = false;
            }
        },

        async changedTab(tab) {
            this.currentMatchDay = tab;
            if(tab !== "season") {
                this.loadingDayScores = true;
                const response = await request.getRequest("/bets/" + tab._id);
                if(response.status === 200) {
                    const res = await response.json();
                    this.betsPerMatchDay.push({
                        matchDay: tab,
                        bets: res,
                    });
                    this.dataTableItems = JSON.parse(JSON.stringify(this.accounts));
                    this.fillAccountsWithBets(res);
                    this.loadingDayScores = false;
                } else {
                    this.loadingDayScores = false;
                    this.snackbarActivator = true;
                    this.snackbarText = "Something went wrong with getting the leaderboard for this day."
                    this.snackbarColor = 'error';
                }
            } else {
                this.dataTableItems = JSON.parse(JSON.stringify(this.accounts));
            }
        },

        fillAccountsWithBets(bets) {
            this.dataTableItems.forEach((account) => {
                bets.some((bet) => {
                    if(account._id === bet.account) {
                        account.bet = bet;
                        account.score = bet.score ? bet.score : 0;
                        return true;
                    }
                });
                // If account doesn't have any bet for this day set score to 0
                if(account.bet === undefined) {
                    account.score = 0;
                }
            });
        },

        async requestAllAccounts() {
            const response = await request.getRequest("/accounts");
            if(response.status === 200) {
                const res = await response.json();
                // ToDo: Remove this
                res.accounts.forEach((account) => {
                    if(account.score === undefined) {
                        account.score = 0;
                    }
                })

                this.accounts = res.accounts;
                this.dataTableItems = JSON.parse(JSON.stringify(res.accounts));
            }
        },
    },

    // Lifecycle hooks are called at different stages
    // of a component's lifecycle.
    // This function will be called when the component is mounted.
    async mounted() {
        this.matchesPerDay = await this.getMatchDays();
        await this.requestAllAccounts();
    }
}
</script>

<style scoped>

</style>
