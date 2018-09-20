sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"alfaerp/ServiceLayerLogin/model/models",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("alfaerp.ServiceLayerLogin.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			this._logon();

		},

		_logon: function () {
			var oUser = new JSONModel();
			this.setModel(oUser, "user");
			oUser.attachRequestCompleted(this._onLogonSuccess, this);

			var oBody = JSON.stringify({
				"CompanyDB": "SBODEMOBR",
				"UserName": "manager",
				"Password": "manager"
			});

			oUser.loadData("/b1s/v1/Login", oBody, true, "POST", false, {
				"Content-Type": "application/json",
			});
			
		},

		_onLogonSuccess: function (oEvent) {
			var oUserModel = oEvent.getSource();
			var session = oUserModel.getProperty("/SessionId");
			var sPath = "/alfaerp/util/serviceLayer.xsjs?cmd=Get&actionUri=Banks&sessionID=" + session + "&username=B1SiteUser";
			var oDataModel = new JSONModel(sPath);
			this.setModel(oDataModel, "data");
			this.getRouter().initialize();
		}
	});
});