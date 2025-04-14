
# Splunk Integration with Supabase Edge Functions

To properly integrate Splunk with your application, you would typically create a Supabase Edge Function that forwards logs to Splunk's HTTP Event Collector (HEC). Here's a sample implementation:

## Edge Function Setup

1. First, create a new edge function in your Supabase project:

```bash
supabase functions new monitoring-splunk
```

2. Then, implement the function to receive logs from your frontend and forward them to Splunk:

```typescript
// supabase/functions/monitoring-splunk/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const SPLUNK_HEC_URL = Deno.env.get('SPLUNK_HEC_URL') || '';
const SPLUNK_HEC_TOKEN = Deno.env.get('SPLUNK_HEC_TOKEN') || '';

serve(async (req) => {
  // Check for proper authorization
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Parse the request body
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Handle single event or batch of events
  const events = body.events || [body.event];
  
  if (!events || events.length === 0) {
    return new Response('No events provided', { status: 400 });
  }

  try {
    // Forward to Splunk HEC
    const splunkResponse = await fetch(SPLUNK_HEC_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Splunk ${SPLUNK_HEC_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(events.map(event => ({
        // Map application event to Splunk event format
        time: new Date(event.timestamp).getTime() / 1000, // Splunk expects epoch time
        host: event.host || body.host,
        source: event.source || body.source,
        sourcetype: event.sourcetype || body.sourcetype,
        index: event.index || body.index,
        event: event
      })))
    });

    if (!splunkResponse.ok) {
      throw new Error(`Splunk error: ${splunkResponse.status} ${await splunkResponse.text()}`);
    }

    return new Response(JSON.stringify({
      success: true,
      count: events.length
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error forwarding to Splunk:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
})
```

3. Deploy the function:

```bash
supabase functions deploy monitoring-splunk
```

4. Add required secrets to your Supabase project:

```bash
supabase secrets set SPLUNK_HEC_URL=https://your-splunk-instance/services/collector
supabase secrets set SPLUNK_HEC_TOKEN=your-splunk-hec-token
```

## Configuration in Your Application

In your frontend application, set the following environment variables:

```
VITE_SPLUNK_ENABLED=true
VITE_SPLUNK_API_ENDPOINT=https://your-supabase-project.functions.supabase.co/monitoring-splunk
VITE_SPLUNK_TOKEN=your-api-auth-token  # This is your own auth token to secure the API, not the Splunk HEC token
VITE_SPLUNK_INDEX=your_splunk_index
VITE_SPLUNK_SOURCE=your_app_name
VITE_SPLUNK_SOURCETYPE=your_log_type
VITE_SPLUNK_BATCH_ENABLED=true  # Optional, for batching logs
VITE_SPLUNK_BATCH_INTERVAL=10000  # Optional, batch interval in milliseconds
VITE_SPLUNK_BATCH_SIZE=10  # Optional, max number of logs per batch
```
