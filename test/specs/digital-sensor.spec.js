"use strict";
var digitalSensor = source("digital-sensor");

describe("Cylon.Drivers.GPIO.DigitalSensor", function() {
  var driver = new Cylon.Drivers.GPIO.DigitalSensor({
    name: 'sensor',
    device: {
      connection: 'connect',
      pin: 13
    }
  });

  it("needs tests");
});
