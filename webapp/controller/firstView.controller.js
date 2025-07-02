sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageBox"],
  (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("rfinterface.controller.firstView", {
      onInit: function () {
        // Recupero la stringa con la chiave
        var sText = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle()
          .getText("Accept");

        // Prendo il bottone per id locale e cambio il testo
        this.byId("_IDGenButton1").setText(sText);
      },

      onScanSuccessOne: function (oEvent) {
        if (oEvent.getParameter("cancelled")) {
          // Recupero la stringa con la chiave
          var sText = this.getOwnerComponent()
            .getModel("i18n")
            .getResourceBundle()
            .getText("ScanCancelled");

          MessageToast.show(sText, { duration: 1000 });
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
            var sText = this.getOwnerComponent()
              .getModel("i18n")
              .getResourceBundle()
              .getText("NoBarcodeDetected");
            MessageToast.show(sText, { duration: 1000 });

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
        var that = this; // salva il riferimento al controller

        if (sBarcode) {
          oModel.callFunction("/ConvertToean", {
            method: "GET",
            urlParameters: {
              Plant: "0100", // oppure ottienilo dinamicamente
              barcode: sBarcode,
            },
            success: function (oData) {
              if (oData.ConvertToean.Message) {
                MessageBox.error(oData.ConvertToean.Message);
              } else {
                var oEmptyModel = new sap.ui.model.json.JSONModel({
                  Batch: "",
                  Plant: "",
                  Product: "",
                  Productdescription: "",
                  Productstandardid: "",
                });
                oView.setModel(oEmptyModel, "model");

                var oJSONModelHeader = new sap.ui.model.json.JSONModel({
                  Barcode: sBarcode,
                  EAN: oData.ConvertToean.Productstandardid,
                  Batch: oData.ConvertToean.Batch,
                  Product: oData.ConvertToean.Product,
                  Productdescription: oData.ConvertToean.Productdescription,
                });

                oView.setModel(oJSONModelHeader, "model");

                // Rendi visibile il blocco Result
                //oView.byId("_IDGenGroupElement2").setVisible(true);
                var sText_1 = that
                  .getOwnerComponent()
                  .getModel("i18n")
                  .getResourceBundle()
                  .getText("DataLoad");
                var sText_2 = that
                  .getOwnerComponent()
                  .getModel("i18n")
                  .getResourceBundle()
                  .getText("Batch");
                var sText_3 = that
                  .getOwnerComponent()
                  .getModel("i18n")
                  .getResourceBundle()
                  .getText("Present");

                MessageBox.success(
                  sText_1 +
                    "\n" +
                    sText_2 +
                    " : " +
                    oData.ConvertToean.Batch +
                    " " +
                    sText_3 +
                    " : " +
                    oData.ConvertToean.Product
                );
              }

              oView.byId("sampleBarcodeScannerResultTwo").setValue("");
            },
            error: function (oError) {
              var sText = that
                .getOwnerComponent()
                .getModel("i18n")
                .getResourceBundle()
                .getText("ErrorDuring");
              MessageBox.error(sText);
            },
          });
        } else {
          var sText = that
            .getOwnerComponent()
            .getModel("i18n")
            .getResourceBundle()
            .getText("PleaseEnter");
          MessageBox.error(sText);
        }
      },
    });
  }
);
