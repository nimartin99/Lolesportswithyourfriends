<template>
    <div style="display: flex; flex-direction: column; padding: 1vw; color: white; height: 100%">
        <div class="rosterContainer">
            <!-- Top -->
            <v-card
                class="playerCard"
                :style="'background-image: url(' + topPlayerImage + ')'"
            >
                <v-card-title>
                    <img :src="topLane">
                </v-card-title>
                <v-card-title>{{ top?.name }}</v-card-title>
                <v-card-text>
                    <v-select
                        v-model="top"
                        solo
                        auto-select-first
                        density="compact"
                        style="height: 12px"
                        :items="topPlayers"
                        :item-title="player => playerSelectorTitle(player)"
                        :item-value="player => player"
                    />
                </v-card-text>
                <span v-if="top && top.evaluation">{{ top.evaluation?.basePoints }}</span>
            </v-card>
            <!-- Jungle -->
            <v-card
                class="playerCard"
                :style="'background-image: url(' + junglePlayerImage + ')'"
            >
                <v-card-title>
                    <img :src="jungleLane">
                </v-card-title>
                <v-card-title>{{ jungle?.name }}</v-card-title>
                <v-card-text>
                    <v-select
                        v-model="jungle"
                        solo
                        auto-select-first
                        density="compact"
                        style="height: 12px"
                        :items="junglePlayers"
                        :item-title="player => playerSelectorTitle(player)"
                        :item-value="player => player"
                    />
                </v-card-text>
                <span v-if="jungle && jungle.evaluation">{{ jungle.evaluation?.basePoints }}</span>
            </v-card>
            <!-- Mid -->
            <v-card
                class="playerCard"
                :style="'background-image: url(' + midPlayerImage + ')'"
            >
                <v-card-title>
                    <img :src="midLane">
                </v-card-title>
                <v-card-title>{{ mid?.name }}</v-card-title>
                <v-card-text>
                    <v-select
                        v-model="mid"
                        solo
                        auto-select-first
                        density="compact"
                        style="height: 12px"
                        :items="midPlayers"
                        :item-title="player => playerSelectorTitle(player)"
                        :item-value="player => player"
                    />
                </v-card-text>
                <span v-if="mid && mid.evaluation">{{ mid.evaluation?.basePoints }}</span>
            </v-card>
            <!-- Bot -->
            <v-card
                class="playerCard"
                :style="'background-image: url(' + botPlayerImage + ')'"
            >
                <v-card-title>
                    <img :src="botLane">
                </v-card-title>
                <v-card-title>{{ bot?.name }}</v-card-title>
                <v-card-text>
                    <v-select
                        v-model="bot"
                        solo
                        auto-select-first
                        density="compact"
                        style="height: 12px"
                        :items="botPlayers"
                        :item-title="player => playerSelectorTitle(player)"
                        :item-value="player => player"
                    />
                </v-card-text>
                <span v-if="bot && bot.evaluation">{{ bot.evaluation?.basePoints }}</span>
            </v-card>
            <!-- Support -->
            <v-card
                class="playerCard"
                :style="'background-image: url(' + supportPlayerImage + ')'"
            >
                <v-card-title>
                    <img :src="supportLane">
                </v-card-title>
                <v-card-title>{{ support?.name }}</v-card-title>
                <v-card-text>
                    <v-select
                        v-model="support"
                        solo
                        auto-select-first
                        density="compact"
                        style="height: 12px"
                        :items="supportPlayers"
                        :item-title="player => playerSelectorTitle(player)"
                        :item-value="player => player"
                    />
                </v-card-text>
                <span v-if="support && support.evaluation">{{ support.evaluation?.basePoints }}</span>
            </v-card>
            <v-spacer/>
            <!-- Coach -->
            <v-card
                class="playerCard"
                :style="'background-image: url(' + coachPlayerImage + ')'"
            >
                <v-card-title>
                    <img :src="coachLane" style="width: 48px">
                </v-card-title>
                <v-card-title>{{ coach?.name }}</v-card-title>
                <v-card-text>
                    <v-select
                        v-model="coach"
                        solo
                        auto-select-first
                        density="compact"
                        style="height: 12px"
                        :items="coachPlayers"
                        :item-title="player => playerSelectorTitle(player)"
                        :item-value="player => player"
                    />
                </v-card-text>
                <span v-if="coach && coach.evaluation">{{ coach.evaluation?.basePoints }}</span>
            </v-card>
        </div>
        <v-btn
            @click="saveRoster"
        >Save Roster</v-btn>
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
import {mapActions} from "vuex";
import topLane from "@/assets/lanes/top.svg";
import jungleLane from "@/assets/lanes/jungle.svg";
import midLane from "@/assets/lanes/mid.svg";
import botLane from "@/assets/lanes/bot.svg";
import supportLane from "@/assets/lanes/support.svg";
import coachLane from "@/assets/lanes/coach.svg";
import * as request from "@/api/request";
import playerImages from "../../const/playerImagesUrls";

export default {
    name: "Roster",
    // Properties returned from data() become reactive state
    // and will be exposed on `this`.
    data() {
        return {
            top: null,
            jungle: null,
            mid: null,
            bot: null,
            support: null,
            coach: null,

            teams: [],
            matches: [],
            matchDays: [],
            myRoster: {},
            currentMatchDay: null,
            evaluationsOfMatchDay: [],
            playerEvaluationsOfMatchDay: [],

            topPlayers: [],
            junglePlayers: [],
            midPlayers: [],
            botPlayers: [],
            supportPlayers: [],
            coachPlayers: [],

            topPlayerImage: null,
            junglePlayerImage: null,
            midPlayerImage: null,
            botPlayerImage: null,
            supportPlayerImage: null,
            coachPlayerImage: null,

            snackbarActivator: false,
            snackbarText: '',
            snackbarColor: 'error',

            // Icons
            topLane,
            jungleLane,
            midLane,
            botLane,
            supportLane,
            coachLane,
        }
    },

    watch: {
        myRoster() {
            this.top = this.myRoster.topPlayer;
            this.jungle = this.myRoster.junglePlayer;
            this.mid = this.myRoster.midPlayer;
            this.bot = this.myRoster.botPlayer;
            this.support = this.myRoster.supportPlayer;
            this.coach = this.myRoster.coachPlayer;
        },

        top() {
            if(this.top && this.top.name) {
                this.topPlayerImage = playerImages.playerImages.find(playerImage => this.top.name === playerImage.playerName).imageURL;

            }
        },

        jungle() {
            if(this.jungle && this.jungle.name) {
                this.junglePlayerImage = playerImages.playerImages.find(playerImage => this.jungle.name === playerImage.playerName).imageURL;
            }
        },

        mid() {
            if(this.mid && this.mid.name) {
                this.midPlayerImage = playerImages.playerImages.find(playerImage => this.mid.name === playerImage.playerName).imageURL;
            }
        },

        bot() {
            if(this.bot && this.bot.name) {
                this.botPlayerImage = playerImages.playerImages.find(playerImage => this.bot.name === playerImage.playerName).imageURL;
            }
        },

        support() {
            if(this.support && this.support.name) {
                this.supportPlayerImage = playerImages.playerImages.find(playerImage => this.support.name === playerImage.playerName).imageURL;
            }
        },

        coach() {
            if(this.coach && this.coach.name) {
                this.coachPlayerImage = playerImages.playerImages.find(playerImage => this.coach.name === playerImage.playerName).imageURL;
            }
        }
    },

    // Methods are functions that mutate state and trigger updates.
    // They can be bound as event handlers in templates.
    methods: {
        ...mapActions('teams', [ 'getTeams' ]),
        ...mapActions('matches', [ 'getMatches', 'getMatchDays' ]),
        ...mapActions('rosters', [ 'getMyRoster' ]),

        playerSelectorTitle(player) {
            if(player === null) {
                return '';
            } else if(player.team && player.team.abbreviation) {
                return player.team.abbreviation + ' ' + player.name
            } else {
                return player.teamAbbreviation + ' ' + player.name
            }
        },

        getNextMatch() {
            const now = new Date();
            let nextMatch = null;
            this.matches.forEach((match) => {
                // When match is not in past save it in nextMatch if nextMatch is either not set or further in the
                // future than this match
                if(match.dateTime.getTime() > now.getTime() && (nextMatch === null || match.dateTime.getTime() < nextMatch.dateTime.getTime())) {
                    nextMatch = match;
                }
            })
            return nextMatch;
        },

        getCurrentMatchDay() {
            const now = new Date();
            let currentMatchDay = null;
            for (const matchDay of this.matchDays) {
                if (matchDay.date.getTime() === this.stripTimeFromDate(now).getTime()) {
                    currentMatchDay = matchDay;
                    break;
                } else if(matchDay.date.getTime() > now.getTime() && (currentMatchDay === null || matchDay.date.getTime() < currentMatchDay.date.getTime())){
                    currentMatchDay = matchDay;
                }
            }
            return currentMatchDay;
        },

        async saveRoster() {
            // if(this.matchInPast(match)) {
            //     this.snackbarActivator = true;
            //     this.snackbarText = 'This game is over or in progress.'
            //     this.snackbarColor = 'error';
            //     return;
            // }

            const nextMatch = this.getNextMatch();
            console.log(nextMatch);
            if(nextMatch === null) {
                this.snackbarActivator = true;
                this.snackbarText = 'There are currently no matches to set your Roster for.'
                this.snackbarColor = 'error';
                return;
            }
            const betBody = {
                matchDate: this.stripTimeFromDate(nextMatch.dateTime),
                topPlayer: this.top,
                junglePlayer: this.jungle,
                midPlayer: this.mid,
                botPlayer: this.bot,
                supportPlayer: this.support,
                coachPlayer: this.coach,
            };
            const response = await request.postRequest("/bet", betBody)
            if(response.status === 201) {
                this.snackbarActivator = true;
                this.snackbarText = 'Roster saved.'
                this.snackbarColor = 'success';
                // This could be made way more fancy by just replacing the single match in the matches array that is in
                // the response body of the bet post request
                // await this.requestMatches();
            } else if(response.status === 403) {
                this.snackbarActivator = true;
                this.snackbarText = 'You can only save your roster until 15 minutes before the first game starts.'
                this.snackbarColor = 'error';
            }
            else {
                this.snackbarActivator = true;
                this.snackbarText = 'Something went wrong with saving your roster.'
                this.snackbarColor = 'error';
            }
        },

        fillPositionArrays() {
            this.topPlayers = this.teams.map((team) => {
                return team.players.find((player) => {
                    if(player.role === 'top') {
                        player.teamAbbreviation = team.abbreviation;
                        return player;
                    }
                })
            });
            this.junglePlayers = this.teams.map((team) => {
                return team.players.find((player) => {
                    if(player.role === 'jungle') {
                        player.teamAbbreviation = team.abbreviation;
                        return player;
                    }
                })
            });
            this.midPlayers = this.teams.map((team) => {
                return team.players.find((player) => {
                    if(player.role === 'mid') {
                        player.teamAbbreviation = team.abbreviation;
                        return player;
                    }
                })
            });
            this.botPlayers = this.teams.map((team) => {
                return team.players.find((player) => {
                    if(player.role === 'bot') {
                        player.teamAbbreviation = team.abbreviation;
                        return player;
                    }
                })
            });
            this.supportPlayers = this.teams.map((team) => {
                return  team.players.find((player) => {
                    if(player.role === 'support') {
                        player.teamAbbreviation = team.abbreviation;
                        return player;
                    }
                })
            });
            this.coachPlayers = this.teams.map((team) => {
                return  team.players.find((player) => {
                    if(player.role === 'coach') {
                        player.teamAbbreviation = team.abbreviation;
                        return player;
                    }
                })
            });
        },

        stripTimeFromDate(date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        },

        async requestEvaluations() {
            const response = await request.getRequest("/evaluationsOfMatchDay/" + this.currentMatchDay._id);
            if(response.status !== 200) {
                return;
            }
            this.evaluationsOfMatchDay = await response.json();

            // Push every player evaluation into the playerEvaluationsOfMatchDay array
            this.evaluationsOfMatchDay.forEach((evaluation) => {
                this.playerEvaluationsOfMatchDay = this.playerEvaluationsOfMatchDay.concat(evaluation.blueTeam.players);
                this.playerEvaluationsOfMatchDay = this.playerEvaluationsOfMatchDay.concat(evaluation.redTeam.players);
            });

            Object.keys(this.myRoster).forEach((pos) => {
                if(typeof this.myRoster[pos] === 'object') {
                    console.log(pos, ": ", this.myRoster[pos]);
                    this.myRoster[pos].evaluation = this.playerEvaluationsOfMatchDay.find((playerEvaluation) => {
                        if(playerEvaluation !== null && this.myRoster[pos]._id === playerEvaluation.player) {
                            return playerEvaluation;
                        }
                    })
                }
            });
        },
    },

    // Lifecycle hooks are called at different stages
    // of a component's lifecycle.
    // This function will be called when the component is mounted.
    async mounted() {
        this.teams = JSON.parse(JSON.stringify(await this.getTeams()));
        this.matchDays = await this.getMatchDays();
        this.matches = await this.getMatches();
        this.currentMatchDay = this.getCurrentMatchDay();
        if(this.currentMatchDay) {
            this.myRoster = JSON.parse(JSON.stringify(await this.getMyRoster({ update: false, matchDay: this.stripTimeFromDate(this.currentMatchDay.date) })));
            await this.requestEvaluations();
        }
        // This should be executed after readyEvaluations()
        this.fillPositionArrays();
    }
}
</script>

<style scoped lang="scss">
.rosterContainer {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.playerCard {
    align-items: center;
    min-width: 15%;
    margin: 0 0.5%;
    background-color: #2B2B2BFF;
    color: white;
    height: 50%;
    display: flex;
    flex-direction: column;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}

@media only screen and (max-width: 900px) {
    .rosterContainer {
        height: unset;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
}
</style>
