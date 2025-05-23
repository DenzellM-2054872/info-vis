import Participant from "./Participant";
import data from "../data/queues.json"

interface QueueType{
    "queueId": number;
    "map": string;
    "description": string;
    "notes": string | null;
}
interface QueuesType{
    [id: string]: QueueType
}
export default class GamerOverview {
    _ID: string
    _winningTeam: number
    _participants: Array<Participant>
    _mainParticipant: number
    _mainTeam: number
    _gameAge: number
    _mapID: number
    _gameTypeID: number

    constructor(mainID: string, input: {[Name: string]: any}) {
        this._ID = `EUW1_${input['gameId']}`;
        this._winningTeam = input['teams'][0]['win'] ? 1:2;
        this._mainParticipant = -1
        this._participants = []
        for (let i = 0; i < input['participants'].length; i++) {
            this._participants.push(new Participant(input['participants'][i]));
            if(input['participants'][i]['puuid'] == mainID) {this._mainParticipant = i}
        }
        this._mainTeam = 1;
        if(this._mainParticipant >= 6) this._mainTeam = 2;
        this._gameAge = input['gameCreation']
        this._mapID = input['mapId']
        this._gameTypeID = input['queueId']
    }

    getMainParticipant() {
        return this._participants[this._mainParticipant];
    }

    getGameName() {
        let typedQeues = data as QueuesType
        return typedQeues[this._gameTypeID].description;
    }
}