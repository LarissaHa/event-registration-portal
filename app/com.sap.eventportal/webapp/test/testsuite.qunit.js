sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: com.sap.eventportal",
		defaults: {
			page: "ui5://test-resources/com/sap/eventportal/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_horizon"
			},
			coverage: {
				only: "com/sap/eventportal/",
				never: "test-resources/com/sap/eventportal/"
			},
			loader: {
				paths: {
					"com/sap/eventportal": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for com.sap.eventportal"
			},
			"integration/opaTests": {
				title: "Integration tests for com.sap.eventportal"
			}
		}
	};
});
