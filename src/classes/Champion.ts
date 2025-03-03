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
        

        // @ts-expect-error Parameter 'name' implicitly has an 'any' type.ts(7006)
        const champID: string = keys[id]
    }

    static nameFromID(id: number){
        const typedKeys = keys as KeysType
        const typedData = data as DataType
        const champID: string = typedKeys[id]
        return typedData[champID].name
    }
}