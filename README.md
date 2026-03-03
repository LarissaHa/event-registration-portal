# Event Registration Portal

A comprehensive event registration system built with SAP Cloud Application Programming Model (CAP) and SAPUI5.

## 🎯 Overview

The Event Registration Portal enables employees to discover and register for internal company events such as training sessions, team events, and workshops. The solution integrates with SAP SuccessFactors for employee data and provides automatic calendar integration.

## ✨ Key Features

### For All Employees
- 📋 Browse and search upcoming events
- 🔍 Filter events by category and location
- 📝 Quick registration with auto-populated employee data
- 📅 Download calendar files (iCal format)
- 👤 View and manage own registrations
- ❌ Cancel registrations

### For Event Organizers
- ➕ Create and edit events
- ❓ Add up to 5 custom registration questions
- 👥 View participant lists
- 📊 Export participant data (Excel/CSV)
- 📈 View registration statistics
- 🚫 Cancel events

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or 20.x
- npm 9.x or 10.x
- @sap/cds-dk (CAP CLI)

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd event-registration

# Install dependencies
npm install
cd app/com.sap.eventportal && npm install && cd ../..

# Start application
cds watch
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:4004/com.sap.eventportal/index.html
```

## 📚 Documentation

- **[README-MVP.md](README-MVP.md)** - Complete implementation details and testing guide
- **[FEATURES.md](FEATURES.md)** - Detailed feature documentation
- **[INSTALLATION.md](INSTALLATION.md)** - Step-by-step installation guide
- **[QUICK-START.md](QUICK-START.md)** - Get started in 3 steps
- **[GIT-SETUP.md](GIT-SETUP.md)** - Git repository setup guide

## 🏗️ Architecture

### Technology Stack
- **Backend**: SAP CAP with Node.js
- **Frontend**: SAPUI5 1.145.0
- **Database**: SQLite (development) / SAP HANA Cloud (production)
- **OData**: V4
- **Integration**: SAP SuccessFactors (mocked for development)

### Project Structure
```
event-registration/
├── app/                    # UI5 Frontend
│   └── com.sap.eventportal/
│       ├── webapp/
│       │   ├── controller/ # 5 Controllers
│       │   ├── view/       # 5 Views
│       │   └── fragment/   # 2 Fragments
├── db/                     # Data Model
│   ├── schema.cds
│   └── data/              # Mock Data (CSV)
├── srv/                    # Backend Services
│   ├── event-service.*
│   ├── successfactors-mock.*
│   ├── calendar-service.js
│   ├── export-service.js
│   └── notification-service.js
└── package.json
```

## 📊 Sample Data

### Events
- UI5 Advanced Workshop (Apr 15, 2025)
- Team Building Event (Apr 20, 2025)
- SAP CAP Introduction (May 5, 2025)
- Leadership Workshop (May 10, 2025)
- Product Demo Day (May 15, 2025)

### Test Users
- **Sarah Johnson** (EMP001) - Employee, Marketing
- **Marcus Williams** (EMP002) - Organizer, Learning & Development
- **Lisa Anderson** (EMP005) - Organizer, HR

## 🎯 Core Functionality

### Event Discovery & Registration
- Search events by title/description
- Filter by category (Training, Team Event, Workshop)
- Filter by location
- View complete event details
- Register with auto-populated employee data
- Answer custom event questions
- Duplicate registration prevention
- Capacity validation

### My Registrations
- View all registered events
- Download calendar files
- Cancel registrations
- View event details

### Organizer Dashboard
- Create new events
- Edit existing events
- Add custom registration questions (up to 5)
- View participant lists
- Export to Excel/CSV
- Cancel events
- View registration statistics

### Calendar Integration
- Generate iCal/ICS files (RFC 5545)
- Compatible with Outlook, Google Calendar, Apple Calendar
- Includes all event details

## 🔧 Development

### Run in Development Mode
```bash
cds watch
```

### Validate Backend
```bash
cds compile srv --for nodejs
cds deploy --to sqlite::memory:
```

### Run UI5 Linter
```bash
cd app/com.sap.eventportal
npm run lint
```

## 📝 API Endpoints

### OData Services

**Event Service** (`/odata/v4/event`)
- GET `/Events` - List all events
- GET `/Events({id})` - Get event details
- POST `/Events` - Create event
- PATCH `/Events({id})` - Update event
- GET `/Registrations` - List registrations
- POST `/Registrations` - Create registration
- POST `/downloadCalendar` - Generate iCal file
- POST `/exportToExcel` - Export participants to Excel
- POST `/exportToCSV` - Export participants to CSV

**SuccessFactors Mock Service** (`/odata/v4/success-factors-mock`)
- GET `/Employees` - List employees

## 🧪 Testing

### Manual Testing
See [README-MVP.md](README-MVP.md) for complete testing guide with step-by-step instructions.

### Test Scenarios
1. Event discovery and search
2. Event registration flow
3. Registration cancellation
4. Calendar file download
5. Organizer event creation
6. Custom questions builder
7. Participant list and export

## 🚢 Deployment

### SAP BTP Cloud Foundry
1. Create HANA Cloud instance
2. Configure destination service
3. Deploy application:
   ```bash
   cf push
   ```

See [SAP CAP Documentation](https://cap.cloud.sap/docs/guides/deployment/) for detailed deployment guide.

## 📋 Requirements Implemented

✅ Event Discovery & Registration (Must-Have)  
✅ Calendar Integration (Must-Have)  
✅ Organizer Management Dashboard (Must-Have)  
✅ Notifications (High-Want - Stubs)  
✅ Event-Specific Questions (High-Want)  
✅ User Roles & Permissions (Must-Have - Basic)  

## 🐛 Known Limitations

- Hardcoded employee IDs (development only)
- No real authentication (local development)
- Email notifications are stubs (console logs)
- No real-time updates
- English only (no i18n)

## 🔮 Future Enhancements

- Waitlist management
- Multi-language support
- Real-time notifications
- Mobile app
- Analytics dashboard
- Advanced search and filtering

## 📖 Learn More

- [SAP CAP Documentation](https://cap.cloud.sap)
- [SAPUI5 Documentation](https://ui5.sap.com)
- [OData V4 Specification](https://www.odata.org/documentation/)
- [SAP BTP Documentation](https://help.sap.com/docs/btp)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- SAP Enterprise Architect Team

## 🙏 Acknowledgments

- SAP CAP Team for the excellent framework
- SAPUI5 Team for the comprehensive UI library
- All contributors and testers

---

**Built with ❤️ using SAP CAP and SAPUI5**
