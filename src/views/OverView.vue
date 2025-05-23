<script setup lang="ts">
import axios from "axios";
import { Summoner } from "../classes/summoner.ts";
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { JsonSourceFile } from "typescript";
import GameOverview from "@/classes/GameOverview.ts";
import GamerOverview from "@/classes/GameOverview.ts";
import Champions from "@/classes/Champion.ts";
import Runes from "@/classes/Runes.ts";
import SummonerSpell from "@/classes/SummonerSpell.ts";
import Items from "@/classes/Items.ts";
import type Participant from "@/classes/Participant.ts";
import moment from "moment";
import router from "@/router/index.ts";


const gameName = ref('') 
const tag = ref('')
const puuid = ref('')
const gameIDS: Ref<Array<string>> = ref([])
const errors: Ref<Array<string>> = ref([])
const overviews: Ref<Array<GameOverview>> = ref([])
const sortedOverviews: ComputedRef<Array<GameOverview>> = ref(computed(() => {
    const sorted = overviews.value.sort((a: GameOverview, b: GameOverview) => {
        if(a._gameAge > b._gameAge) return -1;
        if(a._gameAge < b._gameAge) return  1;
        return 0
    })
    return sorted;
}))

async function searchHandler(){
    errors.value = []
    overviews.value = []

    if(gameName.value.length == 0){
        errors.value.push("please fill in a game name")
    }

    if(tag.value.length == 0){
        errors.value.push("please fill in a tag")
    }else if(tag.value[0] != '#'){
        errors.value.push("the tag must start with '#'")
    }

    if(errors.value.length != 0) return;

    try{
        let response_id = await axios.get("/getSummoner", {headers:{'gameName': gameName.value, 'tagLine': tag.value.slice(1)}});
        puuid.value = response_id.data['puuid']
        let response_games = await axios.get("/getGameIDs", {headers:{'puuid': puuid.value}});
        gameIDS.value = response_games.data

        gameIDS.value.forEach(async gameID => {
            let response_game = await axios.get("/getGameSummary", {headers:{'matchid': gameID}});
            overviews.value.push(new GameOverview(puuid.value, response_game.data['info']))
        });
    }catch(error){
        puuid.value = "the requested profile couldn't be found"
        
    }
}

function toTimeline(overview: GameOverview){
    router.push({path: "timeline", query: {id: overview._ID}})
}

function getChampImage(participant: Participant){
    return new URL(Champions.portraitPathFromID(participant._champID), import.meta.url).href   
}

function getChampTile(participant: Participant){
    return new URL(Champions.tilePathFromID(participant._champID), import.meta.url).href   
}

function getSummonerImage(overview: GameOverview, num: number){
    let missingPath = '/images/missing.png';
    
    if(num == 1){
        return new URL(SummonerSpell.summonerSpellPathFromID(overview._participants[overview._mainParticipant]._summonerID1), import.meta.url).href   
    }
    if(num == 2){
        return new URL(SummonerSpell.summonerSpellPathFromID(overview._participants[overview._mainParticipant]._summonerID2), import.meta.url).href 
    }
    return new URL(missingPath, import.meta.url).href 
}

function getKeystoneImage(overview: GameOverview){
    let path = Runes.runePathFromID(overview._participants[overview._mainParticipant]._keystoneID);
    let missingPath = '/images/missing.png';

    if(path){
        return new URL(path, import.meta.url).href   
    }
    return new URL(missingPath, import.meta.url).href 
}

function getSecondaryImage(overview: GameOverview){
    let path = Runes.secondaryPathFromID(overview._participants[overview._mainParticipant]._secondaryID);
    let missingPath = '/images/missing.png';

    if(path){
        return new URL(path, import.meta.url).href   
    }
    return new URL(missingPath, import.meta.url).href 
}

function getMapImage(overview: GameOverview){
    let path = `/maps/map${overview._mapID}.jpg`;    
    return new URL(path, import.meta.url).href
}

function getItemImage(ID: number){
    let path = Items.itemPathFromID(ID);
    let missingPath = '/images/missing.png';
    if(path){
        return new URL(path, import.meta.url).href   
    }
    return new URL(missingPath, import.meta.url).href
}

function getGameStatus(overview: GameOverview){
    if(overview._mainTeam == overview._winningTeam) return "Win";
    return "Loss";
}

function getKDA(overview: GameOverview){
    let kills = overview._participants[overview._mainParticipant]._kills;
    let deaths = overview._participants[overview._mainParticipant]._deaths;
    let assists = overview._participants[overview._mainParticipant]._assists;
    return `${kills}/${deaths}/${assists}`
}




</script>

<template>
    <div class="page">
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/champstats">Champs</RouterLink>
            <RouterLink to="/champdetail">Champ Details</RouterLink>
            <RouterLink to="/gamedetail">Game Details</RouterLink>
        </nav>
        <div class="wrap" >
            <input v-model="gameName" placeholder="Summoner name"></input>
            <input v-model="tag" placeholder="#tag"></input>
            <button @click="searchHandler">Search</button>
            <p v-if="errors.length">    
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>
        </div>
        
        <li v-for="overview in sortedOverviews" @click="toTimeline(overview)">
            <div class="game_overview" >
                <div class="game">
                <div class="age">{{moment(overview._gameAge).fromNow()}}</div>
                    <div class="front">
                        <div class="pregame_container">
                            <img :src="getKeystoneImage(overview)" class="keystone"/>
                            <img :src="getSecondaryImage(overview)" class="secondaryStone"/>
                            <div class="sum_container">
                                <img :src="getSummonerImage(overview, 1)" class="summoner_spell"/>
                                <img :src="getSummonerImage(overview, 2)" class="summoner_spell"/>
                            </div>
                        </div>
                        <div class="rows">
                            <div class="row">
                                <div class="KDA">
                                    {{ getKDA(overview) }}
                                </div>
                            </div>
                            <div class="row">
                                <div class="item_container">
                                    <div class="row">
                                        <img  v-for="item in overview.getMainParticipant()._itemIDs.slice(0, 3)" :src="getItemImage(item)" class="item"/>
                                    </div>
                                    <div class="row">
                                        <img v-for="item in overview.getMainParticipant()._itemIDs.slice(3, 6)" :src="getItemImage(item)" class="item"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="back">
                        <div class="teams_container">
                            <div class="row">
                                <div class="champ_wrapper" v-for="participant in overview._participants.slice(0, 5)" >
                                    <img :src="getChampTile(participant)" class="champion"/>
                                </div>
                            </div>
                        <div class="row">
                            <div class="champ_wrapper" v-for="participant in overview._participants.slice(5, 10)" >
                                <img :src="getChampTile(participant)" class="champion"/>
                            </div>
                        </div>
                        </div>
                        <div :class="getGameStatus(overview)" class="game_container">
                            <p class="type">{{ overview.getGameName().replace('5v5 ', '').replace(' Pick', '').replace('Ranked ', 'R-') }}</p>
                            <p class="status">{{ getGameStatus(overview) }}</p>
                        </div>
                    </div>
                </div>
                    <!-- <p>{{ Champions.nameFromID(overview._participants[overview._mainParticipant]._champID) }}</p> -->
                <div class="background">
                    <div class="shadow shadow-1"></div>
                    <div class="slanted-edge slanted-edge-1"/>
                    <div class="shadow shadow-2"></div>

                    <div class="slanted-edge slanted-edge-2"/>
                    <img :src="getChampImage(overview.getMainParticipant())" class="champion" />
                    <img :src="getMapImage(overview)" class="map" />
                </div>
            </div>
        </li>
    </div>
  </template>
  
  <style lang="scss" scoped>
  .page{
        width: 100%;
  }
    .game > .age{
        position: absolute;
        color: rgb(255, 255, 255);
        padding-right: 2.5%;
        justify-content: end;
        width: 100%;
        display: grid;
        align-content: normal;
    }
    .game_overview{
        width: 625px;
        height: 150px;
        overflow: clip;
        margin-top: 10px;
        border-radius: 25px;
    }
                
    .game_overview >.background{
        width: inherit;
        height: inherit;
        position: absolute;
        overflow: clip;
        z-index: 0;
        border-radius: inherit;
    }
        
    .game{
        border-style: solid;
        border-radius: 25px;
        display: flex;
        z-index: 2;

    }


    .game_overview > .game{
        width: inherit;
        height: inherit;
        position: absolute;
        z-index: 100;
    }

    .game > .front{
        width: 55%;
        height: inherit;
        z-index: 100;
        display: flex;
        flex-direction: row;
    }

    .game > .back{
        width: 45%;
        height: inherit;
        z-index: 100;
        display: flex;
        flex-direction: row;
    }

    .background{
        display: flex;
    }
    .background > .champion{
        height: 125%;
        margin-top: -1%;
        margin-left: -14%;
        z-index: 0;
        position: inherit;
    }
    
    .background > .shadow{
        box-shadow: -20px 0 7px rgba(0.2, 0.2, 0.2, 0.5);
        height: 115%;
        position: absolute;
        width: 10px;
        z-index: 1;
    }

    .background > .shadow-1{
        margin-left: 27.5%;
        rotate: 25deg;
    }

    .background > .shadow-2{
        margin-left: 72.5%;
        rotate: 205deg;
        margin-top: -5%;
    }

    .background > .map{
        position: absolute;
        height: 100%;
        margin-left: 70%;
    }

    .background > .slanted-edge-1 {
        --p: 70px;
        height: inherit;
        width: 42.5%;
        margin-left: 21%;
        aspect-ratio: 1;
        clip-path: polygon(var(--p) 0,100% 0,100% 100%,0 100%);
        background-color: gray;
        z-index: 1;
        position: relative;
    }

    .background > .slanted-edge-2 {
        --p: 70px;
        height: inherit;
        width: 17.5%;
        aspect-ratio: 1;
        clip-path: polygon(0 0,100% 0,calc(100% - var(--p)) 100%,0 100%);
        background-color: gray;
        z-index: 1;
        position: relative;
    }

    .game > .front > .pregame_container {
        display: flex;
        height: fit-content;
        margin-top: 17.5%;
        background: rgba(128, 128, 128, 0.6);
        border: rgb(187, 187, 187);
        border-style: solid;
        border-radius: 15px;
        margin-left: 5%;
    }

    .champ_wrapper > .champion{
        height: 35px;
        width: 35px;  
    }
    
    .champ_wrapper{
        height: 25px;
        width: 25px;
        margin-bottom: 3px;
        overflow: hidden;
        border-radius: 5px;
        justify-content: center;
        display: flex;
        align-items: center;
    }

    .pregame_container > .keystone{
        height: 68px;
        padding-top: 4px;
    }

    .pregame_container > .secondaryStone{
        height: 28px;
        position: absolute;
        margin-top: 38px;
        margin-left: 34px;
    }

    .pregame_container >  .sum_container{
        display: flex;
        flex-direction: column;
        height: fit-content;
        margin-right: 5px;
    }

    .pregame_container > .sum_container > .summoner_spell{
        width: 30px;
         margin: 2px;
    }


    .teams_container > .row{
        display: flex;
        flex-direction: column;
        width: fit-content;
        margin-right: 12px;
        margin-top: 3px;
    }

    .teams_container{
        height: 100%;
        width: fit-content;
        display: flex;
    }
    .row > .champion{
        height: 20%;
    }

    .KDA {
        font-size: xx-large;
        color: white;
        justify-self: center;
    }

    .game > .rows > .row{
        display: flex;
    }

    .item_container > .row > .item{
        height: 35px;
        margin-left: 3px;
    }

    .item_container{
        display: flex;
        flex-direction: column;
        margin-top: 15%;
        margin-left: 0%;
    }

    .item_container > .row{
        height: 35px;

        margin-bottom: 3px;
    }

    .page > li::marker{
        color: #00000000;
    }
    
    .rows{
        height: inherit;
        display: flex;
        flex-direction: column;
        margin-left: 20%;
    }

    .rows > .row{
        display: grid;
    }

  .wrap{
    display: flex;
    align-items: center;
    align-self: center;
    margin-top: 120px;
  }

  .game_container.Win{
        background: rgba(137, 236, 91, 0.6);
        border: rgba(44, 109, 13, 1);
        color: rgb(255, 255, 255);   
    }

    .game_container.Loss{
        background: rgba(231, 95, 95, 0.6);
        border: rgba(179, 27, 27, 1);
        color: rgb(255, 255, 255);   
    }

  .game> .back > .game_container {
        display: flex;
        flex-direction: column;
        height: 65%;
        width: 40%;
        margin-top: 10%;

        border-style: solid;
        border-radius: 15px;
        margin-left: 27.5%;
        padding-left: 5px;
    }


    .game_container > .status{
        font-size: x-large;
    }

    .game_container > .type{
        font-size: x-large;
    }

  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
  </style>
  