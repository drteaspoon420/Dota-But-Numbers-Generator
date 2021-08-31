const path = require('path');
const valveKv = require('valve-kv');
const fs = require('fs');
const merge = require('lodash.merge');

const settings = require('../settings');

const { getUpdatedAbilities } = require('./abilities');
const { getUpdatedItems } = require('./items');
const { getUpdatedHeroes } = require('./heroes');
const { getUpdatedUnits } = require('./units');

let command = 'generate';

if(process.argv.length > 2)
{
    command = process.argv[2];
}

switch(command)
{
    case 'name':
    {
        console.log(settings.name);
        break;
    }
    case 'target-directory':
    {
        console.log(settings.targetDirectory);
        break;
    }
    case 'dota-path':
    {
        console.log(settings.dotaPath);
        break;
    }
    case 'generate':
    {
        let outputPath = path.join(__filename, '../../output');
        fs.readdirSync(outputPath)
            .forEach(x => 
                {
                    fs.unlinkSync(path.join(outputPath, x));
                });
        

        if(settings.generate.items || settings.generate.abilities)
        {
            fs.writeFile(
                path.join(__filename, '../../output/npc_abilities_override.txt'), 
                valveKv.serialize(
                    merge(
                        settings.generate.abilities ? getUpdatedAbilities() : {}, 
                        settings.generate.items ? getUpdatedItems() : {},
                    )
                ), 
                function (err) {
                    if (err) return console.log(err);
                }
            );
        }
        
        if(settings.generate.heroes)
        {
            fs.writeFile(
                path.join(__filename, '../../output/npc_heroes_custom.txt'), 
                valveKv.serialize(
                    getUpdatedHeroes()
                ), 
                function (err) {
                    if (err) return console.log(err);
                }
            );   
        }
        
        if(settings.generate.units)
        {
            fs.writeFile(
                path.join(__filename, '../../output/npc_units_custom.txt'), 
                valveKv.serialize(
                    getUpdatedUnits()
                ), 
                function (err) {
                    if (err) return console.log(err);
                }
            );   
        }
        
        break;
    }
}
