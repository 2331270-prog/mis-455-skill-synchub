// scripts/seed.js
/**
 * Seed script for SkillSync Hub
 * - Connects to MongoDB (MONGO_URI or localhost)
 * - Clears existing collections (User, Member, Proposal, CollabRequest, Contact)
 * - Creates an admin user (admin@skillsynchub.com / admin123)
 * - Inserts sample members (images reference /assets/...)
 * - Inserts sample proposal, collaboration requests, and contact messages
 *
 * Usage:
 *   NODE_ENV=development node scripts/seed.js
 *
 * Make sure your images are in: public/assets/
 * e.g. public/assets/image-2.jpeg, image-4.jpeg, image_9.png, image-3.jpeg
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Adjust these requires to match your project structure
const User = require('../models/User');
const Member = require('../models/Member');
const Proposal = require('../models/Proposal');
const CollabRequest = require('../models/CollabRequest');
const Contact = require('../models/Contact');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillsync-hub';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Sample members using /assets/ (public folder) paths
const sampleMembers = [
  {
    id: 1,
    name: 'Fatema Tug Juhora',
    role: 'CSE Major | MIS Minor',
    bio: 'Highly motivated Computer Science and Engineering student with a minor in Management Information Systems.',
    skills: ['Programming (C++/Java)', 'Database Management (SQL)', 'Web Development (HTML/CSS)', 'Data Analysis'],
    image: '/assets/image-2.jpeg',
    email: '2331270@iub.edu.bd',
    languages: ['Bengali', 'English'],
    experience: [
      {
        title: 'B.Sc. in Computer Science and Engineering',
        company: 'Independent University, Bangladesh',
        duration: 'Present',
        description: 'CSE Major with Minor in Management Information Systems',
      },
    ],
    profileUrl: '/assets/html/juhora.html',
  },
  {
    id: 2,
    name: 'Jannatul Ferdous Suzane',
    role: 'Web Developer',
    bio: 'Passionate web developer with strong interest in building responsive and user-friendly websites.',
    skills: ['HTML/CSS', 'JavaScript', 'Manual Testing', 'Test Case Design', 'JIRA', 'Postman'],
    image: '/assets/image-4.jpeg',
    email: 'suzane@example.com',
    languages: ['Bengali (Native)', 'Hindi', 'English (Professional)'],
    experience: [
      {
        title: 'University Project',
        company: 'Academic Project',
        duration: '2022-2025',
        description: 'Developed and tested a software project as part of university assignment.',
      },
    ],
    profileUrl: '/assets/html/suzane.html',
  },
  {
    id: 3,
    name: 'Md. Ashraful Haque',
    role: 'SQA Engineer',
    bio: 'Software Quality Assurance Engineer with expertise in manual testing and quality assurance processes.',
    skills: ['Manual Testing', 'Test Case Design', 'JIRA', 'Postman', 'Selenium (Basic)', 'SQL', 'Git'],
    image: '/assets/image_9.png',
    email: 'ashhaquerafim@gmail.com',
    languages: ['Bengali (Native)', 'Hindi', 'English (Professional)'],
    experience: [
      {
        title: 'University Project',
        company: 'Academic Project',
        duration: '2022-2025',
        description: 'Developed and tested a software project as part of a university assignment.',
      },
      {
        title: 'Online Course on SQA',
        company: 'Ostad Platform',
        duration: '2025',
        description: 'Completed hands-on online course covering SDLC, STLC, defect tracking, and API testing.',
      },
    ],
    profileUrl: '/assets/html/rafim.html',
  },
  {
    id: 4,
    name: 'Md Solaiman Shabab',
    role: 'MIS Student',
    bio: 'MIS department student focused on integrating new technological competencies for enhanced personal satisfaction.',
    skills: ['HTML', 'CSS', 'JavaScript (Beginner)', 'Adobe Photoshop', 'Microsoft Office', 'Git'],
    image: '/assets/image-3.jpeg',
    email: 'shababcsx@gmail.com',
    languages: ['Bengali', 'English'],
    experience: [
      {
        title: 'Undergraduate Studies',
        company: 'Current University',
        duration: 'Present',
        description: 'Focused on MIS studies with interest in technology integration.',
      },
    ],
    profileUrl: '/assets/html/shabab.html',
  },
];

// Normalize members to ensure required fields exist and correct types
const normalizeMemberForDB = (m) => ({
  // Optionally store original id in externalId if you want to preserve it
  externalId: m.id ?? undefined,
  name: m.name ?? 'Unknown',
  role: m.role ?? '',
  bio: m.bio ?? '',
  skills: Array.isArray(m.skills) ? m.skills : (m.skills ? String(m.skills).split(',').map(s => s.trim()) : []),
  // Use public path for images
  image: m.image ?? '',
  email: m.email ?? '',
  languages: Array.isArray(m.languages) ? m.languages : (m.languages ? String(m.languages).split(',').map(s => s.trim()) : []),
  experience: Array.isArray(m.experience) ? m.experience : [],
  profileUrl: m.profileUrl ?? '',
  createdAt: new Date(),
  updatedAt: new Date(),
});

const generateSampleData = async () => {
  try {
    // Clear existing collections
    await User.deleteMany();
    await Member.deleteMany();
    await Proposal.deleteMany();
    await CollabRequest.deleteMany();
    await Contact.deleteMany();

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = await User.create({
      email: 'admin@skillsynchub.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'admin',
    });

    // Insert normalized members
    const normalizedMembers = sampleMembers.map(normalizeMemberForDB);
    const createdMembers = await Member.create(normalizedMembers);

    // Create project proposal
    const proposal = await Proposal.create({
      title: 'SkillSync Hub',
      description: 'Collaborative Talent & Portfolio Sharing Platform',
      objectives: [
        {
          title: 'Connect students via skill sharing',
          description: 'Create a platform where students can share their skills and collaborate on projects',
        },
        {
          title: 'Mini portfolio for each user',
          description: 'Provide users with a personal space to showcase their skills and achievements',
        },
        {
          title: 'Collaboration request',
          description: 'Enable users to request collaboration based on their skills and project needs',
        },
        {
          title: 'Skill-based search',
          description: 'Allow users to find collaborators based on specific skills and expertise',
        },
        {
          title: 'Messaging/Contact',
          description: 'Provide communication tools for seamless collaboration between users',
        },
      ],
      lastEditedBy: adminUser._id,
    });

    // Create sample collaboration requests
    const collabRequests = await CollabRequest.create([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        skill: 'Web Development',
        projectIdea: 'E-commerce platform',
        message: 'Looking for a frontend developer to help build an e-commerce platform with React and Node.js.',
        status: 'pending',
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        skill: 'UI/UX Design',
        projectIdea: 'Mobile app design',
        message: 'Need a designer for a fitness tracking mobile app. Looking for someone with experience in Figma.',
        status: 'approved',
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        skill: 'Data Analysis',
        projectIdea: 'Business intelligence dashboard',
        message: 'Seeking data analyst to create business intelligence dashboard using Python and Tableau.',
        status: 'rejected',
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        skill: 'Mobile Development',
        projectIdea: 'Cross-platform mobile app',
        message: 'Looking for a React Native developer to build a cross-platform mobile application.',
        status: 'pending',
      },
    ]);

    // Create sample contact messages
    const contactMessages = await Contact.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Collaboration',
        message: "I'm interested in collaborating on the SkillSync Hub project. Please let me know how I can get involved.",
        status: 'new',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Feature Request',
        message: 'I have a suggestion for a new feature that would enhance the collaboration experience.',
        status: 'read',
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        subject: 'Technical Support',
        message: "I'm having trouble accessing my profile. Could you please assist me?",
        status: 'responded',
      },
      {
        name: 'Sarah Brown',
        email: 'sarah@example.com',
        subject: 'General Inquiry',
        message: "I'd like to learn more about the SkillSync Hub platform and how it works.",
        status: 'new',
      },
    ]);

    console.log('Sample data created successfully!');
    console.log('Admin user created: admin@skillsynchub.com / admin123');
    console.log(`Created ${createdMembers.length} members`);
    console.log(`Created ${collabRequests.length} collaboration requests`);
    console.log(`Created ${contactMessages.length} contact messages`);
    console.log('Created 1 project proposal');

    process.exit(0);
  } catch (error) {
    console.error('Error creating sample data:', error);
    console.error(error);
    process.exit(1);
  }
};

// Run
connectDB().then(generateSampleData);
