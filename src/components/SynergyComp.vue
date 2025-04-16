
<template>
    <div id="SynergyComp">
        <div class="search_bar">
            <ChampSearch ref="champSearch"/>
            <button id="search_button" @click="addChampion">Add</button>
        </div>
       <div class="champs_wrapper">
           <div class="champ_wrapper" :class="{'selected': highlight['champion_1'], 'not_selected': !highlight['champion_1'] }" @click="highlightField(1)">
               <img :src="getChampionImage(1)" class="champ"/>
               <p class="champ_name">{{ namefromID(1) }}</p>
            </div>
            <div class="champ_wrapper" :class="{'selected': highlight['champion_2'], 'not_selected': !highlight['champion_2'] }" @click="highlightField(2)">
                <img :src="getChampionImage(2)" class="champ"/>
                <p class="champ_name">{{ namefromID(2) }}</p>
            </div>
            <div class="champ_wrapper" :class="{'selected': highlight['champion_3'], 'not_selected': !highlight['champion_3'] }" @click="highlightField(3)">
                <img :src="getChampionImage(3)" class="champ"/>
                <p class="champ_name">{{ namefromID(3) }}</p>  
            </div>
            <div class="champ_wrapper" :class="{'selected': highlight['champion_4'], 'not_selected': !highlight['champion_4'] }" @click="highlightField(4)">
                <img :src="getChampionImage(4)" class="champ"/>
                <p class="champ_name">{{ namefromID(4) }}</p>
            </div>
            <div class="champ_wrapper" :class="{'selected': highlight['champion_5'], 'not_selected': !highlight['champion_5'] }" @click="highlightField(5)">
                <img :src="getChampionImage(5)" class="champ"/>
                <p class="champ_name">{{ namefromID(5) }}</p>
            </div>
            <div class="stats_wrapper">
                <p>Games: {{ games }}</p>
                <p>WR: {{ WR }}%</p>
            </div>
        </div>
    </div>
</template>
<script  lang="js">
import ChampSearch from '@/components/ChampSearch.vue';
import Champions from "@/classes/Champion"
import * as d3 from "d3" 
import { computed, ref, useTemplateRef} from 'vue'



export default{
    name: "SynergyComp",
    components: {
        ChampSearch
    },
    setup(){
        const champSearch = useTemplateRef<ChampSearch>('champSearch')
        let data  = undefined 

        const games = ref(0)
        const WR = ref(0)

        let champions = {
            champion_1: "",
            champion_2: "",
            champion_3: "",
            champion_4: "",
            champion_5: "",
        }
        let highlight = ref({
            champion_1: false,
            champion_2: false,
            champion_3: false,
            champion_4: false,
            champion_5: false,
        })   
        return{
            data,
            champions,
            highlight,
            champSearch,
            games,
            WR
        }
    },
    methods: {
        readData(){
            d3.csv("http://localhost:5173/stats/synergies.csv").then((data) => {
            this.data = []
            for(let comp of data){
                let champs = []
                for (let i = 1; i <= 5; i++) {
                    if(comp[`Champ${i}`] != "") champs.push(comp[`Champ${i}`])
                    
                }
                this.data.push({"champs": champs, "games": comp.Games, "wins": comp.Wins})
            }
        })
        },
        printData(){
            console.log(this.data)
        },
        getChampionImage(num){
            if(this.champions[`champion_${num}`] == "") return '/images/missing.png'
            return Champions.iconPathFromID(this.champions[`champion_${num}`])
        },
        namefromID(num){
            if (this.champions[`champion_${num}`] == "") return ""
            return Champions.NamefromID(this.champions[`champion_${num}`])
        },
        highlightField(num){
            if(this.highlight[`champion_${num}`]){
                this.highlight[`champion_${num}`] = false
                return
            }
            this.champions[`champion_${num}`] = ""
            this.updateStats()
            for(let champ in this.highlight){
                this.highlight[champ] = false
            }
            this.highlight[`champion_${num}`] = true
        },
        filteredList() {
            if(this.input.length == 0) return[]
            return this.champs.filter((champ) =>
                champ.toLowerCase().includes(this.input.toLowerCase())
            );
        },
        addChampion(){
            for(let champ in this.highlight){
                if(this.highlight[champ]){
                    this.champions[champ] = this.champSearch.getChampionID().id
                    this.highlight[champ] = false
                    this.$forceUpdate()
                    this.updateStats()
                    this.champSearch.clearInput()
                }
            }
        },
        updateStats(){
            let champCount = 0
            for(let champ in this.champions){
                    if(this.champions[champ] == "") continue;
                    champCount++
            }
            if(champCount < 2) return
            let comps = this.data.filter((comp) =>{
                let keep = true
                for(let champ in this.champions){
                    if(this.champions[champ] == "") continue;
                    keep = keep && comp.champs.includes(this.champions[champ])
                }
                return keep
            })
            if(comps.length == 0){
                this.games = 0
                this.WR = 0
                return
            }           

            this.games = comps[0].games
            this.WR = Math.round(comps[0].wins / comps[0].games * 10000)/100
        }
    },
    mounted(){
        this.readData()
    }
}
</script>



<style lang="scss" scoped>
#SynergyComp{
    display: flex;
    flex-direction: column;
    width: fit-content;
}
#champ_search{
    align-self: center;
}
#search_button{
    margin-top: 2px;
    height: 22px;
}
.stats_wrapper{
    align-content: end;
    padding-bottom: 30px;
}
.champ_name{
    align-self: center;
}
.champ{
    width: 128px;
}
.search_bar{
    display: flex;
    flex-direction: row;
    align-self: center;
}
.champs_wrapper{
    display: flex;
    flex-direction: row;
}
.selected{
    border: 3px blue solid;
}
.not_selected{
    margin: 3px;
}
.champ_wrapper{
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}
</style>