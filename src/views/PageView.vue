<script setup lang="ts">
import axios from "axios";
import { Summoner } from "../classes/summoner.ts";
import { ref, type Ref } from 'vue'
import type { JsonSourceFile } from "typescript";
import GameOverview from "@/classes/GameOverview.ts";
import GamerOverview from "@/classes/GameOverview.ts";


const gameName = ref('') 
const tag = ref('')
const puuid = ref('')
const gameIDS: Ref<Array<string>> = ref([])
const errors: Ref<Array<string>> = ref([])
const overviews: Ref<Array<GameOverview>> = ref([])

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

        // gameIDS.value.forEach(async gameID => {
        let response_game = await axios.get("/getGameSummary", {headers:{'matchid': gameIDS.value[0]}});
        overviews.value.push(new GameOverview(puuid.value, response_game.data['info']))
        // });
    }catch(error){
        puuid.value = "the requested profile couldn't be found"
        
    }
}

async function gameView(overview: GameOverview){
    console.log(overview)   
}
</script>

<template>
    <div class="page">
        <div>
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
        
        <li v-for="overview in overviews">
            <p @click="gameView(overview)">{{ overview._ID }}</p>
        </li>
    </div>
  </template>
  
  <style>
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
  </style>
  