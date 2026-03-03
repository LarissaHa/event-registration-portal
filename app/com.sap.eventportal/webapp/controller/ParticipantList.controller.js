sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, MessageBox, MessageToast, JSONModel, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("com.sap.eventportal.controller.ParticipantList", {

        onInit: function() {
            const oRouter = this.getRouter();
            oRouter.getRoute("participantList").attachPatternMatched(this._onObjectMatched, this);
            
            // Initialize statistics model
            const oStatsModel = new JSONModel({
                totalRegistered: 0,
                availableSeats: 0,
                registrationRate: 0
            });
            this.getView().setModel(oStatsModel, "statistics");
        },

        _onObjectMatched: function(oEvent) {
            this._sEventId = oEvent.getParameter("arguments").eventId;
            this._loadEventData();
            this._loadParticipants();
        },

        _loadEventData: function() {
            const oModel = this.getView().getModel();
            const sPath = `/Events(${this._sEventId})`;
            
            oModel.read(sPath, {
                urlParameters: {
                    $expand: "registrations"
                },
                success: (oData) => {
                    this._updateStatistics(oData);
                },
                error: () => {
                    MessageBox.error("Failed to load event data");
                }
            });
        },

        _loadParticipants: function() {
            const oTable = this.byId("participantsTable");
            const oBinding = oTable.getBinding("items");
            
            // Update filter to show only this event's participants
            const oFilter = new Filter({
                filters: [
                    new Filter("event_ID", FilterOperator.EQ, this._sEventId),
                    new Filter("isCancelled", FilterOperator.EQ, false)
                ],
                and: true
            });
            
            oBinding.filter(oFilter);
        },

        _updateStatistics: function(oEventData) {
            const totalRegistered = oEventData.registrations?.filter(r => !r.isCancelled).length || 0;
            const availableSeats = oEventData.capacity - totalRegistered;
            const registrationRate = oEventData.capacity > 0 
                ? Math.round((totalRegistered / oEventData.capacity) * 100) 
                : 0;
            
            const oStatsModel = this.getView().getModel("statistics");
            oStatsModel.setData({
                totalRegistered: totalRegistered,
                availableSeats: availableSeats,
                registrationRate: registrationRate
            });
        },

        onExportExcel: function() {
            const oModel = this.getView().getModel();
            
            oModel.callFunction("/exportToExcel", {
                method: "POST",
                urlParameters: {
                    eventID: this._sEventId
                },
                success: (oData) => {
                    // The backend returns base64 encoded Excel file
                    const base64Data = oData.exportToExcel;
                    
                    // Convert base64 to blob
                    const byteCharacters = atob(base64Data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { 
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                    });
                    
                    // Create download link
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `participants_${this._sEventId}.xlsx`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    
                    MessageToast.show("Excel file downloaded");
                },
                error: () => {
                    MessageBox.error("Failed to export to Excel");
                }
            });
        },

        onExportCSV: function() {
            const oModel = this.getView().getModel();
            
            oModel.callFunction("/exportToCSV", {
                method: "POST",
                urlParameters: {
                    eventID: this._sEventId
                },
                success: (oData) => {
                    const csvContent = oData.exportToCSV;
                    
                    // Create download link
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `participants_${this._sEventId}.csv`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    
                    MessageToast.show("CSV file downloaded");
                },
                error: () => {
                    MessageBox.error("Failed to export to CSV");
                }
            });
        },

        onNavBack: function() {
            this.getRouter().navTo("organizerDashboard");
        }
    });
});
