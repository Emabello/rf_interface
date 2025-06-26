sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageBox"],
  (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("rfinterface.controller.firstView", {
      onInit: function () {},

      onScanSuccessOne: function (oEvent) {
        if (oEvent.getParameter("cancelled")) {
          MessageToast.show("Scan cancelled", { duration: 1000 });
        } else {
          if (
            oEvent.getParameter("text") !== undefined &&
            oEvent.getParameter("text") !== null
          ) {
            var oInput = this.byId("sampleBarcodeScannerResultTwo");
            if (oInput) {
              oInput.setValue(oEvent.mParameters.text);
            }
          } else {
            MessageToast.show("No QR code detected", { duration: 1000 });

            var oInput = this.byId("sampleBarcodeScannerResultTwo");
            if (oInput) {
              oInput.setValue(""); // Pulisce il campo
            }
          }
        }
      },

      onPress: function () {
        const oView = this.getView();
        const oModel = this.getView().getModel(); // modello OData
        const sBarcode = oView.byId("sampleBarcodeScannerResultTwo").getValue();

        var oEmptyModel = new sap.ui.model.json.JSONModel({
          Batch: "",
          Plant: "",
          Product: "",
          Productdescription: "",
          Productstandardid: "",
        });
        oView.setModel(oEmptyModel, "model");

        if (sBarcode) {
          oModel.callFunction("/ConvertToean", {
            method: "GET",
            urlParameters: {
              Plant: "0100", // oppure ottienilo dinamicamente
              barcode: sBarcode,
            },
            success: function (oData) {
              var oJSONModelHeader = new sap.ui.model.json.JSONModel({
                Batch: oData.ConvertToean.Batch,
                Plant: oData.ConvertToean.Plant,
                Product: oData.ConvertToean.Product,
                Productdescription: oData.ConvertToean.Productdescription,
                Productstandardid: oData.ConvertToean.Productstandardid,
              });

              oView.setModel(oJSONModelHeader, "model");

              // Rendi visibile il blocco Result
              //oView.byId("_IDGenGroupElement2").setVisible(true);
              if (oData.ConvertToean.Message) {
                MessageBox.error(oData.ConvertToean.Message);
              } else {
                MessageBox.success(
                  "Data load from " + oData.ConvertToean.Product + " material."
                );
              }
            },
            error: function (oError) {
              MessageBox.error("Error during data fetch");
            },
          });
        } else {
          MessageBox.error("Please enter a barcode");
        }
      },
    });
  }
);
