<script setup lang="ts">
import axios from "axios";
import { Summoner } from "../classes/summoner.ts";
import { ref } from 'vue'


const gameName = ref('') 
const tag = ref('')
const puuid = ref('')

const errors = ref([''])
//typing is annoying if you dont add an empy string
errors.value = []

async function searchHandler(){
    errors.value = []

    if(gameName.value.length == 0){
        errors.value.push("please fill in a game name")
    }

    if(tag.value.length == 0){
        errors.value.push("please fill in a tag")
    }else if(tag.value[0] != '#'){
        errors.value.push("the tag must start with '#'")
    }

    if(errors.value.length != 0) return;

    console.log(gameName.value)
    console.log(tag.value)
    try{
        let response = await axios.get("/getSummoner", {headers:{'gameName': gameName.value, 'tagLine': tag.value.slice(1)}});
        puuid.value = response.data['puuid']

    }catch(error){
        puuid.value = "the requested profile couldn't be found"
        
    }

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
  