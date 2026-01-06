// controllers/auth.controller.js
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Initialize Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345';

// User Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in Supabase
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{
                name,
                email,
                phone: phone || null,
                password: hashedPassword,
                role: 'user',
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create user',
                error: error.message
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'User created successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during signup',
            error: error.message
        });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Update last login
        await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', user.id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
};

// Send OTP (Phone Login)
exports.sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in database with expiry (5 minutes)
        const expiryTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();

        const { error } = await supabase
            .from('otp_verifications')
            .insert([{
                phone,
                otp,
                expires_at: expiryTime,
                created_at: new Date().toISOString()
            }]);

        if (error) {
            console.error('OTP storage error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP'
            });
        }

        // TODO: Send OTP via Twilio SMS
        console.log(`OTP for ${phone}: ${otp}`);

        res.json({
            success: true,
            message: 'OTP sent successfully',
            // Remove this in production:
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while sending OTP',
            error: error.message
        });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Phone and OTP are required'
            });
        }

        // Find valid OTP
        const { data: otpRecord, error } = await supabase
            .from('otp_verifications')
            .select('*')
            .eq('phone', phone)
            .eq('otp', otp)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !otpRecord) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Find or create user
        let { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('phone', phone)
            .single();

        if (!user) {
            // Create new user
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([{
                    phone,
                    name: `User ${phone.slice(-4)}`,
                    role: 'user',
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (createError) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create user'
                });
            }

            user = newUser;
        }

        // Delete used OTP
        await supabase
            .from('otp_verifications')
            .delete()
            .eq('id', otpRecord.id);

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, phone: user.phone, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during OTP verification',
            error: error.message
        });
    }
};

// Admin Login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('📧 Admin login attempt:', email);
        console.log('🔑 Password received:', password);
        console.log('✅ Expected password:', ADMIN_PASSWORD);

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Check if it's the admin credentials
        if (password !== ADMIN_PASSWORD) {
            console.log('❌ Password mismatch!');
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        console.log('✅ Password matched! Creating admin user...');

        // Find admin user or create one
        let     admin;
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .eq('role', 'admin')
                .single();

            admin = data;
            
            if (error) {
                console.log('⚠️ Supabase error (will create admin):', error.message);
            }
        } catch (dbError) {
            console.log('⚠️ Database connection issue:', dbError.message);
        }

        if (!admin) {
            // Create admin user
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const { data: newAdmin, error } = await supabase
                    .from('users')
                    .insert([{
                        name: 'Admin',
                        email,
                        password: hashedPassword,
                        role: 'admin',
                        created_at: new Date().toISOString()
                    }])
                    .select()
                    .single();

                if (error) {
                    console.log('⚠️ Failed to create admin in DB:', error.message);
                    // Continue anyway - allow login without DB
                    admin = {
                        id: 'admin-' + Date.now(),
                        name: 'Admin',
                        email: email,
                        role: 'admin'
                    };
                } else {
                    admin = newAdmin;
                }
            } catch (createError) {
                console.log('⚠️ Admin creation error:', createError.message);
                // Use temporary admin object
                admin = {
                    id: 'admin-' + Date.now(),
                    name: 'Admin',
                    email: email,
                    role: 'admin'
                };
            }
        }

        console.log('✅ Admin user ready:', admin);

        // Generate JWT token
        const token = jwt.sign(
            { userId: admin.id, email: admin.email, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('🎉 Login successful! Token generated.');

        res.json({
            success: true,
            message: 'Admin login successful',
            token,
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('💥 Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during admin login',
            error: error.message
        });
    }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, phone, role, created_at')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// OLD FUNCTIONS (keeping for reference)
const supabaseClient = require('../config/supabase');

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);

    if (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name,
        avatar: user.user_metadata?.avatar_url,
        provider: user.app_metadata?.provider,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: name,
        phone,
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      success: true,
      user: data.user,
    });
  } catch (err) {
    next(err);
  }
};

// Sign out
exports.signOut = async (req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, message: 'Signed out successfully' });
  } catch (err) {
    next(err);
  }
};

// Google Authentication
exports.googleAuth = async (req, res) => {
    try {
        const { credential, googleId, email, name, picture, accessToken } = req.body;

        let userEmail = email;
        let userName = name;
        let userPicture = picture;
        let userGoogleId = googleId;

        // If credential (ID token) is provided, verify it
        if (credential) {
            try {
                // Decode the JWT token (in production, verify with Google's public keys)
                const base64Payload = credential.split('.')[1];
                const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));
                
                userEmail = payload.email;
                userName = payload.name;
                userPicture = payload.picture;
                userGoogleId = payload.sub;

                // Verify token expiration
                if (payload.exp * 1000 < Date.now()) {
                    return res.status(401).json({
                        success: false,
                        message: 'Google token has expired'
                    });
                }
            } catch (decodeError) {
                console.error('Token decode error:', decodeError);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Google credential'
                });
            }
        }

        if (!userEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email is required for Google authentication'
            });
        }

        // Check if user exists
        let { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', userEmail)
            .single();

        let user;

        if (existingUser) {
            // Update existing user with Google info
            const { data: updatedUser, error: updateError } = await supabase
                .from('users')
                .update({
                    google_id: userGoogleId,
                    profile_picture: userPicture,
                    updated_at: new Date().toISOString()
                })
                .eq('email', userEmail)
                .select()
                .single();

            if (updateError) {
                console.error('Update error:', updateError);
            }
            user = updatedUser || existingUser;
        } else {
            // Create new user
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([{
                    name: userName,
                    email: userEmail,
                    google_id: userGoogleId,
                    profile_picture: userPicture,
                    role: 'user',
                    auth_provider: 'google',
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (createError) {
                console.error('Create error:', createError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create user account',
                    error: createError.message
                });
            }
            user = newUser;
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                role: user.role,
                authProvider: 'google'
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Google authentication successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profilePicture: user.profile_picture
            }
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during Google authentication',
            error: error.message
        });
    }
};
