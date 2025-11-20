// Simple skill gap API for CodeAtRandom assignment
// Built by Ravish Kumar

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes (allows frontend to communicate with backend)
app.use(bodyParser.json()); // Parse JSON request bodies

// Predefined skills for each role
const ROLE_SKILLS = {
    "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Git"],
    "Backend Developer": ["Java", "Spring Boot", "SQL", "APIs", "Git"],
    "Data Analyst": ["Excel", "SQL", "Python", "Dashboards", "Statistics"]
};

// Skill Gap API - compares user skills with role requirements
app.post('/api/skill-gap', (req, res) => {
    try {
        const { role, skills } = req.body;

        // Input validation
        if (!role || !skills) {
            return res.status(400).json({
                error: "Missing required fields",
                message: "Both 'role' and 'skills' are required"
            });
        }

        // Get target skills for the role
        const target = ROLE_SKILLS[role] || [];

        // Handle unknown role
        if (target.length === 0) {
            return res.status(400).json({
                error: "Invalid role",
                message: `Role must be one of: ${Object.keys(ROLE_SKILLS).join(', ')}`
            });
        }

        // Convert to lowercase for case-insensitive matching
        const userSkills = skills.split(',').map(s => s.trim().toLowerCase());

        // Find matched and missing skills
        const matched = target.filter(s => userSkills.includes(s.toLowerCase()));
        const missing = target.filter(s => !userSkills.includes(s.toLowerCase()));

        // Generate personalized recommendations
        const recommendations = missing.length > 0
            ? missing.map(s => `Master ${s} to fit the ${role} role.`)
            : ["Great! You have all the required skills for this role."];

        // Return analysis results
        res.json({
            role,
            matchedSkills: matched,
            missingSkills: missing,
            recommendations,
            suggestedLearningOrder: missing // Skills to learn in priority order
        });
    } catch (error) {
        console.error('Error in /api/skill-gap:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ========================================
// API 2: CAREER ROADMAP GENERATOR
// ========================================
// Career Roadmap API - returns 3-phase learning path for each role
app.post('/api/roadmap', (req, res) => {
    try {
        const { role } = req.body;

        // Input validation
        if (!role) {
            return res.status(400).json({
                error: "Missing required field",
                message: "'role' is required"
            });
        }

        let roadmap = [];

        // Different roadmaps for each role
        if (role === "Backend Developer") {
            roadmap = [
                {
                    phase: "Phase 1 (1-2 months)",
                    focus: "Java Basics, OOP Concepts, Git Version Control"
                },
                {
                    phase: "Phase 2 (2 months)",
                    focus: "Spring Boot Framework, REST APIs, SQL Databases"
                },
                {
                    phase: "Phase 3 (1-2 months)",
                    focus: "Microservices Architecture, Cloud Deployment (AWS), System Design"
                }
            ];
        } else if (role === "Frontend Developer") {
            roadmap = [
                {
                    phase: "Phase 1 (1 month)",
                    focus: "HTML5, CSS3, JavaScript ES6+ Fundamentals"
                },
                {
                    phase: "Phase 2 (2 months)",
                    focus: "React.js, Tailwind CSS, State Management (Redux/Context)"
                },
                {
                    phase: "Phase 3 (1 month)",
                    focus: "Next.js Framework, Performance Optimization, SEO Best Practices"
                }
            ];
        } else if (role === "Data Analyst") {
            roadmap = [
                {
                    phase: "Phase 1 (1-2 months)",
                    focus: "Excel Advanced Functions, SQL Queries, Data Cleaning"
                },
                {
                    phase: "Phase 2 (2 months)",
                    focus: "Python (Pandas, NumPy), Statistical Analysis, Data Visualization"
                },
                {
                    phase: "Phase 3 (1-2 months)",
                    focus: "Dashboard Creation (Tableau/Power BI), Business Intelligence, Real Projects"
                }
            ];
        } else {
            // Generic roadmap for unknown roles
            roadmap = [
                { phase: "Phase 1", focus: "Core Foundations & Basic Skills" },
                { phase: "Phase 2", focus: "Advanced Frameworks & Tools" },
                { phase: "Phase 3", focus: "Real-world Projects & System Design" }
            ];
        }

        res.json({ role, roadmap });
    } catch (error) {
        console.error('Error in /api/roadmap:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// HackerNews API - fetches top 5 tech stories
app.get('/api/news', async (req, res) => {
    try {
        // Step 1: Fetch top story IDs from HackerNews
        const topStoriesResponse = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topIds = topStoriesResponse.data.slice(0, 5); // Get top 5 story IDs

        // Step 2: Fetch details for each story in parallel
        const promises = topIds.map(id =>
            axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        );
        const responses = await Promise.all(promises);

        // Step 3: Extract and format required fields
        const stories = responses.map(r => ({
            title: r.data.title || 'No title',
            url: r.data.url || `https://news.ycombinator.com/item?id=${r.data.id}`,
            score: r.data.score || 0,
            time: new Date(r.data.time * 1000).toLocaleDateString(),
            type: r.data.type || 'story',
            by: r.data.by || 'unknown'
        }));

        res.json(stories);
    } catch (error) {
        console.error('Error fetching HackerNews:', error.message);
        res.status(500).json({
            error: "Failed to fetch news",
            message: "Unable to retrieve stories from HackerNews API"
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'CodeAtRandom AI API is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API Endpoints:`);
    console.log(`   - POST /api/skill-gap`);
    console.log(`   - POST /api/roadmap`);
    console.log(`   - GET  /api/news`);
    console.log(`   - GET  /api/health`);
});
