const path = require('path');
const { processFile } = require('./shared/processing');
const operations = require('./shared/transformation-functions');
const filters = require('./shared/filter-functions');

const settings = require('../settings').units;

const getUpdatedUnits = () =>
{
    return processFile(
        path.join(__filename, '../../input/npc_units.txt'), 
        'DOTAUnits', 
        settings.dataTransformationFunction,
        settings.shouldProcessKey,
        settings.shouldProcessField,
        settings.additionalTransformation, 
    );
}

module.exports = { getUpdatedUnits, }
