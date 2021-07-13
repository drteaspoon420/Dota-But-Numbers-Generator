const path = require('path');
const { processFile } = require('./shared/processing');

const settings = require('../settings').items;

const getUpdatedItems = () =>
{
    let processedData = processFile(
        path.join(__filename, '../../input/items.txt'), 
        'DOTAAbilities',
        settings.dataTransformationFunction,
        settings.shouldProcessKey,
        settings.shouldProcessField,
        settings.additionalTransformation, 
        settings.scalingFunction,
        '',
        settings.extrapolateLevel || 0,
    );
    // Manual fix for royal jelly. Do not change except you exactly know what to do. Changes > 2 will crash the game.
    processedData['DOTAAbilities']['item_royal_jelly']['ItemInitialCharges'] = "2"; 
    return processedData;
}

module.exports = { getUpdatedItems, };
