import http, { get } from 'http';
import fetch from 'node-fetch';
import axios from 'axios'
import * as fs from 'fs';

let riotToken: string = fs.readFileSync('api_token.txt','utf8');

async function getUser(gameName: string, tag: string){
  const response = await axios.get(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tag}`, { headers: { "X-Riot-Token": `${riotToken}` } });
  return response.data;
}

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, async function() {
  console.log('Server running at http://'+ hostname + ':' + port + '/');

  const data = getUser("CinematiCarpet", "24fps")
  console.log(data["puuid"])
  console.log(data["gameName"])
  console.log(data["tagLine"])

});