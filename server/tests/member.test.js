const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Member = require('../models/Member');

describe('Member Endpoints', () => {
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
    await Member.deleteMany();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up before each test
    await Member.deleteMany();
  });

  describe('GET /api/members', () => {
    it('should get all members', async () => {
      // Create test members
      const member1 = new Member({
        name: 'John Doe',
        role: 'Developer',
        bio: 'Full-stack developer',
        skills: ['JavaScript', 'React'],
        image: 'test1.jpg'
      });

      const member2 = new Member({
        name: 'Jane Smith',
        role: 'Designer',
        bio: 'UI/UX designer',
        skills: ['Figma', 'Photoshop'],
        image: 'test2.jpg'
      });

      await member1.save();
      await member2.save();

      // Get all members
      const response = await request(app).get('/api/members');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBe(2);
    });

    it('should return empty array when no members exist', async () => {
      const response = await request(app).get('/api/members');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBe(0);
    });
  });

  describe('GET /api/members/:id', () => {
    it('should get member by ID', async () => {
      // Create test member
      const member = new Member({
        name: 'Test Member',
        role: 'Test Role',
        bio: 'Test bio',
        skills: ['Skill 1', 'Skill 2'],
        image: 'test.jpg'
      });

      await member.save();

      // Get member by ID
      const response = await request(app).get(`/api/members/${member._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('_id', member._id.toString());
      expect(response.body.data).toHaveProperty('name', 'Test Member');
    });

    it('should return 404 for non-existent member', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/members/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Member Model', () => {
    it('should create a new member', async () => {
      const memberData = {
        name: 'New Member',
        role: 'Developer',
        bio: 'A passionate developer',
        skills: ['JavaScript', 'React', 'Node.js'],
        image: 'new-member.jpg',
        email: 'newmember@example.com',
        languages: ['English', 'Spanish']
      };

      const member = new Member(memberData);
      await member.save();

      expect(member._id).toBeDefined();
      expect(member.name).toBe(memberData.name);
      expect(member.role).toBe(memberData.role);
      expect(member.bio).toBe(memberData.bio);
      expect(member.skills).toEqual(memberData.skills);
      expect(member.languages).toEqual(memberData.languages);
    });

    it('should validate required fields', async () => {
      const member = new Member({});
      
      await expect(member.save()).rejects.toThrow();
    });

    it('should handle skills array', async () => {
      const memberData = {
        name: 'Skilled Member',
        role: 'Expert',
        bio: 'Very skilled',
        skills: ['Skill 1', 'Skill 2', 'Skill 3'],
        image: 'skilled.jpg'
      };

      const member = new Member(memberData);
      await member.save();

      expect(Array.isArray(member.skills)).toBe(true);
      expect(member.skills.length).toBe(3);
    });
  });
});