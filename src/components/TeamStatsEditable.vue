<template>
    <div style="display: flex; flex-direction: column; width: 100%; padding: 0 12px">
        <div class="rowWithTextField">
            <span>Kills</span>
            <v-text-field
                v-model="teamStats.totalKills"
                hide-details
                single-line
                type="number"
                variant="outlined"
                class="textField"
            />
        </div>
        <div class="rowWithTextField">
            <span>Towers</span>
            <v-text-field
                v-model="teamStats.towers"
                hide-details
                single-line
                type="number"
                variant="outlined"
                class="textField"
            />
        </div>
        <div class="rowWithTextField">
            <span>Inhibitors</span>
            <v-text-field
                v-model="teamStats.inhibitors"
                hide-details
                single-line
                type="number"
                variant="outlined"
                class="textField"
            />
        </div>
        <div class="rowWithTextField">
            <span>Dragons</span>
            <v-text-field
                v-model="teamStats.dragons"
                hide-details
                single-line
                variant="outlined"
                class="textField"
            />
        </div>
        <div class="rowWithTextField">
            <span>Total Gold</span>
            <v-text-field
                v-model="teamStats.totalGold"
                hide-details
                single-line
                variant="outlined"
                class="textField"
            />
        </div>

        <v-expansion-panels>
            <v-expansion-panel
                v-for="player in teamStats.players"
                :title="player.summonerName"
            >
                <v-expansion-panel-text>
                    <div class="rowWithTextField">
                        <span style="width: 60%">KDA</span>
                        <v-text-field
                            v-model="player.kills"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField shrink"
                        />
                        <span> / </span>
                        <v-text-field
                            v-model="player.deaths"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                        <span> / </span>
                        <v-text-field
                            v-model="player.assists"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Kill Participation</span>
                        <v-text-field
                            v-model="player.killParticipation"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Damage Share</span>
                        <v-text-field
                            v-model="player.championDamageShare"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                    <v-divider style="margin: 12px"/>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Champion</span>
                        <v-text-field
                            v-model="player.championId"
                            hide-details
                            single-line
                            variant="outlined"
                            class="textField"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Level</span>
                        <v-text-field
                            v-model="player.level"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Gold earned</span>
                        <v-text-field
                            v-model="player.totalGoldEarned"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Creep Score</span>
                        <v-text-field
                            v-model="player.creepScore"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Attack Damage</span>
                        <v-text-field
                            v-model="player.attackDamage"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Critical Chance</span>
                        <v-text-field
                            v-model="player.criticalChance"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Attack Speed</span>
                        <v-text-field
                            v-model="player.attackSpeed"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Ability Power</span>
                        <v-text-field
                            v-model="player.abilityPower"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Armor</span>
                        <v-text-field
                            v-model="player.armor"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Magic Resistance</span>
                        <v-text-field
                            v-model="player.magicResistance"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Tenacity</span>
                        <v-text-field
                            v-model="player.tenacity"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Life Steal</span>
                        <v-text-field
                            v-model="player.lifeSteal"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Wards placed</span>
                        <v-text-field
                            v-model="player.wardsPlaced"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                    <div class="rowWithTextField">
                        <span style="width: 60%">Wards destroyed</span>
                        <v-text-field
                            v-model="player.wardsDestroyed"
                            hide-details
                            single-line
                            variant="outlined"
                            type="number"
                            class="textField"
                        />
                    </div>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script>
import * as request from "@/api/request";
import {reactive} from "vue";

export default {
    name: "TeamStatsEditable",
    props: {
        teamStats: { type: Object, required: true },
    },
    // Properties returned from data() become reactive state
    // and will be exposed on `this`.
    data() {
        return {

        }
    },

    // Methods are functions that mutate state and trigger updates.
    // They can be bound as event handlers in templates.
    methods: {

    },

    // Lifecycle hooks are called at different stages
    // of a component's lifecycle.
    // This function will be called when the component is mounted.
    async mounted() {

    }
}
</script>

<style scoped>
.rowWithTextField {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.textField {
    max-width: 50%
}
</style>
