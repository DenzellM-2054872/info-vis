
<template>
    <div id="champ_search">
        <input class="search_bar" type="text" v-model="input" placeholder="Search champs..." />
        <div class="search_suggestion" v-if="input&&!this.filteredList().length&&(input.length >= 3)">
            <p>No results found!</p>
        </div>
        <div class="search_suggestion" v-else >
            <div v-for="champ in filteredList()" :key="champ" class="champ" @click="this.fillChamp">
                <img :src="this.getChampionImage(champ.id)" class="champ_image"/>
                <p>{{ champ.data.name }}</p>
            </div>
        </div>
    </div>
</template>
<script  lang="js">
import { computed, ref} from 'vue'
import {keys} from '../data/championFull.json'
import Champions from '@/classes/Champion';




export default{
    name: "ChampSearch",
    setup(){
        let input = ref("");
        let champs = [];
        for(let key in keys){
            champs.push(new Champions(keys[key]))
        }
        return{
            input,
            champs
        }
    },
    methods: {
        filteredList() {
            if(this.input.length < 3) return []
            return this.champs.filter((champ) => {
                return champ.data.id.toLowerCase().includes(this.input.toLowerCase())
                ||champ.data.name.toLowerCase().includes(this.input.toLowerCase())
            });
        },
        getChampionImage(ID){
            return Champions.iconPathFromID(ID)
        },
        fillChamp(event){
            if(event.target.className == 'champ'){
                this.input = event.target.innerText
            }else{
                this.input = event.target.parentNode.innerText
            }
        },
        getChampionID(){
            if(this.input.length < 3) return ""
            return this.champs.filter((champ) => {
                return champ.data.id.toLowerCase().includes(this.input.toLowerCase())
                ||champ.data.name.toLowerCase().includes(this.input.toLowerCase())
            })[0]
        },
        clearInput(){
            this.input = ""
        }
    },

}
</script>



<style lang="scss" scoped>
#champ_search{
    position: relative;
    width: 150px;
}

.search_bar{
    width: inherit;
}

.champ{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 5px
}

.champ_image{
    width: 40px;
    margin-right: 5px;
}

.search_suggestion{
    position: absolute;
    z-index: 100;
    background-color    : black;
    width: inherit;
}
</style>