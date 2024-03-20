<template>
    <div style="display: flex; flex-direction: column; padding: 1vw">
        <v-tabs
            v-model="tab"
            style="color: white"
        >
            <v-tab>
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
            style="background-color: transparent; color: white"
            :items="accounts"
            :headers="tableHeader"
        />
    </div>
</template>

<script>
import * as request from "@/api/request";
import {reactive} from "vue";
import {mapActions} from "vuex";

export default {
    name: "Leaderboard",
    // Properties returned from data() become reactive state
    // and will be exposed on `this`.
    data() {
        return {
            tab: 'season',
            accounts: [],
            matches: [],

            loadingDayScores: false,

            matchesPerDay: [],

            // Table
            tableHeader: [
                { title: 'Username', value: 'username' },
                { title: 'Score', value: 'score' },
            ],
        }
    },

    // Methods are functions that mutate state and trigger updates.
    // They can be bound as event handlers in templates.
    methods: {
        ...mapActions('matches', [ 'getMatchDays' ]),

        changedTab(tab) {
            if(tab !== 0) {
                this.loadingDayScores = true;
            }
        },

        async requestAllAccounts() {
            const response = await request.getRequest("/accounts");
            if(response.status === 200) {
                const res = await response.json();
                // ToDo: Remove this
                res.accounts.forEach((account) => {
                    if(account.score === undefined) {
                        account.score = 5;
                    }
                })

                this.accounts = res.accounts;
            }
        },

        extendAccountsByLeaderBoardValues(accounts) {
            accounts.forEach((account) => {
                this.matches.forEach((match) => {
                    // Check if there is even bets and an evaluation of the match
                    if(match.bets && match.evaluation) {
                        match.bets.forEach((bet) => {
                            if(bet.account === account._id && bet.team === match.evaluation.winnerTeam) {
                                if(account.wins) {
                                    account.wins++;
                                } else {
                                    account.wins = 1;
                                }
                            }
                        })
                    }
                })
            })
            return accounts;
        },
    },

    // Lifecycle hooks are called at different stages
    // of a component's lifecycle.
    // This function will be called when the component is mounted.
    async mounted() {
        this.matchesPerDay = await this.getMatchDays();
        console.log("matchDays", this.matchesPerDay);
        await this.requestAllAccounts();
        console.log("accounts", this.accounts);
    }
}
</script>

<style scoped>

</style>
