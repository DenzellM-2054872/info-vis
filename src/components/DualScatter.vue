<template>
    <div class="dual_scatter">
        <!-- <BannedScatter  ref="bannedScatter" /> -->
        <ChampScatter ref="champScatter"/>
        <div class="graph_controls">
            <div class="icon_controls">
                <input @change="toggleIcons()" id="ShowIcons" type="checkbox" v-model="displayIcons"/>
                <p>Show champion icons</p>
            </div>
            <select name="y_axis" id="y_axis" v-model="yAxis" @change="setDisplay">
                <option value="games">Games</option>
                <option v-if="filter == 'rank'" value="banrate">Banrate</option>
            </select>
            <select name="filter" id="filter" v-model="filter" @change="changeFilter">
                <option value="rank">Rank</option>
                <option v-if="yAxis == 'games'" value="mastery">Mastery</option>
            </select>

            <select v-if="filter == 'rank'" name="rank" id="rank" v-model="rank" @change="setRank">
                <option value="all">all</option>
                <option value="IRON">Iron</option>
                <option value="BRONZE">Bronze</option>
                <option value="GOLD">Gold</option>
                <option value="PLATINUM">Platinum</option>
                <option value="EMERALD">Emerald</option>
                <option value="DIAMOND">Diamond</option>
                <option value="MASTER">Master</option>
                <option value="GRANDMASTER">Grandmaster</option>
                <option value="CHALLENGER">Challenger</option>
                <option value="PLATINUM+">Platinum+</option>
                <option value="EMERALD+">Emerald+</option>
                <option value="DIAMOND+">Diamond+</option>
                <option value="MASTER+">Master+</option>
            </select>

            <select v-if="filter == 'mastery'" name="mastery" id="mastery" v-model="mastery" @change="setMastery">
                <option value=0>1 - 4</option>
                <option value=1>5 - 9</option>
                <option value=2>10 - 25</option>
                <option value=3>25+</option>
            </select>

            <ChampSearch ref="champSearch" @change="setName"/>
        </div>
    </div>
</template>

<script  lang="ts">
import ChampScatter from '@/components/ChampScatter.vue';
import BannedScatter from '@/components/BannedScatter.vue';
import { ref, useTemplateRef } from 'vue';
import ChampSearch from './ChampSearch.vue';

export default{
    name: "DualScatter",
    components: {
        ChampScatter,
        BannedScatter,
        ChampSearch
    },
    setup(){
        const bannedScatter = useTemplateRef<BannedScatter>('bannedScatter')
        const champScatter = useTemplateRef<ChampScatter>('champScatter')
        const champSearch = useTemplateRef<ChampSearch>('champSearch')
        let displayIcons = ref(false)
        let yAxis = ref("games")
        let rank = ref("all")
        let filter = ref("rank")
        let mastery = ref(0)

        return{
            bannedScatter,
            champScatter,
            displayIcons,
            yAxis,
            rank,
            mastery,
            filter
        }
    },
    methods: {
        toggleIcons(){
            this.champScatter.setIcons(this.displayIcons)
            // this.bannedScatter.setIcons(this.displayIcons)
        },
        setDisplay(){
            this.champScatter.setDisplay(this.yAxis)
            // this.bannedScatter.setDisplay(this.yAxis)
        },
        setRank(){
            this.champScatter.setRank(this.rank)
            // this.bannedScatter.setRank(this.rank)
        },
        setMastery(){
            this.champScatter.setMastery(this.mastery)
            // this.bannedScatter.setMastery()

        },
        setName(name: any){
            if(name.target) return 
            this.champScatter.highlightName(name)
        },
        changeFilter(){

            if(this.filter == "rank") this.setRank()
            if(this.filter == "mastery") this.setMastery()
        }
    },
    mounted(){

    }
}
</script>



<style lang="scss" scoped>
    #y_axis{
        margin-bottom: 5px;
    }

    #mastery{
        margin-bottom: 5px;
    }

    #rank{
        margin-bottom: 5px;
    }

    .graph_controls{
        display: flex;
        flex-direction: column;
    }

    .icon_controls{
        display: flex;
        height: fit-content;
    }

    .icon_controls input{
        margin-right: 10px;
    }
    .dual_scatter{
        display: flex;
        margin-top: 50px;
        margin-bottom: 25px;
        margin-inline: auto;
        // border: 1px solid lightgray;
        // padding: 10px;
        // box-shadow: 7px 5px 10px rgba(0.2, 0.2, 0.2, 0.5);
        // border-radius: 10px;
    }
</style>