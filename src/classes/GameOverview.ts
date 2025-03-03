import Participant from "./Participant";


export default class GamerOverview {
    _ID: string
    _winningTeam: number
    _participants: Array<Participant>
    _mainParticipant: number

    constructor(mainID: string, input: {[Name: string]: any}) {
        this._ID = `EUW1_${input['gameId']}`;
        this._winningTeam = input['teams'][0]['win'] ? 1:2;
        this._mainParticipant = -1
        this._participants = []
        for (let i = 0; i < input['participants'].length; i++) {
            this._participants.push(new Participant(input['participants'][i]));
            if(input['participants'][i]['puuid'] == mainID) {this._mainParticipant = i}
        }
    }
}