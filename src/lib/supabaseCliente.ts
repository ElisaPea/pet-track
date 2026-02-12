// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nxawqcahssgckzwqqskk.supabase.co'
const supabaseKey = 'sb_publishable_4PGaX7rokNzSpzDSLmIDdg_D_9_sQr8' // Usa variables de entorno (.env) para esto

export const supabase = createClient(supabaseUrl, supabaseKey)

