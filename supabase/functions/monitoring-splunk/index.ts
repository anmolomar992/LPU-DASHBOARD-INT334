
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get Splunk configuration from environment variables
const SPLUNK_HEC_URL = Deno.env.get('SPLUNK_HEC_URL') || '';
const SPLUNK_HEC_TOKEN = Deno.env.get('SPLUNK_HEC_TOKEN') || '';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify authorization
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Unauthorized request to monitoring-splunk');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Extract token from header and validate (simple check for demo)
  const token = authHeader.split(' ')[1];
  const expectedToken = Deno.env.get('SPLUNK_TOKEN');
  
  if (token !== expectedToken) {
    console.error('Invalid token provided to monitoring-splunk');
    return new Response(JSON.stringify({ error: 'Invalid token' }), { 
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Invalid JSON in request body:', error);
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Handle single event or batch of events
    const events = body.events || [body];
    
    if (!events || events.length === 0) {
      console.error('No events provided in request');
      return new Response(JSON.stringify({ error: 'No events provided' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Processing ${events.length} events for Splunk`);

    // If Splunk HEC URL is not configured, log to console and return
    if (!SPLUNK_HEC_URL || !SPLUNK_HEC_TOKEN) {
      console.warn('Splunk HEC not configured, logging to console only');
      console.log('Events:', JSON.stringify(events, null, 2));
      
      return new Response(JSON.stringify({
        success: true,
        count: events.length,
        message: 'Events logged to console (Splunk HEC not configured)'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // Prepare events for Splunk HEC format
    const splunkEvents = events.map(event => ({
      // Splunk expects epoch time in seconds
      time: event.timestamp ? new Date(event.timestamp).getTime() / 1000 : Math.floor(Date.now() / 1000),
      host: event.host || body.host || 'lpu_web_app',
      source: event.source || body.source || 'lpu_portal',
      sourcetype: event.sourcetype || body.sourcetype || 'lpu_web_logs',
      index: event.index || body.index || 'lpu_portal',
      // The actual event data
      event: event
    }));

    // Send to Splunk HEC
    console.log(`Sending ${splunkEvents.length} events to Splunk HEC: ${SPLUNK_HEC_URL}`);
    
    const splunkResponse = await fetch(SPLUNK_HEC_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Splunk ${SPLUNK_HEC_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(splunkEvents)
    });

    if (!splunkResponse.ok) {
      const errorText = await splunkResponse.text();
      console.error(`Splunk HEC error: ${splunkResponse.status} ${errorText}`);
      
      throw new Error(`Splunk error: ${splunkResponse.status} ${errorText}`);
    }

    const splunkResult = await splunkResponse.json();
    console.log('Splunk response:', JSON.stringify(splunkResult));

    return new Response(JSON.stringify({
      success: true,
      count: events.length,
      splunkResponse: splunkResult
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error in monitoring-splunk:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
