const cds = require('@sap/cds');
const ExcelJS = require('exceljs');

async function exportParticipants(eventID, format) {
  const { Registrations, EventQuestions, RegistrationAnswers } = cds.entities('com.sap.eventregistration');
  
  // Get all registrations for the event
  const registrations = await SELECT.from(Registrations)
    .where({ event_ID: eventID, isCancelled: false });
  
  // Get custom questions for the event
  const questions = await SELECT.from(EventQuestions)
    .where({ event_ID: eventID });
  
  // Prepare data
  const data = [];
  
  for (const registration of registrations) {
    const row = {
      Name: registration.employeeName,
      Email: registration.employeeEmail,
      Department: registration.employeeDepartment,
      'Registration Date': new Date(registration.registrationDate).toLocaleDateString()
    };
    
    // Add custom question answers
    for (const question of questions) {
      const answer = await SELECT.one.from(RegistrationAnswers)
        .where({ 
          registration_ID: registration.ID, 
          question_ID: question.ID 
        });
      
      row[question.questionText] = answer ? answer.answerText : '';
    }
    
    data.push(row);
  }
  
  if (format === 'excel') {
    return await generateExcel(data);
  } else {
    return generateCSV(data);
  }
}

async function generateExcel(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Participants');
  
  if (data.length === 0) {
    worksheet.addRow(['No participants registered']);
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer.toString('base64');
  }
  
  // Add headers
  const headers = Object.keys(data[0]);
  worksheet.addRow(headers);
  
  // Style headers
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD3D3D3' }
  };
  
  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => row[header]);
    worksheet.addRow(values);
  });
  
  // Auto-fit columns
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
      const length = cell.value ? cell.value.toString().length : 10;
      if (length > maxLength) {
        maxLength = length;
      }
    });
    column.width = Math.min(maxLength + 2, 50);
  });
  
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer.toString('base64');
}

function generateCSV(data) {
  if (data.length === 0) {
    return 'No participants registered';
  }
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header] || '';
      // Escape commas and quotes
      return `"${value.toString().replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
}

module.exports = {
  exportParticipants
};
