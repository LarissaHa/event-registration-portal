using { cuid } from '@sap/cds/common';

namespace com.sap.successfactors.mock;

@cds.persistence.skip
entity Employees : cuid {
  employeeID    : String(50) not null;
  firstName     : String(100) not null;
  lastName      : String(100) not null;
  email         : String(200) not null;
  department    : String(200);
  isOrganizer   : Boolean default false;
}

service SuccessFactorsMockService {
  @readonly entity Employees as projection on mock.Employees;
}
