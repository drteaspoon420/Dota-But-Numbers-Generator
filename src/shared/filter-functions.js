function wildcheck(key) {
    key = key.toUpperCase();
    for (const key in skip_wild) {
        if (Object.hasOwnProperty.call(skip_wild, key)) {
            const element = skip_wild[key].toUpperCase();
            if (key.includes(element)) return true;
        }
    }
    return false;
}

function whitelist(whitelist)
{
    return function(key)
    {
        return whitelist.includes(key);
    }
}

function blacklist(blacklist)
{
    return function(key)
    {
        return !blacklist.includes(key);
    }
}

function and(filterA, filterB)
{
    return function(key)
    {
        return filterA(key) && filterB(key);
    }
}

function or(filterA, filterB)
{
    return function(key)
    {
        return filterA(key) || filterB(key);
    }
}

function not(filter)
{
    return function(key)
    {
        return !filter(key);
    }
}

function depth(depth)
{
    return function(key, currentDepth)
    {
        return depth === currentDepth;
    }
}

let f_true = _ => true;
let f_false = _ => false;

module.exports = { wildcheck, whitelist, blacklist, and, or, not, depth, f_true, f_false, };
