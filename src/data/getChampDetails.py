import json
import os
from glob import glob
from collections import defaultdict

directory = 'C:/Users/yoshu/Desktop/Info Vis/Riot-API-scraper/overview/15.7'
json_files = glob(os.path.join(directory, '**', 'overview_*.[jJ][sS][oO][nN]'), recursive=True)

class Champion:
    def __init__(self, name, id):
        self.name = name
        self.id = id
        self.counter = defaultdict(int)
        self.total_kills = defaultdict(int)
        self.average_kills = defaultdict(float)
        self.total_deaths = defaultdict(int)
        self.average_deaths = defaultdict(float)
        self.total_assists = defaultdict(int)
        self.average_assists = defaultdict(float)
        self.positions_played = defaultdict(lambda: defaultdict(int))
        self.average_positions = defaultdict(lambda: defaultdict(float))
        self.runes_usage = defaultdict(lambda: defaultdict(int))
        self.wins = defaultdict(int)
        self.losses = defaultdict(int)
        self.wins_times = defaultdict(list)
        self.losses_times = defaultdict(list)       
    
    
    def update_kills(self, value, rank):
        self.total_kills[rank] += value
        self.counter[rank] += 1
        self.average_kills[rank] = self.total_kills[rank] / self.counter[rank]
        self.total_kills["all"] += value
        self.counter["all"] += 1
        self.average_kills["all"] = self.total_kills["all"] / self.counter["all"]
        
    def update_deaths(self, value, rank):
        self.total_deaths[rank] += value
        self.average_deaths[rank] = self.total_deaths[rank] / self.counter[rank]
        self.total_deaths["all"] += value
        self.average_deaths["all"] = self.total_deaths["all"] / self.counter["all"]
        
    def update_assists(self, value, rank):
        self.total_assists[rank] += value
        self.average_assists[rank] = self.total_assists[rank] / self.counter[rank]
        self.total_assists["all"] += value
        self.average_assists["all"] = self.total_assists["all"] / self.counter["all"]
        
    def update_position(self, position, rank):
        self.positions_played[rank][position] += 1
        for pos, count in self.positions_played[rank].items():
            self.average_positions[rank][pos] = count / self.counter[rank]
        self.positions_played["all"][position] += 1
        for pos, count in self.positions_played["all"].items():
            self.average_positions["all"][pos] = count / self.counter["all"]
            
    def update_perks(self, perks, rank):
        runes_string = ""
        stat_perks = perks.get('statPerks', {})
        runes_string += str(stat_perks) + ", "
        styles = perks.get('styles', [])
        for style in styles:
            selections = style.get('selections', [])
            for selection in selections:
                perk = selection.get('perk', 0)
                runes_string += str(perk) + ", "
        # main_styles = perks.get('styles', [])[0]
        # sub_styles = perks.get('styles', [])[1]
        self.runes_usage[rank][runes_string] += 1
        self.runes_usage["all"][runes_string] += 1
        
    def update_win_time(self, time, rank):
        self.wins[rank] += 1
        self.wins_times[rank].append(time)
        self.wins["all"] += 1
        self.wins_times["all"].append(time)
    
    def update_loss_time(self, time, rank):
        self.losses[rank] += 1
        self.losses_times[rank].append(time)
        self.losses["all"] += 1
        self.losses_times["all"].append(time)

    def to_dict(self):
        # bucket win times into 1-minute intervals
        bucketed_wins = defaultdict(int)
        for time in self.wins_times["all"]:
            bucket = time // 150 * 2.5
            bucketed_wins[bucket] += 1
        # bucket loss times into 1-minute intervals
        bucketed_losses = defaultdict(int)
        for time in self.losses_times["all"]:
            bucket = time // 150 * 2.5
            bucketed_losses[bucket] += 1
        winrate_at_times = {}
        for time in bucketed_wins:
            winrate_at_times[time] = bucketed_wins[time] / (bucketed_wins[time] + bucketed_losses.get(time, 0))
        # for time in bucketed_losses:
        #     if time not in winrate_at_times:
        #         winrate_at_times[time] = 0
        
        return {
            'name': self.name,
            'id': self.id,
            'total_kills': dict(self.total_kills),
            'total_deaths': dict(self.total_deaths),
            'total_assists': dict(self.total_assists),
            'average_kills': dict(self.average_kills),
            'average_deaths': dict(self.average_deaths),
            'average_assists': dict(self.average_assists),
            'positions_played': dict(self.positions_played),
            'average_positions': dict(self.average_positions),
            'highest_runes_usage': dict(self.runes_usage),#sorted(self.runes_usage.items(), key=lambda x: x[1], reverse=True)[:3],
            'total_games': dict(self.counter),
            'wins': dict(self.wins),
            'losses': dict(self.losses),
            'winrate_at_times': winrate_at_times,
        }

    def __str__(self):
        return f"{self.name},\n\taverage_kda={self.average_kills:.2f}/{self.average_deaths:.2f}/{self.average_assists:.2f}\
\n\tpositions_played={self.average_positions}, total_games={self.counter}"

all_champions = {}

i = 0
for json_file in json_files:
    i += 1
    if i % 10000 == 0:
        print(f"Processing {json_file}")
    try:
        if os.path.getsize(json_file) == 0:
            #print(f"Skipping empty file: {json_file}")
            continue
        with open(json_file, 'r', encoding="utf-8") as f:
            data = json.load(f)
            if not data:
                continue
            time_length = data.get('info', {}).get('gameDuration', 0)
            first_team_won = bool(data.get('info', {}).get('teams', [])[0].get('win', 'False'))
            participants = data.get('info', {}).get('participants', [])
            j = 0
            for participant in participants:
                rank = participant.get('tier', 'Unranked') + participant.get('rank', '')
                champion_id = participant.get('championId')
                champion_name = participant.get('championName')
                if all_champions.get(champion_id) is None:
                    all_champions[champion_id] = Champion(champion_name, champion_id)
                all_champions[champion_id].update_kills(participant.get('kills', 0), rank)
                all_champions[champion_id].update_deaths(participant.get('deaths', 0), rank)
                all_champions[champion_id].update_assists(participant.get('assists', 0), rank)
                all_champions[champion_id].update_position(participant.get('individualPosition', 'Unknown'), rank)
                all_champions[champion_id].update_perks(participant.get('perks', {}), rank)
                if first_team_won and j < 5:
                    all_champions[champion_id].update_win_time(time_length, rank)
                elif not first_team_won and j >= 5:
                    all_champions[champion_id].update_win_time(time_length, rank)
                else:
                    all_champions[champion_id].update_loss_time(time_length, rank)
                j += 1
            #break
                    
    except json.JSONDecodeError as e:
        print(f"Invalid JSON in {json_file}: {e}")
    except Exception as e:
        print(f"Error reading {json_file}: {e}")

champ_data_list = []
for champion in all_champions.values():
    champ_data_list.append(champion.to_dict())
    #print(str(champion))

with open("C:/Users/yoshu/Desktop/Info Vis/info-vis/src/data/champDetails3.json", "w") as f:
    json.dump(champ_data_list, f, indent=4, sort_keys=True, ensure_ascii=False)

print(f"Total games processed: {i}")