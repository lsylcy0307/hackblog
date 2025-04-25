/**
 * Simple API test script
 * 
 * To run: node test_api.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
let token = '';
let userId = '';
let articleId = '';

// Test user registration
async function testRegister() {
  try {
    console.log('Testing user registration...');
    const response = await axios.post(`${API_URL}/users/register`, {
      username: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      linkedin_url: 'https://linkedin.com/in/testuser',
      personal_bio: 'Test user for API testing',
      class_year: '2023',
      github_url: 'https://github.com/testuser'
    });

    console.log('User registered successfully');
    token = response.data.token;
    userId = response.data.user.id;
    console.log(`Token: ${token}`);
    console.log(`User ID: ${userId}`);
    return true;
  } catch (error) {
    console.error('Registration failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Test user login
async function testLogin() {
  try {
    console.log('\nTesting user login...');
    const response = await axios.post(`${API_URL}/users/login`, {
      email: 'test@example.com',
      password: 'password123'
    });

    console.log('User logged in successfully');
    token = response.data.token;
    userId = response.data.user.id;
    console.log(`Token: ${token}`);
    console.log(`User ID: ${userId}`);
    return true;
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Test create article
async function testCreateArticle() {
  try {
    console.log('\nTesting article creation...');
    const response = await axios.post(
      `${API_URL}/articles`, 
      {
        title: 'Test Article',
        article_content: {
          blocks: [
            {
              type: 'paragraph',
              text: 'This is a test article created for API testing.'
            }
          ]
        },
        tags: ['engineering']
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log('Article created successfully');
    articleId = response.data.data._id;
    console.log(`Article ID: ${articleId}`);
    return true;
  } catch (error) {
    console.error('Article creation failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Test get all articles
async function testGetArticles() {
  try {
    console.log('\nTesting get all articles...');
    const response = await axios.get(`${API_URL}/articles`);
    
    console.log('Articles retrieved successfully');
    console.log(`Total articles: ${response.data.count}`);
    return true;
  } catch (error) {
    console.error('Get articles failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Test get single article
async function testGetArticle() {
  try {
    console.log('\nTesting get single article...');
    const response = await axios.get(`${API_URL}/articles/${articleId}`);
    
    console.log('Article retrieved successfully');
    console.log(`Article title: ${response.data.data.title}`);
    return true;
  } catch (error) {
    console.error('Get article failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Test update article
async function testUpdateArticle() {
  try {
    console.log('\nTesting update article...');
    const response = await axios.put(
      `${API_URL}/articles/${articleId}`,
      {
        title: 'Updated Test Article',
        article_content: {
          blocks: [
            {
              type: 'paragraph',
              text: 'This article has been updated.'
            }
          ]
        }
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    console.log('Article updated successfully');
    console.log(`Updated title: ${response.data.data.title}`);
    return true;
  } catch (error) {
    console.error('Update article failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Test delete article
async function testDeleteArticle() {
  try {
    console.log('\nTesting delete article...');
    await axios.delete(
      `${API_URL}/articles/${articleId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    console.log('Article deleted successfully');
    return true;
  } catch (error) {
    console.error('Delete article failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('=== STARTING API TESTS ===\n');
  
  // First try login, if it fails (likely because user doesn't exist), register
  let loginResult = await testLogin();
  if (!loginResult) {
    await testRegister();
  }
  
  // Run article tests
  await testCreateArticle();
  await testGetArticles();
  await testGetArticle();
  await testUpdateArticle();
  await testDeleteArticle();
  
  console.log('\n=== API TESTS COMPLETED ===');
}

runTests(); 