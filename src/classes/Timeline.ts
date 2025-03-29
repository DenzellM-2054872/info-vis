export default interface Timeline{
    "endOfGameResult": string,
    "frameInterval": number,
    "gameId": number,
    "frames":Frame[]
}

export interface Frame{
    "events": GameEvent[],
    "participantFrames": ParticipantFrames
}
export interface PauseEnd extends GameEvent{
    "realTimestamp": number,
}
export interface ItemPurchase extends GameEvent{
    "itemId": number
    "participantId": number,
}

export interface SkillLevelUp extends GameEvent{
    "levelUpType": string
    "participantId": number,
    "skillSlot": number,
}

export interface ItemUndo extends GameEvent{
    "afterId": number,
    "beforeId": number,
    "goldGain": number,
    "skillSlot": number,
    "participantId": number,
}

export interface ItemDestroyed extends GameEvent{
    "itemId": number,
    "participantId": number,
}

export interface SpecialKill extends GameEvent{
    "killType": string,
    "killerId": number,
    "position": Position,
}

export interface Kill extends GameEvent{
    "assistingParticipantIds": number[]
    "bounty": number,
    "killStreakLength": number,
    "killerId": number,
    "position": Position
    "shutdownBounty": number,
    "victimDamageDealt": Damage[]
    "victimDamageReceived": Damage[]
}

export interface GameEvent{
    "type": string,
    "timestamp": number
}

interface Damage{
    "basic": boolean,
    "magicDamage": number,
    "name": string,
    "participantId": number,
    "physicalDamage": number,
    "spellName": string,
    "spellSlot": number,
    "trueDamage": number,
    "type": string,
}

interface Position{
    "x": number,
    "y": number
}
interface ParticipantFrames{
    [id: string]: ParticipantFrame
}

interface ParticipantFrame{
    "championStats": ChampionStats
    "currentGold": number,
    "damageStats": DamageStats,
    "goldPerSecond": number,
    "jungleMinionsKilled": number,
    "level": number,
    "minionsKilled": number,
    "participantId": number,
    "position": Position,
    "timeEnemySpentControlled": number,
    "totalGold": number,
    "xp": number
}

interface ChampionStats{
    "abilityHaste": number,
    "abilityPower": number,
    "armor": number,
    "armorPen": number,
    "armorPenPercent": number,
    "attackDamage": number,
    "attackSpeed": number,
    "bonusArmorPenPercent": number,
    "bonusMagicPenPercent": number,
    "ccReduction": number,
    "cooldownReduction": number,
    "health": number,
    "healthMax": number,
    "healthRegen": number,
    "lifesteal": number,
    "magicPen": number,
    "magicPenPercent": number,
    "magicResist": number,
    "movementSpeed": number,
    "omnivamp": number,
    "physicalVamp": number,
    "power": number,
    "powerMax": number,
    "powerRegen": number,
    "spellVamp": number
}

interface DamageStats{
    "magicDamageDone": number,
    "magicDamageDoneToChampions": number,
    "magicDamageTaken": number,
    "physicalDamageDone": number,
    "physicalDamageDoneToChampions": number,
    "physicalDamageTaken": number,
    "totalDamageDone": number,
    "totalDamageDoneToChampions": number,
    "totalDamageTaken": number,
    "trueDamageDone": number,
    "trueDamageDoneToChampions": number,
    "trueDamageTaken": number
}

