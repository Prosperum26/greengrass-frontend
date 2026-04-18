# Response Validation System

## Overview

The response validation system uses **Zod** schemas to validate API responses against backend contracts. This prevents silent data errors that occur when the backend changes its response format.

## Problem It Solves

### Without Validation
```javascript
// If backend changes `/events` response format:
// OLD: { success: true, data: [...] }
// NEW: { events: [...] }  // Different structure!

const events = response.data; // undefined - silent failure
events.map(...); // TypeError: Cannot read property 'map' of undefined
```

### With Validation
```javascript
// Same scenario with validation:
const events = await eventsApiValidated.getAll();
// Throws error immediately:
// "Events list response validation failed: data: required"
// Caught by error context and shown to user
```

## Components

### 1. Response Schemas (`src/utils/responseSchemas.js`)

Zod schemas that define the expected structure of every API response.

**Coverage:**
- ✅ Auth responses (login, register, refresh)
- ✅ User responses (profile, update)
- ✅ Event responses (list, detail, create)
- ✅ Check-in responses (stats, QR code, participants)
- ✅ Gamification responses (leaderboard, points, badges)
- ✅ Notification responses (list, unread count)
- ✅ Map responses (markers, nearby)

**Example Schema:**
```javascript
export const EventListResponseSchema = SuccessResponseSchema.extend({
  data: z.array(EventSchema),
});

// Validates this structure:
{
  success: true,
  data: [
    {
      id: 1,
      title: "Event title",
      startTime: "2024-01-01T10:00:00Z",
      // ... other event fields
    }
  ]
}
```

### 2. Validation Utilities (`src/utils/responseSchemas.js`)

**`validateResponse(response, schema, label)`**
- Throws ZodError on validation failure
- For critical flows where error should stop execution
- Error caught by existing try/catch + error context

**`validateResponseSafe(response, schema, label)`**
- Returns null on failure (non-blocking)
- Logs warning to console
- For optional features where graceful degradation is acceptable

### 3. Validated API Wrappers (`src/api/validatedApi.js`)

Wrapper functions around existing API clients that add response validation.

**Available Validated APIs:**
- `authApiValidated` - Login, register, refresh with validation
- `eventsApiValidated` - Event list/detail with validation
- `usersApiValidated` - User profile with validation
- `pointsApiValidated` - Leaderboard with validation

**Important:** All original API methods remain available and unchanged. Validation wrappers are optional additions.

## Usage Patterns

### Pattern 1: Opt-in Validation (Recommended)

Use validated versions in critical flows:

```javascript
// In AuthContext.jsx
import { authApiValidated } from '../api';

const login = async (credentials) => {
  try {
    const tokens = await authApiValidated.login(credentials);
    // tokens validated - guaranteed to have accessToken + refreshToken
    setTokens(tokens);
  } catch (error) {
    // Validation error or network error
    addError(getErrorMessage(error.message));
  }
};
```

### Pattern 2: Safe/Non-blocking Validation

For non-critical features:

```javascript
// In HomePage.jsx
import { eventsApiValidated } from '../api';

const loadEvents = async () => {
  const events = await eventsApiValidated.getAllSafe(params);
  if (events) {
    setEvents(events.data);
  } else {
    // Validation failed, log warning, show fallback
    setEvents([]);
  }
};
```

### Pattern 3: Gradual Migration

Keep existing code working while adopting validation where needed:

```javascript
// Old code (still works)
const events = await eventsApi.getAll(params);

// New code (validated)
const events = await eventsApiValidated.getAll(params);

// Both work, but validated version provides safety
```

## Integration Checklist

To add response validation to a component:

1. **Identify Critical API Calls**
   - Login/register flow (most important)
   - User profile load
   - Sensitive data fetches

2. **Replace with Validated Version**
   ```javascript
   // Before
   const response = await authApi.login(creds);
   
   // After
   const response = await authApiValidated.login(creds);
   ```

3. **Existing Error Handling Works**
   - Validation errors caught by existing try/catch
   - Error context displays them to user
   - No additional error handling needed

4. **Test Against Contract**
   - Verify response matches backend Swagger docs
   - Run with backend running to validate in dev

## Adding New Response Schemas

When API endpoints are added:

1. **Define Schema in `responseSchemas.js`:**
   ```javascript
   export const MyNewResponseSchema = SuccessResponseSchema.extend({
     data: z.array(MyNewItemSchema),
   });
   ```

2. **Add to `validatedApi.js`:**
   ```javascript
   export const myApiValidated = {
     getAll: async (params) => {
       const response = await myApi.getAll(params);
       return validateResponse(response, MyNewResponseSchema, 'My API response');
     },
   };
   ```

3. **Export from `api/index.js`:**
   ```javascript
   export * from './validatedApi';
   ```

## Error Messages for Contract Changes

When validation fails, the error message includes the path and reason:

**Example:**
```
Events list response validation failed: 
data.0.startTime: Invalid datetime; 
data.0.organizer: required
```

This tells you exactly which fields are missing/invalid, making debugging backend changes easier.

## Performance Impact

- **Minimal:** Zod parsing is fast (< 1ms for typical responses)
- **Only on request completion:** Validation happens after network latency
- **Optional:** Non-validated code unchanged

## Recommended Rollout

### Phase 1: Foundation (Current)
- ✅ Auth API validated (login, register, refresh)
- Prevents most common issues (token format)

### Phase 2: Critical Flows (Next)
- User profile load
- Event list fetch
- Organizer sensitive endpoints

### Phase 3: Full Coverage (Future)
- All remaining endpoints validated
- Consider making validation mandatory with warning logs

## Testing Validation

To test validation locally:

1. **Intentionally break backend response** (temporarily modify NestJS)
2. **Frontend should throw error immediately**
3. **Error appears in toast notification**
4. **Browser console shows validation details**

Example:
```javascript
// Backend returns wrong format
{ events: [...] } // 'data' field missing

// Frontend validation catches it:
// "Events list response validation failed: data: required"
// Error displayed to user in toast
```

## Related Files

- **Schema definitions:** `src/utils/responseSchemas.js`
- **API wrappers:** `src/api/validatedApi.js`
- **Form validation:** `src/utils/validationSchemas.js` (different - validates form inputs)
- **Error handling:** `src/contexts/ErrorContext.jsx`
- **Error messages:** `src/utils/errorMessages.js`

## Troubleshooting

**"Validation failed: data: required"**
- Backend changed response structure
- Check backend Swagger docs for new format
- Update schema in `responseSchemas.js`

**"Validation failed: id: expected number"**
- Backend returning string instead of number
- Either: fix backend type or adjust schema

**Validation errors not showing in UI**
- Ensure component uses error context's `addError` hook
- Check ErrorContext is provider in App.jsx
- Verify Toast component is rendered

## Future Improvements

1. **Response interceptor in axios** - Auto-validate all responses
2. **Dev mode toggle** - Enable/disable validation per environment
3. **Metrics collection** - Track validation success/failure rates
4. **Auto-schema generation** - Generate schemas from OpenAPI/Swagger
