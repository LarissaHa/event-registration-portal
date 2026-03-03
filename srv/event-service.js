const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
  const { Events, Registrations, EventQuestions, RegistrationAnswers } = this.entities;

  // Before CREATE Events - validate date and capacity
  this.before('CREATE', Events, async (req) => {
    const event = req.data;
    
    // Validate future date
    const now = new Date();
    const startDate = new Date(event.startDateTime);
    if (startDate <= now) {
      req.error(400, 'Event date must be in the future');
    }
    
    // Validate capacity
    if (event.capacity < 1) {
      req.error(400, 'Capacity must be at least 1');
    }
  });

  // Before UPDATE Events - validate date and capacity
  this.before('UPDATE', Events, async (req) => {
    const event = req.data;
    
    if (event.startDateTime) {
      const now = new Date();
      const startDate = new Date(event.startDateTime);
      if (startDate <= now) {
        req.error(400, 'Event date must be in the future');
      }
    }
    
    if (event.capacity !== undefined && event.capacity < 1) {
      req.error(400, 'Capacity must be at least 1');
    }
  });

  // After READ Events - add computed availableSeats field
  this.after('READ', Events, async (events) => {
    if (!events) return;
    
    const eventArray = Array.isArray(events) ? events : [events];
    
    for (const event of eventArray) {
      // Count registrations for this event
      const registrationCount = await SELECT.from(Registrations)
        .where({ event_ID: event.ID, isCancelled: false })
        .then(results => results.length);
      
      event.availableSeats = event.capacity - registrationCount;
    }
  });

  // Cancel event action
  this.on('cancelEvent', Events, async (req) => {
    const eventID = req.params[0].ID;
    
    await UPDATE(Events).set({ isCancelled: true }).where({ ID: eventID });
    
    return 'Event cancelled successfully';
  });

  // Before CREATE Registrations - validate event not full and no duplicate
  this.before('CREATE', Registrations, async (req) => {
    const registration = req.data;
    
    // Get event details
    const event = await SELECT.one.from(Events).where({ ID: registration.event_ID });
    
    if (!event) {
      req.error(404, 'Event not found');
    }
    
    if (event.isCancelled) {
      req.error(400, 'Cannot register for cancelled event');
    }
    
    // Check capacity
    const registrationCount = await SELECT.from(Registrations)
      .where({ event_ID: registration.event_ID, isCancelled: false })
      .then(results => results.length);
    
    if (registrationCount >= event.capacity) {
      req.error(400, 'Event is fully booked');
    }
    
    // Check for duplicate registration
    const existingRegistration = await SELECT.one.from(Registrations)
      .where({ 
        event_ID: registration.event_ID, 
        employeeID: registration.employeeID,
        isCancelled: false 
      });
    
    if (existingRegistration) {
      req.error(400, 'You are already registered for this event');
    }
    
    // Query SuccessFactors mock service for employee data
    try {
      const sfService = await cds.connect.to('SuccessFactorsMockService');
      const employees = await sfService.run(SELECT.from('com.sap.successfactors.mock.Employees'));
      const employee = employees.find(e => e.employeeID === registration.employeeID);
      
      if (employee) {
        registration.employeeName = `${employee.firstName} ${employee.lastName}`;
        registration.employeeEmail = employee.email;
        registration.employeeDepartment = employee.department;
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  });

  // After CREATE Registrations - send notification
  this.after('CREATE', Registrations, async (registration) => {
    const notificationService = require('./notification-service');
    notificationService.sendConfirmationEmail(registration);
  });

  // Before DELETE Registrations - mark as cancelled
  this.before('DELETE', Registrations, async (req) => {
    const registrationID = req.params[0].ID;
    
    // Instead of deleting, mark as cancelled
    await UPDATE(Registrations).set({ isCancelled: true }).where({ ID: registrationID });
    
    // Prevent actual deletion
    req.reject(200, 'Registration cancelled successfully');
  });

  // After DELETE Registrations - send notification
  this.after('DELETE', Registrations, async (registration) => {
    const notificationService = require('./notification-service');
    notificationService.sendCancellationEmail(registration);
  });

  // Register for event action
  this.on('registerForEvent', async (req) => {
    const { eventID } = req.data;
    
    // This would typically get employeeID from authenticated user
    // For now, using a mock employeeID
    const employeeID = 'EMP001';
    
    const registration = {
      event_ID: eventID,
      employeeID: employeeID,
      registrationDate: new Date().toISOString(),
      status: 'Registered',
      isCancelled: false
    };
    
    const result = await INSERT.into(Registrations).entries(registration);
    
    return 'Registration successful';
  });

  // Download calendar action
  this.on('downloadCalendar', async (req) => {
    const { eventID, registrationID } = req.data;
    const calendarService = require('./calendar-service');
    
    const icsContent = await calendarService.generateICalFile(eventID, registrationID);
    
    return icsContent;
  });

  // Export to Excel action
  this.on('exportToExcel', async (req) => {
    const { eventID } = req.data;
    const exportService = require('./export-service');
    
    const excelFile = await exportService.exportParticipants(eventID, 'excel');
    
    return excelFile;
  });

  // Export to CSV action
  this.on('exportToCSV', async (req) => {
    const { eventID } = req.data;
    const exportService = require('./export-service');
    
    const csvFile = await exportService.exportParticipants(eventID, 'csv');
    
    return csvFile;
  });
});
