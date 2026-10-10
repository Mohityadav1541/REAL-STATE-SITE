const EventEmitter = require('events');

class PlotEventEmitter extends EventEmitter {}

const plotEmitter = new PlotEventEmitter();

module.exports = plotEmitter;
