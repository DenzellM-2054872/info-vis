export default class Participant {
    _playerID: string;
    _playerName: string;
    _champID: number;
    _keystoneID: number;
    _summonerID1: number;
    _summonerID2: number;
    _itemIDs: number[];
    _kills: number;
    _deaths: number;
    _assists: number;


    constructor(input: {[Name: string]: any}) { 
        this._playerID = input['puuid'];
        this._playerName = input['riotIdGameName'];
        this._champID = input['championId'];
        this._kills = input['kills'];
        this._deaths = input['deaths'];
        this._assists = input['assists'];
        this._keystoneID = input['perks']['styles'][0]['selections'][0]['perk'];
        this._summonerID1 = input['summoner1Id'];
        this._summonerID2 = input['summoner2Id'];
        this._itemIDs = []
        for (let i = 0; i <= 6; i++) {
            this._itemIDs.push(input[`item${i}`]);
        }

    }
}