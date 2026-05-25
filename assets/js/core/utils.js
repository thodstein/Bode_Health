const Utils = {
    sum: arr => arr.reduce((a, b) => a + b, 0),
    avg: arr => arr.length ? Utils.sum(arr) / arr.length : 0,
    clamp: (val, min, max) => Math.min(Math.max(val, min), max)
};
