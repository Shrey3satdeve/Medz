const fs = require('fs').promises;
const path = require('path');

const MEDICAL_DB_PATH = path.join(__dirname, '../data/medical-database.json');

// Load medical database
async function loadMedicalDB() {
    try {
        const data = await fs.readFile(MEDICAL_DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading medical database:', error);
        return { symptoms: {}, keywords: {} };
    }
}

// Save medical database
async function saveMedicalDB(data) {
    try {
        await fs.writeFile(MEDICAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error saving medical database:', error);
        return false;
    }
}

// Get all symptoms
exports.getAllSymptoms = async (req, res) => {
    try {
        const db = await loadMedicalDB();
        res.json({
            success: true,
            count: Object.keys(db.symptoms).length,
            symptoms: db.symptoms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching symptoms',
            error: error.message
        });
    }
};

// Get specific symptom details
exports.getSymptomDetails = async (req, res) => {
    try {
        const { symptomName } = req.params;
        const db = await loadMedicalDB();
        
        const symptomData = db.symptoms[symptomName.toLowerCase()];
        
        if (!symptomData) {
            return res.status(404).json({
                success: false,
                message: 'Symptom not found'
            });
        }
        
        res.json({
            success: true,
            symptom: symptomName,
            data: symptomData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching symptom details',
            error: error.message
        });
    }
};

// Add new symptom
exports.addSymptom = async (req, res) => {
    try {
        const { name, tests, medicines, severity, advice, keywords } = req.body;
        
        if (!name || !tests || !medicines || !severity || !advice) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, tests, medicines, severity, advice'
            });
        }
        
        const db = await loadMedicalDB();
        const symptomKey = name.toLowerCase().replace(/ /g, '_');
        
        // Check if symptom already exists
        if (db.symptoms[symptomKey]) {
            return res.status(409).json({
                success: false,
                message: 'Symptom already exists'
            });
        }
        
        // Add symptom
        db.symptoms[symptomKey] = {
            tests: tests,
            medicines: medicines,
            severity: severity,
            advice: advice
        };
        
        // Add keywords
        if (keywords && keywords.length > 0) {
            db.keywords[symptomKey] = keywords;
        }
        
        const saved = await saveMedicalDB(db);
        
        if (saved) {
            res.json({
                success: true,
                message: 'Symptom added successfully',
                symptom: symptomKey,
                data: db.symptoms[symptomKey]
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error saving symptom to database'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding symptom',
            error: error.message
        });
    }
};

// Update symptom
exports.updateSymptom = async (req, res) => {
    try {
        const { symptomName } = req.params;
        const { tests, medicines, severity, advice, keywords } = req.body;
        
        const db = await loadMedicalDB();
        const symptomKey = symptomName.toLowerCase();
        
        if (!db.symptoms[symptomKey]) {
            return res.status(404).json({
                success: false,
                message: 'Symptom not found'
            });
        }
        
        // Update symptom data
        if (tests) db.symptoms[symptomKey].tests = tests;
        if (medicines) db.symptoms[symptomKey].medicines = medicines;
        if (severity) db.symptoms[symptomKey].severity = severity;
        if (advice) db.symptoms[symptomKey].advice = advice;
        
        // Update keywords
        if (keywords && keywords.length > 0) {
            db.keywords[symptomKey] = keywords;
        }
        
        const saved = await saveMedicalDB(db);
        
        if (saved) {
            res.json({
                success: true,
                message: 'Symptom updated successfully',
                symptom: symptomKey,
                data: db.symptoms[symptomKey]
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error saving updated symptom'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating symptom',
            error: error.message
        });
    }
};

// Delete symptom
exports.deleteSymptom = async (req, res) => {
    try {
        const { symptomName } = req.params;
        const db = await loadMedicalDB();
        const symptomKey = symptomName.toLowerCase();
        
        if (!db.symptoms[symptomKey]) {
            return res.status(404).json({
                success: false,
                message: 'Symptom not found'
            });
        }
        
        // Delete symptom and keywords
        delete db.symptoms[symptomKey];
        delete db.keywords[symptomKey];
        
        const saved = await saveMedicalDB(db);
        
        if (saved) {
            res.json({
                success: true,
                message: 'Symptom deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error deleting symptom'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting symptom',
            error: error.message
        });
    }
};

// Search symptoms by keyword
exports.searchSymptoms = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query (q) is required'
            });
        }
        
        const db = await loadMedicalDB();
        const query = q.toLowerCase();
        const matches = [];
        
        // Search in symptom names
        for (const [symptomKey, symptomData] of Object.entries(db.symptoms)) {
            if (symptomKey.includes(query)) {
                matches.push({
                    symptom: symptomKey,
                    data: symptomData,
                    matchType: 'name'
                });
            }
        }
        
        // Search in keywords
        for (const [symptomKey, keywordList] of Object.entries(db.keywords)) {
            const keywordMatch = keywordList.some(keyword => 
                keyword.toLowerCase().includes(query)
            );
            
            if (keywordMatch && !matches.find(m => m.symptom === symptomKey)) {
                matches.push({
                    symptom: symptomKey,
                    data: db.symptoms[symptomKey],
                    matchType: 'keyword'
                });
            }
        }
        
        res.json({
            success: true,
            query: q,
            count: matches.length,
            results: matches
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching symptoms',
            error: error.message
        });
    }
};

// AI-powered symptom analysis (can integrate with OpenAI/Gemini later)
exports.analyzeSymptoms = async (req, res) => {
    try {
        const { symptoms, duration, severity } = req.body;
        
        if (!symptoms || symptoms.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Symptoms description is required'
            });
        }
        
        const db = await loadMedicalDB();
        const detectedSymptoms = [];
        const message = symptoms.toLowerCase();
        
        // Detect symptoms from keywords
        for (const [symptomKey, keywordList] of Object.entries(db.keywords)) {
            const found = keywordList.some(keyword => 
                message.includes(keyword.toLowerCase())
            );
            
            if (found) {
                detectedSymptoms.push({
                    symptom: symptomKey,
                    data: db.symptoms[symptomKey]
                });
            }
        }
        
        if (detectedSymptoms.length === 0) {
            return res.json({
                success: true,
                detected: false,
                message: 'No specific symptoms detected. Please describe your symptoms more clearly.',
                suggestions: [
                    'Try describing your main symptom (e.g., "headache", "fever")',
                    'Mention location of pain or discomfort',
                    'Include other symptoms you\'re experiencing'
                ]
            });
        }
        
        // Build response with all detected symptoms
        const response = {
            success: true,
            detected: true,
            count: detectedSymptoms.length,
            symptoms: detectedSymptoms,
            duration: duration || 'Not specified',
            severity: severity || 'Not specified',
            recommendations: {
                tests: [],
                medicines: [],
                advice: []
            }
        };
        
        // Aggregate recommendations
        detectedSymptoms.forEach(item => {
            response.recommendations.tests.push(...item.data.tests);
            response.recommendations.medicines.push(...item.data.medicines);
            response.recommendations.advice.push(item.data.advice);
        });
        
        // Remove duplicates
        response.recommendations.tests = [...new Set(response.recommendations.tests)];
        response.recommendations.medicines = [...new Set(response.recommendations.medicines)];
        
        res.json(response);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error analyzing symptoms',
            error: error.message
        });
    }
};
