sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (BaseController, MessageBox, MessageToast, Fragment, JSONModel) {
    "use strict";

    return BaseController.extend("com.sap.eventportal.controller.EventDetail", {

        onInit: function() {
            const oRouter = this.getRouter();
            oRouter.getRoute("eventDetail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function(oEvent) {
            const sEventId = oEvent.getParameter("arguments").eventId;
            const sPath = `/Events(${sEventId})`;
            
            this.getView().bindElement({
                path: sPath,
                parameters: {
                    $expand: "registrations,questions"
                },
                events: {
                    dataReceived: this._onDataReceived.bind(this)
                }
            });
        },

        _onDataReceived: function(oEvent) {
            const oData = oEvent.getParameter("data");
            if (!oData) return;
            
            // Calculate available seats
            const registrationCount = oData.registrations?.length || 0;
            const availableSeats = oData.capacity - registrationCount;
            
            // Check if current user is registered (hardcoded for MVP)
            const currentEmployeeId = "EMP001";
            const isRegistered = oData.registrations?.some(
                reg => reg.employeeID === currentEmployeeId && !reg.isCancelled
            ) || false;
            
            // Set additional properties
            const oModel = this.getView().getModel();
            const oContext = this.getView().getBindingContext();
            if (oContext) {
                oModel.setProperty(oContext.getPath() + "/availableSeats", availableSeats);
                oModel.setProperty(oContext.getPath() + "/isRegistered", isRegistered);
            }
        },

        onRegister: function() {
            if (!this._pRegistrationDialog) {
                this._pRegistrationDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: "com.sap.eventportal.view.fragment.RegistrationDialog",
                    controller: this
                }).then(function(oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            this._pRegistrationDialog.then(function(oDialog) {
                this._loadEmployeeData();
                this._loadEventQuestions();
                oDialog.open();
            }.bind(this));
        },

        _loadEmployeeData: function() {
            // Hardcoded employee for MVP
            const oViewModel = this.getView().getModel("registrationData") || new JSONModel();
            oViewModel.setProperty("/employee", {
                employeeID: "EMP001",
                name: "Sarah Johnson",
                email: "sarah.johnson@company.com",
                department: "Marketing"
            });
            this.getView().setModel(oViewModel, "registrationData");
        },

        _loadEventQuestions: function() {
            const oContext = this.getView().getBindingContext();
            if (!oContext) return;
            
            const oData = oContext.getObject();
            const aQuestions = oData.questions || [];
            
            const oViewModel = this.getView().getModel("registrationData") || new JSONModel();
            oViewModel.setProperty("/questions", aQuestions);
            oViewModel.setProperty("/answers", {});
            this.getView().setModel(oViewModel, "registrationData");
        },

        onConfirmRegistration: function() {
            const oModel = this.getView().getModel();
            const oContext = this.getView().getBindingContext();
            const oEvent = oContext.getObject();
            
            const oRegistration = {
                event_ID: oEvent.ID,
                employeeID: "EMP001",
                employeeName: "Sarah Johnson",
                employeeEmail: "sarah.johnson@company.com",
                employeeDepartment: "Marketing",
                status: "Registered",
                isCancelled: false
            };
            
            oModel.create("/Registrations", oRegistration, {
                success: () => {
                    MessageToast.show("Successfully registered for event!");
                    this.onCloseRegistrationDialog();
                    this.getView().getElementBinding().refresh();
                },
                error: (oError) => {
                    const sMessage = JSON.parse(oError.responseText)?.error?.message || "Registration failed";
                    MessageBox.error(sMessage);
                }
            });
        },

        onCloseRegistrationDialog: function() {
            this._pRegistrationDialog.then(function(oDialog) {
                oDialog.close();
            });
        },

        onCancelRegistration: function() {
            const oModel = this.getView().getModel();
            const oContext = this.getView().getBindingContext();
            const oEvent = oContext.getObject();
            
            MessageBox.confirm("Are you sure you want to cancel your registration?", {
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        // Find user's registration
                        const userRegistration = oEvent.registrations?.find(
                            reg => reg.employeeID === "EMP001" && !reg.isCancelled
                        );
                        
                        if (userRegistration) {
                            oModel.update(`/Registrations(${userRegistration.ID})`, {
                                isCancelled: true
                            }, {
                                success: () => {
                                    MessageToast.show("Registration cancelled");
                                    this.getView().getElementBinding().refresh();
                                },
                                error: () => {
                                    MessageBox.error("Failed to cancel registration");
                                }
                            });
                        }
                    }
                }
            });
        },

        onDownloadCalendar: function() {
            const oContext = this.getView().getBindingContext();
            const oEvent = oContext.getObject();
            
            // Call backend action to generate iCal file
            const oModel = this.getView().getModel();
            oModel.callFunction("/downloadCalendar", {
                method: "POST",
                urlParameters: {
                    eventID: oEvent.ID,
                    registrationID: ""
                },
                success: (oData) => {
                    // Create download link
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

        onNavBack: function() {
            this.getRouter().navTo("main");
        },

        onNavToEvents: function() {
            this.getRouter().navTo("main");
        },

        onNavToMyRegistrations: function() {
            this.getRouter().navTo("myRegistrations");
        },

        onNavToOrganizer: function() {
            this.getRouter().navTo("organizerDashboard");
        }
    });
});
