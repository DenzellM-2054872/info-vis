import {keys} from '../../public/championFull.json'
import {data} from '../../public/championFull.json'
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
        return(`/public/centered/${name}_0.jpg`)

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
}