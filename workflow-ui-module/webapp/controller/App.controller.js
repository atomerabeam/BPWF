sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
  ],
  function (BaseController, JSONModel, Filter, FilterOperator, MessageBox, Fragment) {
    "use strict";

    return BaseController.extend("workflowuimodule.controller.App", {


      async onInit() {
        this.getUserInfo();
        // await  this.getBPDetails("50", "0000")
      },

      onAfterRendering: function () {
        console.log(window.location);
        if (window?.location?.hash.includes("TaskCollection")) {
          setTimeout(() => {
            var oContextData = this.getOwnerComponent().getModel("context").getData();
            this._oID = oContextData.BTPRequestID;
            this._oYear = oContextData.Gjahr;
            console.log("btprn-", this._oID);
            this.getBPDetails(this._oID, this._oYear);
          }, 1000);
        }
      },


      getBPDetails: async function (oId, oYear) {
        debugger;
        var that = this;
        return await new Promise(async (resolve, reject) => {
          let oModel = this.getOwnerComponent().getModel("ZBP_WF_SRV");
          var sServiceUrl = oModel.sServiceUrl;

          const sFilter = JSON.stringify({
            REQUEST: 'GETDETAILS',
            ZBTPRN: oId,
            GJAHR: oYear
          });

          var sUrl = sServiceUrl + "/EntitySet('" + encodeURIComponent(sFilter) + "')";



          try {
            const oResponse = await $.ajax({
              url: sUrl,
              method: "GET",
              headers: {
                "Accept": "application/json"
              }
            });
            var data = JSON.parse(oResponse?.d?.Output)
            console.log("Read success:", data);
            this.getView().setModel(new JSONModel(data[0]), "oBPDetailsModel");
            resolve("Done");

          } catch (error) {
            console.error("Error in getAssetDetails:", error);
          }
        })
      },
      //   try {
      //     oModel.read(sUrl, {
      //       success: function (oData, response) {

      //         var data = JSON.parse(oData.Output)
      //         console.log("Read success:", data);
      //         this.getView().setModel(new JSONModel(data[0]), "oBPDetailsModel");
      //         resolve("Done");
      //         this.getView().setBusy(false);
      //       }.bind(this),
      //       error: function (oError) {
      //         // this.byId("idPaymentWFList").setBusy(false);
      //         console.error("Read error:", oError);
      //       }.bind(this)
      //     });
      //   } catch (e) {
      //     console.log(e)
      //     resolve("failed")
      //   }
      // })


      // This function fetches the logged-in user's information
      getUserInfo: async function () {
        const url = this.getBaseURL() + "/user-api/currentUser";
        const oModel = this.getOwnerComponent().getModel("currentUser");
        const mock = {
          firstname: "Dummy",
          lastname: "User",
          email: "dummy.user@com",
          name: "dummy.user@com",
          displayName: "Dummy User (dummy.user@com)"
        };

        try {
          oModel.loadData(url);
          await oModel.dataLoaded();
          const data = oModel.getData();
          console.log("data fetched- ", data);
          if (!data || !data.email) {
            oModel.setData(mock);
            console.log("user info Local", oModel.getData());
          }

          console.log("user info After Deployment", oModel.getData());
        } catch (error) {
          oModel.setData(mock);
          console.log("Fallback to mock user due to error:", error);
        }
      },
      getBaseURL: function () {
        return sap.ui.require.toUrl("fixedassetsdisposalapproval/adw/wf/workflowuimodule");
      },

      formatCapitalizationDate: function (oValue) {
        if (!oValue) {
          return "";
        }

        let oDate;

        // Handle Date object
        if (oValue instanceof Date) {
          oDate = oValue;
        }
        // Handle "YYYY-MM-DD" string
        else if (typeof oValue === "string") {
          oDate = new Date(oValue);
        }
        // Handle timestamps or other formats
        else {
          oDate = new Date(oValue);
        }

        // Format date to DD.MM.YYYY
        let oDateFormat = DateFormat.getDateInstance({ pattern: "dd.MM.yyyy" });
        return oDateFormat.format(oDate);
      },



    });
  });
