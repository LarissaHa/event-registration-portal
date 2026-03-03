using { com.sap.eventregistration as db } from '../db/schema';

service EventService {
  entity Events as projection on db.Events actions {
    action cancelEvent() returns String;
  };
  
  entity Registrations as projection on db.Registrations actions {
    action registerForEvent(eventID: String) returns String;
  };
  
  entity EventQuestions as projection on db.EventQuestions;
  entity RegistrationAnswers as projection on db.RegistrationAnswers;
  
  // Custom actions for calendar and export
  action downloadCalendar(eventID: String, registrationID: String) returns String;
  action exportToExcel(eventID: String) returns String;
  action exportToCSV(eventID: String) returns String;
}
