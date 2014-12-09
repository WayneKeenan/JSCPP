//logger = require('tracer').colorConsole();
var CRuntime = require('./rt')
var rt = new CRuntime();
var Interpreter = require('./interpreter');
var interpreter = new Interpreter(rt);
var ast = require('./ast');
var inputbuffer = '';
var stdio = {
	drain: function() {
		return inputbuffer;
	},
	write: function(s) {
		process.stdout.write(s);
	}
};
require('./includes/iostream').load(rt, stdio);

module.exports = {
	run: function(code, input) {
		inputbuffer = input.toString();
		code = code.toString();
		var ret = ast.parse(code);
		interpreter.run(ret);
		ret = rt.getFunc('global', 'main', [])(rt, null, []).v;
		return ret;
	}
};