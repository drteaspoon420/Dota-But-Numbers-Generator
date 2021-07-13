const path = require('path');
const { processFile } = require('./shared/processing');

const settings = require('../settings').abilities;

const getUpdatedAbilities = () =>
{
    return processFile(
        path.join(__filename, '../../input/npc_abilities.txt'), 
        'DOTAAbilities', 
        settings.dataTransformationFunction,
        settings.shouldProcessKey,
        settings.shouldProcessField,
        settings.additionalTransformation, 
        settings.scalingFunction,
        '',
        settings.extrapolateLevel || 0,
    );
}


module.exports = { getUpdatedAbilities, };
