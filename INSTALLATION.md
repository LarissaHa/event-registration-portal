# Event Registration Portal - Installation & Setup Guide

## 📦 Voraussetzungen

Stellen Sie sicher, dass folgende Software auf Ihrem lokalen Rechner installiert ist:

### Erforderlich:
- **Node.js** (Version 18.x oder 20.x) - [Download](https://nodejs.org/)
- **npm** (kommt mit Node.js)
- **Git** - [Download](https://git-scm.com/)

### Optional (aber empfohlen):
- **Visual Studio Code** - [Download](https://code.visualstudio.com/)
- **SAP CDS Extension für VS Code** - [Marketplace](https://marketplace.visualstudio.com/items?itemName=SAPSE.vscode-cds)

---

## 🚀 Installation auf Ihrem lokalen Rechner

### Schritt 1: Projekt herunterladen

Sie haben zwei Möglichkeiten:

#### Option A: Git Clone (wenn Repository verfügbar)
```bash
git clone <repository-url>
cd event-registration
```

#### Option B: Projekt-Ordner kopieren
1. Kopieren Sie den kompletten Ordner `/home/user/projects/event-registration` auf Ihren lokalen Rechner
2. Öffnen Sie ein Terminal/Command Prompt
3. Navigieren Sie zum Projekt-Ordner:
   ```bash
   cd /pfad/zu/event-registration
   ```

---

### Schritt 2: Dependencies installieren

Installieren Sie alle benötigten Node.js-Pakete:

```bash
# Im Hauptverzeichnis
npm install

# Im UI5-App-Verzeichnis
cd app/com.sap.eventportal
npm install
cd ../..
```

**Erwartete Ausgabe:**
```
added 113 packages, and audited 114 packages in 4s
```

---

### Schritt 3: Anwendung starten

Starten Sie den CAP-Server:

```bash
cds watch
```

**Erwartete Ausgabe:**
```
[cds] - loaded model from 4 file(s)
[cds] - connect to db > sqlite { url: ':memory:' }
[cds] - serving EventService { at: '/odata/v4/event' }
[cds] - serving SuccessFactorsMockService { at: '/odata/v4/success-factors-mock' }
[cds] - server listening on { url: 'http://localhost:4004' }
```

✅ **Die Anwendung läuft jetzt!**

---

## 🌐 Anwendung öffnen

### UI5 Frontend:
Öffnen Sie Ihren Browser und gehen Sie zu:
```
http://localhost:4004/com.sap.eventportal/index.html
```

### CAP Index-Seite (Übersicht):
```
http://localhost:4004
```

### OData Service Endpunkte:
- **Events**: http://localhost:4004/odata/v4/event/Events
- **Registrations**: http://localhost:4004/odata/v4/event/Registrations
- **Employees (Mock)**: http://localhost:4004/odata/v4/success-factors-mock/Employees

---

## 🔧 Troubleshooting

### Problem: "cds: command not found"

**Lösung:** Installieren Sie CAP CLI global:
```bash
npm install -g @sap/cds-dk
```

Prüfen Sie die Installation:
```bash
cds version
```

---

### Problem: Port 4004 bereits belegt

**Lösung 1:** Anderen Port verwenden:
```bash
PORT=4005 cds watch
```
Dann öffnen: http://localhost:4005/com.sap.eventportal/index.html

**Lösung 2:** Prozess auf Port 4004 beenden:

**Windows:**
```cmd
netstat -ano | findstr :4004
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:4004 | xargs kill -9
```

---

### Problem: npm install schlägt fehl

**Lösung:** Cache leeren und neu installieren:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### Problem: UI lädt keine Daten

**Prüfen Sie:**
1. Ist der Server gestartet? (`cds watch` läuft?)
2. Console-Fehler im Browser (F12 → Console)
3. Backend-Test:
   ```bash
   curl http://localhost:4004/odata/v4/event/Events
   ```

**Häufige Ursache:** manifest.json zeigt auf falschen Service-Pfad
- Prüfen Sie: `app/com.sap.eventportal/webapp/manifest.json`
- `dataSources.mainService.uri` sollte `/event-service/` sein

---

### Problem: "Cannot find module '@sap/cds'"

**Lösung:** CDS-Pakete fehlen:
```bash
npm install @sap/cds @sap/cds-dk
```

---

## 📁 Projekt-Struktur

```
event-registration/
├── app/                          # UI5 Frontend
│   └── com.sap.eventportal/     # UI5 App
│       ├── webapp/
│       │   ├── controller/       # Controller
│       │   ├── view/             # Views
│       │   └── manifest.json     # App Config
│       └── package.json
├── db/                           # Datenbank
│   ├── schema.cds               # Datenmodell
│   └── data/                    # Mock-Daten (CSV)
├── srv/                          # Backend Services
│   ├── event-service.cds        # Service Definition
│   ├── event-service.js         # Service Implementation
│   ├── successfactors-mock.cds  # Mock SF Service
│   ├── successfactors-mock.js   # Mock SF Implementation
│   ├── calendar-service.js      # Kalender-Service
│   ├── export-service.js        # Export-Service
│   └── notification-service.js  # Benachrichtigungs-Service
├── package.json                  # Haupt-Dependencies
├── README-MVP.md                 # MVP Dokumentation
└── INSTALLATION.md               # Diese Datei
```

---

## 🧪 Testen der Installation

### Backend-Test:

```bash
# Alle Events
curl http://localhost:4004/odata/v4/event/Events

# Alle Mitarbeiter
curl http://localhost:4004/odata/v4/success-factors-mock/Employees

# Event mit Registrierungen
curl "http://localhost:4004/odata/v4/event/Events?$expand=registrations"
```

### Frontend-Test:

1. Öffnen Sie http://localhost:4004/com.sap.eventportal/index.html
2. Sie sollten 5 Events sehen
3. Klicken Sie auf ein Event → Details-Dialog öffnet sich
4. Klicken Sie "Register" → Registrierung wird erstellt

---

## 📊 Beispiel-Daten

### Events (5):
1. UI5 Advanced Workshop - 15. April 2025
2. Team Building Event - 20. April 2025
3. SAP CAP Introduction - 5. Mai 2025
4. Leadership Workshop - 10. Mai 2025
5. Product Demo Day - 15. Mai 2025

### Mitarbeiter (10):
- EMP001: Sarah Johnson (Marketing)
- EMP002: Marcus Williams (L&D) - **Organizer**
- EMP003: Jennifer Chen (IT)
- EMP004: Michael Brown (Sales)
- EMP005: Lisa Anderson (HR) - **Organizer**
- ... und 5 weitere

---

## 🔄 Entwicklungs-Workflow

### Änderungen am Backend:
1. Datei in `srv/` oder `db/` bearbeiten
2. Server startet automatisch neu (Hot Reload)
3. Änderungen sofort verfügbar

### Änderungen am Frontend:
1. Datei in `app/com.sap.eventportal/webapp/` bearbeiten
2. Browser neu laden (F5)
3. Bei Manifest-Änderungen: Server neu starten

### Datenbank zurücksetzen:
```bash
# Server stoppen (Ctrl+C)
# Neu starten
cds watch
```
Die In-Memory-Datenbank wird bei jedem Start neu initialisiert.

---

## 💡 Nützliche Befehle

```bash
# CDS Version prüfen
cds version

# Datenmodell kompilieren (ohne Server)
cds compile srv --for nodejs

# Datenbank-Schema anzeigen
cds compile db --to sql

# Projekt-Struktur anzeigen
cds env

# Dependencies aktualisieren
npm update

# UI5 App separat bauen (optional)
cd app/com.sap.eventportal
npm run build
```

---

## 🎓 Weitere Ressourcen

- **CAP Dokumentation**: https://cap.cloud.sap
- **SAPUI5 Dokumentation**: https://ui5.sap.com
- **CAP Samples**: https://github.com/SAP-samples/cloud-cap-samples
- **UI5 Samples**: https://ui5.sap.com/#/controls

---

## 📞 Support

Bei Problemen:
1. Prüfen Sie die Console-Ausgabe des Servers
2. Prüfen Sie die Browser-Console (F12)
3. Lesen Sie README-MVP.md für Feature-Details
4. Prüfen Sie die Logs in der Terminal-Ausgabe

---

## ✅ Checkliste für erfolgreiche Installation

- [ ] Node.js installiert (Version 18.x oder 20.x)
- [ ] Projekt heruntergeladen/kopiert
- [ ] `npm install` im Hauptverzeichnis ausgeführt
- [ ] `npm install` im UI5-App-Verzeichnis ausgeführt
- [ ] `cds watch` startet ohne Fehler
- [ ] http://localhost:4004 ist erreichbar
- [ ] UI5 App lädt unter http://localhost:4004/com.sap.eventportal/index.html
- [ ] 5 Events werden in der Liste angezeigt
- [ ] Event-Details-Dialog öffnet sich beim Klick
- [ ] Registrierung funktioniert

**Wenn alle Punkte ✅ sind, ist Ihre Installation erfolgreich!** 🎉
