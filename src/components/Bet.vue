<template>
    <div style="display: flex; flex-direction: column; padding: 1vw; color: white">
        <div v-for="day in matchesPerDay"
             :key="day.date">
            <span>{{ `${('0' + day.date.getDate()).slice(-2)}.${('0' + (day.date.getMonth() + 1)).slice(-2)}.${day.date.getFullYear()}` }}</span>
            <div
                v-for="(match) in day.matches"
                :key="match._id"
                style="margin: 2px 0"
            >
                <div style="display: flex; flex-direction: row; justify-content: space-around;">
                    <v-card
                        class="teamCard"
                        :class="userPlacedBets(match, match.team1._id) ? 'teamSelected' : ''"
                        :style="matchInPast(match) ? 'cursor: not-allowed' : 'cursor: pointer'"
                        @click="placeBet(match, match.team1._id)"
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
                        :class="userPlacedBets(match, match.team2._id) ? 'teamSelected' : ''"
                        :style="matchInPast(match) ? 'cursor: not-allowed' : 'cursor: pointer'"
                        @click="placeBet(match, match.team2)"
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

export default {
    name: "Bet",
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
        async requestMatches() {
            const response = await request.getRequest("/matches");
            const res = await response.json();
            res.matches.map((match) => {
                match.dateTime = new Date(match.dateTime);
            });
            this.matches = res.matches;
            this.fillMatchesPerDayArray();
        },

        fillMatchesPerDayArray() {
            this.matchesPerDay = [];
            const matchesPerDayVar = [];
            this.matches.map((match) => {
                const matchDate = new Date(match.dateTime.getFullYear(), match.dateTime.getMonth(), match.dateTime.getDate());
                const matchDay = matchesPerDayVar.find((day) => {
                    return day.date.getTime() === matchDate.getTime();
                });
                if(matchDay) {
                    matchDay.matches.push(match);
                } else {
                    matchesPerDayVar.push({
                        date: matchDate,
                        matches: [ match ],
                    })
                }
            });

            matchesPerDayVar.sort((a, b) => {
                if (a.date.getTime() < b.date.getTime()) return -1;
                else return 1;
            })

            this.matchesPerDay = matchesPerDayVar;
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
            return match.bets.some((bet) => {
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
        await this.requestMatches();
        await this.requestMyAccount();
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
