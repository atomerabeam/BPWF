sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "workflowuimodule/model/models",
    "sap/ui/model/json/JSONModel",
      "sap/m/MessageBox",
  ],
  function (UIComponent, Device, models,JSONModel,MessageBox) {
    "use strict";

    return UIComponent.extend(
      "workflowuimodule.Component",
      {
        metadata: {
          manifest: "json",
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        init: function () {
          // call the base component's init function
          UIComponent.prototype.init.apply(this, arguments);

          // enable routing
          this.getRouter().initialize();

          // set the device model
          this.setModel(models.createDeviceModel(), "device");

          this.setTaskModels();

          this.getInboxAPI().addAction(
            {
              action: "APPROVE",
              label: "Approve",
              type: "accept", // (Optional property) Define for positive appearance
            },
            function () {
              this.completeTask(true);
            },
            this
          );

          this.getInboxAPI().addAction(
            {
              action: "REJECT",
              label: "Reject",
              type: "reject", // (Optional property) Define for negative appearance
            },
            function () {
              this.completeTask(false);
            },
            this
          );
        },

        setTaskModels: function () {
          // set the task model
          var startupParameters = this.getComponentData().startupParameters;
          this.setModel(startupParameters.taskModel, "task");

          // set the task context model
          var taskContextModel = new sap.ui.model.json.JSONModel(
            this._getTaskInstancesBaseURL() + "/context"
          );
          this.setModel(taskContextModel, "context");
        },

        _getTaskInstancesBaseURL: function () {
          return (
            this._getWorkflowRuntimeBaseURL() +
            "/task-instances/" +
            this.getTaskInstanceID()
          );
        },

        _getWorkflowRuntimeBaseURL: function () {
          var appId = this.getManifestEntry("/sap.app/id");
          var appPath = appId.replaceAll(".", "/");
          var appModulePath = jQuery.sap.getModulePath(appPath);

          return appModulePath + "/bpmworkflowruntime/v1";
        },

        getTaskInstanceID: function () {
          return this.getModel("task").getData().InstanceID;
        },

        getInboxAPI: function () {
          var startupParameters = this.getComponentData().startupParameters;
          return startupParameters.inboxAPI;
        },

        completeTask: function (approvalStatus) {
          this.getModel("context").setProperty("/approved", approvalStatus);
          this._patchTaskInstance(approvalStatus);
          this._refreshTaskList();
        },

        async  _approveRequest(){
            var that = this;
        return await new Promise(async (resolve, reject) => {
          let oModel = this.getModel("ZBP_WF_SRV");
          var sServiceUrl = oModel.sServiceUrl;

          var data = this.getModel("context").getData();
          const sFilter = JSON.stringify({
            "GJAHR" : data?.Gjahr,
            "ACTION" : "Approve",
            "ZBTPRN" : data?.BTPRequestID,
            "REQUEST": "ONACTION"
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
            resolve(data);

          } catch (error) {
            console.error("Error occured on ONACTION:", error);
          }
        })
        },

        _patchTaskInstance: async function (approvalStatus) {
          if (approvalStatus){
        var result =   await  this._approveRequest();
          }


        if(result == 'Successfull'){
        const  context = this.getModel("context").getData();
          var data = {
            status: "COMPLETED",
            context: {...context, comment:'' },
            decision: approvalStatus ? 'approve' : 'reject' 
          };

          jQuery.ajax({
            url: this._getTaskInstancesBaseURL(),
            method: "PATCH",
            contentType: "application/json",
            async: false,
            data: JSON.stringify(data),
            headers: {
              "X-CSRF-Token": await this._fetchToken(),
            },
          });
        }else{

          MessageBox.error('Failed');
        }
        },

        _fetchToken:  function () {
          var fetchedToken;

          jQuery.ajax({
            url: this._getWorkflowRuntimeBaseURL() + "/xsrf-token",
            method: "GET",
            async: false,
            headers: {
              "X-CSRF-Token": "Fetch",
            },
            success(result, xhr, data) {
              fetchedToken = data.getResponseHeader("X-CSRF-Token");
            },
          });
          return fetchedToken;
        },

        
        _refreshTaskList: function () {
          this.getInboxAPI().updateTask("NA", this.getTaskInstanceID());
        },
      }
    );
  }
);
