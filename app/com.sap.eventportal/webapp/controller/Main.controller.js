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
            const oContext = oItem.getBindingContext();
            const sEventId = oContext.getProperty("ID");
            
            // Navigate to event detail page
            this.getRouter().navTo("eventDetail", {
                eventId: sEventId
            });
        },

        onNavToEvents: function() {
            // Already on events page
            MessageToast.show("Already on Events page");
        },

        onNavToMyRegistrations: function() {
            this.getRouter().navTo("myRegistrations");
        },

        onNavToOrganizer: function() {
            this.getRouter().navTo("organizerDashboard");
        }
    });
});
