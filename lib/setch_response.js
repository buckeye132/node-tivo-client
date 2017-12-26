var debug = require('debug')('node-tivo-client:SetChResponse');

function SetChResponse(data) {
	this.reason = '';
	this.channel = 0;
	this.subchannel = 0;

	parts = data.split(' ');
	if (parts[0] === 'CH_STATUS') {
		if (parts.length === 3) {
			this.channel = parseInt(parts[1]);
			this.reason = parts[2];
		} 
		if (parts.length === 4) {
			this.channel = parseInt(parts[1]);
			this.reason = parts[3];
			this.subchannel = parseInt(parts[2]);
		}
	} else if (parts[0] === 'CH_FAILED') {
		this.err = 'SETCH Failed';
		if (parts.length > 0) {
			this.reason = parts[1];
		}
	} else {
		debug("Unrecognized SetCh response: %s", data);
		this.err = 'Unrecognized SETCH Response: ' + data;
	}
}

SetChResponse.prototype.getError = function() {
	return this.err;
};

SetChResponse.prototype.getReason = function() {
	return this.reason;
};

SetChResponse.prototype.getChannel = function() {
	return this.channel;
};

SetChResponse.prototype.getSubChannel = function() {
	return this.subchannel;
};

exports.SetChResponse = SetChResponse;