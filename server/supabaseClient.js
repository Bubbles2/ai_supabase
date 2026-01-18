const { createClient } = require("@supabase/supabase-js");

// Ensure environment variables are loaded if not already (though index.js does it)
if (!process.env.SUPABASE_URL && !process.env.PORT) {
    require('dotenv').config();
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PRIVATE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
