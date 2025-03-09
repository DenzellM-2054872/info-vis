import type { ImageType } from "./SummonerSpell";
import items from "../data/item.json"
interface GoldType{
    "base": number;
    "purchasable": boolean;
    "total": number;
    "sell": number;
}

interface MapsType{
    [id: string]: boolean
}

interface StatsType{
    [id: string]: number
}

interface ItemType{
    "name": string;
    "description": string;
    "colloq": string;
    "plaintext": string;
    "into"?: string[];
    "image": ImageType;
    "gold": GoldType;
    "tags": string[]
    "maps": MapsType
    "stats": StatsType

}

interface ItemsType{
    [id:  string]: ItemType
}

export default class Items {
    constructor() {
    }

    static itemPathFromID(ID: number){
        const typedItems = items.data as ItemsType
        return `/item/${typedItems[`${ID}`].image.full}`

    }

}