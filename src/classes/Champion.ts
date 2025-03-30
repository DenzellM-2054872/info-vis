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

    static portraitPathFromID(id: number){
        const name = Champions.codeNameFromID(id)
        return(`/centered/${name}_0.jpg`)

    }

    static tilePathFromID(id: number){
        const name = Champions.codeNameFromID(id)
        return(`/tiles/${name}_0.jpg`)

    }
    
    static codeNameFromID(id: number){
        const typedKeys = keys as KeysType
        const typedData = data as DataType
        const champID: string = typedKeys[id]
        return typedData[champID].id
    }

    static nameFromID(id: number){
        const typedKeys = keys as KeysType
        const typedData = data as DataType
        const champID: string = typedKeys[id]
        return typedData[champID].name
    }


    static NamefromCodeName(codeName: string){
        const typedData = data as DataType
        return typedData[codeName].name
    }

    static ClassesfromCodeName(codeName: string){
        const typedData = data as DataType
        if(codeName == "FiddleSticks") return typedData['Fiddlesticks'].classes
        return typedData[codeName].classes
    }
}