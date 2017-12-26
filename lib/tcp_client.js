var debug = require('debug')('node-tivo-client:TcpClient');

var net = require('net');

function TcpClient(ip, port) {
	this.ip = ip;
	this.port = port;
} 

TcpClient.prototype.sendAndGetResponse = function(data, callback) {
	var self = this;

	var net_client = new net.Socket();
	net_client.setEncoding('utf8');
	
	net_client.connect(self.port, self.ip, function() {
		debug("Connected to Tivo, sending: %s", data);
		net_client.write(data);
	});

	net_client.on('data', function(rcvData) {
		debug("Response recieved from Tivo: %s", rcvData);
		net_client.destroy();
		if (callback) {
			callback(rcvData);
		}
	});
};

TcpClient.prototype.send = function(data) {
	this.sendAndGetResponse(data, null);
};

exports.TcpClient = TcpClient;