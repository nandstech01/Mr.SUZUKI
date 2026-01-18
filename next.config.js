/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://heaicaoqjfjawkdjfknb.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYWljYW9xamZqYXdrZGpma25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3Mzc2MDgsImV4cCI6MjA4NDMxMzYwOH0.U5kic4heJ8ArJEpvDui__NjtYbLE-gvW4cGTO-ipMPw',
    SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYWljYW9xamZqYXdrZGpma25iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODczNzYwOCwiZXhwIjoyMDg0MzEzNjA4fQ.jKCbeRWre4-k3dX9ehqIG5DVlzwS1dLq9rTd5tAbK4M',
  },
}

module.exports = nextConfig