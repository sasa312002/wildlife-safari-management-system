import axios from 'axios';

const testAdminLogin = async () => {
  try {
    console.log('Testing admin login...');
    
    const response = await axios.post('http://localhost:5000/api/auth/staff-login', {
      email: 'admin@mufasa.com',
      password: 'admin123'
    });
    
    console.log('✅ Admin login successful!');
    console.log('Response:', response.data);
    console.log('User role:', response.data.user.role);
    
  } catch (error) {
    console.log('❌ Admin login failed!');
    console.log('Error status:', error.response?.status);
    console.log('Error data:', error.response?.data);
    console.log('Error message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('Server is not running on port 5000');
    }
  }
};

testAdminLogin();
