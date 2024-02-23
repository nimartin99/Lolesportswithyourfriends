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
            </div>

            <div
                v-if="stepperValue === 2"
                style="display: flex; flex-direction: row; justify-content: center; width: 100%; height: 70vh; overflow: auto"
            >
                <div style="display: flex; flex-direction: column; width: 50%">
                    <span>Blue Team</span>
                    <TeamStatsEditable
                        :team-stats="blueTeam"
                    />
                </div>
                <div style="display: flex; flex-direction: column; width: 50%">
                    <span>Red Team</span>
                    <TeamStatsEditable
                        :team-stats="redTeam"
                    />
                </div>
            </div>

            <div
                style="width: 100%; display: flex; flex-direction: row; justify-content: space-between"
            >
                <div/>
                <v-btn
                    @click="getInfo"
                >
                    Get Info
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
    data() {
        return {
            stepperValue: 1,

            matchId: '111561061776880408',
            timestamp: '2024-02-18T16:43:40.000Z',

            matchRaw: {},
            playerRaw: {},

            snackbarActivator: false,
            snackbarText: '',
            snackbarColor: 'error',



            // Match vars
            blueTeam: {
                players: [],
                teamData: {},
            },

            redTeam: {
                players: [],
                teamData: {},
            },
        }
    },

    // Methods are functions that mutate state and trigger updates.
    // They can be bound as event handlers in templates.
    methods: {
        async getInfo() {
            this.stepperValue = 2;
            if(this.matchId !== '' && this.timestamp !== '') {
                await this.requestMatchFromLolesports(this.matchId, this.timestamp);
                this.parseDataToLocals();
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
            console.log("Matchstats: ", matchStats);
            console.log("Playerstats: ", playerStats);
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
            for(let i = 0; i < this.matchRaw.gameMetadata.blueTeamMetadata.participantMetadata.length; i++) {
                const bluePlayer = Object.assign({}, this.matchRaw.gameMetadata.blueTeamMetadata.participantMetadata[i], this.playerRaw.team1[i]);
                this.blueTeam.players.push(bluePlayer);
                const redPlayer = Object.assign({}, this.matchRaw.gameMetadata.redTeamMetadata.participantMetadata[i], this.playerRaw.team1[i]);
                this.redTeam.players.push(redPlayer);
            }

            const teamsMetaData = this.matchRaw.frames[this.matchRaw.frames.length - 1];
            this.blueTeam.teamData = teamsMetaData.blueTeam;
            this.redTeam.teamData = teamsMetaData.redTeam;
            console.log(this.blueTeam);
            console.log(this.redTeam);
        },
    },

    // Lifecycle hooks are called at different stages
    // of a component's lifecycle.
    // This function will be called when the component is mounted.
    async mounted() {

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
