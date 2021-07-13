var valveKv = require("valve-kv");
var fs = require('fs');
const { isArray } = require("util");

var abilities = valveKv.deserializeFile("npc_heroes.txt");
var over = {
    DOTAHeroes: {}
}
var kf = (current,scaling,level) => {
    return (current*0.5).toFixed(2);
}

var rn = (current) => {
    let i = 1;
    while (current != (current % i)) {
        i = i*10;
    }
    if (i == 1) {
        return Math.floor(Math.random()*100)*0.01
    } else {
        return Math.floor(Math.random()*i*0.1+(i*0.1))
    }
}

var skip_keys = [
    "npc_dota_hero_base",
]

var skip_wild = [
    "radius",
    "range",
    "duration",
]

var whitelist = [
    // "VisionDaytimeRange",
   //  "VisionNighttimeRange",
     "StatusHealth",
     "StatusMana",
   //  "MovementSpeed",
   //  "BountyXP",
   //  "BountyGoldMin",
   //  "BountyGoldMax",
     "AttributeBaseStrength",
     "AttributeStrengthGain",
     "AttributeBaseIntelligence",
     "AttributeIntelligenceGain",
     "AttributeBaseAgility",
     "AttributeAgilityGain",
     "StatusHealthRegen",
     "StatusManaRegen",
   //  "FollowRange",
     "ProjectileSpeed",
     //  "BaseAttackSpeed",
     //  "MovementTurnRate",
     "AttackDamageMin",
     "AttackDamageMax",
     "ArmorPhysical",
     "MagicalResistance",
     "AttackDamageMin",
     "AttackDamageMax",
     //"AttackRate",
    // "AttackAnimationPoint",
   //  "AttackAcquisitionRange",
    // "AttackRange",
    // "AttackRangeBuffer"
   // "AttackRangeBuffer"
]

function repl(content,f) {
    if (typeof content !== 'object') {
        if (typeof content == 'string') {
            let sl = content.split(" ")
            let rl = []
            let ok = true
            if (isNaN(Number(sl[0]))) {
                ok = false
            } else {
                for (let i = 0; i < sl.length; i++) {
                    sl[i] = Number(sl[i])
                }
                for (let i = 0; i < sl.length; i++) {
                    rl[i] = f(sl[i],0,i);
                }
            }
            if (!ok)
                return content
            else
                return rl.join(" ")
        }
        return content
    }
    let t = {}
    for (const key in content) {
        if (Object.hasOwnProperty.call(content, key)) {
            const element = content[key];
            //console.log(element);
            if (whitelist.includes(key)) {
                t[key] = repl(element,f);
            }
        }
    }
    return t
}

for (const key in abilities.DOTAHeroes) {
    if (Object.hasOwnProperty.call(abilities.DOTAHeroes, key)) {
        if (!skip_keys.includes(key)) {
            const element = abilities.DOTAHeroes[key];
            over.DOTAHeroes[key + "_over"] = {};
            over.DOTAHeroes[key + "_over"] = repl(element,kf);
            over.DOTAHeroes[key + "_over"].override_hero = key;
        }
    }
}


fs.writeFile('npc_heroes_custom.txt', valveKv.serialize(over), function (err) {
    if (err) return console.log(err);
  });