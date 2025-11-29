const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillsynchub_test';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clean up and close connection
    await User.deleteMany();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up before each test
    await User.deleteMany();
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials and return JWT token', async () => {
      // Create a test user
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'admin'
      };

      // Hash password and create user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });

      // Login request
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
    });

    it('should return 400 for invalid credentials', async () => {
      // Login request with wrong password
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing email or password', async () => {
      // Login request without email
      const response1 = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123'
        });

      expect(response1.status).toBe(400);

      // Login request without password
      const response2 = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
        });

      expect(response2.status).toBe(400);
    });
  });

  describe('User Model', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        role: 'user'
      };

      const user = new User(userData);
      await user.save();

      expect(user._id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.role).toBe(userData.role);
      expect(user.password).not.toBe(userData.password); // Password should be hashed
    });

    it('should not create user with duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'User 1',
        role: 'user'
      };

      // Create first user
      await User.create(userData);

      // Try to create user with same email
      const duplicateUser = new User({
        ...userData,
        name: 'User 2'
      });

      await expect(duplicateUser.save()).rejects.toThrow();
    });

    it('should validate required fields', async () => {
      const user = new User({});
      
      await expect(user.save()).rejects.toThrow();
    });
  });
});

// Mock bcrypt for testing
const bcrypt = {
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockImplementation((password, salt) => `hashed_${password}`),
  compare: jest.fn().mockImplementation((password, hashedPassword) => 
    hashedPassword === `hashed_${password}`
  )
};

module.exports = { bcrypt };