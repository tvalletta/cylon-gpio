/*
 * Cylon button driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var namespace = require('node-namespace');

require('./cylon-gpio');

namespace("Cylon.Drivers.GPIO", function() {
  this.MakeyButton = (function(klass) {
    subclass(MakeyButton, klass);

    function MakeyButton(opts) {
      MakeyButton.__super__.constructor.apply(this, arguments);

      this.pin = this.device.pin;
      this.isPressed = false;
      this.data = [];
    }

    MakeyButton.prototype.commands = function() {
      return ['isPressed'];
    };

    // Public: Starts the driver
    //
    // callback - params
    //
    // Returns null.
    MakeyButton.prototype.start = function(callback) {
      var self = this;

      this.connection.digitalRead(this.pin, function(data) {
        self.data.push(data);
        return self.data.shift;
      });

      every(100, function() {
        if (self.averageData() > 0.5 && !self.isPressed) {
          self.isPressed = true;
          self.device.emit('push');
        } else if (self.averageData() <= 0.5 && self.isPressed) {
          self.isPressed = false;
          self.device.emit('release');
        }
      });

      return MakeyButton.__super__.start.apply(this, arguments);
    };

    MakeyButton.prototype.averageData = function() {
      var result = 0;

      if (this.data.length > 0) {
        this.data.forEach(function(n) { result += n; });
        result = result / this.data.length;
      }

      return result;
    };

    return MakeyButton;

  })(Cylon.Driver);
});

module.exports = Cylon.Drivers.GPIO.MakeyButton;
