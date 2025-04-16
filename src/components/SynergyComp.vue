
<template>
    <div id="SynergyComp">
        <input type="text" v-model="input" placeholder="Search champs..." />
        <div v-for="champ in filteredList()" :key="champ">
            <p>{{ champ }}</p>
        </div>
        <div class="item error" v-if="input&&!this.filteredList().length">
            <p>No results found!</p>
        </div>
        <div class="champ_wrapper" :class="{'selected': highlight['champion_1'], 'not_selected': !highlight['champion_1'] }" @click="highlightField(1)">
            <img :src="getChampionImage(1)" class="champ"/>
            <p>{{ namefromID(1) }}</p>
        </div>
        <div class="champ_wrapper" :class="{'selected': highlight['champion_2'], 'not_selected': !highlight['champion_2'] }" @click="highlightField(2)">
            <img :src="getChampionImage(2)" class="champ"/>
            <p>{{ namefromID(2) }}</p>
        </div>
        <div class="champ_wrapper" :class="{'selected': highlight['champion_3'], 'not_selected': !highlight['champion_3'] }" @click="highlightField(3)">
            <img :src="getChampionImage(3)" class="champ"/>
            <p>{{ namefromID(3) }}</p>  
        </div>
        <div class="champ_wrapper" :class="{'selected': highlight['champion_4'], 'not_selected': !highlight['champion_4'] }" @click="highlightField(4)">
            <img :src="getChampionImage(4)" class="champ"/>
            <p>{{ namefromID(4) }}</p>
        </div>
        <div class="champ_wrapper" :class="{'selected': highlight['champion_5'], 'not_selected': !highlight['champion_5'] }" @click="highlightField(5)">
            <img :src="getChampionImage(5)" class="champ"/>
            <p>{{ namefromID(5) }}</p>
        </div>
    </div>
</template>
<script  lang="js">
import Champions from "@/classes/Champion"
import * as d3 from "d3" 
import { computed, ref} from 'vue'



export default{
    name: "SynergyComp",
    setup(){
        let input = ref("");
        const champs = ["apple", "banana", "orange"];
        let data  = undefined 
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
            input,
            champs
        }
    },
    methods: {
        readData(){
            d3.csv("http://localhost:5173/stats/synergies.csv").then((data) => {
            this.data = data
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
}

.selected{
    border: 3px blue solid;
}
.not_selected{
    margin: 3px;
}
.champ_wrapper{
    box-sizing: border-box;
}
</style>