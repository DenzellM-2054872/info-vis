
<script script setup lang="ts">
import { useRoute } from "vue-router";
import axios from "axios";
import { computed, onMounted, ref, Suspense, type ComputedRef, type Ref } from 'vue'
import type Timeline from "@/classes/Timeline";
import type { PauseEnd, SkillLevelUp, ItemDestroyed, ItemPurchase, ItemUndo, SpecialKill, Kill, GameEvent } from "@/classes/Timeline";
import GameOverview from "@/classes/GameOverview";

const route = useRoute()
const timeline : Ref<Timeline | null> = ref(null)
const overview : Ref<GameOverview | null> = ref(null)
const events : Ref<GameEvent[]> = ref([])

axios.get("/getGameSummary", {headers:{'matchid': `${route.query['id']}`}}).then((res) => {
    overview.value = new GameOverview("", res.data["info"])
})

axios.get("/getGameTimeline", {headers:{'matchid': `${route.query['id']}`}}).then((data) => {

    timeline.value = data.data.info
    if(!timeline.value) return;
    for(let frame of timeline.value.frames){
        events.value = events.value.concat(frame["events"])
    }
    events.value.sort((a, b) => {
        if(a["timestamp"] > b["timestamp"]) return 1;
        if(a["timestamp"] < b["timestamp"]) return -1;
        return 0;
        })

})



const time: Ref<number>= ref(0)
const activeEvents: ComputedRef<Array<GameEvent>> = ref(computed(() => {
    const sorted = events.value.filter((value) => {
        const delta = 1000
        if(Math.abs(time.value - value.timestamp) <= delta ) return true
        return false
    })
    return sorted;
}))

function getMapImage(){
    let missingPath = '/images/missing.png';
    if(!overview.value)return new URL(missingPath, import.meta.url).href;

    let path = `/minimap/map${overview.value._mapID}.png`;    
    return new URL(path, import.meta.url).href
}
</script>
<template>
    <div v-if="events.length > 0" style="width: 100%;" class="content">
        <img :src="getMapImage()"/>
        <input type="range" v-model="time" :max="events[events.length - 1].timestamp" class="time_slider"/>
        <div class="event_container">
            <div v-for="event in activeEvents">
                {{ event.type }} @ {{ event.timestamp }}
            </div>
        </div>
    </div>
</template>
<style>
    .content{
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        align-content: center;
    }
    .event_container{
        display: flex;
        flex-direction: column;
    }

    .time_slider{
        width: 70%;
        margin-inline: auto;
    }
    /* @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  } */
</style>