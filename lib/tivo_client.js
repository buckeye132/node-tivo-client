var debug = require('debug')('node-tivo-client:TivoClient');

var TcpClient = require('./tcp_client').TcpClient;
var SetChResponse = require('./setch_response').SetChResponse;
var TivoIrCode = require('./tivo_ir_code').TivoIrCode;

var TIVO_PORT = 31339;

function TivoClient(ip) {
	this.tcpClient = new TcpClient(ip, TIVO_PORT);
}

TivoClient.prototype.getCurrentChannel = function(callback) {
	var self = this;

	SendChannelCommandAndParseResult(self.tcpClient, ' ', callback);
};

TivoClient.prototype.setChannel = function(channel, subchannel, callback) {
	var self = this;

	var command = 'SETCH ' + channel;
	if (subchannel) {
		command += ' ' + subchannel;
	}
	command += '\r';

	SendChannelCommandAndParseResult(self.tcpClient, command, callback);
};

TivoClient.prototype.sendIrCode = function(irCode) {
	if (TivoIrCode.isDefined(irCode)) {
		this.tcpClient.send('IRCODE ' + irCode.key + '\r');
	} else {
		debug("Unrecognized IR code %o - ignoring...", irCode);
	}
};

/*
// Static Helpers
*/
function GetIRCommand(cmd) {
	return 'IRCODE ' + cmd + '\r';
}

function SendChannelCommandAndParseResult(client, command, callback) {
	client.sendAndGetResponse(command, function(rcv) {
		response = new SetChResponse(rcv);
		debug('Recieved channel response: %o', response);
		callback(
			response.getError(),
			response.getReason(),
			response.getChannel(),
			response.getSubChannel());
	});
}

exports.TivoClient = TivoClient;