
<template>
    <div id="WinRate">
        <div class="inputContainer">
            <div class="center">
                <p>Rank</p>
                <select name="rank" id="rank" v-model="game.rank" @change="getWinrate">
                    <option value="all">any</option>
                    <option value="IRON">Iron</option>
                    <option value="BRONZE">Bronze</option>
                    <option value="GOLD">Gold</option>
                    <option value="PLATINUM">Platinum</option>
                    <option value="EMERALD">Emerald</option>
                    <option value="DIAMOND">Diamond</option>
                    <option value="MASTER">Master</option>
                    <option value="GRANDMASTER">Grandmaster</option>
                </select>
            </div>
        </div>

        <div class="inputContainer">
            <div class="team1">
                <p>Atakhan</p>
                <input type="checkbox" v-model="team1.atakhan" @change="getWinrate" :disabled="!game.atakhan || team2.atakhan">
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.atakhan" @change="getWinrate">
            </div>
            <div class="team2">
                <p>Atakhan</p>
                <input type="checkbox" v-model="team2.atakhan" @change="getWinrate" :disabled="!game.atakhan || team1.atakhan">
            </div>
        </div>

        <div class="inputContainer">
            <div class="team1">
                <p>Feats</p>
                <input type="checkbox" v-model="team1.feats" @change="getWinrate" :disabled="!game.feats || team2.feats">
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.feats" @change="getWinrate">
            </div>
            <div class="team2">
                <p>Feats</p>
                <input type="checkbox" v-model="team2.feats" @change="getWinrate" :disabled="!game.feats || team1.feats">
            </div>
        </div>

        <div class="inputContainer">
            <div class="team1">
                <p>First baron</p>
                <input type="checkbox" v-model="team1.firstBaron" @change="getWinrate" :disabled="!game.firstBaron || team2.firstBaron">
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.firstBaron" @change="getWinrate">
            </div>
            <div class="team2">
                <p>Firts baron</p>
                <input type="checkbox" v-model="team2.firstBaron" @change="getWinrate" :disabled="!game.firstBaron || team1.firstBaron">
            </div>
        </div>

        <div class="inputContainer">
            <div class="team1">
                <p>First blood</p>
                <input type="checkbox" v-model="team1.firstBlood" @change="getWinrate" :disabled="!game.firstBlood || team2.firstBlood">
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.firstBlood" @change="getWinrate">
            </div>
            <div class="team2">
                <p>First blood</p>
                <input type="checkbox" v-model="team2.firstBlood" @change="getWinrate" :disabled="!game.firstBlood || team1.firstBlood">
            </div>
        </div>

        <div class="inputContainer">
            <div class="team1">
                <p>First dragon</p>
                <input type="checkbox" v-model="team1.firstDragon" @change="getWinrate" :disabled="!game.firstDragon || team2.firstDragon">
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.firstDragon" @change="getWinrate">
            </div>
            <div class="team2">
                <p>First dragon</p>
                <input type="checkbox" v-model="team2.firstDragon" @change="getWinrate" :disabled="!game.firstDragon || team1.firstDragon">
            </div>
        </div>

        <div class="inputContainer">
            <div class="team1">
                <p>First inhib</p>
                <input type="checkbox" v-model="team1.firstInhib" @change="getWinrate" :disabled="!game.firstInhib || team2.firstInhib">
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.firstInhib" @change="getWinrate">
            </div>
            <div class="team2">
                <p>Firts inhib</p>
                <input type="checkbox" v-model="team2.firstInhib" @change="getWinrate" :disabled="!game.firstInhib || team1.firstInhib">
            </div>
        </div>

        <div class="inputContainer">
            <div class="team1">
                <p>First tower</p>
                <input type="checkbox" v-model="team1.firstTower" @change="getWinrate" :disabled="!game.firstTower || team2.firstTower">
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.firstTower" @change="getWinrate">
            </div>
            <div class="team2">
                <p>Firts tower</p>
                <input type="checkbox" v-model="team2.firstTower" @change="getWinrate" :disabled="!game.firstTower || team1.firstTower">
            </div>
        </div>

        <div class="inputContainer">
            <div class="team1">
                <p>Herald</p>
                <input type="checkbox" v-model="team1.herald" @change="getWinrate" :disabled="!game.herald || team2.herald">
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.herald" @change="getWinrate">
            </div>
            <div class="team2">
                <p>Herald</p>
                <input type="checkbox" v-model="team2.herald" @change="getWinrate" :disabled="!game.herald || team1.herald">
            </div>
        </div>

        <div id="RateBar">
            <div id="Left">{{ Math.round(team1.winrate * 100) / 100 }}% ({{ team1.gameCount }})</div>
            <div id="Right">{{ Math.round(team2.winrate * 100) / 100 }}% ({{ team2.gameCount }})</div>
        </div>
    </div>

</template>
<script  lang="ts">
import { ref, useTemplateRef, type Ref } from 'vue';
import * as d3 from "d3" 
import axios from 'axios';
import type { Query } from '@codemix/ts-sql';
class BaseDetail {
    wins: string[] = []
    losses: string[] = []
    WR: number = 0
}

class AdvDetail {
    wins: string[] = []
    losses: string[] = []
    WR: number = 0 
    vs: {[vs: number]: BaseDetail} = {}
}

class Details{
    rank: {[rank: string]: BaseDetail} = {}
    dragonCount: {[count: number]: AdvDetail} = {}
    grubCount: {[count: number]: AdvDetail} = {}
    inhibCount: {[count: number]: AdvDetail} = {}
    towerCount: {[count: number]: AdvDetail} = {}
    baron: {[count: number]: AdvDetail} = {}
    
    herald: {[count: number]: AdvDetail} = {}
    atakhan: {[count: number]: AdvDetail} = {}
    feats: {[count: number]: AdvDetail} = {}
    firstBlood: {[count: number]: AdvDetail} = {}
    firstDragon: {[count: number]: AdvDetail} = {}
    firstInhib: {[count: number]: AdvDetail} = {}
    firstTower: {[count: number]: AdvDetail} = {}
    firstBaron: {[count: number]: AdvDetail} = {}
    soul: {[count: number]: AdvDetail} = {}
    totalGames: number = 0
}

class Team{
    atakhan: boolean = false
    feats: boolean = false
    firstBaron: boolean = false
    firstBlood: boolean = false
    firstDragon: boolean = false
    firstInhib: boolean = false
    firstTower: boolean = false
    herald: boolean = false
    winrate: number = 50
    gameCount: number = 0
}

class Game{
    rank: string = "all"
    atakhan: boolean = false
    feats: boolean = false
    firstBaron: boolean = false
    firstBlood: boolean = false
    firstDragon: boolean = false
    firstInhib: boolean = false
    firstTower: boolean = false
    herald: boolean = false
}
export default{
    name: "WinRate",
    setup(){
        let team1: Ref<Team> = ref(new Team)
        let team2: Ref<Team> = ref(new Team)
        let game: Ref<Game> = ref(new Game)
        let gameData: Ref<Details> = ref(new Details)
        return{
            team1,
            team2,
            game,
            gameData
        }
    },
    methods: {
        adjustWidth(){
            d3.select("#Left").transition().duration(200).style("width", `${this.team1.winrate}%`)
            d3.select("#Right").transition().duration(200).style("width", `${this.team2.winrate}%`)
        },
        getWinrate(){
            console.log('started')
            let qual_games: BaseDetail[] = []

            if(this.game.rank != "all"){
                qual_games.push({
                    wins: this.gameData['rank'][this.game.rank].wins,
                    losses: this.gameData['rank'][this.game.rank].losses,
                    WR: this.gameData['rank'][this.game.rank].WR
                })
            }

            if(this.game.atakhan){
                let teamAtakhan = this.team1.atakhan ? 1 : 0
                let oppAtakhan = this.team2.atakhan ? 1 : 0
                qual_games.push({
                    wins: this.gameData['atakhan'][teamAtakhan].vs[oppAtakhan].wins,
                    losses: this.gameData['atakhan'][teamAtakhan].vs[oppAtakhan].losses,
                    WR: this.gameData['atakhan'][teamAtakhan].vs[oppAtakhan].WR
                })
            }else{
                this.team1.atakhan = false
                this.team2.atakhan = false
            }

            if(this.game.feats){
                let teamFeats = this.team1.feats ? 1 : 0
                let oppFeats = this.team2.feats ? 1 : 0
                qual_games.push({
                    wins: this.gameData['feats'][teamFeats].vs[oppFeats].wins,
                    losses: this.gameData['feats'][teamFeats].vs[oppFeats].losses,
                    WR: this.gameData['feats'][teamFeats].vs[oppFeats].WR
                })
            }else{
                this.team1.feats = false
                this.team2.feats = false
            }

            if(this.game.firstBaron){
                let teamFirstBaron = this.team1.firstBaron ? 1 : 0
                let oppFirstBaron = this.team2.firstBaron ? 1 : 0
                qual_games.push({
                    wins: this.gameData['firstBaron'][teamFirstBaron].vs[oppFirstBaron].wins,
                    losses: this.gameData['firstBaron'][teamFirstBaron].vs[oppFirstBaron].losses,
                    WR: this.gameData['firstBaron'][teamFirstBaron].vs[oppFirstBaron].WR
                })
            }else{
                this.team1.firstBaron = false
                this.team2.firstBaron = false
            }

            if(this.game.firstBlood){
                let teamFirstBlood = this.team1.firstBlood ? 1 : 0
                let oppFirstBlood = this.team2.firstBlood ? 1 : 0
                qual_games.push({
                    wins: this.gameData['firstBlood'][teamFirstBlood].vs[oppFirstBlood].wins,
                    losses: this.gameData['firstBlood'][teamFirstBlood].vs[oppFirstBlood].losses,
                    WR: this.gameData['firstBlood'][teamFirstBlood].vs[oppFirstBlood].WR
                })
            }else{
                this.team1.firstBlood = false
                this.team2.firstBlood = false
            }

            if(this.game.firstDragon){
                let teamFirstDragon = this.team1.firstDragon ? 1 : 0
                let oppFirstDragon = this.team2.firstDragon ? 1 : 0
                qual_games.push({
                    wins: this.gameData['firstDragon'][teamFirstDragon].vs[oppFirstDragon].wins,
                    losses: this.gameData['firstDragon'][teamFirstDragon].vs[oppFirstDragon].losses,
                    WR: this.gameData['firstDragon'][teamFirstDragon].vs[oppFirstDragon].WR
                })
            }else{
                this.team1.firstDragon = false
                this.team2.firstDragon = false
            }

            if(this.game.firstInhib){
                let teamFirstInhib = this.team1.firstInhib ? 1 : 0
                let oppFirstInhib = this.team2.firstInhib ? 1 : 0
                qual_games.push({
                    wins: this.gameData['firstInhib'][teamFirstInhib].vs[oppFirstInhib].wins,
                    losses: this.gameData['firstInhib'][teamFirstInhib].vs[oppFirstInhib].losses,
                    WR: this.gameData['firstInhib'][teamFirstInhib].vs[oppFirstInhib].WR
                })
            }else{
                this.team1.firstInhib = false
                this.team2.firstInhib = false
            }

            if(this.game.firstTower){
                let teamFirstTower = this.team1.firstTower ? 1 : 0
                let oppFirstTower = this.team2.firstTower ? 1 : 0
                qual_games.push({
                    wins: this.gameData['firstTower'][teamFirstTower].vs[oppFirstTower].wins,
                    losses: this.gameData['firstTower'][teamFirstTower].vs[oppFirstTower].losses,
                    WR: this.gameData['firstTower'][teamFirstTower].vs[oppFirstTower].WR
                })
            }else{
                this.team1.firstTower = false
                this.team2.firstTower = false
            }
  
            if(this.game.herald){
                let teamHerald = this.team1.herald ? 1 : 0
                let oppHerald = this.team2.herald ? 1 : 0
                qual_games.push({
                    wins: this.gameData['herald'][teamHerald].vs[oppHerald].wins,
                    losses: this.gameData['herald'][teamHerald].vs[oppHerald].losses,
                    WR: this.gameData['herald'][teamHerald].vs[oppHerald].WR
                })
            }else{
                this.team1.herald = false
                this.team2.herald = false
            }

            let accepted = qual_games.pop()
            if(!accepted){
                this.team1.winrate = 50
                this.team1.gameCount = 0
                this.team2.winrate = 50
                this.team2.gameCount = 0
                this.adjustWidth()  
                return
            }
            console.log('filtering')

            for(let game of qual_games){
                accepted.wins = this.intersection(accepted.wins, game.wins)
                accepted.losses = this.intersection(accepted.losses, game.losses)
                console.log(accepted)
            }
            console.log('done')

            accepted.WR = (accepted.wins.length / (accepted.wins.length + accepted.losses.length)) * 100

            if(accepted.losses.length == 0 || accepted.wins.length == 0){
                this.team1.winrate = 50
                this.team1.gameCount = 0
                this.team2.winrate = 50
                this.team2.gameCount = 0
                this.adjustWidth()  
                return
            }

            this.team1.winrate = accepted.WR
            this.team1.gameCount = accepted.wins.length
            this.team2.winrate = 100 - accepted.WR
            this.team2.gameCount = accepted.losses.length

            this.adjustWidth()  
        },
        readData(){
            d3.json("http://localhost:5173/stats/overview.json").then((data: any) => {
                this.gameData = data
                console.log('loaded')
            })
        },
        intersection(array1: string[], array2: string[]) {
            let results: string[] = []
            let i = 0, j = 0;
            while (i < array1.length && j < array2.length) {
                if (array1[i] < array2[j]) {
                    i++
                } else if (array1[i] > array2[j]) {
                    j++
                } else {
                    results.push(array1[i])
                    i++
                    j++
                }
            }
            return results
        }
    },
    mounted(){
        this.readData()
        
    }
}
</script>



<style lang="scss" scoped>
.inputContainer{
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: 5px;    
    margin-bottom: 5px;
}

.team1{
    display: flex;
    flex-direction: row;
    margin-right: auto;
}

.center{
    display: flex;
    flex-direction: row;
    margin: auto;
}

.team2{
    display: flex;
    flex-direction: row;
    margin-left: auto;
}

#Team1{
    display: flex;
    flex-direction: column;
    width: 50%;

}

#Team2{
    display: flex;
    flex-direction: column;
    width: 50%;
    align-items: end;
}

#TeamContainer{
    display: flex;
    flex-direction: row;
}

#WinRate{
    width:70%;
    height: fit-content;
}

#RateBar{
    display: flex;
    flex-direction: row;
    height: 50px;
}

#Left{
    width: 50%;
    background-color: blue;
    justify-items: start;
    display: grid;
}

#Right{
    width: 50%;
    background-color: red;
    justify-items: end;
    display: grid;
}
</style>