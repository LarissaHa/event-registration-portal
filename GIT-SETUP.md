# 🔧 Git Repository Setup & Push

## Schritt-für-Schritt Anleitung zum Pushen zu GitHub/GitLab

### Voraussetzungen
- Git installiert auf Ihrem System
- GitHub oder GitLab Account
- Repository erstellt (leer)

---

## Option 1: Push zu GitHub

### 1️⃣ GitHub Repository erstellen

1. Gehen Sie zu https://github.com
2. Klicken Sie auf "+" → "New repository"
3. **Repository Name**: `event-registration-portal` (oder beliebig)
4. **Visibility**: Private oder Public
5. ⚠️ **WICHTIG**: Wählen Sie **"Create empty repository"** 
   - ❌ Kein README
   - ❌ Keine .gitignore
   - ❌ Keine License
6. Klicken Sie "Create repository"

### 2️⃣ Remote hinzufügen und pushen

Im BAS Terminal:

```bash
cd /home/user/projects/event-registration

# Ihre GitHub Repository URL verwenden
git remote add origin https://github.com/IHR-USERNAME/event-registration-portal.git

# Push zum Repository
git push -u origin main
```

### 3️⃣ Authentifizierung

Wenn nach Credentials gefragt:
- **Username**: Ihr GitHub Username
- **Password**: Verwenden Sie ein **Personal Access Token** (nicht Ihr Passwort!)

**Personal Access Token erstellen:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" → "Generate new token (classic)"
3. Name: "BAS Event Registration"
4. Scope: Wählen Sie **"repo"** (full control)
5. "Generate token"
6. ⚠️ **Kopieren Sie den Token** (wird nur einmal angezeigt!)
7. Verwenden Sie diesen Token als Password beim Push

---

## Option 2: Push zu GitLab

### 1️⃣ GitLab Repository erstellen

1. Gehen Sie zu https://gitlab.com
2. Klicken Sie auf "New project" → "Create blank project"
3. **Project name**: `event-registration-portal`
4. **Visibility**: Private oder Public
5. ⚠️ **Deaktivieren Sie**: "Initialize repository with a README"
6. Klicken Sie "Create project"

### 2️⃣ Remote hinzufügen und pushen

```bash
cd /home/user/projects/event-registration

# Ihre GitLab Repository URL verwenden
git remote add origin https://gitlab.com/IHR-USERNAME/event-registration-portal.git

# Push zum Repository
git push -u origin main
```

### 3️⃣ Authentifizierung

- **Username**: Ihr GitLab Username
- **Password**: Verwenden Sie ein **Personal Access Token**

**Personal Access Token erstellen:**
1. GitLab → Settings → Access Tokens
2. Token name: "BAS Event Registration"
3. Scopes: Wählen Sie **"write_repository"**
4. "Create personal access token"
5. ⚠️ **Kopieren Sie den Token**
6. Verwenden Sie diesen Token als Password

---

## Option 3: Push zu SAP GitHub Enterprise

Falls Sie SAP GitHub Enterprise verwenden:

```bash
cd /home/user/projects/event-registration

# SAP GitHub Enterprise URL
git remote add origin https://github.tools.sap/IHR-ORG/event-registration-portal.git

git push -u origin main
```

Authentifizierung über SAP SSO oder Personal Access Token.

---

## 🔍 Status prüfen

### Aktueller Status:
```bash
cd /home/user/projects/event-registration
git status
```

**Erwartete Ausgabe:**
```
On branch main
nothing to commit, working tree clean
```

### Remote prüfen:
```bash
git remote -v
```

**Nach Hinzufügen des Remote:**
```
origin  https://github.com/IHR-USERNAME/event-registration-portal.git (fetch)
origin  https://github.com/IHR-USERNAME/event-registration-portal.git (push)
```

### Commits prüfen:
```bash
git log --oneline
```

**Sollte zeigen:**
```
c141141 Add installation and download documentation
cdd4dbf Initial commit - Event Registration Portal MVP
```

---

## 🚀 Push-Befehle

### Erster Push:
```bash
git push -u origin main
```

**Ausgabe bei Erfolg:**
```
Enumerating objects: 60, done.
Counting objects: 100% (60/60), done.
Delta compression using up to 4 threads
Compressing objects: 100% (50/50), done.
Writing objects: 100% (60/60), 200 KiB | 10 MiB/s, done.
Total 60 (delta 5), reused 0 (delta 0)
To https://github.com/IHR-USERNAME/event-registration-portal.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

### Weitere Updates pushen:
```bash
git add .
git commit -m "Ihre Änderung beschreiben"
git push
```

---

## 📋 Was wird gepusht?

### Inkludiert:
- ✅ Source Code (db/, srv/, app/)
- ✅ Konfigurationsdateien (package.json, manifest.json, etc.)
- ✅ Dokumentation (README, INSTALLATION, etc.)
- ✅ Mock-Daten (CSV-Dateien)
- ✅ .gitignore (filtert unnötige Dateien)

### Ausgeschlossen (via .gitignore):
- ❌ node_modules/ (zu groß, wird lokal installiert)
- ❌ package-lock.json (wird automatisch generiert)
- ❌ .env Dateien (Secrets)
- ❌ Build-Artefakte
- ❌ IDE-spezifische Dateien

---

## 🔐 SSH statt HTTPS (Optional)

Für bequemeres Pushen ohne Token-Eingabe:

### 1. SSH Key generieren:
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

### 2. Public Key zu GitHub/GitLab hinzufügen:
```bash
cat ~/.ssh/id_ed25519.pub
```
Kopieren Sie den Output und fügen Sie ihn hinzu:
- **GitHub**: Settings → SSH and GPG keys → New SSH key
- **GitLab**: Settings → SSH Keys

### 3. Remote auf SSH umstellen:
```bash
git remote set-url origin git@github.com:IHR-USERNAME/event-registration-portal.git
```

---

## 🆘 Troubleshooting

### "fatal: remote origin already exists"
```bash
# Remote entfernen und neu hinzufügen
git remote remove origin
git remote add origin <your-repo-url>
```

### "Authentication failed"
- Verwenden Sie **Personal Access Token**, nicht Ihr Passwort
- Prüfen Sie Token-Permissions (repo/write_repository)
- Token abgelaufen? Erstellen Sie einen neuen

### "fatal: refusing to merge unrelated histories"
```bash
# Falls Remote nicht leer war
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### "Permission denied (publickey)"
- SSH Key nicht korrekt hinzugefügt
- Verwenden Sie HTTPS statt SSH
- Oder: SSH Key neu generieren und hinzufügen

---

## 📊 Repository-Größe

**Ohne node_modules:**
- ~5 MB Source Code
- ~200 KB Dokumentation
- ~1 MB Konfiguration

**Total:** ~6 MB (sehr klein!)

**Mit node_modules:** ~200 MB (wird NICHT gepusht!)

---

## ✅ Checkliste

Nach erfolgreichem Push:
- [ ] `git remote -v` zeigt Ihr Repository
- [ ] `git push -u origin main` war erfolgreich
- [ ] Repository auf GitHub/GitLab sichtbar
- [ ] Alle Dateien sind vorhanden
- [ ] README.md wird auf Repository-Startseite angezeigt
- [ ] Andere können das Repository clonen

---

## 🔄 Workflow für Änderungen

```bash
# 1. Änderungen machen
# ... Code bearbeiten ...

# 2. Status prüfen
git status

# 3. Änderungen stagen
git add .

# 4. Committen
git commit -m "Beschreibung der Änderung"

# 5. Pushen
git push
```

---

## 📞 Nächste Schritte

Nach erfolgreichem Push:
1. Repository auf GitHub/GitLab öffnen
2. README.md prüfen (wird automatisch angezeigt)
3. Andere Entwickler können jetzt clonen:
   ```bash
   git clone <your-repo-url>
   ```

**Fertig!** 🎉 Ihr Code ist jetzt sicher in Git!
