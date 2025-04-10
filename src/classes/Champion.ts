import {data} from '../data/championFull.json'
import {keys} from '../data/championFull.json'
import type { ChampType } from './ChampionTypes'



interface DataType{
    [champID: string]: ChampType
}

interface KeysType{
    [ID: number]: string
}

export default class Champions {
    id: string
    data: ChampType
    constructor(id: string) {
        this.id = id
        const typedData = data as DataType
        if (!typedData[id]) {
            throw new Error(`Champion with ID ${id} not found`)
        }
        this.data = typedData[id]
    }

    static iconPathFromID(ID: string){
        if(ID == "FiddleSticks") return (`/champion/Fiddlesticks.png`)
        return (`/champion/${ID}.png`)
    }


    static portraitPathFromID(ID: string){
        return(`/centered/${ID}_0.jpg`)

    }

    static tilePathFromID(ID: string){
        return(`/tiles/${ID}_0.jpg`)

    }

    static nameFromID(ID: string){
        const typedData = data as DataType
        return typedData[ID].name
    }


    static NamefromID(ID: string){
        const typedData = data as DataType
        return typedData[ID].name
    }

    static ClassesfromID(ID: string){
        const typedData = data as DataType
        if(ID == "FiddleSticks") return typedData['Fiddlesticks'].classes
        return typedData[ID].classes
    }

    getSpells(){
        return this.data.spells
    }

    getPassive(){
        return this.data.passive  
    }

    getSpellIcon(spellNumber: number){
        const spell = this.data.spells[spellNumber] 
        if (spell) {
            return (`/spell/${spell.image.full}`)
        }
        return '/spell/AatroxE.png'
    }

    getClass(){
        return this.data.classes
    }

    getPortraitPath(){
        return(`/centered/${this.id}_0.jpg`)
    }

    getName(){
        return this.data.name
    }

     
}