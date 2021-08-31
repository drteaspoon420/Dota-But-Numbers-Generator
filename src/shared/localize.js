const fs = require('fs');
const nreadlines = require('n-readlines');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf-8');

function init(dotaPath)
{
    console.log('Initializing localization');
    
    if(!fs.existsSync('./data'))
    {
        fs.mkdirSync('./data');
    }

    let map = new Map();

    if(fs.existsSync('./data/localization.json'))
    {
        map = new Map(Object.entries(JSON.parse(fs.readFileSync('./data/localization.json', 'utf-8'))));
    }
    else
    {
        let lineReader;
        let filePath;
        let line;

        filePath = dotaPath + '\\game\\dota\\pak01_235.vpk';
        console.log('Processing ' + filePath);
        lineReader = new nreadlines(filePath);
        while(line = lineReader.next())
        {
            line = decoder.write(line);
            if(line.indexOf('#npc_dota') < 0) continue;

            let keyEndIndex = line.indexOf('"', 1);
            let valueStartIndex = line.indexOf('"', keyEndIndex + 1);
            let valueEndIndex = line.indexOf('"', valueStartIndex + 1);
            let key = line.substring(2, keyEndIndex);
            let value = line.substring(valueStartIndex + 1, valueEndIndex);
            map.set(key, value);
        }

        let fileNames = fs.readdirSync(dotaPath + '\\game\\dota').filter(x => x.substr(0, 5) == 'pak01').sort((a, b) => a > b ? -1 : 1);
        
        for(filename of fileNames)
        {
            filePath = dotaPath + '\\game\\dota\\' + filename;
            console.log('Processing ' + filePath);
            lineReader = new nreadlines(filePath);
            while(line = lineReader.next())
            {
                line = decoder.write(line);
                if(line.indexOf('[english]') < 0) continue;

                let keyEndIndex = line.indexOf('"', 1);
                let valueStartIndex = line.indexOf('"', keyEndIndex + 1);
                let valueEndIndex = line.indexOf('"', valueStartIndex + 1);
                let key = line.substring(10, keyEndIndex);
                let value = line.substring(valueStartIndex + 1, valueEndIndex);
        
                if(!map.has(key)) map.set(key, value);
            }
        }


        const localizationTable = Object.fromEntries(map);
        fs.writeFileSync('./data/localization.json', JSON.stringify(localizationTable, null, 4) , 'utf-8');
    }


    return function(key)
    {
        let value = map.get(key);
        
        if(value) return value;

        throw `The key ${key} does not exist in the localization file.`;
    }
}

module.exports = init;