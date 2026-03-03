namespace com.sap.eventregistration;

using { cuid, managed } from '@sap/cds/common';

entity Events : cuid, managed {
  title           : String(200) not null;
  description     : String(2000);
  startDateTime   : DateTime not null;
  endDateTime     : DateTime not null;
  location        : String(200) not null;
  capacity        : Integer not null;
  category        : String(50) not null;
  organizerID     : String(50) not null;
  organizerName   : String(200);
  organizerEmail  : String(200);
  isCancelled     : Boolean default false;
  
  // Associations
  registrations   : Composition of many Registrations on registrations.event = $self;
  questions       : Composition of many EventQuestions on questions.event = $self;
}

entity Registrations : cuid, managed {
  event            : Association to Events not null;
  employeeID       : String(50) not null;
  employeeName     : String(200);
  employeeEmail    : String(200);
  employeeDepartment : String(200);
  registrationDate : DateTime default $now;
  status           : String(20) default 'Registered';
  isCancelled      : Boolean default false;
  
  // Associations
  answers          : Composition of many RegistrationAnswers on answers.registration = $self;
}

entity EventQuestions : cuid {
  event           : Association to Events not null;
  questionText    : String(500) not null;
  questionType    : String(50) not null; // Text, SingleChoice, MultipleChoice
  isRequired      : Boolean default false;
  choiceOptions   : String(1000); // JSON array for choice options
}

entity RegistrationAnswers : cuid {
  registration    : Association to Registrations not null;
  question        : Association to EventQuestions not null;
  answerText      : String(1000);
}
