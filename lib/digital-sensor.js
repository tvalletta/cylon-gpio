/*
 * Digital Sensor driver
 */

"use strict";

var namespace = require('node-namespace');

require('cylon-gpio');

namespace("Cylon.Drivers.GPIO", function() {
    this.DigitalSensor = (function(klass) {
        subclass(DigitalSensor, klass);

        function DigitalSensor(opts) {
            DigitalSensor.__super__.constructor.apply(this, arguments);

            var extraParams = opts.extraParams || {};

            this.pin = this.device.pin;
            this.upperLimit = extraParams.upperLimit || 256;
            this.lowerLimit = extraParams.lowerLimit || 0;
            this.digital_val = null;

        }

        DigitalSensor.prototype.commands = function() {
            return ['digitalRead'];
        };

        // Public: Starts the driver
        //
        // callback - params
        //
        // Returns null.
        DigitalSensor.prototype.start = function(callback) {
            var self = this;

            this.connection.digitalRead(this.pin, function(readVal) {
                self.digitalVal = readVal;
                self.device.emit('digitalRead', readVal);

                if (readVal >= self.upperLimit) {
                    return self.device.emit('upperLimit', readVal);
                } else if (readVal <= self.lowerLimit) {
                    return self.device.emit('lowerLimit', readVal);
                }
            });

            return DigitalSensor.__super__.start.apply(this, arguments);
        };

        return DigitalSensor;

    })(Cylon.Driver);
});
