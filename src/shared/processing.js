const valveKv = require('valve-kv');
const operations = require('./transformation-functions');
const filters = require('./filter-functions');

function processFile(
    fileName,
    dataKey,
    dataTransformationFunction,
    shouldProcessKey = filters.f_true,
    shouldProcessField = filters.f_true,
    additionalTransformation = operations.noop,
    scalingFunction = operations.f_zero,
    suffix = '',
    extrapolateToLevel = 0,
)
{
    let data = valveKv.deserializeFile(fileName)
    let overrideData = {
        [dataKey]: {}
    }
    for (const key in data[dataKey]) {
        if (Object.hasOwnProperty.call(data[dataKey], key)) {
            if (shouldProcessKey(key)) {
                const element = data[dataKey][key];
                let newData = {};
                newData = replace(
                    element, 
                    dataTransformationFunction, 
                    key, 
                    shouldProcessField,
                    scalingFunction, 
                    0,
                    element,
                    key,
                    extrapolateToLevel,
                );
                
                additionalTransformation(newData, key);
                overrideData[dataKey][key + suffix] = newData;
            }
        }
    }
    return overrideData;
}

let set = new Set();

function replace(
    content, 
    dataTransformationFunction, 
    parentKey, 
    shouldProcessField,
    scalingFunction, 
    depth,
    dataObject,
    dataKey,
    extrapolateToLevel = 0,
) 
{
    if(depth > 1)
    {
        set.add(parentKey);
    }
    if (typeof content !== 'object') {
        if (typeof content == 'string') {
            let originalValues = content.split(' ');
            let replacedValues = [];
            let ok = true;
            if (isNaN(Number(originalValues[0]))) {
                ok = false
            } else {
                for (let i = 0; i < originalValues.length; i++) {
                    originalValues[i] = Number(originalValues[i])
                }
                let scaling = scalingFunction(originalValues) || 0;
                for (let i = 0; i < Math.max(originalValues.length, originalValues.length > 1 ? extrapolateToLevel : 0); i++) {
                    replacedValues[i] = dataTransformationFunction(
                        (i < originalValues.length ? originalValues[i] : undefined), 
                        originalValues[0], 
                        scaling, 
                        i, 
                        parentKey,
                        dataObject,
                        dataKey,
                    );
                }
            }
            if (!ok)
                return content;
            else
                return replacedValues.join(' ');
        }
        return content;
    }
    let t = {}
    for (const key in content) {
        if (Object.hasOwnProperty.call(content, key)) {
            const element = content[key];
            if (shouldProcessField(key, depth)) {
                t[key] = replace(
                    element, 
                    dataTransformationFunction, 
                    key,
                    shouldProcessField, 
                    scalingFunction, 
                    depth + 1,
                    dataObject,
                    dataKey,
                    extrapolateToLevel,
                );
            }
        }
    }
    return t;
}

module.exports = { processFile, replace, };
