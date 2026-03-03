# Fix: Frontend and Backend Not Communicating

## Problem
Frontend shows no data even though backend has test data (visible via curl).

## Root Cause
**Incorrect Service URL in manifest.json**

The manifest.json was pointing to:
```json
"uri": "/event-service/"
```

But the actual CAP service is available at:
```json
"uri": "/odata/v4/event/"
```

## How to Verify

### Check Backend Service URL
When you run `cds watch`, you should see:
```
[cds] - serving EventService { at: '/odata/v4/event' }
```

### Test Backend Directly
```bash
# This should return JSON with events:
curl http://localhost:4004/odata/v4/event/Events

# This should return service metadata:
curl http://localhost:4004/odata/v4/event/$metadata
```

### Check Frontend Network Requests
1. Open Browser Console (F12)
2. Go to **Network** tab
3. Reload the page
4. Look for requests to `/event-service/` → These will fail with 404
5. After fix: Look for requests to `/odata/v4/event/` → These should succeed

## Solution Applied

### Changed in: `app/com.sap.eventportal/webapp/manifest.json`

**Before:**
```json
"dataSources": {
  "mainService": {
    "uri": "/event-service/",
    "type": "OData",
    "settings": {
      "odataVersion": "4.0"
    }
  }
}
```

**After:**
```json
"dataSources": {
  "mainService": {
    "uri": "/odata/v4/event/",
    "type": "OData",
    "settings": {
      "odataVersion": "4.0"
    }
  }
}
```

## How to Apply This Fix

### Option 1: Git Pull (Recommended)
```bash
cd /path/to/event-registration
git pull origin main
```

### Option 2: Manual Fix
1. Open `app/com.sap.eventportal/webapp/manifest.json`
2. Find the `dataSources` section
3. Change `"uri": "/event-service/"` to `"uri": "/odata/v4/event/"`
4. Save the file

## After Applying the Fix

### 1. Clear Browser Cache
```bash
# In Browser:
Ctrl + Shift + Delete
# Or hard reload:
Ctrl + F5
```

### 2. Restart cds watch (if needed)
```bash
# Stop (Ctrl+C) and restart:
cd /path/to/event-registration
cds watch
```

### 3. Reload Application
```
http://localhost:4004/com.sap.eventportal/index.html
```

### 4. Verify Data Loads
You should now see:
- ✅ 5 Events in the event list
- ✅ Event details when clicking on an event
- ✅ Registrations in "My Registrations"
- ✅ Events in "Organizer Dashboard"

## Debugging Steps

### Check Browser Console (F12)

#### Before Fix:
```
❌ GET http://localhost:4004/event-service/Events 404 (Not Found)
❌ Failed to load data
```

#### After Fix:
```
✅ GET http://localhost:4004/odata/v4/event/Events 200 (OK)
✅ Data loaded successfully
```

### Check Network Tab

1. Open Browser Console (F12)
2. Go to **Network** tab
3. Filter by "event"
4. Reload page
5. Look for:
   - Request URL: Should be `/odata/v4/event/Events`
   - Status: Should be `200 OK`
   - Response: Should contain JSON with events

### Verify Backend Service

```bash
# List all services
curl http://localhost:4004

# Get Events
curl http://localhost:4004/odata/v4/event/Events

# Get Service Metadata
curl http://localhost:4004/odata/v4/event/$metadata
```

## Expected Results After Fix

### Event List Page
- Shows 5 events:
  1. UI5 Advanced Workshop
  2. Team Building Event
  3. SAP CAP Introduction
  4. Leadership Workshop
  5. Product Demo Day

### My Registrations Page
- Shows 2 registrations for EMP001 (Sarah Johnson):
  1. UI5 Advanced Workshop
  2. (Second registration if any)

### Organizer Dashboard
- Shows 3 events for EMP002 (Marcus Williams):
  1. UI5 Advanced Workshop
  2. SAP CAP Introduction
  3. Product Demo Day

## Common Issues After Fix

### Issue 1: Still No Data After Fix
**Solution:**
1. Clear browser cache completely (Ctrl+Shift+Delete)
2. Close all browser tabs
3. Restart browser
4. Open application again

### Issue 2: 404 Errors Still Appearing
**Solution:**
1. Verify manifest.json was saved correctly
2. Check if you're editing the right file (in `app/com.sap.eventportal/webapp/`)
3. Restart cds watch

### Issue 3: CORS Errors
**Solution:**
CAP automatically handles CORS for local development. If you see CORS errors:
1. Ensure you're accessing via http://localhost:4004
2. Don't use 127.0.0.1 or other aliases

## Testing Checklist

After applying the fix, test:
- [ ] Event list loads and shows 5 events
- [ ] Search works
- [ ] Filters work
- [ ] Click on event shows details
- [ ] My Registrations shows data
- [ ] Organizer Dashboard shows events
- [ ] Can create new event
- [ ] Can register for event
- [ ] Export functions work

## Additional Notes

### Why This Happened
The manifest.json template used `/event-service/` as a generic placeholder, but CAP automatically generates the service path as `/odata/v4/<service-name>/` where `<service-name>` is derived from the CDS service definition.

### Service Path Convention
In `srv/event-service.cds`:
```cds
service EventService {
  // entities...
}
```

CAP converts this to:
- Service name: `EventService`
- URL path: `/odata/v4/event` (lowercase, without "Service" suffix)

### How to Find the Correct Path
Always check the console output when running `cds watch`:
```
[cds] - serving EventService { at: '/odata/v4/event' }
```
This tells you the exact path to use in manifest.json.

## Status
- [x] Issue identified
- [x] Fix applied
- [x] Tested
- [x] Documentation created
- [x] Ready for deployment

## Date
March 3, 2025
