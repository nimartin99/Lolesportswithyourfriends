<template>
    <div style="display: flex; flex-direction: column; width: 100%">
        <v-stepper
            :model-value="stepperValue"
            style="width: 100%"
        >
            <v-stepper-header style="">
                <v-stepper-item
                    complete
                    title="Match Information"
                    :value="1"
                ></v-stepper-item>

                <v-divider></v-divider>

                <v-stepper-item
                    title="Check Data"
                    :value="2"
                ></v-stepper-item>
            </v-stepper-header>

            <div
                v-if="stepperValue === 1"
                style="display: flex; flex-direction: column; align-items: center; width: 100%; height: 70vh"
            >
                <div style="display: flex; flex-direction: row; align-items: center; width: 50%; justify-content: center">
                    <span style="padding: 12px">Match ID</span>
                    <v-text-field
                        v-model="matchId"
                        label="Match ID"
                        required
                        hide-details
                    />
                </div>
                <div style="display: flex; flex-direction: row; align-items: center; width: 50%; justify-content: center">
                    <span style="padding: 12px">Timestamp</span>
                    <v-text-field
                        v-model="timestamp"
                        label="Timestamp"
                        required
                        hide-details
                    />
                </div>
                <div
                    v-if="match.matchType && match.matchType !== 'Bo1'"
                    style="display: flex; flex-direction: row; align-items: center; width: 50%; justify-content: center"
                >
                    <span style="padding: 12px">Match of Series</span>
                    <v-select
                        v-model="matchNumber"
                        :items="matchSelectionItems"
                        density="compact"
                        style="max-width: 20%"
                    >

                    </v-select>
                </div>
            </div>

            <div
                v-if="stepperValue === 2"
                style="display: flex; flex-direction: row; justify-content: center; width: 100%; height: 70vh; overflow: auto"
            >
                <div style="display: flex; flex-direction: column; width: 50%">
                    <div style="display: flex; flex-direction: row; justify-content: space-between; align-items:center; padding: 0 12px">
                        <span>{{ winnerTeam === null ? 'Choose Winner' : winnerTeam._id === match.team1._id ? 'Winner: ' : 'Looser:' }}</span>
                        <v-btn @click="winnerTeam = match.team1">{{ match.team1.name }}</v-btn>
                    </div>
                    <TeamStatsEditable
                        :team-stats="blueTeam"
                        :local-team="teams.find(team => team._id === match.team1._id)"
                    />
                </div>
                <div style="display: flex; flex-direction: column; width: 50%">
                    <div style="display: flex; flex-direction: row; justify-content: space-between; align-items:center; padding: 0 12px">
                        <span>{{ winnerTeam === null ? 'Choose Winner' : winnerTeam._id === match.team2._id ? 'Winner: ' : 'Looser:' }}</span>
                        <v-btn @click="winnerTeam = match.team2">{{ match.team2.name }}</v-btn>
                    </div>
                    <TeamStatsEditable
                        :team-stats="redTeam"
                        :local-team="teams.find(team => team._id === match.team2._id)"
                    />
                </div>
            </div>

            <div
                style="width: 100%; display: flex; flex-direction: row; justify-content: space-between"
            >
                <div/>
                <v-btn
                    @click="stepperValue === 1 ? getInfo() : postEvaluation()"
                >
                    {{ stepperValue === 1 ? 'Get Info' : 'Upload Data' }}
                </v-btn>
            </div>
        </v-stepper>


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
import TeamStatsEditable from "@/components/TeamStatsEditable";

export default {
    name: "EvaluateDialog",
    components: {TeamStatsEditable},
    // Properties returned from data() become reactive state
    // and will be exposed on `this`.
    props: {
        teams: { type: Array, required: false, default: 36 },
        match: { type: Object, required: true },
    },
    data() {
        return {
            stepperValue: 1,

            matchId: '',
            timestamp: '2024-02-03T16:39:20.000Z',

            matchRaw: {},
            playerRaw: {},

            snackbarActivator: false,
            snackbarText: '',
            snackbarColor: 'error',

            matchSelectionItems: [],
            matchNumber: 1,

            // Match vars
            winnerTeam: null,
            blueTeam: {
                players: [],
            },

            redTeam: {
                players: [],
            },
        }
    },

    // Methods are functions that mutate state and trigger updates.
    // They can be bound as event handlers in templates.
    methods: {
        async getInfo() {
            if(this.matchId !== '' && this.timestamp !== '') {
                await this.requestMatchFromLolesports(this.matchId, this.timestamp);
                this.parseDataToLocals();
                this.calculateBasePoints();
                this.stepperValue = 2;
                // this.calculateItems();
            }
        },

        async postEvaluation() {
            if(this.winnerTeam === null) {
                this.snackbarActivator = true;
                this.snackbarColor = 'error';
                this.snackbarText = "You still need to choose a winner of the game.";
                return;
            }
            const evaluation = {
                matchId: this.match._id,
                winnerTeamId: this.winnerTeam._id,
                lolesportsMatchId: this.matchId,
                lolesportsTimestamp: this.timestamp,
                blueTeam: this.blueTeam,
                redTeam: this.redTeam,
                matchNumber: this.matchNumber,
            };
            console.log(evaluation)

            const response = await request.postRequest("/evaluation", evaluation);
            if(response.status === 201) {
                this.snackbarActivator = true;
                this.snackbarColor = 'success';
                this.snackbarText = 'Created Match evaluation.';
            }
        },

        async requestMatchFromLolesports(matchId, timestamp) {
            let response = await fetch('https://feed.lolesports.com/livestats/v1/window/' + matchId + '?startingTime=' + timestamp, {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                },
            });
            let matchStats;
            if(response.status === 200) {
                matchStats = await response.json();
            } else {
                this.snackbarColor = "error";
                this.snackbarText = "Something went wrong getting the match stats.";
                this.snackbarActivator = true;
                return;
            }


            const playerStats = {
                team1: [],
                team2: [],
            };
            for (let i = 0; i <= 4; i++) {
                // wait for the promise to resolve before advancing the for loop
                response = await this.requestTwoPlayerStats(matchId, timestamp, i);
                if(response.status === 200) {
                    const playerData = await response.json();
                    playerStats.team1[i] = playerData.frames[playerData.frames.length - 1].participants[0];
                    playerStats.team2[i] = playerData.frames[playerData.frames.length - 1].participants[1];
                } else {
                    this.snackbarColor = "error";
                    this.snackbarText = "Something went wrong getting the match stats.";
                    this.snackbarActivator = true;
                    return;
                }
            }

            this.matchRaw = matchStats;
            this.playerRaw = playerStats;
        },

        async requestTwoPlayerStats(matchId, timestamp, index) {
            return  await fetch('https://feed.lolesports.com/livestats/v1/details/' + matchId + '?startingTime=' + timestamp + '&participantIds=' + (index + 1) + '_' + (index + 6), {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                },
            });
        },

        parseDataToLocals() {
            const teamsMetaData = this.matchRaw.frames[this.matchRaw.frames.length - 1];
            teamsMetaData.blueTeam.players = [];
            teamsMetaData.redTeam.players = [];

            for(let i = 0; i < this.matchRaw.gameMetadata.blueTeamMetadata.participantMetadata.length; i++) {
                const bluePlayer = Object.assign({}, this.matchRaw.gameMetadata.blueTeamMetadata.participantMetadata[i], this.playerRaw.team1[i]);
                bluePlayer.name = bluePlayer.summonerName.substring(bluePlayer.summonerName.indexOf(' ') + 1);
                teamsMetaData.blueTeam.players.push(bluePlayer);

                const redPlayer = Object.assign({}, this.matchRaw.gameMetadata.redTeamMetadata.participantMetadata[i], this.playerRaw.team2[i]);
                redPlayer.name = redPlayer.summonerName.substring(redPlayer.summonerName.indexOf(' ') + 1);
                teamsMetaData.redTeam.players.push(redPlayer);
            }

            teamsMetaData.blueTeam.coach = JSON.parse(JSON.stringify(this.teams.find(team => team._id === this.match.team1._id).players.find(player => player.role === 'coach')));
            teamsMetaData.redTeam.coach = JSON.parse(JSON.stringify(this.teams.find(team => team._id === this.match.team2._id).players.find(player => player.role === 'coach')));


            this.blueTeam = teamsMetaData.blueTeam;
            this.redTeam = teamsMetaData.redTeam;
        },

        calculateBasePoints() {
            this.blueTeam.players.forEach((player) => {
                player.basePoints = player.kills * 5 + player.deaths * (-3) + player.assists * 2;
            });
            this.redTeam.players.forEach((player) => {
                player.basePoints = player.kills * 5 + player.deaths * (-3) + player.assists * 2;
            });
            this.blueTeam.coach.basePoints = 1 * this.blueTeam.towers + 2 * this.blueTeam.dragons.length + 2 * this.blueTeam.inhibitors + 3 * this.blueTeam.barons;
            this.redTeam.coach.basePoints = 1 * this.redTeam.towers + 2 * this.redTeam.dragons.length + 2 * this.redTeam.inhibitors + 3 * this.redTeam.barons;
        }
    },

    // Lifecycle hooks are called at different stages
    // of a component's lifecycle.
    // This function will be called when the component is mounted.
    async mounted() {
        this.timestamp = new Date().toISOString();

        this.matchId = "111997906552170257";
        this.timestamp = "2024-03-11T17:18:50.000Z";

        if(this.match.matchType === 'Bo3') {
            this.matchSelectionItems = [1, 2, 3];
        } else if(this.match.matchType === 'Bo5') {
            this.matchSelectionItems = [1, 2, 3, 4, 5];
        } else {
            this.matchSelectionItems = [];
        }
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

.dialogClass {
    display: flex;
    justify-content: center;
}
</style>
