import runes from '../data/runesReforged.json'

interface SlotType{
    "id": number;
    "key": string;
    "icon": string;
    "name": string;
    "shortDesc": string;
    "longDesc":string;
}

interface SlotsType{
    [id: string]: SlotType | undefined;
}

interface PathType{
    "id": number;
    "key": string;
    "icon": string;
    "name": string;
    "slots": SlotsType[];
}

interface RunesType{
    [path: string]: PathType;
}

export default class Runes{
    constructor(){}

    static runePathFromID(id: number){
        const typedRunes = runes as RunesType
        
        for (let school in typedRunes){
            for(let keystone in typedRunes[school]['slots'][0]) 
                if(typedRunes[school]['slots'][0][keystone]?.id == id){
                    return `/public/${typedRunes[school]['slots'][0][keystone].icon}`
                }
        }
    }
}