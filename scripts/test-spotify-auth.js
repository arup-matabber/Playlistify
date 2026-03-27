/**
 * Spotify Authentication Test Script
 * 
 * This script tests your Spotify credentials to verify they work.
 * 
 * Usage:
 * node test-spotify-auth.js
 * 
 * Or with environment variables:
 * SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy SPOTIFY_REFRESH_TOKEN=zzz node test-spotify-auth.js
 */

const SpotifyWebApi = require('spotify-web-api-node');

// Get credentials from environment or prompt user
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

console.log('\n' + '='.repeat(80));
console.log('🧪 Spotify Authentication Test');
console.log('='.repeat(80) + '\n');

// Check if credentials are provided
if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error('❌ Missing credentials!\n');
  console.error('Please provide Spotify credentials via environment variables:');
  console.error('\n  SPOTIFY_CLIENT_ID=your_client_id \\');
  console.error('  SPOTIFY_CLIENT_SECRET=your_client_secret \\');
  console.error('  SPOTIFY_REFRESH_TOKEN=your_refresh_token \\');
  console.error('  node test-spotify-auth.js\n');
  console.error('Or edit this file and add them directly.\n');
  process.exit(1);
}

// Show credentials (masked)
console.log('📋 Testing with credentials:');
console.log('   Client ID:', CLIENT_ID.substring(0, 10) + '...' + CLIENT_ID.substring(CLIENT_ID.length - 4));
console.log('   Client Secret:', CLIENT_SECRET.substring(0, 10) + '...');
console.log('   Refresh Token:', REFRESH_TOKEN.substring(0, 15) + '...\n');

const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
});

spotifyApi.setRefreshToken(REFRESH_TOKEN);

async function testAuth() {
  try {
    console.log('🔄 Step 1: Testing refresh token...');
    
    // Try to refresh the access token
    const data = await spotifyApi.refreshAccessToken();
    const accessToken = data.body['access_token'];
    const expiresIn = data.body['expires_in'];
    
    console.log('✅ Step 1: SUCCESS!');
    console.log('   Access token obtained');
    console.log('   Token (first 20 chars):', accessToken.substring(0, 20) + '...');
    console.log('   Expires in:', expiresIn, 'seconds (' + Math.floor(expiresIn / 60) + ' minutes)\n');
    
    // Set the access token for API calls
    spotifyApi.setAccessToken(accessToken);
    
    console.log('🔄 Step 2: Testing API access (getting user profile)...');
    
    // Test a simple API call
    const me = await spotifyApi.getMe();
    console.log('✅ Step 2: SUCCESS!');
    console.log('   User ID:', me.body.id);
    console.log('   Display Name:', me.body.display_name || 'N/A');
    console.log('   Email:', me.body.email || 'N/A');
    console.log('   Country:', me.body.country || 'N/A');
    console.log('   Product:', me.body.product || 'N/A');
    console.log('   Followers:', me.body.followers?.total || 0);
    console.log('');
    
    console.log('🔄 Step 3: Testing search functionality...');
    
    // Test search
    const searchResult = await spotifyApi.searchTracks('happy', { limit: 3 });
    const tracks = searchResult.body.tracks?.items || [];
    
    console.log('✅ Step 3: SUCCESS!');
    console.log('   Found', tracks.length, 'tracks for query "happy"');
    if (tracks.length > 0) {
      console.log('   Example track:', tracks[0].name, 'by', tracks[0].artists[0].name);
    }
    console.log('');
    
    console.log('🔄 Step 4: Testing recommendations...');
    
    // Test recommendations
    const recommendations = await spotifyApi.getRecommendations({
      seed_genres: ['pop'],
      limit: 3
    });
    
    console.log('✅ Step 4: SUCCESS!');
    console.log('   Got', recommendations.body.tracks?.length || 0, 'recommendations');
    if (recommendations.body.tracks && recommendations.body.tracks.length > 0) {
      console.log('   Example:', recommendations.body.tracks[0].name);
    }
    console.log('');
    
    // Final success message
    console.log('='.repeat(80));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('='.repeat(80));
    console.log('\n✅ Your Spotify credentials are valid and working correctly!');
    console.log('✅ You can now use these credentials in your Apify actor.');
    console.log('\n📋 Next steps:');
    console.log('   1. Add these credentials to your Apify actor environment variables');
    console.log('   2. Mark them as "Secret" in Apify Console');
    console.log('   3. Rebuild your actor');
    console.log('   4. Test your actor\n');
    
  } catch (error) {
    console.error('\n' + '='.repeat(80));
    console.error('❌ TEST FAILED!');
    console.error('='.repeat(80) + '\n');
    
    console.error('Error message:', error.message);
    console.error('Status code:', error.statusCode || 'N/A');
    
    if (error.body) {
      console.error('Response body:', JSON.stringify(error.body, null, 2));
    }
    
    console.error('\n🔍 Troubleshooting:\n');
    
    if (error.message.includes('invalid_client') || error.statusCode === 400) {
      console.error('❌ Invalid Client Credentials');
      console.error('\nThis error means your Client ID or Client Secret is incorrect.\n');
      console.error('Solutions:');
      console.error('  1. Go to https://developer.spotify.com/dashboard');
      console.error('  2. Open your app');
      console.error('  3. Copy the Client ID (should be 32 characters)');
      console.error('  4. Click "Show Client Secret" and copy it');
      console.error('  5. Make sure there are no extra spaces or newlines');
      console.error('  6. Update your environment variables');
      console.error('  7. Run this test again\n');
    } else if (error.message.includes('invalid_grant') || error.statusCode === 401) {
      console.error('❌ Invalid Refresh Token');
      console.error('\nThis error means your refresh token is invalid or expired.\n');
      console.error('Solutions:');
      console.error('  1. The refresh token must be generated using the SAME Client ID/Secret');
      console.error('  2. Run: node scripts/spotify-auth-helper.js');
      console.error('  3. Follow the authorization flow');
      console.error('  4. Get a new refresh token');
      console.error('  5. Update your environment variables');
      console.error('  6. Run this test again\n');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('network')) {
      console.error('❌ Network Error');
      console.error('\nCannot reach Spotify API. Check your internet connection.\n');
    } else {
      console.error('❌ Unknown Error');
      console.error('\nPlease check the error details above.\n');
      console.error('Common issues:');
      console.error('  - Credentials contain extra spaces or newlines');
      console.error('  - Using wrong credentials from different Spotify app');
      console.error('  - Spotify API is temporarily down');
      console.error('  - Network/firewall blocking requests\n');
    }
    
    console.error('Full error object:', error);
    console.error('');
    
    process.exit(1);
  }
}

// Run the test
testAuth();
