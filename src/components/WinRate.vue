
<template>
    <div id="WinRate">
        <div id="TeamContainer">
            <div id="Team1">
                <div class="inputContainer">
                    <p>First blood</p>
                    <input type="checkbox" v-model="team1.firstblood">
                </div>
            </div>

            <div id="Team2">
                <div class="inputContainer">
                    <p>First blood</p>
                    <input type="checkbox" v-model="team2.firstblood">
                </div>
            </div>
        </div>
        <div id="RateBar">
            <div id="Left">{{ leftRate }}</div>
            <div id="Right">{{ rightRate }}</div>
        </div>
    </div>

</template>
<script  lang="ts">
import { ref, useTemplateRef, type Ref } from 'vue';
import * as d3 from "d3" 

class Team{
    firstblood: boolean = false
}
export default{
    name: "WinRate",
    setup(){
        let leftRate = 50
        let rightRate = 50

        let team1: Ref<Team> = ref(new Team)
        let team2: Ref<Team> = ref(new Team)

        return{
            leftRate,
            rightRate,
            team1,
            team2
        }
    },
    methods: {
        shrink(){
            console.log(d3.select("#Left"))
            d3.select("#Left").style("width", "25%")
            d3.select("#Right").style("width", "75%")
        }
    },
    mounted(){
    }
}
</script>



<style lang="scss" scoped>
.inputContainer{
    display: flex;
    flex-direction: row;
}

#Team1{
    display: flex;
    flex-direction: column;
    width: 50%;

}

#Team2{
    display: flex;
    flex-direction: column;
    width: 50%;
    align-items: end;

}

#TeamContainer{
    display: flex;
    flex-direction: row;
}

#WinRate{
    width:70%;
    height: fit-content;
}

#RateBar{
    display: flex;
    flex-direction: row;
    height: 50px;
}

#Left{
    width: 50%;
    background-color: blue;
}

#Right{
    width: 50%;
    background-color: red;
}
</style>