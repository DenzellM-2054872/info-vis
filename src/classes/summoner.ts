import axios from "axios";

class Summoner {
    p_token: string
    p_gameName: string = "";
    p_tag: string = "";
    p_puuid: string = "";
    p_sumID: string = "";

    constructor(token: string) {
      this.p_token = token  
    }

    async nameLookup(gameName: string, tag: string){
        let response = await axios.get(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tag}`, { headers: { "X-Riot-Token": `${this.p_token}` } });
        this.p_gameName = response.data['gameName']
        this.p_tag = response.data['tagLine']
        this.p_puuid = response.data['puuid']

        response = await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${this.p_puuid}`, { headers: { "X-Riot-Token": `${this.p_token}` } });
        this.p_sumID = response.data['id']
    }

    async puuidLookup(puuid: string){
        let response = await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${this.p_puuid}`, { headers: { "X-Riot-Token": `${this.p_token}` } });
        this.p_sumID = response.data['id']

    }
}

export {Summoner}