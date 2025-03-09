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

function getSummonerImage(overview: GameOverview, num: number){
    
    if(num == 1){
        return new URL(SummonerSpell.summonerSpellPathFromID(overview._participants[overview._mainParticipant]._summonerID1), import.meta.url).href   
    }
    if(num == 2){
        return new URL(SummonerSpell.summonerSpellPathFromID(overview._participants[overview._mainParticipant]._summonerID2), import.meta.url).href 
    }
    console.log(new URL('/images/missing.png', import.meta.url))
    return new URL('/images/missing.png', import.meta.url).href 

}

function getKeystoneImage(overview: GameOverview){
    let path = Runes.runePathFromID(overview._participants[overview._mainParticipant]._keystoneID);
    if(path){
        return new URL(path, import.meta.url).href   
    }
    return new URL('/images/missing.png', import.meta.url).href 
}

function getItemImage(ID: number){
    let path = Items.itemPathFromID(ID);
    if(path){
        return new URL(path, import.meta.url).href   
    }
    return new URL('/images/missing.png', import.meta.url).href 
}

function getGameStatus(overview: GameOverview){
    if(overview._mainTeam == overview._winningTeam) return "game_win";
    return "game_loss";
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
                <div class="content">
                    <div class="row">
                        <div class="KDA">
                            {{ getKDA(overview) }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="pregame_container">
                            <img :src="getKeystoneImage(overview)" class="keystone"/>
                            <div class="sum_container">
                                <img :src="getSummonerImage(overview, 1)" class="summoner_spell"/>
                                <img :src="getSummonerImage(overview, 2)" class="summoner_spell"/>
                            </div>
                        </div>
                        <div class="item_container">
                            <div class="row">
                                <img  v-for="item in overview._participants[overview._mainParticipant]._itemIDs.slice(0, 3)" :src="getItemImage(item)" class="item"/>
                            </div>
                            <div class="row">
                                <img v-for="item in overview._participants[overview._mainParticipant]._itemIDs.slice(3, 6)" :src="getItemImage(item)" class="item"/>
                            </div>
                        </div>
                    </div>
                </div>
                    <!-- <p>{{ Champions.nameFromID(overview._participants[overview._mainParticipant]._champID) }}</p> -->
                <div class="background">
                    <div class="shadow"></div>
                    <div class="slanted-edge"/>
                    <img :src="getChampImage(overview)" class="champion" />
                </div>
            </div>
        </li>
    </div>
  </template>
  
  <style>
.KDA{
    margin-left: 10%;
    font-size: xx-large;
    color: white;

}
  .content > .row{
    height: 50%;
    display: flex;
    margin-left: 18%;
  }

    .item_container > .row > .item{
        height: 100%;
    }

    .item_container{
        display: flex;
        flex-direction: column;
    }

    .item_container > .row{
        height: 50%;
    }

  .background > .shadow{
    box-shadow: -20px 0 7px rgba(0.2, 0.2, 0.2, 0.5);
    height: 115%;
    position: absolute;
    width: 10px;
    margin-left: 22.5%;
    z-index: 1;
    rotate: 25deg;
  }
    .page > li::marker{
        color: #00000000;
    }

    .game_overview > .champ-spacing{
        margin-right: 17.5%;
        height: 100%;
        width: 0;
    }

    .background > .slanted-edge {
        --p: 70px; /* control the shape (can be percentage) */
        height: inherit;
        width:85%;
        margin-left: 15%;
        aspect-ratio: 1;
        clip-path: polygon(var(--p) 0,100% 0,100% 100%,0 100%);
        background-color: gray;
        z-index: 1;
        position: relative;
        border-bottom-right-radius: inherit;
        border-top-right-radius: inherit;
        
    }
    .content > .row > .pregame_container {
        display: contents;
    }

    .pregame_container > .keystone{
        height: 100%;
    }
    .pregame_container >  .sum_container{
        display: flex;
        flex-direction: column;
    }

    .pregame_container > .sum_container > .summoner_spell{
        width: 55%;
    }

    .content{
        border-style: solid;
        border-radius: 25px;
        display: flex;
        z-index: 2;
    }

    .game_win > .content{
        border-color: #2c6d0d;
        
    }

    .game_win > .background > .slanted-edge {
        background-color: #89EC5B;
    }

    .game_loss> .content{
        border-color: #b31b1b;
    }
    .game_loss  > .background > .slanted-edge {
        background-color: #E75F5F;
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

    .game_overview >.content{
        width: inherit;
        height: inherit;
        position: absolute;
        z-index: 100;
        display: flex;
        flex-direction: column;

    }
    
  .background > .champion{
    height: 125%;
    margin-top: -25%;
    margin-left: -15%;
    z-index: 0;
    position: inherit;


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
  