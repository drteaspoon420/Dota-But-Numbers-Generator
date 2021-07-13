let rn = (current) => {
    let i = 1;
    while (current != (current % i)) {
        i = i * 10;
    }
    if (i == 1) {
        return Math.floor(Math.random() * 100) * 0.01
    } else {
        return Math.floor(Math.random() * i * 0.1 + (i * 0.1))
    }
}

function fixNumber(n) {
    if (n % 1 > 0) {
        return n.toFixed(1)
    } else {
        return n.toFixed(0)
    }
}

const times = function (x)
{
    return (current, scaling, level, key) => {
        return current * x;
    };
}

const f_one = _ => 1;
const f_zero = _ => 0;

// Keeps the input value unchanged
const identity = x => x;

// Does nothing
const noop = _ => {};

module.exports = { identity, noop, rn, fixNumber, times, f_one, f_zero, };
