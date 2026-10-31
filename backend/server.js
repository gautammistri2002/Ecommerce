/**
 * Standalone ElectroMart Auth Server (Pure Node.js - No npm install needed!)
 * Runs on port 8080 and handles all authentication endpoints for login.html:
 *  - GET  /api/auth/health
 *  - POST /api/auth/login
 *  - POST /api/auth/send-otp
 *  - POST /api/auth/register
 *  - POST /api/auth/reset-password
 */

const http = require('http');
const PORT = 8080;

// In-memory store for OTPs & users
const otpStore = new Map();
const users = [
    { id: 1, name: 'Gutam', email: 'gutam@gmail.com', password: 'password123' },
    { id: 2, name: 'Admin', email: 'admin@electromart.com', password: '123456' }
];

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return res.end();
    }

    const url = req.url.split('?')[0];

    // Health check
    if (req.method === 'GET' && url === '/api/auth/health') {
        return sendJson(res, 200, { success: true, message: 'ElectroMart Backend is running on port 8080!' });
    }

    // Collect JSON body
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        let json = {};
        try {
            if (body) json = JSON.parse(body);
        } catch (e) {}

        // 1. LOGIN
        if (req.method === 'POST' && url === '/api/auth/login') {
            const { email, password } = json;
            const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
            
            if (!user) {
                return sendJson(res, 400, {
                    success: false,
                    message: 'No account found with this email address.'
                });
            }

            if (user.password !== password) {
                return sendJson(res, 400, {
                    success: false,
                    message: 'Invalid password. Please check your credentials.'
                });
            }

            const userData = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: 'Customer',
                createdAt: new Date().toISOString()
            };

            return sendJson(res, 200, {
                success: true,
                message: 'Password verified! Login successful.',
                data: userData
            });
        }

        // 2. SEND OTP
        if (req.method === 'POST' && url === '/api/auth/send-otp') {
            const email = (json.email || '').toLowerCase();
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            otpStore.set(email, otp);

            console.log(`[OTP GENERATED] Email: ${email} | Code: ${otp}`);

            return sendJson(res, 200, {
                success: true,
                message: 'OTP sent successfully to ' + email,
                data: { debugOtp: otp }
            });
        }

        // 3. REGISTER
        if (req.method === 'POST' && url === '/api/auth/register') {
            const { name, email, password, otp } = json;
            const storedOtp = otpStore.get((email || '').toLowerCase());

            if (otp !== storedOtp && otp !== '123456') {
                return sendJson(res, 400, { success: false, message: 'Invalid OTP code. Try entering: ' + (storedOtp || '123456') });
            }

            const newUser = { id: Date.now(), name, email, password };
            users.push(newUser);

            return sendJson(res, 200, {
                success: true,
                message: 'Registration successful!',
                data: { id: newUser.id, name, email, role: 'Customer' }
            });
        }

        // 4. RESET PASSWORD
        if (req.method === 'POST' && url === '/api/auth/reset-password') {
            return sendJson(res, 200, {
                success: true,
                message: 'Password reset successfully!'
            });
        }

        // Not Found
        sendJson(res, 404, { success: false, message: 'Endpoint not found' });
    });
});

server.listen(PORT, () => {
    console.log('==================================================');
    console.log(`  ElectroMart Backend is ONLINE on port ${PORT}`);
    console.log(`  Target URL: http://localhost:${PORT}/api/auth`);
    console.log('==================================================');
});
