
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

                <p>Advanced Breakdown</p>
                <input type="checkbox" v-model="game.advanced" @change="getWinrate">
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
                <p>First baron</p>
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
                <p>First inhib</p>
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


        <div class="inputContainer">
            <div class="team1">
                <p>Dragon count</p>
                <input type="number" v-model="team1.dragonCount" @change="getWinrate" :disabled="!game.dragonCount" min="0" :max = "team1.dragonCount == 4 ? 3 : 4 ">
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.dragonCount" @change="getWinrate">
            </div>
            <div class="team2">
                <p>Dragon count</p>
                <input type="number" v-model="team2.dragonCount" @change="getWinrate" :disabled="!game.dragonCount" min="0" :max = "team1.dragonCount == 4 ? 3 : 4 ">
            </div>
        </div>

        <div class="inputContainer">
            <div class="team1">
                <p>Elder Dragon count</p>
                <input type="number" v-model="team1.elderCount" @change="getWinrate" :disabled="!game.elderCount" min="0" >
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.elderCount" @change="getWinrate" :disabled="game.dragonCount && !(team1.dragonCount == 4 || team2.dragonCount == 4)">
            </div>
            <div class="team2">
                <p>Elder Dragon count</p>
                <input type="number" v-model="team2.elderCount" @change="getWinrate" :disabled="!game.elderCount" min="0">
            </div>
        </div>

        <div class="inputContainer">
            <div class="team1">
                <p>Grub count</p>
                <input type="number" v-model="team1.grubCount" @change="getWinrate" :disabled="!game.grubCount" min="0" :max=" 6 - team2.grubCount">
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.grubCount" @change="getWinrate">
            </div>
            <div class="team2">
                <p>Grub count</p>
                <input type="number" v-model="team2.grubCount" @change="getWinrate" :disabled="!game.grubCount" min="0" :max=" 6 - team1.grubCount">
            </div>
        </div>

        <div class="inputContainer">
            <div class="team1">
                <p>Inhib count</p>
                <input type="number" v-model="team1.inhibCount" @change="getWinrate" :disabled="!game.inhibCount" min="0">
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.inhibCount" @change="getWinrate">
            </div>
            <div class="team2">
                <p>Inhib count</p>
                <input type="number" v-model="team2.inhibCount" @change="getWinrate" :disabled="!game.inhibCount" min="0">
            </div>
        </div>

        <div class="inputContainer">
            <div class="team1">
                <p>Tower count</p>
                <input type="number" v-model="team1.towerCount" @change="getWinrate" :disabled="!game.towerCount" min="0">
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.towerCount" @change="getWinrate">
            </div>
            <div class="team2">
                <p>Tower count</p>
                <input type="number" v-model="team2.towerCount" @change="getWinrate" :disabled="!game.towerCount" min="0">
            </div>
        </div>

        <div class="inputContainer">
            <div class="team1">
                <p>Baron count</p>
                <input type="number" v-model="team1.baron" @change="getWinrate" :disabled="!game.baron" min="0">
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.baron" @change="getWinrate">
            </div>
            <div class="team2">
                <p>Baron count</p>
                <input type="number" v-model="team2.baron" @change="getWinrate" :disabled="!game.baron" min="0">
            </div>
        </div>

        <div class="inputContainer">
            <div class="team1">
                <p>Dragon soul</p>
                <select name="soul" id="soul" v-model="team1.soul" @change="getWinrate" :disabled="!game.soul || team2.soul != 'none'">
                    <option value="any">Any</option>
                    <option value="Hextech">Hextech</option>
                    <option value="Chemtech">Chemtech</option>
                    <option value="Infenal">Infenal</option>
                    <option value="Ocean">Ocean</option>
                    <option value="Cloud">Cloud</option>
                    <option value="Mountain">Mountain</option>
                    <option value="none">None</option>
                </select>
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.soul" @change="getWinrate">
            </div>
            <div class="team2">
                <p>Dragon soul</p>
                <select name="soul" id="soul" v-model="team2.soul" @change="getWinrate" :disabled="!game.soul || team1.soul != 'none'"> 
                    <option value="any">Any</option>
                    <option value="Hextech">Hextech</option>
                    <option value="Chemtech">Chemtech</option>
                    <option value="Infenal">Infenal</option>
                    <option value="Ocean">Ocean</option>
                    <option value="Cloud">Cloud</option>
                    <option value="Mountain">Mountain</option>
                    <option value="none">None</option>
                </select>
            </div>
        </div>
        <div id="RateBar" v-if="!game.advanced">
            <div class="wins">{{ Math.round(team1.winrate * 100) / 100 }}% ({{ team1.gameCount }})</div>
            <div class="losses">{{ Math.round(team2.winrate * 100) / 100 }}% ({{ team2.gameCount }})</div>
        </div>
        <div id="Advanced" v-else>

            <h2>Ahead</h2>
            <div id="aheadBar"> 
                <div class="wins">{{ Math.round(team1.winrate * 100) / 100 }}% ({{ team1.gameCount }})</div>
                <div class="losses">{{ Math.round(team2.winrate * 100) / 100 }}% ({{ team2.gameCount }})</div>
            </div>

            <h2>Even</h2>
            <div id="evenBar"> 
                <div class="wins">{{ Math.round(team1.winrate * 100) / 100 }}% ({{ team1.gameCount }})</div>
                <div class="losses">{{ Math.round(team2.winrate * 100) / 100 }}% ({{ team2.gameCount }})</div>
            </div>

            <h2>Behind</h2>
            <div id="behindBar"> 
                <div class="wins">{{ Math.round(team1.winrate * 100) / 100 }}% ({{ team1.gameCount }})</div>
                <div class="losses">{{ Math.round(team2.winrate * 100) / 100 }}% ({{ team2.gameCount }})</div>
            </div>
        </div>
    </div>

    

</template>
<script  lang="ts">
import { ref, useTemplateRef, type Ref } from 'vue';
import * as d3 from "d3" 

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

class BaseStateDetail {
    ahead: BaseDetail = new BaseDetail
    behind: BaseDetail = new BaseDetail
    even: BaseDetail = new BaseDetail
}

class AdvStateDetail {
    general: BaseStateDetail = new BaseStateDetail
    vs: {[vs: number]: BaseStateDetail} = {}
}

class AdvStateDragonDetail {
    general: BaseStateDetail = new BaseStateDetail
    vs: {[vs: string]: BaseStateDetail} = {}
}

class Details{
    rank: {[rank: string]: BaseStateDetail} = {}
    dragonCount: {[count: number]: AdvDetail} = {}
    elderCount: {[count: number]: AdvDetail} = {}
    grubCount: {[count: number]: AdvDetail} = {}

    atakhan: {[count: number]: AdvStateDetail} = {}
    herald: {[count: number]: AdvStateDetail} = {}

    inhibCount: {[count: number]: AdvDetail} = {}
    towerCount: {[count: number]: AdvDetail} = {}

    baron: {[count: number]: AdvDetail} = {}
    feats: {[count: number]: AdvStateDetail} = {}

    firstBlood: {[count: number]: AdvStateDetail} = {}
    firstDragon: {[count: number]: AdvStateDetail} = {}
    firstInhib: {[count: number]: AdvStateDetail} = {}
    firstTower: {[count: number]: AdvStateDetail} = {}
    firstBaron: {[count: number]: AdvStateDetail} = {}
    soul: {[type: string]: AdvStateDragonDetail} = {}
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

    dragonCount: number = 0
    elderCount: number = 0
    grubCount: number = 0
    inhibCount: number = 0
    towerCount: number = 0
    baron: number = 0

    soul: string = "none"
    winrate: number = 50
    gameCount: number = 0

    aheadWinrate: number = 50
    aheadGameCount: number = 0
    evenWinrate: number = 50
    evenGameCount: number = 0
    behindWinrate: number = 50
    behindGameCount: number = 0
}

class Game{
    rank: string = "all"
    advanced: boolean = false

    atakhan: boolean = false
    feats: boolean = false
    firstBaron: boolean = false
    firstBlood: boolean = false
    firstDragon: boolean = false
    firstInhib: boolean = false
    firstTower: boolean = false
    herald: boolean = false

    dragonCount: boolean = false
    elderCount: boolean = false
    grubCount: boolean = false
    inhibCount: boolean = false
    towerCount: boolean = false
    baron: boolean = false
    soul: boolean = false
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
        getStateGames(data: BaseStateDetail, state: string, out: BaseDetail[]){
            if(state == "even"){
                out.push({
                    wins: data.even.wins,
                    losses: data.even.losses,
                    WR: 0
                })
            }else if(state == "ahead"){
                out.push({
                    wins: data.ahead.wins,
                    losses: data.ahead.losses,
                    WR: 0
                })
            }else if(state == "behind"){   
                out.push({
                    wins: data.behind.wins,
                    losses: data.behind.losses,
                    WR: 0
                })
            }
            out.push({
                wins: data.even.wins.concat(data.ahead.wins).concat(data.behind.wins),
                losses: data.even.losses.concat(data.ahead.losses).concat(data.behind.losses),
                WR: 0
            })
        },
        getGames(data: BaseDetail, out: BaseDetail[]){
            out.push({
                wins: data.wins,
                losses: data.losses,
                WR: 0
            })
        },
        getWinrate(){
            console.log('started')
            let games: BaseDetail[] = []
            let ahead_games: BaseDetail[] = []
            let even_games: BaseDetail[] = []
            let behind_games: BaseDetail[] = []

            if(this.game.rank != "all"){
                this.getStateGames(this.gameData['rank'][this.game.rank], 'all', games)
                this.getStateGames(this.gameData['rank'][this.game.rank], 'ahead', ahead_games)
                this.getStateGames(this.gameData['rank'][this.game.rank], 'even', even_games)
                this.getStateGames(this.gameData['rank'][this.game.rank], 'behind', behind_games)
            }

            if(this.game.atakhan){
                let teamAtakhan = this.team1.atakhan ? 1 : 0
                let oppAtakhan = this.team2.atakhan ? 1 : 0

                this.getStateGames(this.gameData['atakhan'][teamAtakhan].vs[oppAtakhan], 'all', games)
                this.getStateGames(this.gameData['atakhan'][teamAtakhan].vs[oppAtakhan], 'ahead', ahead_games)
                this.getStateGames(this.gameData['atakhan'][teamAtakhan].vs[oppAtakhan], 'even', even_games)
                this.getStateGames(this.gameData['atakhan'][teamAtakhan].vs[oppAtakhan], 'behind', behind_games)
            }else{
                this.team1.atakhan = false
                this.team2.atakhan = false
            }

            if(this.game.feats){
                let teamFeats = this.team1.feats ? 1 : 0
                let oppFeats = this.team2.feats ? 1 : 0
                
                this.getStateGames(this.gameData['feats'][teamFeats].vs[oppFeats], 'all', games)
                this.getStateGames(this.gameData['feats'][teamFeats].vs[oppFeats], 'ahead', ahead_games)
                this.getStateGames(this.gameData['feats'][teamFeats].vs[oppFeats], 'even', even_games)
                this.getStateGames(this.gameData['feats'][teamFeats].vs[oppFeats], 'behind', behind_games)
            }else{
                this.team1.feats = false
                this.team2.feats = false
            }

            if(this.game.firstBaron){
                let teamFirstBaron = this.team1.firstBaron ? 1 : 0
                let oppFirstBaron = this.team2.firstBaron ? 1 : 0

                this.getStateGames(this.gameData['firstBaron'][teamFirstBaron].vs[oppFirstBaron], 'all', games)
                this.getStateGames(this.gameData['firstBaron'][teamFirstBaron].vs[oppFirstBaron], 'ahead', ahead_games)
                this.getStateGames(this.gameData['firstBaron'][teamFirstBaron].vs[oppFirstBaron], 'even', even_games)
                this.getStateGames(this.gameData['firstBaron'][teamFirstBaron].vs[oppFirstBaron], 'behind', behind_games)
            }else{
                this.team1.firstBaron = false
                this.team2.firstBaron = false
            }

            if(this.game.firstBlood){
                let teamFirstBlood = this.team1.firstBlood ? 1 : 0
                let oppFirstBlood = this.team2.firstBlood ? 1 : 0

                this.getStateGames(this.gameData['firstBlood'][teamFirstBlood].vs[oppFirstBlood], 'all', games)
                this.getStateGames(this.gameData['firstBlood'][teamFirstBlood].vs[oppFirstBlood], 'ahead', ahead_games)
                this.getStateGames(this.gameData['firstBlood'][teamFirstBlood].vs[oppFirstBlood], 'even', even_games)
                this.getStateGames(this.gameData['firstBlood'][teamFirstBlood].vs[oppFirstBlood], 'behind', behind_games)
            }else{
                this.team1.firstBlood = false
                this.team2.firstBlood = false
            }

            if(this.game.firstDragon){
                let teamFirstDragon = this.team1.firstDragon ? 1 : 0
                let oppFirstDragon = this.team2.firstDragon ? 1 : 0

                this.getStateGames(this.gameData['firstDragon'][teamFirstDragon].vs[oppFirstDragon], 'all', games)
                this.getStateGames(this.gameData['firstDragon'][teamFirstDragon].vs[oppFirstDragon], 'ahead', ahead_games)
                this.getStateGames(this.gameData['firstDragon'][teamFirstDragon].vs[oppFirstDragon], 'even', even_games)
                this.getStateGames(this.gameData['firstDragon'][teamFirstDragon].vs[oppFirstDragon], 'behind', behind_games)
            }else{
                this.team1.firstDragon = false
                this.team2.firstDragon = false
            }

            if(this.game.firstInhib){
                let teamFirstInhib = this.team1.firstInhib ? 1 : 0
                let oppFirstInhib = this.team2.firstInhib ? 1 : 0

                this.getStateGames(this.gameData['firstInhib'][teamFirstInhib].vs[oppFirstInhib], 'all', games)
                this.getStateGames(this.gameData['firstInhib'][teamFirstInhib].vs[oppFirstInhib], 'ahead', ahead_games)
                this.getStateGames(this.gameData['firstInhib'][teamFirstInhib].vs[oppFirstInhib], 'even', even_games)
                this.getStateGames(this.gameData['firstInhib'][teamFirstInhib].vs[oppFirstInhib], 'behind', behind_games)
            }else{
                this.team1.firstInhib = false
                this.team2.firstInhib = false
            }

            if(this.game.firstTower){
                let teamFirstTower = this.team1.firstTower ? 1 : 0
                let oppFirstTower = this.team2.firstTower ? 1 : 0

                this.getStateGames(this.gameData['firstTower'][teamFirstTower].vs[oppFirstTower], 'all', games)
                this.getStateGames(this.gameData['firstTower'][teamFirstTower].vs[oppFirstTower], 'ahead', ahead_games)
                this.getStateGames(this.gameData['firstTower'][teamFirstTower].vs[oppFirstTower], 'even', even_games)
                this.getStateGames(this.gameData['firstTower'][teamFirstTower].vs[oppFirstTower], 'behind', behind_games)
            }else{
                this.team1.firstTower = false
                this.team2.firstTower = false
            }
  

            if(this.game.herald){
                let teamHerald = this.team1.herald ? 1 : 0
                let oppHerald = this.team2.herald ? 1 : 0

                this.getStateGames(this.gameData['herald'][teamHerald].vs[oppHerald], 'all', games)
                this.getStateGames(this.gameData['herald'][teamHerald].vs[oppHerald], 'ahead', ahead_games)
                this.getStateGames(this.gameData['herald'][teamHerald].vs[oppHerald], 'even', even_games)
                this.getStateGames(this.gameData['herald'][teamHerald].vs[oppHerald], 'behind', behind_games)
            }else{
                this.team1.herald = false
                this.team2.herald = false
            }

            if(this.game.soul){
                let teamSoul = this.team1.soul
                let oppSoul = this.team2.soul
                console.log(teamSoul, oppSoul)
                console.log(this.gameData['soul'])

                this.getStateGames(this.gameData['soul'][teamSoul].vs[oppSoul], 'all', games)
                this.getStateGames(this.gameData['soul'][teamSoul].vs[oppSoul], 'ahead', ahead_games)
                this.getStateGames(this.gameData['soul'][teamSoul].vs[oppSoul], 'even', even_games)
                this.getStateGames(this.gameData['soul'][teamSoul].vs[oppSoul], 'behind', behind_games)
            }else{
                this.team1.soul = "none"
                this.team2.soul = "none"
            }

            if(this.game.dragonCount && !(this.team1.dragonCount.toString() == "" && this.team2.dragonCount.toString() == "")){
                if(this.team1.dragonCount.toString() == ""){
                    let game: BaseDetail = new BaseDetail
                    for(let count in  this.gameData['dragonCount']){
                        if(!this.gameData['dragonCount'][count].vs[this.team2.dragonCount]) continue
                        
                        game.wins = game.wins.concat(this.gameData['dragonCount'][count].vs[this.team2.dragonCount].wins)
                        game.losses = game.losses.concat(this.gameData['dragonCount'][count].vs[this.team2.dragonCount].losses)
                        
                    }
                    this.getGames(game, games)
                    this.getGames(game, ahead_games)
                    this.getGames(game, even_games)
                    this.getGames(game, behind_games)
                } else if(this.team2.dragonCount.toString() == ""){
                    this.getGames(this.gameData['dragonCount'][this.team1.dragonCount], games)
                    this.getGames(this.gameData['dragonCount'][this.team1.dragonCount], ahead_games)
                    this.getGames(this.gameData['dragonCount'][this.team1.dragonCount], even_games)
                    this.getGames(this.gameData['dragonCount'][this.team1.dragonCount], behind_games)
                }else{

                    this.getGames(this.gameData['dragonCount'][this.team1.dragonCount].vs[this.team2.dragonCount], games)
                    this.getGames(this.gameData['dragonCount'][this.team1.dragonCount].vs[this.team2.dragonCount], ahead_games)
                    this.getGames(this.gameData['dragonCount'][this.team1.dragonCount].vs[this.team2.dragonCount], even_games)
                    this.getGames(this.gameData['dragonCount'][this.team1.dragonCount].vs[this.team2.dragonCount], behind_games)

                }

            }else{
                this.team1.dragonCount = 0
                this.team2.dragonCount = 0
            }

            if(this.game.elderCount && !(this.team1.elderCount.toString() == "" && this.team2.elderCount.toString() == "")){
                if(this.team1.elderCount.toString() == ""){
                    let game: BaseDetail = new BaseDetail
                    for(let count in  this.gameData['elderCount']){
                        if(!this.gameData['elderCount'][count].vs[this.team2.elderCount]) continue
                        
                        game.wins = game.wins.concat(this.gameData['elderCount'][count].vs[this.team2.elderCount].wins)
                        game.losses = game.losses.concat(this.gameData['elderCount'][count].vs[this.team2.elderCount].losses)
                        
                    }
                    this.getGames(game, games)
                    this.getGames(game, ahead_games)
                    this.getGames(game, even_games)
                    this.getGames(game, behind_games)

                } else if(this.team2.elderCount.toString() == ""){
                    this.getGames(this.gameData['elderCount'][this.team1.elderCount], games)
                    this.getGames(this.gameData['elderCount'][this.team1.elderCount], ahead_games)
                    this.getGames(this.gameData['elderCount'][this.team1.elderCount], even_games)
                    this.getGames(this.gameData['elderCount'][this.team1.elderCount], behind_games)
                }else{
                    this.getGames(this.gameData['elderCount'][this.team1.elderCount].vs[this.team2.elderCount], games)
                    this.getGames(this.gameData['elderCount'][this.team1.elderCount].vs[this.team2.elderCount], ahead_games)
                    this.getGames(this.gameData['elderCount'][this.team1.elderCount].vs[this.team2.elderCount], even_games)
                    this.getGames(this.gameData['elderCount'][this.team1.elderCount].vs[this.team2.elderCount], behind_games)
                }

            }else{
                this.team1.elderCount = 0
                this.team2.elderCount = 0
            }

            if(this.game.grubCount && !(this.team1.grubCount.toString() == "" && this.team2.grubCount.toString() == "")){
                if(this.team1.grubCount.toString() == ""){
                    let game: BaseDetail = new BaseDetail
                    for(let count in  this.gameData['grubCount']){
                        if(!this.gameData['grubCount'][count].vs[this.team2.grubCount]) continue
                        
                        game.wins = game.wins.concat(this.gameData['grubCount'][count].vs[this.team2.grubCount].wins)
                        game.losses = game.losses.concat(this.gameData['grubCount'][count].vs[this.team2.dragonCount].losses)
                        
                    }
                    this.getGames(game, games)
                    this.getGames(game, ahead_games)
                    this.getGames(game, even_games)
                    this.getGames(game, behind_games)
                }  else if(this.team2.grubCount.toString() == ""){
                    qual_games.push({
                    wins: this.gameData['grubCount'][this.team1.grubCount].wins,
                    losses: this.gameData['grubCount'][this.team1.grubCount].losses,
                    WR: this.gameData['grubCount'][this.team1.grubCount].WR
                    })
                }else{
                    qual_games.push({
                    wins: this.gameData['grubCount'][this.team1.grubCount].vs[this.team2.grubCount].wins,
                    losses: this.gameData['grubCount'][this.team1.grubCount].vs[this.team2.grubCount].losses,
                    WR: this.gameData['grubCount'][this.team1.grubCount].vs[this.team2.grubCount].WR
                    })
                }

            }else{
                this.team1.grubCount = 0
                this.team2.grubCount = 0
            }

            if(this.game.inhibCount && !(this.team1.inhibCount.toString() == "" && this.team2.inhibCount.toString() == "")){
                if(this.team1.inhibCount.toString() == ""){
                    let game: BaseDetail = new BaseDetail
                    for(let count in  this.gameData['inhibCount']){
                        if(!this.gameData['inhibCount'][count].vs[this.team2.inhibCount]) continue
                        
                        game.wins = game.wins.concat(this.gameData['inhibCount'][count].vs[this.team2.inhibCount].wins)
                        game.losses = game.losses.concat(this.gameData['inhibCount'][count].vs[this.team2.inhibCount].losses)
                        
                    }
                    this.getGames(game, games)
                    this.getGames(game, ahead_games)
                    this.getGames(game, even_games)
                    this.getGames(game, behind_games)
                } else if(this.team2.inhibCount.toString() == ""){
                    qual_games.push({
                    wins: this.gameData['inhibCount'][this.team1.inhibCount].wins,
                    losses: this.gameData['inhibCount'][this.team1.inhibCount].losses,
                    WR: this.gameData['inhibCount'][this.team1.inhibCount].WR
                    })
                }else{
                    qual_games.push({
                    wins: this.gameData['inhibCount'][this.team1.inhibCount].vs[this.team2.inhibCount].wins,
                    losses: this.gameData['inhibCount'][this.team1.inhibCount].vs[this.team2.inhibCount].losses,
                    WR: this.gameData['inhibCount'][this.team1.inhibCount].vs[this.team2.inhibCount].WR
                    })
                }

            }else{
                this.team1.inhibCount = 0
                this.team2.inhibCount = 0
            }

            if(this.game.baron && !(this.team1.baron.toString() == "" && this.team2.baron.toString() == "")){
                if(this.team1.baron.toString() == ""){
                    let game: BaseDetail = new BaseDetail
                    for(let count in  this.gameData['baron']){
                        if(!this.gameData['baron'][count].vs[this.team2.baron]) continue
                        
                        game.wins = game.wins.concat(this.gameData['baron'][count].vs[this.team2.baron].wins)
                        game.losses = game.losses.concat(this.gameData['baron'][count].vs[this.team2.baron].losses)
                        
                    }
                    this.getGames(game, games)
                    this.getGames(game, ahead_games)
                    this.getGames(game, even_games)
                    this.getGames(game, behind_games)
                } else if(this.team2.baron.toString() == ""){
                    qual_games.push({
                    wins: this.gameData['baron'][this.team1.baron].wins,
                    losses: this.gameData['baron'][this.team1.baron].losses,
                    WR: this.gameData['baron'][this.team1.baron].WR
                    })
                }else{
                    qual_games.push({
                    wins: this.gameData['baron'][this.team1.baron].vs[this.team2.baron].wins,
                    losses: this.gameData['baron'][this.team1.baron].vs[this.team2.baron].losses,
                    WR: this.gameData['baron'][this.team1.baron].vs[this.team2.baron].WR
                    })
                }

            }else{
                this.team1.baron = 0
                this.team2.baron = 0
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
            d3.json("http://localhost:5173/stats/overview2.json").then((data: any) => {
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
    border-bottom: 1px solid grey;
}

#rank{
    margin-bottom: 2px;
    margin-right: 5px;
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
    margin-top: 25px;
    width:70%;
    height: fit-content;
}

#RateBar{
    display: flex;
    flex-direction: row;
    height: 50px;
}
#aheadBar{
    display: flex;
    flex-direction: row;
    height: 50px;
}
#evenBar{
    display: flex;
    flex-direction: row;
    height: 50px;
}
#behindBar{
    display: flex;
    flex-direction: row;
    height: 50px;
}

.wins{
    width: 50%;
    background-color: blue;
    justify-items: start;
    display: grid;
    align-content: center;
    border-radius: 16px 0 0 16px;
    padding-left: 5px;
}

.losses{
    width: 50%;
    background-color: red;
    justify-items: end;
    display: grid;
    align-content: center;
    border-radius: 0 16px 16px 0;
    padding-right: 5px;
}
</style>