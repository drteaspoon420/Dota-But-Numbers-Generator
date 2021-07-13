const path = require('path');
const { processFile } = require('./shared/processing');
const transformations = require('./shared/transformation-functions');

const settings = require('../settings').heroes;

const getUpdatedHeroes = () =>
{
    return processFile(
        path.join(__filename, '../../input/npc_heroes.txt'), 
        'DOTAHeroes',
        settings.dataTransformationFunction,
        settings.shouldProcessKey,
        settings.shouldProcessField,
        (obj, key) => {
            obj.override_hero = key
            settings.additionalTransformation(obj, key)
        }, 
        transformations.f_zero,
        '_over', 
    );
};

module.exports = { getUpdatedHeroes, };
