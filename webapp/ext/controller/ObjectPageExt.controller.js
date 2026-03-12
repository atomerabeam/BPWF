sap.ui.define([
    "sap/fe/core/controllerextensions/ControllerExtension"
], function (ControllerExtension) {
    "use strict";

    console.log("Minimal extension loaded");

    return ControllerExtension.extend("bpwf.ext.controller.ObjectPageExt", {
        // Mark this as an override of the Object Page controller
        override: {
            onAfterRendering: function () {
                // Access the Save button by its stable ID
                debugger;
                const oSaveBtn = this.base.getView().byId("fe::FooterBar::StandardAction::Save");
                if (oSaveBtn) {
                    oSaveBtn.setText("Submit");
                    console.log("Save button text changed to 'Submit'");
                } else {
                    console.warn("Save button not found");
                }
            }
        }
    });
});
