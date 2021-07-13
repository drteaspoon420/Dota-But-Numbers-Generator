var valveKv = require("valve-kv");
var fs = require('fs');
const { isArray } = require("util");

var abilities = valveKv.deserializeFile("npc_units.txt");
var over = {
    DOTAUnits: {}
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
    "Version",
    "npc_dota_units_base",
    "npc_dota_thinker",
    "npc_dota_companion",
    "npc_dota_loadout_generic"
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

for (const key in abilities.DOTAUnits) {
    if (Object.hasOwnProperty.call(abilities.DOTAUnits, key)) {
        if (!skip_keys.includes(key)) {
            const element = abilities.DOTAUnits[key];
            over.DOTAUnits[key] = {};
            over.DOTAUnits[key] = repl(element,kf);
        }
    }
}


fs.writeFile('npc_units_custom.txt', valveKv.serialize(over), function (err) {
    if (err) return console.log(err);
  });