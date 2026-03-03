sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, MessageBox, MessageToast) {
    "use strict";

    return BaseController.extend("com.sap.eventportal.controller.MyRegistrations", {

        onViewEventDetail: function(oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const sEventId = oContext.getProperty("event/ID");
            
            this.getRouter().navTo("eventDetail", {
                eventId: sEventId
            });
        },

        onDownloadCalendar: function(oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const oRegistration = oContext.getObject();
            const oEvent = oRegistration.event;
            
            const oModel = this.getView().getModel();
            oModel.callFunction("/downloadCalendar", {
                method: "POST",
                urlParameters: {
                    eventID: oEvent.ID,
                    registrationID: oRegistration.ID
                },
                success: (oData) => {
                    const icsContent = oData.downloadCalendar;
                    const blob = new Blob([icsContent], { type: 'text/calendar' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${oEvent.title}.ics`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    MessageToast.show("Calendar file downloaded");
                },
                error: () => {
                    MessageBox.error("Failed to generate calendar file");
                }
            });
        },

        onCancelRegistration: function(oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const oRegistration = oContext.getObject();
            
            MessageBox.confirm("Are you sure you want to cancel your registration?", {
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        const oModel = this.getView().getModel();
                        oModel.update(`/Registrations(${oRegistration.ID})`, {
                            isCancelled: true
                        }, {
                            success: () => {
                                MessageToast.show("Registration cancelled");
                                this.byId("registrationsTable").getBinding("items").refresh();
                            },
                            error: () => {
                                MessageBox.error("Failed to cancel registration");
                            }
                        });
                    }
                }
            });
        },

        onNavToEvents: function() {
            this.getRouter().navTo("main");
        },

        onNavToMyRegistrations: function() {
            // Already on page
            MessageToast.show("Already on My Registrations page");
        },

        onNavToOrganizer: function() {
            this.getRouter().navTo("organizerDashboard");
        }
    });
});
