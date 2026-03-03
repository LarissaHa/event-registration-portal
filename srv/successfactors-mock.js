const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
  const { Employees } = this.entities;

  // Mock employee data
  const mockEmployees = [
    {
      ID: '1',
      employeeID: 'EMP001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@company.com',
      department: 'Marketing',
      isOrganizer: false
    },
    {
      ID: '2',
      employeeID: 'EMP002',
      firstName: 'Marcus',
      lastName: 'Williams',
      email: 'marcus.williams@company.com',
      department: 'Learning & Development',
      isOrganizer: true
    },
    {
      ID: '3',
      employeeID: 'EMP003',
      firstName: 'Jennifer',
      lastName: 'Chen',
      email: 'jennifer.chen@company.com',
      department: 'IT',
      isOrganizer: false
    },
    {
      ID: '4',
      employeeID: 'EMP004',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@company.com',
      department: 'Sales',
      isOrganizer: false
    },
    {
      ID: '5',
      employeeID: 'EMP005',
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'lisa.anderson@company.com',
      department: 'HR',
      isOrganizer: true
    },
    {
      ID: '6',
      employeeID: 'EMP006',
      firstName: 'David',
      lastName: 'Martinez',
      email: 'david.martinez@company.com',
      department: 'Finance',
      isOrganizer: false
    },
    {
      ID: '7',
      employeeID: 'EMP007',
      firstName: 'Emma',
      lastName: 'Taylor',
      email: 'emma.taylor@company.com',
      department: 'Operations',
      isOrganizer: false
    },
    {
      ID: '8',
      employeeID: 'EMP008',
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james.wilson@company.com',
      department: 'Engineering',
      isOrganizer: false
    },
    {
      ID: '9',
      employeeID: 'EMP009',
      firstName: 'Sophia',
      lastName: 'Garcia',
      email: 'sophia.garcia@company.com',
      department: 'Product Management',
      isOrganizer: false
    },
    {
      ID: '10',
      employeeID: 'EMP010',
      firstName: 'Daniel',
      lastName: 'Rodriguez',
      email: 'daniel.rodriguez@company.com',
      department: 'Customer Success',
      isOrganizer: false
    }
  ];

  // READ handler for Employees
  this.on('READ', Employees, async (req) => {
    // Return mock data
    return mockEmployees;
  });
});
