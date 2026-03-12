sap.ui.define(['sap/ui/core/mvc/ControllerExtension', 'sap/m/MessageToast'], function (ControllerExtension, MessageToast) {
	'use strict';

	return ControllerExtension.extend('bpwf.ext.controller.ObjectPageExtensionController', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf bpwf.ext.controller.ObjectPageExtensionController
			 */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			},
			editFlow: {
				onBeforeSave: async (mParameters) => {
					let oContext = mParameters.context;
					try {
						const sPath = "/odata/v4/doa/getApproverDetails(applicationID='FAD',costCenter='C1021-00',subObject='Grant',process='Non-Disposal',email='')";
						const oResponse = await fetch(sPath, { method: "GET", headers: { "Content-Type": "application/json" } });
						const oResult = await oResponse.json();
						if (!oResponse.ok) {
							return Promise.reject(oResult.message);
						}
						oContext.setProperty("Assignedto", oResult?.value?.length !== 0 ? oResult.value[0].EMPLOYEEEMAIL : "");
						return Promise.resolve(oResult);
					} catch (oError) {
						MessageToast.show(oError);
						return Promise.reject(oError);
					}

				}
			}

		}
	});
});
