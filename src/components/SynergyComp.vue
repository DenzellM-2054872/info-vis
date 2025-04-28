
<template>
    <div id="SynergyComp">
        <div class="search">
            <div class="search_bar">
                <ChampSearch ref="champSearch"/>
                <button id="search_button" @click="addChampion">Add</button>
                <select name="suggestion_sort" id="suggestion_sort" v-model="suggestionSort" @change="updateStats">
                    <option value="popular">Popular</option>
                    <option value="winrate">Win rate</option>
                    <option value="random">Random</option>
                </select>
            </div>
        <div class="champs_wrapper">
            <div class="champ_wrapper" @click="removeChamp(main.champs, 0)">
                <img :src="getChampionImage(main, 0)" class="champ"/>
                <p class="champ_name">{{ namefromID(main, 0) }}</p>
                </div>
                <div class="champ_wrapper" @click="removeChamp(main.champs, 1)">
                    <img :src="getChampionImage(main, 1)" class="champ"/>
                    <p class="champ_name">{{ namefromID(main, 1) }}</p>
                </div>
                <div class="champ_wrapper" @click="removeChamp(main.champs, 2)">
                    <img :src="getChampionImage(main, 2)" class="champ"/>
                    <p class="champ_name">{{ namefromID(main, 2) }}</p>  
                </div>
                <div class="champ_wrapper" @click="removeChamp(main.champs, 3)">
                    <img :src="getChampionImage(main, 3)" class="champ"/>
                    <p class="champ_name">{{ namefromID(main, 3) }}</p>
                </div>
                <div class="champ_wrapper" @click="removeChamp(main.champs, 4)">
                    <img :src="getChampionImage(main, 4)" class="champ"/>
                    <p class="champ_name">{{ namefromID(main, 4) }}</p>
                </div>
                <div class="stats_wrapper">
                    <p>Games: {{ main.games }}</p>
                    <p>WR: {{ main.WR }}%</p>
                </div>
            </div>
            <div v-for="suggestion in suggestions" class="champs_wrapper suggestions">
                <div class="champ_wrapper">
                <img :src="getChampionImage(suggestion, 0)" class="champ"/>
                <p class="champ_name">{{ namefromID(suggestion, 0) }}</p>
                </div>
                <div class="champ_wrapper">
                    <img :src="getChampionImage(suggestion, 1)" class="champ"/>
                    <p class="champ_name">{{ namefromID(suggestion, 1) }}</p>
                </div>
                <div class="champ_wrapper">
                    <img :src="getChampionImage(suggestion, 2)" class="champ"/>
                    <p class="champ_name">{{ namefromID(suggestion, 2) }}</p>  
                </div>
                <div class="champ_wrapper">
                    <img :src="getChampionImage(suggestion, 3)" class="champ"/>
                    <p class="champ_name">{{ namefromID(suggestion, 3) }}</p>
                </div>
                <div class="champ_wrapper">
                    <img :src="getChampionImage(suggestion, 4)" class="champ"/>
                    <p class="champ_name">{{ namefromID(suggestion, 4) }}</p>
                </div>
                <div class="stats_wrapper">
                    <p>Games: {{ suggestion.games }}</p>
                    <p>WR: {{ suggestion.WR }}%</p>
                </div>
            </div>
        </div>
        <div class="top">
            <div v-for="top in tops" class="champs_wrapper">
                <div class="champ_wrapper">
                <img :src="getChampionImage(top, 0)" class="champ"/>
                <p class="champ_name">{{ namefromID(top, 0) }}</p>
                </div>
                <div class="champ_wrapper">
                    <img :src="getChampionImage(top, 1)" class="champ"/>
                    <p class="champ_name">{{ namefromID(top, 1) }}</p>
                </div>
                <div class="champ_wrapper">
                    <img :src="getChampionImage(top, 2)" class="champ"/>
                    <p class="champ_name">{{ namefromID(top, 2) }}</p>  
                </div>
                <div class="champ_wrapper">
                    <img :src="getChampionImage(top, 3)" class="champ"/>
                    <p class="champ_name">{{ namefromID(top, 3) }}</p>
                </div>
                <div class="champ_wrapper">
                    <img :src="getChampionImage(top, 4)" class="champ"/>
                    <p class="champ_name">{{ namefromID(top, 4) }}</p>
                </div>
                <div class="stats_wrapper">
                    <p>Games: {{ top.games }}</p>
                    <p>WR: {{ top.WR }}%</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script  lang="ts">
import ChampSearch from '@/components/ChampSearch.vue';
import Champions from "@/classes/Champion"
import * as d3 from "d3" 
import { computed, ref, useTemplateRef, type Ref} from 'vue'
interface CompStats{
    champs: string[]
    WR: number
    games: number
}

interface ChamStats{
    Name: string
    Games: number
    Wins: number
    Losses: number
    Bans: number
    EffectiveBans: number
    WR: number
}


export default{
    name: "SynergyComp",
    components: {
        ChampSearch
    },
    setup(){
        const champSearch = useTemplateRef<ChampSearch>('champSearch')
        let data:  CompStats[] = []
        let champData: ChamStats[] = []
        const suggestionSort = ref('popular')
        const main: Ref<CompStats> = ref({
            champs:
            [
                "",
                "",
                "",
                "",
                "",
            ],
            WR: 0,
            games: 0
        })
        const suggestions: Ref<CompStats[]>  = ref([
        ])
        const tops: Ref<CompStats[]> = ref([
        ])

        return{
            data,
            champData,
            main,
            tops,
            suggestions,
            suggestionSort,
            champSearch
        }
    },
    methods: {
        readData(){
            d3.csv("http://localhost:5173/stats/synergies.csv").then((data) => {
                for(let comp of data){
                    let champs = []
                    for (let i = 1; i <= 5; i++) {
                        if(comp[`Champ${i}`] != "") champs.push(comp[`Champ${i}`])
                        
                    }
                    this.data.push({champs: champs, games: Number(comp.Games), WR: Number(comp.Wins) / Number(comp.Games)})
                }
            })

            d3.json("http://localhost:5173/stats/wbpr.json").then((data: any) => {
                this.champData = data['all']
            })
        },
        printData(){
            console.log(this.data)
        },
        getChampionImage(object: CompStats, index: number){
            for(let top of this.tops){
                if(top == object){
                    if(object.champs[index] == "") return '/images/missing.png'
                    return Champions.iconPathFromID(object.champs[index])
                }
            }
            if(object != this.main && this.main.champs[index] != "") return '/images/empty.png'
            if(object.champs[index] == "") return '/images/missing.png'
            return Champions.iconPathFromID(object.champs[index])
        },
        namefromID(object: CompStats, index: number){
            if (object.champs[index] == "") return ""
            return Champions.NamefromID(object.champs[index])
        },
        removeChamp(array: string[], index: number){
            if(array[index] == "") return;
            array[index] = ""
            for (let i = index; i < array.length - 1; i++) {
                array[i] = array[i + 1]
            }
            this.updateStats()
        },
        addChampion(){
            for(let champ in this.main.champs){
                if(this.main.champs[champ] == ""){
                    let champion = this.champSearch.getChampionID()
                    if(champion == "") return;
                    this.main.champs[champ] = champion.id
                    this.updateStats()
                    this.champSearch.clearInput()
                    return
                }
            }
        },
        
        updateStats(){
            this.$forceUpdate()
            let champCount = 0
            for(let champ of this.main.champs){
                    if(champ == "") continue;
                    champCount++
            }
            if(!this.data) return
            let comps = this.data.filter((comp) =>{
                let keep = true
                for(let champ of this.main.champs){
                    if(champ == "") return keep;
                    keep = keep && comp.champs.includes(champ)
                }
                return keep
            })
            this.generateTop(champCount)
            if(comps.length == 0){
                this.main.games = 0
                this.main.WR = 0
                return
            }
            this.suggestions = []
            let suggestions = this.generateComps(comps, champCount)
            for (let i = 0; i < suggestions.length; i++) {
                let champ = suggestions[i].champs.filter((champ: string) => !this.main.champs.includes(champ))[0]
                this.suggestions.push({
                    champs:
                    [
                        "",
                        "",
                        "",
                        "",
                        "",
                    ],
                    WR: 0,
                    games: 0
                })
                this.suggestions[i].champs[champCount] = champ
                this.suggestions[i].WR = Math.round(suggestions[i].WR * 10000)/100
                this.suggestions[i].games = suggestions[i].games
            }

            if(champCount < 2){
                this.main.games = 0
                this.main.WR = 0
                return
            } 

            this.main.games = comps[0].games
            this.main.WR = Math.round(comps[0].WR * 10000)/100

        },
        generateComps(comps: CompStats[], champCount: number){
            comps = comps.filter((comp) =>{
                return comp.champs.length == champCount + 1
            })
            if(this.suggestionSort == "popular") comps.sort((a, b) => {
                let aChamp = a.champs.filter((champ) => !this.main.champs.includes(champ))[0]
                let bChamp = b.champs.filter((champ) => !this.main.champs.includes(champ))[0]
                
                let aData = this.champData.filter((data: ChamStats) => data.Name == aChamp)[0]
                let bData = this.champData.filter((data: ChamStats) => data.Name == bChamp)[0]
                

                return (b.games/Math.pow(bData.Games, 0.85)) - (a.games/Math.pow(aData.Games, 0.85))
            })
            else if(this.suggestionSort == "winrate"){ 
                comps.sort((a, b) => {
                    let z = 3.891

                    let aScore = a.WR + z**2 / (2 * a.games) - z * Math.sqrt((a.WR * (1 - a.WR) + z**2 / (4 * a.games)) / a.games) / (1 + z**2 / a.games)
                    let bScore = b.WR + z**2 / (2 * b.games) - z * Math.sqrt((b.WR*(1 - b.WR) + z**2 / (4 * b.games)) / b.games) / (1 + z**2 / b.games)
                    return bScore - aScore 
                })
        }

            else if(this.suggestionSort == "random") comps.sort(() => Math.random() - 0.5)

            return comps.slice(0, 4)
        },
        generateTop(champCount: number){
            this.tops = []
            let comps = this.data.filter((comp) =>{
                return comp.champs.length == champCount + 1
            })
            let k = 200
            if(this.suggestionSort == "popular") comps.sort((a, b) => {
                return (b.games) - (a.games)
            })
            
            else if(this.suggestionSort == "winrate"){ 
                comps.sort((a, b) => {
                    let z = 3.891

                    let aScore = a.WR + z**2 / (2 * a.games) - z * Math.sqrt((a.WR * (1 - a.WR) + z**2 / (4 * a.games)) / a.games) / (1 + z**2 / a.games)
                    let bScore = b.WR + z**2 / (2 * b.games) - z * Math.sqrt((b.WR * (1 - b.WR) + z**2 / (4 * b.games)) / b.games) / (1 + z**2 / b.games)
                    return bScore - aScore 
                })
                
                comps = comps.filter((point) => {
                    return point.games >= (30 * (4 - champCount))
                })
        }

            else if(this.suggestionSort == "random") comps.sort(() => Math.random() - 0.5)

            for (let i = 0; i < 5; i++) {
                if(!comps[i]){
                    return
                } 
                this.tops.push({
                    champs:
                    [
                        "",
                        "",
                        "",
                        "",
                        "",
                    ],
                    WR: 0,
                    games: 0
                })
                for (let j = 0; j < comps[i].champs.length; j++) {
                    this.tops[i].champs[j] = comps[i].champs[j]
                }
                this.tops[i].games = comps[i].games
                this.tops[i].WR = Math.round(comps[i].WR * 10000)/100
            }
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
    flex-direction: row;
    width: fit-content;
}
#champ_search{
    align-self: center;
}
#suggestion_sort{
    margin-top: 2px;
    height: 22px;
}
#search_button{
    margin-top: 2px;
    height: 22px;
}
.top{
    margin-top: 24px;
}
.search{
    margin-right: 50px;
}
.suggestions{
    opacity: 30%;
}
.stats_wrapper{
    align-content: center;
    padding-bottom: 25px;
}
.champ_name{
    align-self: center;
    text-wrap: wrap;
}
.champ{
    width: inherit;
}
.search_bar{
    display: flex;
    flex-direction: row;
    align-self: center;
    margin-bottom: 10px;
}
.champs_wrapper{
    display: flex;
    flex-direction: row;
    border-bottom: 2px gray solid;
    margin-top: 10px;
    margin-bottom: 10px;
    
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
    width: 64px;
    margin-right: 5px;

    
}
</style>