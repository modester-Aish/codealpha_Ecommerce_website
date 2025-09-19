const http = require('http');

function testCategoriesAPI() {
  console.log('Testing categories API endpoints...');
  
  // Test main categories endpoint
  console.log('\n1. Testing /api/categories/main endpoint...');
  const mainOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/categories/main',
    method: 'GET'
  };

  const mainReq = http.request(mainOptions, (res) => {
    console.log(`Main categories response status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Main categories response data:', data);
      try {
        const jsonData = JSON.parse(data);
        console.log('Main categories found:', jsonData.length);
        if (jsonData.length > 0) {
          console.log('Main categories:');
          jsonData.forEach((cat, index) => {
            console.log(`  ${index + 1}. "${cat.name}" (ID: ${cat._id})`);
          });
        } else {
          console.log('❌ No main categories returned by API!');
        }
      } catch (error) {
        console.log('Failed to parse JSON:', error.message);
      }
    });
  });

  mainReq.on('error', (error) => {
    console.error('Main categories request error:', error.message);
  });

  mainReq.end();
}

testCategoriesAPI();










