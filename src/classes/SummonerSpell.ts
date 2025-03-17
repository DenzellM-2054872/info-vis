import summoner from '../data/summoner.json'

export interface ImageType{
    "full": string
    "sprite": string
    "group": string
    "x": number
    "y": number
    "w": number
    "h": number
}

interface SummonerType{
    "id": string
    "name": string
    "description": string
    "tooltip": string
    "maxrank": number
    "cooldown": number[]
    "cooldownBurn": string
    "cost": number[]
    "costBurn": string
    // // "datavalues:"
    "effect": (null|number[])[]
    "effectBurn": (null|string)[]
    // // "vars":
    "key": string,
    "summonerLevel": number,
    "modes": string[],
    "costType": string
    "maxammo": string
    "range": number[]
    "rangeBurn": string,
    "image": ImageType
    "resource": string
}

interface SummonersType{
    [path: string]: SummonerType;
}

export default class SummonerSpell{
    constructor(){}

    static summonerSpellPathFromID(id: number){
        const typedRunes = summoner.data as SummonersType
        // console.log(`SummonerSpells/${typedRunes[id]["image"]["full"]}`)
        return `/SummonerSpells/${typedRunes[id]["image"]["full"]}`

    }
}