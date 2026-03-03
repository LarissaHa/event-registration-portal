# 🚀 Quick Start - Event Registration Portal

## In 3 Schritten lokal starten:

### 1️⃣ Projekt auf Ihren Rechner kopieren

Kopieren Sie den kompletten Ordner:
```
/home/user/projects/event-registration
```
auf Ihren lokalen Rechner.

---

### 2️⃣ Dependencies installieren

Öffnen Sie ein Terminal im Projekt-Ordner:

```bash
# Node.js Pakete installieren
npm install

# UI5 App Pakete installieren
cd app/com.sap.eventportal
npm install
cd ../..
```

---

### 3️⃣ Anwendung starten

```bash
cds watch
```

✅ **Fertig!** Öffnen Sie:
```
http://localhost:4004/com.sap.eventportal/index.html
```

---

## ⚠️ Voraussetzungen

Installieren Sie vorher:
- **Node.js 18.x oder 20.x**: https://nodejs.org/
- **@sap/cds-dk** (CAP CLI): 
  ```bash
  npm install -g @sap/cds-dk
  ```

---

## 🆘 Probleme?

### "cds: command not found"
```bash
npm install -g @sap/cds-dk
```

### Port 4004 belegt
```bash
PORT=4005 cds watch
# Dann: http://localhost:4005/com.sap.eventportal/index.html
```

### Mehr Hilfe
Siehe **INSTALLATION.md** für detaillierte Anleitung.

---

## 📦 Projekt-Download

Sie können das Projekt auch als ZIP-Archiv erstellen:

```bash
cd /home/user/projects
tar -czf event-registration.tar.gz event-registration/
```

Dann `event-registration.tar.gz` auf Ihren Rechner kopieren und entpacken.
