sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (BaseController, MessageBox, MessageToast, Fragment, JSONModel) {
    "use strict";

    return BaseController.extend("com.sap.eventportal.controller.OrganizerDashboard", {

        onInit: function() {
            // Initialize event data model
            const oEventModel = new JSONModel({
                title: "",
                description: "",
                startDateTime: null,
                endDateTime: null,
                location: "",
                capacity: 20,
                category: "Training",
                questions: []
            });
            this.getView().setModel(oEventModel, "eventData");
        },

        onCreateEvent: function() {
            this._openEventDialog(null);
        },

        onEditEvent: function(oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            this._openEventDialog(oContext);
        },

        _openEventDialog: function(oContext) {
            if (!this._pEventDialog) {
                this._pEventDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: "com.sap.eventportal.view.fragment.EventDialog",
                    controller: this
                }).then(function(oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            this._pEventDialog.then(function(oDialog) {
                if (oContext) {
                    // Edit mode
                    const oData = oContext.getObject();
                    const oEventModel = this.getView().getModel("eventData");
                    oEventModel.setData({
                        ID: oData.ID,
                        title: oData.title,
                        description: oData.description,
                        startDateTime: new Date(oData.startDateTime),
                        endDateTime: new Date(oData.endDateTime),
                        location: oData.location,
                        capacity: oData.capacity,
                        category: oData.category,
                        questions: oData.questions || []
                    });
                    oDialog.setTitle("Edit Event");
                } else {
                    // Create mode
                    const oEventModel = this.getView().getModel("eventData");
                    oEventModel.setData({
                        title: "",
                        description: "",
                        startDateTime: null,
                        endDateTime: null,
                        location: "",
                        capacity: 20,
                        category: "Training",
                        questions: []
                    });
                    oDialog.setTitle("Create New Event");
                }
                oDialog.open();
            }.bind(this));
        },

        onSaveEvent: function() {
            const oEventModel = this.getView().getModel("eventData");
            const oData = oEventModel.getData();
            
            // Validation
            if (!oData.title || !oData.startDateTime || !oData.location || !oData.capacity) {
                MessageBox.error("Please fill all required fields");
                return;
            }
            
            if (new Date(oData.startDateTime) <= new Date()) {
                MessageBox.error("Event date must be in the future");
                return;
            }
            
            if (oData.capacity < 1) {
                MessageBox.error("Capacity must be at least 1");
                return;
            }
            
            const oModel = this.getView().getModel();
            const oEventData = {
                title: oData.title,
                description: oData.description,
                startDateTime: oData.startDateTime.toISOString(),
                endDateTime: oData.endDateTime ? oData.endDateTime.toISOString() : oData.startDateTime.toISOString(),
                location: oData.location,
                capacity: parseInt(oData.capacity),
                category: oData.category,
                organizerID: "EMP002",
                organizerName: "Marcus Williams",
                organizerEmail: "marcus.williams@company.com",
                isCancelled: false
            };
            
            if (oData.ID) {
                // Update existing event
                oModel.update(`/Events(${oData.ID})`, oEventData, {
                    success: () => {
                        MessageToast.show("Event updated successfully");
                        this.onCloseEventDialog();
                        this.byId("organizerEventsTable").getBinding("items").refresh();
                    },
                    error: (oError) => {
                        const sMessage = JSON.parse(oError.responseText)?.error?.message || "Failed to update event";
                        MessageBox.error(sMessage);
                    }
                });
            } else {
                // Create new event
                oModel.create("/Events", oEventData, {
                    success: () => {
                        MessageToast.show("Event created successfully");
                        this.onCloseEventDialog();
                        this.byId("organizerEventsTable").getBinding("items").refresh();
                    },
                    error: (oError) => {
                        const sMessage = JSON.parse(oError.responseText)?.error?.message || "Failed to create event";
                        MessageBox.error(sMessage);
                    }
                });
            }
        },

        onCloseEventDialog: function() {
            this._pEventDialog.then(function(oDialog) {
                oDialog.close();
            });
        },

        onAddQuestion: function() {
            const oEventModel = this.getView().getModel("eventData");
            const aQuestions = oEventModel.getProperty("/questions") || [];
            
            if (aQuestions.length >= 5) {
                MessageBox.warning("Maximum 5 questions allowed");
                return;
            }
            
            aQuestions.push({
                questionText: "",
                questionType: "Text",
                isRequired: false,
                choiceOptions: ""
            });
            
            oEventModel.setProperty("/questions", aQuestions);
        },

        onRemoveQuestion: function(oEvent) {
            const oSource = oEvent.getSource();
            const oContext = oSource.getBindingContext("eventData");
            const sPath = oContext.getPath();
            const iIndex = parseInt(sPath.split("/").pop());
            
            const oEventModel = this.getView().getModel("eventData");
            const aQuestions = oEventModel.getProperty("/questions");
            aQuestions.splice(iIndex, 1);
            oEventModel.setProperty("/questions", aQuestions);
        },

        onViewParticipants: function(oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const sEventId = oContext.getProperty("ID");
            
            this.getRouter().navTo("participantList", {
                eventId: sEventId
            });
        },

        onCancelEvent: function(oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const oEventData = oContext.getObject();
            
            MessageBox.confirm(`Are you sure you want to cancel the event "${oEventData.title}"?`, {
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        const oModel = this.getView().getModel();
                        oModel.callFunction("/cancelEvent", {
                            method: "POST",
                            urlParameters: {
                                ID: oEventData.ID
                            },
                            success: () => {
                                MessageToast.show("Event cancelled successfully");
                                this.byId("organizerEventsTable").getBinding("items").refresh();
                            },
                            error: () => {
                                MessageBox.error("Failed to cancel event");
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
            this.getRouter().navTo("myRegistrations");
        },

        onNavToOrganizer: function() {
            MessageToast.show("Already on Organizer Dashboard");
        }
    });
});
