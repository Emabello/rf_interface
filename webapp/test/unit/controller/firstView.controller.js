/*global QUnit*/

sap.ui.define([
	"rfinterface/controller/firstView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("firstView Controller");

	QUnit.test("I should test the firstView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
