import express from 'express'
import cors from 'cors'

import axios from 'axios'
import rateLimit from 'axios-rate-limit';
import fs from 'fs';
import e from 'express';

const riotToken = fs.readFileSync('api_key.txt','utf8');
const inst = rateLimit(rateLimit(axios.create(), {maxRPS: 15}), {maxRequests: 100, perMilliseconds:120000});
inst.defaults.baseURL = 'https://europe.api.riotgames.com';
inst.defaults.headers.common['X-Riot-Token'] = riotToken;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const app = express();
const port = 3000;
app.use(cors({origin: `http://localhost:5173`}));

app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
  });

  app.get('/getSummoner', async (req, res) => {
    // console.log(req.headers) 
    let gameName = req.headers['gamename'];
    let tag = req.headers['tagline'];


    console.log(gameName)
    console.log(tag)
    try {
      if(fs.existsSync(`game_data/proflile_${gameName}#${tag}.json`)){
        res.send(fs.readFileSync(`game_data/proflile_${gameName}#${tag}.json`)); 
      }else{
        const response = await inst.get(`/riot/account/v1/accounts/by-riot-id/${gameName}/${tag}`)
        fs.writeFileSync(`game_data/proflile_${gameName}#${tag}.json`, JSON.stringify(response.data), {flag: "w"})
        res.send(response.data);
      }
      
    } catch (error) {
      res.status(404).send("requested account couldn't be found");
    }

  });

  app.get('/getGameIDs', async (req, res) => {
    // console.log(req.headers) 
    let puuid = req.headers['puuid'];

    let startTime = "";
    if(req.headers['startTime']){
      let startTime = `startTime=${req.headers['startTime']}`;
    }

    let endTime = "";
    if(req.headers['endTime']){
      let endTime = `endTime=${req.headers['endTime']}`;
    }

    let queue = "";
    if(req.headers['queue']){
      let queue = `queue=${req.headers['queue']}`;
    }

    let type = "";
    if(req.headers['type']){
      let type = `type=${req.headers['type']}`;
    }

    let count = "";
    if(req.headers['count']){
      let count = `count=${req.headers['count']}`;
    }

    try {
      if(fs.existsSync(`game_data/games_${puuid}.json`)){
        res.send(fs.readFileSync(`game_data/games_${puuid}.json`)); 
      }else{
        const response = await inst.get(`/lol/match/v5/matches/by-puuid/${puuid}/ids?${startTime}&${endTime}&${queue}&${type}&${count}`)
        fs.writeFileSync(`game_data/games_${puuid}.json`, JSON.stringify(response.data), {flag: "w"})
        res.send(response.data);
      }      
    } catch (error) {
      res.status(404).send("requested account couldn't be found");
    }

  });

  app.get('/getGameTimeline', async (req, res) => { 
    let matchId = req.headers['matchid'];
    console.log(matchId)

    try {
      if(fs.existsSync(`game_data/timeline_${matchId}.json`)){
        res.send(fs.readFileSync(`game_data/timeline_${matchId}.json`)); 
      }else{
        const response = await inst.get(`/lol/match/v5/matches/${matchId}/timeline`)
        fs.writeFileSync(`game_data/timeline_${matchId}.json`, JSON.stringify(response.data), {flag: "w"})
        res.send(response.data);
      }
      
    } catch (error) {
      console.log(error)
      res.status(404).send("requested game couldn't be found");
    }
  });

  app.get('/getGameSummary', async (req, res) => { 
    let matchId = req.headers['matchid'];
    console.log(matchId)

    try {
      if (fs.existsSync(`game_data/overview_${matchId}.json`)){
        const response = fs.readFileSync(`game_data/overview_${matchId}.json`)
        res.send(response);
        console.log('sending chached data')
        return
      }
      const response = await inst.get(`/lol/match/v5/matches/${matchId}`)
      fs.writeFileSync(`game_data/overview_${matchId}.json`, JSON.stringify(response.data), {flag: "w"})
      res.send(response.data);
      
    } catch (error) {
      console.log(error)
      res.status(404).send("requested game couldn't be found");
    }

  });

  app.get('/getWinrate', async (req, res) => { 
    if((typeof req.headers['team1']) != 'string') return;
    if((typeof req.headers['team2']) != 'string') return;
    if((typeof req.headers['game']) != 'string') return;

    console.log(req.headers['team1'])
    console.log(req.headers['team2'])
    console.log(req.headers['game'])
    
    let team1: Team = JSON.parse(req.headers['team1'])
    let team2: Team = JSON.parse(req.headers['team2'])
    let game: Game = JSON.parse(req.headers['game'])

    res.send(calcWinrate(team1, team2, game));
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
interface Team{
    firstblood: boolean
    winrate: number
}

interface Game{
    rank: string
}

function calcRankNumber(tier: string, rank: string){
  let rankNumber = 0
  switch (tier) {
      case 'IRON':
          rankNumber += 0 * 4
          break;
      case 'BRONZE':
          rankNumber += 1 * 4
          break;
      case 'SILVER':
          rankNumber += 2 * 4
          break;
      case 'GOLD':
          rankNumber += 3 * 4
          break;
      case 'PLATINUM':
          rankNumber += 4 * 4
          break;
      case 'EMERALD':
          rankNumber += 5 * 4
          break;
      case 'DIAMOND':
          rankNumber += 6 * 4
          break;
      case 'MASTER':
          rankNumber += 7 * 4
          break;
      case 'GRANDMASTER':
          rankNumber += 8 * 4
          break;
      case 'CHALLENGER':
          rankNumber += 9 * 4
          break;
      default:
          break;
  }

  switch (rank) {
      case 'I':
          rankNumber += 0
          break;
      case 'II':
          rankNumber += 1
          break;
      case 'III':
          rankNumber += 2
          break;
      case 'IV':
          rankNumber += 3
          break;
      default:
          break;
  }
  return rankNumber
}
function getTier(rank: number){
  switch (Math.floor(rank / 4)) {
      case 0: return 'IRON'
      case 1: return 'BRONZE'
      case 2: return 'SILVER'
      case 3: return 'GOLD'
      case 4: return 'PLATINUM'
      case 5: return 'EMERALD'
      case 6: return 'DIAMOND'
      case 7: return 'MASTER'
      case 8: return 'GRANDMASTER'
      case 9: return 'CHALLENGER'
      default: return '?'
  }
}

function calcWinrate(team1: Team, team2: Team, game_data: Game){
  let data_folder = "backend/data/15.7"
  let WR = {games: 0, wins: 0, losses: 0, wr: 0}

  let content = fs.readdirSync(data_folder, { withFileTypes: true })
  const dirs = content.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

  for(let region of dirs){
    console.log(`reading: ${region} data!`)

    let files = fs.readdirSync(`${data_folder}/${region}/`, { withFileTypes: true })
    for(let file of files){
      let game = JSON.parse(fs.readFileSync(`${data_folder}/${region}/${file.name}`, {encoding: "utf-8"}))
      let avgRank = 0
      for(let player of game['info']['participants']){
          avgRank += calcRankNumber(player['tier'], player['rank'])
      } 

      let rank = getTier(avgRank / 10)

      if(game_data.rank != "any" && game_data.rank != rank) continue

      for(let team of game['info']['teams']){
        if(team1.firstblood || team2.firstblood){
          if(!team['objectives']['champion']['first']) continue
        }
        WR.games++
        if(team['win']) WR.wins++
        else WR.losses++
      }
    }
  }
  WR.wr = (WR.wins / WR.games) * 100
  return WR
}