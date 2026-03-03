# 📥 Projekt auf Ihren lokalen Rechner herunterladen

## Option 1: Komplettes Projekt als ZIP/TAR

### Schritt 1: Archiv erstellen (bereits erledigt)
Ein Archiv wurde bereits erstellt:
```
/home/user/projects/event-registration.tar.gz (49 MB)
```

### Schritt 2: Archiv herunterladen
1. **Im SAP Business Application Studio:**
   - Rechtsklick auf die Datei `event-registration.tar.gz` im Explorer
   - Wählen Sie "Download"
   
2. **Über Terminal:**
   ```bash
   # Archiv ist hier:
   /home/user/projects/event-registration.tar.gz
   ```

### Schritt 3: Auf Ihrem lokalen Rechner entpacken

**Windows:**
- Rechtsklick → "Alle extrahieren..."
- Oder verwenden Sie 7-Zip: https://www.7-zip.org/

**Mac:**
```bash
tar -xzf event-registration.tar.gz
```

**Linux:**
```bash
tar -xzf event-registration.tar.gz
```

---

## Option 2: Via Git (empfohlen)

### Wenn Sie Git verwenden:

**Schritt 1:** Repository initialisieren (bereits erledigt)
```bash
cd /home/user/projects/event-registration
git init
git add .
git commit -m "Initial commit"
```

**Schritt 2:** Zu GitHub/GitLab pushen
```bash
# Ihr Remote Repository hinzufügen
git remote add origin <your-repo-url>
git push -u origin main
```

**Schritt 3:** Auf lokalem Rechner clonen
```bash
git clone <your-repo-url>
cd event-registration
```

---

## Option 3: Einzelne Dateien kopieren

Wenn Sie nur bestimmte Dateien brauchen, kopieren Sie diese Ordner:

### Minimal (nur Source Code):
```
event-registration/
├── db/              # Datenmodell + Mock-Daten
├── srv/             # Backend Services
├── app/             # UI5 Frontend
├── package.json     # Dependencies
└── README-MVP.md    # Dokumentation
```

### Vollständig (inkl. Dependencies):
```
event-registration/
├── db/
├── srv/
├── app/
├── node_modules/    # ⚠️ Groß! Besser: npm install ausführen
├── package.json
└── package-lock.json
```

---

## Nach dem Download: Installation

### 1. Dependencies installieren:
```bash
cd event-registration
npm install

cd app/com.sap.eventportal
npm install
cd ../..
```

### 2. Anwendung starten:
```bash
cds watch
```

### 3. Browser öffnen:
```
http://localhost:4004/com.sap.eventportal/index.html
```

---

## 📦 Archiv-Inhalt

Das Archiv enthält:
- ✅ Kompletter Source Code (Backend + Frontend)
- ✅ Datenmodell und Mock-Daten
- ✅ Alle Konfigurationsdateien
- ✅ Dokumentation (README, INSTALLATION, etc.)
- ❌ **KEINE** node_modules (müssen installiert werden)

**Größe:** ~49 MB (komprimiert)  
**Entpackt:** ~50 MB (ohne node_modules)  
**Mit node_modules:** ~200 MB

---

## 🔐 Wichtig: .gitignore

Das Projekt enthält eine `.gitignore` Datei, die folgendes ausschließt:
- `node_modules/` (zu groß)
- `package-lock.json` (wird neu generiert)
- `.env` (Secrets)
- IDE-spezifische Dateien

Diese Dateien müssen lokal neu erstellt werden mit `npm install`.

---

## ✅ Checkliste

Nach dem Download und Entpacken:
- [ ] Ordner `event-registration/` existiert
- [ ] `package.json` ist vorhanden
- [ ] Ordner `db/`, `srv/`, `app/` sind vorhanden
- [ ] `npm install` ausgeführt (im Hauptverzeichnis)
- [ ] `npm install` ausgeführt (in `app/com.sap.eventportal/`)
- [ ] `cds watch` startet ohne Fehler
- [ ] Browser zeigt UI unter http://localhost:4004

---

## 🆘 Probleme beim Download?

### Archiv zu groß?
Erstellen Sie ein kleineres Archiv ohne Tests und Docs:
```bash
tar -czf event-registration-slim.tar.gz \
  event-registration/db \
  event-registration/srv \
  event-registration/app \
  event-registration/package.json \
  event-registration/README-MVP.md
```

### Alternative: Einzelne Ordner downloaden
Laden Sie die Ordner einzeln herunter:
1. `db/` (Datenmodell)
2. `srv/` (Backend)
3. `app/` (Frontend)
4. `package.json` (Dependencies)

---

## 📞 Nächste Schritte

Nach erfolgreichem Download:
1. Lesen Sie **QUICK-START.md** für schnellen Einstieg
2. Lesen Sie **INSTALLATION.md** für detaillierte Installation
3. Lesen Sie **README-MVP.md** für Feature-Übersicht

**Viel Erfolg!** 🚀
