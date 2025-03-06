<script setup lang="ts">
import axios from "axios";
import { Summoner } from "../classes/summoner.ts";
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { JsonSourceFile } from "typescript";
import GameOverview from "@/classes/GameOverview.ts";
import GamerOverview from "@/classes/GameOverview.ts";
import Champions from "@/classes/Champion.ts";
import Runes from "@/classes/Runes.ts";


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

function getChampImage(overview: GameOverview){
    return new URL(Champions.portraitPathFromID(overview._participants[overview._mainParticipant]._champID), import.meta.url).href   
}


function getKeystoneImage(overview: GameOverview){
    let path = Runes.runePathFromID(overview._participants[overview._mainParticipant]._keystoneID);
    if(path){
        return new URL(path, import.meta.url).href   
    }
    return new URL('public/missing.webp', import.meta.url).href 
}

function getGameStatus(overview: GameOverview){
    if(overview._mainTeam == overview._winningTeam) return "game_win";
    return "game_loss";
}


</script>

<template>
    <div class="page">
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

        <p v-if="puuid.length">    
            {{ puuid }}
        </p>

        <li v-for="overview in sortedOverviews">
            <div :class="getGameStatus(overview)" class="game_overview" >
                <img :src="getKeystoneImage(overview)" class="keystone"/>
                <div class="slanted-edge">
                    <p>{{ Champions.nameFromID(overview._participants[overview._mainParticipant]._champID) }}</p>
                </div>
                <img :src="getChampImage(overview)" class="champion" />
            </div>
        </li>
    </div>
  </template>
  
  <style>
    .page > li::marker{
        color: #00000000;
    }

    .game_overview > .slanted-edge {
        --p: 70px; /* control the shape (can be percentage) */
        height: inherit;
        width:85%;
        margin-left: 15%;
        aspect-ratio: 1;
        clip-path: polygon(var(--p) 0,100% 0,100% 100%,0 100%);
        background-color: gray;
        z-index: 1;
        
    }
    .game_overview >.keystone{
        width: 2.5%;
        position: absolute;
        margin-top: 5.2%;
        margin-left: 5.5%;
        z-index: 2;

    }
    .game_win{
        border-color: #2c6d0d;
    }

    .game_win > .slanted-edge {
        background-color: #89EC5B;
    }

    .game_loss{
        border-color: #b31b1b;
    }
    .game_loss > .slanted-edge {
        background-color: #E75F5F;
    }

    .game_overview{
        width: 100%;
        height: 150px;
        overflow: clip;
        margin-top: 10px;
        border-style: solid;
        border-radius: 25px;
    }
  .game_overview > .champion{
    height: 220%;
    margin-top: -28%;
    margin-left: -35%;
    z-index: 0;

  }
  .wrap{
    display: flex;
    align-items: center;
    align-self: center;
    margin-top: 120px;
  }
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
  </style>
  