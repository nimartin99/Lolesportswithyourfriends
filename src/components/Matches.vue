<template>
    <div style="display: flex; flex-direction: column; padding: 1vw; color: white">
        <div v-for="matchDay in matchesPerDay"
             :key="matchDay.date">
            <span>{{ `${('0' + matchDay.date.getDate()).slice(-2)}.${('0' + (matchDay.date.getMonth() + 1)).slice(-2)}.${matchDay.date.getFullYear()}` }}</span>
            <div
                v-for="(match) in matchDay.matches"
                :key="match._id"
                style="margin: 2px 0"
            >
                <div style="display: flex; flex-direction: row; justify-content: space-around;">
                    <v-card
                        class="teamCard"
                    >
                        <v-card-title
                            class="teamCardTitle"
                            style="display: flex; flex-direction: row; justify-content: center; align-items: center; text-align: center"
                        >
                            <img
                                v-if="match.evaluation && match.evaluation.winnerTeam === match.team1._id"
                                :src="winningSymbol"
                                style="height: 32px"
                            >
                            {{ `${ match.team1.name } (${ match.team1.abbreviation })` }}
                        </v-card-title>
                    </v-card>
                    <div style="width: 5%; display: flex; flex-direction: column; justify-content: center; align-items: center">
                        <span>{{ `${match.dateTime.getHours()}:${('0' + match.dateTime.getMinutes()).slice(-2)}` }}</span>
                    </div>
                    <v-card
                        class="teamCard"
                    >
                        <v-card-title
                            class="teamCardTitle"
                            style="display: flex; flex-direction: row; justify-content: center; align-items: center; text-align: center"
                        >
                            <img
                                v-if="match.evaluation && match.evaluation.winnerTeam === match.team2._id"
                                :src="winningSymbol"
                                style="height: 32px"
                            >
                            {{ `${ match.team2.name } (${ match.team2.abbreviation })` }}
                        </v-card-title>
                    </v-card>
                </div>
            </div>
        </div>
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
    name: "Matches",
    // Properties returned from data() become reactive state
    // and will be exposed on `this`.
    data() {
        return {
            account: null,
            matches: [],
            matchesPerDay: [],

            now: null,

            snackbarActivator: false,
            snackbarText: '',
            snackbarColor: 'error',

            // Icons
            winningSymbol: winningSymbol,
        }
    },

    // Methods are functions that mutate state and trigger updates.
    // They can be bound as event handlers in templates.
    methods: {
        ...mapActions('matches', [ 'getMatchDays' ]),

        async requestMatchDays() {
            this.matchesPerDay = await this.getMatchDays();
        },

        async requestMyAccount() {
            const response = await request.getRequest("/user/account");
            if(response.status === 200) {
                const res = await response.json();
                this.account = res.account;
            }
        },

        async placeBet(match, teamId) {
            if(this.matchInPast(match)) {
                this.snackbarActivator = true;
                this.snackbarText = 'This game is over or in progress.'
                this.snackbarColor = 'error';
                return;
            }
            const matchId = match._id;
            const betBody = {
                matchId,
                teamId,
            };
            const response = await request.postRequest("/bet", betBody)
            if(response.status === 201) {
                // This could be made way more fancy by just replacing the single match in the matches array that is in
                // the response body of the bet post request
                await this.requestMatches();
            } else {
                this.snackbarActivator = true;
                this.snackbarText = 'Something went wrong placing your bet.'
                this.snackbarColor = 'error';
            }
        },

        userPlacedBets(match, teamId) {
            return match.bets && match.bets.some((bet) => {
                return bet.account === this.account._id && bet.team === teamId;
            })
        },

        matchInPast(match) {
            return match.dateTime.getTime() < this.now.getTime();
        },
    },

    // Lifecycle hooks are called at different stages
    // of a component's lifecycle.
    // This function will be called when the component is mounted.
    async mounted() {
        this.now = new Date();
        await this.requestMatchDays();
        await this.requestMyAccount();
        console.log(this.matchesPerDay)
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
</style>
