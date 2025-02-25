import express from 'express'
import cors from 'cors'

import axios from 'axios'
import { readFileSync } from 'fs';


const riotToken = readFileSync('api_key.txt','utf8');
axios.defaults.baseURL = 'https://europe.api.riotgames.com';
axios.defaults.headers.common['X-Riot-Token'] = riotToken;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const app = express();
const port = 3000;
const allowed = []
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
      const response = await axios.get(`/riot/account/v1/accounts/by-riot-id/${gameName}/${tag}`)
      res.send(response.data);
      
    } catch (error) {
      res.status(404).send("requested account couldn't be found");
    }

  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });