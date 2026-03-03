const cds = require('@sap/cds');

async function generateICalFile(eventID, registrationID) {
  const { Events } = cds.entities('com.sap.eventregistration');
  
  // Get event details
  const event = await SELECT.one.from(Events).where({ ID: eventID });
  
  if (!event) {
    throw new Error('Event not found');
  }
  
  // Format dates for iCal (YYYYMMDDTHHMMSSZ)
  const formatICalDate = (date) => {
    const d = new Date(date);
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };
  
  const startDate = formatICalDate(event.startDateTime);
  const endDate = formatICalDate(event.endDateTime);
  const now = formatICalDate(new Date());
  
  // Generate iCal content (RFC 5545 format)
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Event Registration Portal//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:event-${eventID}@eventregistration.company.com
DTSTAMP:${now}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location}
ORGANIZER;CN=${event.organizerName}:MAILTO:${event.organizerEmail}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
  
  return icsContent;
}

module.exports = {
  generateICalFile
};
