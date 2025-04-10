<template>
    <BannedScatter  ref="bannedScatter" />
    <ChampScatter v-if="bannedScatter" ref="champScatter"
    @legend_mouseover="bannedScatter.legend_mouseover"
    @legend_click="bannedScatter.legend_click"
    @legend_mouseleave="bannedScatter.legend_mouseleave"/>
    <input @change="toggleIcons()" id="ShowIcons" type="checkbox" v-model="displayIcons"/>
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

</style>