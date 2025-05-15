
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


        <div class="inputContainer">
            <div class="team1">
                <p>Dragon count</p>
                <input type="number" v-model="team1.dragonCount" @change="getWinrate" :disabled="!game.dragonCount" min="0">
            </div>
            <div class="center">
                <p>Enabled</p>
                <input type="checkbox" v-model="game.dragonCount" @change="getWinrate">
            </div>
            <div class="team2">
                <p>Dragon count</p>
                <input type="number" v-model="team2.dragonCount" @change="getWinrate" :disabled="!game.dragonCount" min="0">
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
        <div id="RateBar">
            <div id="Left">{{ Math.round(team1.winrate * 100) / 100 }}% ({{ team1.gameCount }})</div>
            <div id="Right">{{ Math.round(team2.winrate * 100) / 100 }}% ({{ team2.gameCount }})</div>
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

    dragonCount: number = 0
    grubCount: number = 0
    inhibCount: number = 0
    towerCount: number = 0
    baron: number = 0

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

    dragonCount: boolean = false
    grubCount: boolean = false
    inhibCount: boolean = false
    towerCount: boolean = false
    baron: boolean = false
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

            if(this.game.dragonCount && !(this.team1.dragonCount.toString() == "" && this.team2.dragonCount.toString() == "")){
                if(this.team1.dragonCount.toString() == ""){
                    let game: BaseDetail = new BaseDetail
                    for(let count in  this.gameData['dragonCount']){
                        if(!this.gameData['dragonCount'][count].vs[this.team2.dragonCount]) continue
                        
                        game.wins = game.wins.concat(this.gameData['dragonCount'][count].vs[this.team2.dragonCount].wins)
                        game.losses = game.losses.concat(this.gameData['dragonCount'][count].vs[this.team2.dragonCount].losses)
                        
                    }
                    qual_games.push(game)
                } else if(this.team2.dragonCount.toString() == ""){
                    qual_games.push({
                    wins: this.gameData['dragonCount'][this.team1.dragonCount].wins,
                    losses: this.gameData['dragonCount'][this.team1.dragonCount].losses,
                    WR: this.gameData['dragonCount'][this.team1.dragonCount].WR
                    })
                }else{
                    qual_games.push({
                    wins: this.gameData['dragonCount'][this.team1.dragonCount].vs[this.team2.dragonCount].wins,
                    losses: this.gameData['dragonCount'][this.team1.dragonCount].vs[this.team2.dragonCount].losses,
                    WR: this.gameData['dragonCount'][this.team1.dragonCount].vs[this.team2.dragonCount].WR
                    })
                }

            }else{
                this.team1.dragonCount = 0
                this.team2.dragonCount = 0
            }

            if(this.game.grubCount && !(this.team1.grubCount.toString() == "" && this.team2.grubCount.toString() == "")){
                if(this.team1.grubCount.toString() == ""){
                    let game: BaseDetail = new BaseDetail
                    for(let count in  this.gameData['grubCount']){
                        if(!this.gameData['grubCount'][count].vs[this.team2.grubCount]) continue
                        
                        game.wins = game.wins.concat(this.gameData['grubCount'][count].vs[this.team2.grubCount].wins)
                        game.losses = game.losses.concat(this.gameData['grubCount'][count].vs[this.team2.dragonCount].losses)
                        
                    }
                    qual_games.push(game)
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
                    qual_games.push(game)
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
                    qual_games.push(game)
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
    border-bottom: 1px solid grey;
}

#rank{
    margin-bottom: 2px;
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
    align-content: center;
    border-radius: 16px 0 0 16px;
    padding-left: 5px;
}

#Right{
    width: 50%;
    background-color: red;
    justify-items: end;
    display: grid;
    align-content: center;
    border-radius: 0 16px 16px 0;
    padding-right: 5px;
}
</style>