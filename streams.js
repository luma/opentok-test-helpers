if (!TB.TestHelpers) TB.TestHelpers = {};
if (!TB.TestHelpers.Streams) TB.TestHelpers.Streams = {};

// Generate a single quality event for +stream+.
//
// @param [Stream] stream
//
// @param [Object] newValue
//		A valid Quality event object
//
// @example Simulate a quality event for a single stream
//
//	TB.TestHelpers.Streams.simulateQualityEvent(stream, {
//		micLevel: 1,
//		networkQuality: 'Acceptable',
//		AECEnabled: true,
//		readyH264: false
//	});
//
TB.TestHelpers.Streams.simulateQualityEvent = (function() {
	var oldValue;

	return function(stream, newValue) {
		var event = {
			type: 'streamPropertyChanged',
			stream: stream,
			changedProperty: 'quality',
			oldValue: oldValue,
			newValue: newValue
		};

		TB.log("TB.TestHelpers Simulating: network quality:" + newValue.networkQuality + ", mic level:" + newValue.micLevel.toString() + ", AECEnabled:" + newValue.AECEnabled + ", readyH264:" + newValue.readyH264);

		TS.session.dispatchEvent(event);
		oldValue = newValue;
	};
})();

// Generate quality events every +interval+ seconds for +stream+.
//
// @param [Stream] stream
//
// @param [Integer] interval
//		How often we should simulate quality events, setting this value too low could cause issues. Defaults to 3000 ms.
//
// @example Simulate quality events for all users in the TokShow backstage queue
//
//	TS.userCollection.fans.queued.each(function(u) {
//		TB.TestHelpers.Streams.simulateQualityEvents(u.attributes.stream);
//	});
//
//
// @example Simulate quality events for all artists
//
//	TS.userCollection.artists.each(function(u) {
//		TB.TestHelpers.Streams.simulateQualityEvents(u.attributes.stream);
//	});
//
TB.TestHelpers.Streams.simulateQualityEvents = function(stream, interval) {
	var micLevel = [-1, 0, 1],
		networkQuality = ['Poor', 'Acceptable', 'Good'],

		randomElement = function(collection) {
			var index = Math.floor(Math.random() * collection.length);
			return collection[index];
		},

		generateRandomQuality = function() {
			return {
				micLevel: randomElement(micLevel),
				networkQuality: randomElement(networkQuality),
				AECEnabled: Math.random() > 0.4,
				readyH264: Math.random() > 0.4
			};
		},

		runSimulation = function() {
			TB.TestHelpers.Streams.simulateQualityEvent(stream, generateRandomQuality());
		};

	setInterval(runSimulation, interval || 3000);
};
