var valveKv = require("valve-kv");
var fs = require('fs');
const { isArray } = require("util");

var abilities = valveKv.deserializeFile("npc_heroes.txt");
var over = {
    DOTAHeroes: {}
}
var kf = (current,scaling,level) => {
    return current*(0.1+Math.random()*(10-0.1));
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

var whitelist = [
    "ModelScale",
    "AttackAcquisitionRange",
    "AttackRange",
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
                if (sl.length > 1) {
                    let scaling = (sl[1]) - sl[0]
                    rl[0] = rn(sl[0]);
                    for (let i = 1; i < sl.length; i++) {
                        rl[i] = f(rl[i-1],scaling,i);
                    }
                } else {
                    rl[0] = rn(sl[0]);
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
        const element = abilities.DOTAHeroes[key];
        over.DOTAHeroes[key + "_over"] = {};
        over.DOTAHeroes[key + "_over"] = repl(element,kf);
        over.DOTAHeroes[key + "_over"].override_hero = key;
        over.DOTAHeroes[key + "_over"].BoundsHullName = "DOTA_HULL_SIZE_SMALL";
        over.DOTAHeroes[key + "_over"].RingRadius = "23";
    }
}


fs.writeFile('npc_heroes_custom.txt', valveKv.serialize(over), function (err) {
    if (err) return console.log(err);
  });