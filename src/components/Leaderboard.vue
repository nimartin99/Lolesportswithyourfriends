<template>
    <div style="display: flex; flex-direction: column; padding: 1vw">
        <v-data-table
            style="background-color: transparent; color: white"
            :items="accounts"
            :headers="tableHeader"
        >

        </v-data-table>
    </div>
</template>

<script>
import * as request from "@/api/request";
import {reactive} from "vue";

export default {
    name: "Leaderboard",
    // Properties returned from data() become reactive state
    // and will be exposed on `this`.
    data() {
        return {
            accounts: [],
            matches: [],

            // Table
            tableHeader: [
                { title: 'Username', value: 'username' },
                { title: 'Wins', value: 'wins' },
            ],
        }
    },

    // Methods are functions that mutate state and trigger updates.
    // They can be bound as event handlers in templates.
    methods: {
        async requestAllAccounts() {
            const response = await request.getRequest("/accounts");
            if(response.status === 200) {
                const res = await response.json();
                this.accounts = this.extendAccountsByLeaderBoardValues(res.accounts);
            }
        },

        async requestMatches() {
            const response = await request.getRequest("/matches");
            const res = await response.json();
            res.matches.map((match) => {
                match.dateTime = new Date(match.dateTime);
            });
            this.matches = res.matches;
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
        await this.requestMatches();
        await this.requestAllAccounts();
    }
}
</script>

<style scoped>

</style>
