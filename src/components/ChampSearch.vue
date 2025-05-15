
<template>
    <div id="champ_search">
        <input class="search_bar" type="text" v-model="input" placeholder="Search champs..." @input="change"/>
        <div class="search_suggestion" v-if="input&&this.filteredList().length&&(input.length >= 3)">
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
        let showSuggestions = ref(true); 

        for(let key in keys){
            champs.push(new Champions(keys[key]))
        }
        return{
            input,
            champs, 
            showSuggestions
        }
    },
    methods: {
        change(){
            this.$emit('change', this.input)
        },
        getInput(){
            return this.input
        },
        filteredList() {
            if(!this.showSuggestions || this.input.length < 3) return []
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
            this.$emit('change', this.input)
            this.showSuggestions = false;
        },
        getChampionID(){
            if(this.input.length == 0) return ""
            let results = this.champs.filter((champ) => {
                return champ.data.id.toLowerCase().includes(this.input.toLowerCase())
                ||champ.data.name.toLowerCase().includes(this.input.toLowerCase())
            })

            let matches = results.filter((champ) => {
                return champ.data.id.toLowerCase() == (this.input.toLowerCase())
                || champ.data.name.toLowerCase() == (this.input.toLowerCase())
            })

            if(matches.length != 0) return matches[0]

            return results[0]
        },
        clearInput(){
            this.input = ""
        }
    },
    watch: {
        input(newValue) {
            this.showSuggestions = true;
        }
    }

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