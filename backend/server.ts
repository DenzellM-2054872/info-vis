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
      const response = await inst.get(`/lol/match/v5/matches/${matchId}/timeline`)
      fs.writeFileSync(`game_data/timeline_${matchId}.json`, JSON.stringify(response.data), {flag: "w"})
      res.send(response.data);
      
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


  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

