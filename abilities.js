var valveKv = require("valve-kv");
var fs = require('fs');
const { isArray } = require("util");
var store = 5;
var abilities = valveKv.deserializeFile("npc_abilities.txt");
var over = {
    DOTAAbilities: {}
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
    "ability_base",
    "dota_base_ability",
    "default_attack",
    "attribute_bonus",
    "special_bonus_attributes",
    "ability_capture",
]

var skip_wild = [
    "radius",
  //  "range",
  //  "duration",
    "magic_resistance",
    "bonus_magical_armor",
    "bonus_magic_resist",
    "status_resistance",
    "bonus_spell_resist",
]

var blackList = [
    "Version",
    "ID",
    "OnCastbar",
    "OnLearnbar",
    "FightRecapLevel",
    "AbilitySharedCooldown",
    "AbilityModifierSupportValue",
    "AbilityModifierSupportBonus",
    "ItemCombinable",
    "ItemPermanent",
    "ItemStackable",
    "ItemRecipe",
    "ItemDroppable"	,
    "ItemPurchasable",
    "ItemSellable",
    "ItemRequiresCharges",
    "ItemKillable",
    "ItemDisassemblable",
    "ItemShareability",
    "ItemDeclaresPurchase",
    "ItemIsNeutralDrop",
    "AbilityBehavior",
    "AbilityUnitTargetTeam",
    "AbilityUnitTargetType",
    "SpellImmunityType",
    "MaxLevel",
    "AbilitySound",
    "HasShardUpgrade",
    "HasScepterUpgrade",
    "IsGrantedByShard",
    "IsGrantedByScepter",
    "AbilityCastAnimation",
    "AbilityType",
    "RequiresScepter",
    "RequiresShard",
    "ItemShopTags",
    "ItemBaseLevel",
    "ShouldBeSuggested",
    "IsObsolete",
    "IsShardUpgrade",
    "ItemContributesToNetWorthWhenDropped",
    "AllowedInBackpack",
    "IsTempestDoubleClonable",
    "AnimationIgnoresModelScale",
    "AbilityCastAnimation",
    "AnimationPlaybackRate",
    "RequiredLevel",
    "LevelsBetweenUpgrades",
    "BaseClass",
    "AbilityBehavior",
    "AbilityTextureName",
    "AbilityUnitTargetTeam",
    "AbilityUnitTargetType",
    "AbilityUnitTargetFlags",
    "AbilityUnitDamageType",
    "AbilityType",
    "ItemStockMax",
    "ItemStockTime",
    "ItemStockInitial",
    "ItemDisplayCharges",
    "ItemRequiresCharges",
    "ItemStackable",
    "ItemPermanent",
    "ItemCastOnPickup",
    "SpellDispellableType",
    "AbilityDraftUltScepterAbility",
    "AbilityDraftUltShardAbility",
    "ItemInitialCharges",
  //  "AbilityCooldown",
    "AbilityCastRange",
    //"AbilityManaCost",
   // "ItemCost",
]

function repl(key,content,f) {
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
                    if (!wildcheck(key)) {
                        rl[i] = f(sl[i],0,i);
                    } else {
                        rl[i] = sl[i];
                    }
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
            if (!blackList.includes(key)) {
                t[key] = repl(key,element,f);
            }
        }
    }
    return t
}

function wildcheck(str) {
    str = str.toUpperCase();
    for (const key in skip_wild) {
        if (Object.hasOwnProperty.call(skip_wild, key)) {
            const element = skip_wild[key].toUpperCase();
            if (str.includes(element)) return true;
        }
    }
    return false;
}

for (const key in abilities.DOTAAbilities) {
    if (Object.hasOwnProperty.call(abilities.DOTAAbilities, key)) {
        if (!skip_keys.includes(key)) {
            const element = abilities.DOTAAbilities[key];
            over.DOTAAbilities[key] = {};
            over.DOTAAbilities[key] = repl(key,element,kf);
        }
    }
}
var abilities = valveKv.deserializeFile("items.txt");
for (const key in abilities.DOTAAbilities) {
    if (Object.hasOwnProperty.call(abilities.DOTAAbilities, key)) {
        if (!skip_keys.includes(key)) {
            const element = abilities.DOTAAbilities[key];
            over.DOTAAbilities[key] = {};
            over.DOTAAbilities[key] = repl(key,element,kf);
        }
    }
}


fs.writeFile('npc_abilities_override.txt', valveKv.serialize(over), function (err) {
    if (err) return console.log(err);
  });