const loglevel = require('loglevel');
const loglevelPrefix = require('loglevel-plugin-prefix');

loglevelPrefix.reg(loglevel);

if (process.env.DEBUG) {
    loglevel.setLevel(loglevel.levels.DEBUG);
}

loglevelPrefix.apply(loglevel, {
    format(level, name, timestamp) {
        return `${`[${timestamp}]`} ${level.toUpperCase()}:`;
    },
});

Object.assign(module.exports, {...loglevel});