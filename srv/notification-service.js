// Notification service stubs for email sending
// In production, this would integrate with SAP BTP Destination Service

function sendConfirmationEmail(registration) {
  console.log('===== EMAIL NOTIFICATION =====');
  console.log('TO:', registration.employeeEmail);
  console.log('SUBJECT: Event Registration Confirmation');
  console.log('BODY: Thank you for registering for the event.');
  console.log('Registration ID:', registration.ID);
  console.log('Employee:', registration.employeeName);
  console.log('==============================');
}

function sendReminderEmail(registration, event) {
  console.log('===== EMAIL NOTIFICATION =====');
  console.log('TO:', registration.employeeEmail);
  console.log('SUBJECT: Event Reminder - Tomorrow');
  console.log('BODY: Reminder: You are registered for', event.title);
  console.log('Date:', new Date(event.startDateTime).toLocaleString());
  console.log('Location:', event.location);
  console.log('==============================');
}

function sendCapacityNotification(event) {
  console.log('===== EMAIL NOTIFICATION =====');
  console.log('TO:', event.organizerEmail);
  console.log('SUBJECT: Event Full - ' + event.title);
  console.log('BODY: Your event has reached full capacity.');
  console.log('Total Registrations:', event.capacity);
  console.log('==============================');
}

function sendCancellationEmail(registration) {
  console.log('===== EMAIL NOTIFICATION =====');
  console.log('TO:', registration.employeeEmail);
  console.log('SUBJECT: Event Registration Cancelled');
  console.log('BODY: Your registration has been cancelled.');
  console.log('Registration ID:', registration.ID);
  console.log('==============================');
}

module.exports = {
  sendConfirmationEmail,
  sendReminderEmail,
  sendCapacityNotification,
  sendCancellationEmail
};
