sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, MessageBox, MessageToast, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("com.sap.eventportal.controller.Main", {

        onSearch: function(oEvent) {
            const sQuery = oEvent.getParameter("query");
            const oList = this.byId("eventList");
            const oBinding = oList.getBinding("items");
            
            const aFilters = [];
            if (sQuery) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("title", FilterOperator.Contains, sQuery),
                        new Filter("description", FilterOperator.Contains, sQuery)
                    ],
                    and: false
                }));
            }
            
            oBinding.filter(aFilters);
        },

        onFilterCategory: function(oEvent) {
            const sCategory = oEvent.getParameter("selectedItem")?.getKey();
            const oList = this.byId("eventList");
            const oBinding = oList.getBinding("items");
            
            const aFilters = [];
            if (sCategory) {
                aFilters.push(new Filter("category", FilterOperator.EQ, sCategory));
            }
            
            oBinding.filter(aFilters);
        },

        onFilterLocation: function(oEvent) {
            const sLocation = oEvent.getParameter("value");
            const oList = this.byId("eventList");
            const oBinding = oList.getBinding("items");
            
            const aFilters = [];
            if (sLocation) {
                aFilters.push(new Filter("location", FilterOperator.Contains, sLocation));
            }
            
            oBinding.filter(aFilters);
        },

        onEventSelect: function(oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const sEventId = oItem.data("eventId");
            
            // Navigate to event detail (for MVP, show in dialog)
            this._showEventDetail(sEventId);
        },

        _showEventDetail: function(sEventId) {
            const oModel = this.getView().getModel();
            const sPath = `/Events(${sEventId})`;
            
            oModel.read(sPath, {
                urlParameters: {
                    $expand: "registrations,questions"
                },
                success: (oData) => {
                    const availableSeats = oData.capacity - (oData.registrations?.length || 0);
                    const isFullyBooked = availableSeats <= 0;
                    
                    const sDetails = `
                        <strong>Title:</strong> ${oData.title}<br/>
                        <strong>Description:</strong> ${oData.description || 'N/A'}<br/>
                        <strong>Date:</strong> ${new Date(oData.startDateTime).toLocaleString()}<br/>
                        <strong>Location:</strong> ${oData.location}<br/>
                        <strong>Available Seats:</strong> ${availableSeats} / ${oData.capacity}<br/>
                        <strong>Organizer:</strong> ${oData.organizerName}
                    `;
                    
                    MessageBox.information(sDetails, {
                        title: "Event Details",
                        actions: isFullyBooked ? [MessageBox.Action.CLOSE] : [MessageBox.Action.CLOSE, "Register"],
                        onClose: (sAction) => {
                            if (sAction === "Register") {
                                this._registerForEvent(sEventId);
                            }
                        }
                    });
                },
                error: () => {
                    MessageBox.error("Failed to load event details");
                }
            });
        },

        _registerForEvent: function(sEventId) {
            const oModel = this.getView().getModel();
            
            // For MVP, using hardcoded employee
            const oRegistration = {
                event_ID: sEventId,
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
                    this.byId("eventList").getBinding("items").refresh();
                },
                error: (oError) => {
                    const sMessage = oError.responseText || "Registration failed";
                    MessageBox.error(sMessage);
                }
            });
        },

        onNavToEvents: function() {
            // Already on events page
            MessageToast.show("Already on Events page");
        },

        onNavToMyRegistrations: function() {
            MessageToast.show("My Registrations feature - Coming soon!");
        },

        onNavToOrganizer: function() {
            MessageToast.show("Organizer Dashboard feature - Coming soon!");
        }
    });
});
