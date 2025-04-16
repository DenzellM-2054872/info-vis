<template>
    <div class="dual_scatter">
        <BannedScatter  ref="bannedScatter" />
        <ChampScatter v-if="bannedScatter" ref="champScatter"
        @legend_mouseover="bannedScatter.legend_mouseover"
        @legend_click="bannedScatter.legend_click"
        @legend_mouseleave="bannedScatter.legend_mouseleave"/>
        <div class="graph_controls">
            <div class="icon_controls">
                <input @change="toggleIcons()" id="ShowIcons" type="checkbox" v-model="displayIcons"/>
                <p>Show champion icons</p>
            </div>
        </div>
    </div>
</template>

<script  lang="ts">
import ChampScatter from '@/components/ChampScatter.vue';
import BannedScatter from '@/components/BannedScatter.vue';
import { ref, useTemplateRef } from 'vue';

export default{
    name: "DualScatter",
    components: {
        ChampScatter,
        BannedScatter
    },
    setup(){
        const bannedScatter = useTemplateRef<BannedScatter>('bannedScatter')
        const champScatter = useTemplateRef<ChampScatter>('champScatter')
        let displayIcons = ref(false)

        return{
            bannedScatter,
            champScatter,
            displayIcons
        }
    },
    methods: {
        toggleIcons(){
            this.champScatter.setIcons(this.displayIcons)
            this.bannedScatter.setIcons(this.displayIcons)
        }
    },
    mounted(){

    }
}
</script>



<style lang="scss" scoped>
    .graph_controls{
        display: flex;
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
    }
</style>