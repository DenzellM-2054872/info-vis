<template>
    <div id="ability_comp">
        <div style="margin: auto; display: flex; justify-content: center;">
            <input v-model="winning" type="checkbox" id="winning" name="winning" value="winning" @change="$forceUpdate()">
            <label for="winning" style="margin-right: 5px;">Winning</label>
            <input v-model="popular" type="checkbox" id="popular" name="popular" value="popular" @change="$forceUpdate()">
            <label for="popular">Popular</label>
        </div>
        <div class="abilityLine">
            <img class = "abilityPic" :src="champ?.getSpellIcon(0)" alt="Champion Q" />
            <div class="abilitySquare" :class="[getPopular(i - 1) == 1 && popular? 'popular':'', getWinning(i - 1) == 1 && winning? 'winning':'']" v-for="i in 18" :id="'Q' + i">
                <p>{{ 
                    (champStats?.rank?.[rank]?.[i - 1]?.[1]?.wins ?? 0) + 
                    (champStats?.rank?.[rank]?.[i - 1]?.[1]?.losses ?? 0)
                }}</p>
                <p>{{
                    champStats?.rank?.[rank]?.[i - 1]?.[1]?.wins !== undefined &&
                    champStats?.rank?.[rank]?.[i - 1]?.[1]?.losses !== undefined &&
                    (champStats?.rank?.[rank]?.[i - 1]?.[1]?.wins + champStats?.rank?.[rank]?.[i - 1]?.[1]?.losses) > 0
                        ? (champStats.rank[rank][i - 1][1].wins /
                           (champStats.rank[rank][i - 1][1].wins + champStats.rank[rank][i - 1][1].losses)).toFixed(2)
                        : 'N/A'
                }}</p>
               
            </div>
        </div>
        <div class="abilityLine">
            <img class = "abilityPic" :src="champ?.getSpellIcon(1)" alt="Champion W" />
                <div class="abilitySquare" :class="[getPopular(i - 1) == 2 && popular ? 'popular':'', getWinning(i - 1) == 2 && winning? 'winning':'']" v-for="i in 18" :id="'W' + i">
                <p>{{ 
                    (champStats?.rank?.[rank]?.[i - 1]?.[2]?.wins ?? 0) + 
                    (champStats?.rank?.[rank]?.[i - 1]?.[2]?.losses ?? 0)
                }}</p>
                <p>{{
                    champStats?.rank?.[rank]?.[i - 1]?.[2]?.wins !== undefined &&
                    champStats?.rank?.[rank]?.[i - 1]?.[2]?.losses !== undefined &&
                    (champStats?.rank?.[rank]?.[i - 1]?.[2]?.wins + champStats?.rank?.[rank]?.[i - 1]?.[2]?.losses) > 0
                        ? (champStats.rank[rank][i - 1][2].wins /
                           (champStats.rank[rank][i - 1][2].wins + champStats.rank[rank][i - 1][2].losses)).toFixed(2)
                        : 'N/A'
                }}</p>
               
            </div>
        </div>
        <div class="abilityLine">
            <img class = "abilityPic" :src="champ?.getSpellIcon(2)" alt="Champion E" />
            <div class="abilitySquare" :class="[getPopular(i - 1) == 3 && popular ? 'popular':'', getWinning(i - 1) == 3 && winning? 'winning':'']" v-for="i in 18" :id="'E' + i">
                <p>{{ 
                    (champStats?.rank?.[rank]?.[i - 1]?.[3]?.wins ?? 0) + 
                    (champStats?.rank?.[rank]?.[i - 1]?.[3]?.losses ?? 0)
                }}</p>
                <p>{{
                    champStats?.rank?.[rank]?.[i - 1]?.[3]?.wins !== undefined &&
                    champStats?.rank?.[rank]?.[i - 1]?.[3]?.losses !== undefined &&
                    (champStats?.rank?.[rank]?.[i - 1]?.[3]?.wins + champStats?.rank?.[rank]?.[i - 1]?.[3]?.losses) > 0
                    ? (champStats.rank[rank][i - 1][3].wins /
                    (champStats.rank[rank][i - 1][3].wins + champStats.rank[rank][i - 1][3].losses)).toFixed(2)
                    : 'N/A'
                }}</p>
            </div>
        </div>
        <div class="abilityLine">
            <img class = "abilityPic" :src="champ?.getSpellIcon(3)" alt="Champion R" />
            <div class="abilitySquare" :class="[getPopular(i - 1) == 4 && popular ? 'popular':'', getWinning(i - 1) == 4 && winning? 'winning':'']" v-for="i in 18" :id="'R' + i">
                <p>{{ 
                    (champStats?.rank?.[rank]?.[i - 1]?.[4]?.wins ?? 0) + 
                    (champStats?.rank?.[rank]?.[i - 1]?.[4]?.losses ?? 0)
                }}</p>
                <p>{{
                    champStats?.rank?.[rank]?.[i - 1]?.[4]?.wins !== undefined &&
                    champStats?.rank?.[rank]?.[i - 1]?.[4]?.losses !== undefined &&
                    (champStats?.rank?.[rank]?.[i - 1]?.[4]?.wins + champStats?.rank?.[rank]?.[i - 1]?.[4]?.losses) > 0
                        ? (champStats.rank[rank][i - 1][4].wins /
                           (champStats.rank[rank][i - 1][4].wins + champStats.rank[rank][i - 1][4].losses)).toFixed(2)
                        : 'N/A'
                }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from "vue";
import Champions from "@/classes/Champion.ts"; 
import * as d3 from "d3";

class abilities{
    rank: {[key: string]: {[order: number]: {[ability: string]: {wins: number, losses: number}}}} = {}
}

export default{
    name: "AbilityComp",
    props: {
        champStats: {
            type: Object as () => abilities | null,
            required: true
        },

        champion: {
            type:  Object as () => string | null,
            required: true
        }
    },
    setup(){
        let champ: undefined | Champions
        let data: abilities | undefined;
        let rank = 'all';
        let popular = true;
        let winning = false;
        return {
            popular,
            winning,
            rank,
            champ,
            data
        };
    },
    methods: {
        setRank(rank: string){
            this.rank = rank
            this.$forceUpdate()
        },
        getPopular(pos: number){
            if(!this.champStats || !this.champ) return -1;
            let highest = 0;
            let highestability = 0;
            for(let i = 1; i <= 4; i++){
                if(!this.champStats.rank[this.rank][pos][i]) continue;
                if(this.champStats.rank[this.rank][pos][i].wins + this.champStats.rank[this.rank][pos][i].losses > highest){
                    highest = this.champStats.rank[this.rank][pos][i].wins + this.champStats.rank[this.rank][pos][i].losses;
                    highestability = i;
                }
            }
            return highestability
        },
        getWinning(pos: number){
            if(!this.champStats || !this.champ) return -1;
            let highest = 0;
            let highestability = 0;
            for(let i = 1; i <= 4; i++){
                if(!this.champStats.rank[this.rank][pos][i]) continue;
                if(this.champStats.rank[this.rank][pos][i].wins / (this.champStats.rank[this.rank][pos][i].losses + this.champStats.rank[this.rank][pos][i].wins)> highest){
                    highest = this.champStats.rank[this.rank][pos][i].wins / (this.champStats.rank[this.rank][pos][i].losses + this.champStats.rank[this.rank][pos][i].wins);
                    highestability = i;
                }
            }
            return highestability
        },
    },
    mounted(){
        console.log(this.champion)
        if(!this.champion) return;
        this.champ = new Champions(this.champion);
        console.log("ChampMatchup mounted with champStats", this.champStats);
        this.$forceUpdate();
    }
}

</script>

<style scoped>
.abilityLine{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
}
.abilitySquare {
    width: 50px;
    height: 50px;
    background-color: #ccc;
    color: black;
    font-size: small;
    margin: 3px;
    display: flex;
    flex-direction: column;
    border-radius: 7px;
    /* border: 3.5px solid grey; */
    padding-block: 2px;
}
.popular{
    /* border: 3.5px solid blue; */
    background-color: #7a7ade;
}

.winning{
    /* border: 3.5px solid yellow; */
    background-color: #F4F471;

}

.popular.winning{
    /* border: 3.5px solid green; */
    background-color: #51B451;

}
.abilityLine p{
    margin: auto;
}

.abilityPic{
    border-radius: 8px;
    width: 55px;
    height: 55px;
}
</style>

