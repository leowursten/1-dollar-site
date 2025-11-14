// netlify/functions/increment.js

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      statusCode: 500,
      body: 'Missing Supabase environment variables',
    };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Call your SQL function increment_counter()
  const { data, error } = await supabase.rpc('increment_counter');

  if (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  const count = data; // increment_counter() returns the new value

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count }),
  };
};