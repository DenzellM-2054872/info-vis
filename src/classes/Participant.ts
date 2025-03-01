export default class Participant {
    _playerID: string;
    _playerName: string;
    _champID: string;
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
        this._assists = input['assists'];
    }
}