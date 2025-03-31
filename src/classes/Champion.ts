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
    constructor() {
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
}