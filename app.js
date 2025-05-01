// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const loadingMessage = document.getElementById('loading-message');
const faceStatus = document.getElementById('face-status');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const accessDenied = document.getElementById('access-denied');
const cameraContainer = document.getElementById('camera-container');
const dashboard = document.getElementById('dashboard');
const retryButton = document.getElementById('retry-button');
const registerLink = document.getElementById('register-link');
const loginLink = document.getElementById('login-link');
const logoutButton = document.getElementById('logout-button');
const authForm = document.getElementById('auth-form');
const registerAuthForm = document.getElementById('register-auth-form');
const historyData = document.getElementById('history-data');

// Canvas context
const ctx = canvas.getContext('2d');

// Global variables
let model;
let faceDetectionInterval;
let isFaceDetected = false;
let isModelLoaded = false;
let loginAttempts = [];

// Initialize the application
async function init() {
    try {
        // Set up camera
        await setupCamera();
        
        // Load face detection model
        model = await blazeface.load();
        console.log('Face detection model loaded!');
        isModelLoaded = true;
        loadingMessage.style.display = 'none';
        
        // Start face detection
        startFaceDetection();
        
        // Set up event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Error initializing app:', error);
        loadingMessage.textContent = 'Error initializing camera. Please check camera permissions.';
    }
}

// Setup camera
async function setupCamera() {
    const constraints = {
        video: {
            width: 640,
            height: 480,
            facingMode: 'user'
        },
        audio: false
    };
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                // Set canvas dimensions to match video
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                resolve();
            };
        });
    } catch (error) {
        throw new Error('Camera access denied: ' + error.message);
    }
}

// Start face detection
function startFaceDetection() {
    faceDetectionInterval = setInterval(async () => {
        if (!isModelLoaded) return;
        
        try {
            const predictions = await detectFaces();
            
            if (predictions.length > 0) {
                // Face detected
                isFaceDetected = true;
                faceStatus.textContent = 'Face Detected! You can proceed to login.';
                faceStatus.className = 'face-detected';
                
                // Draw face rectangle
                drawFaceDetections(predictions);
                
                // Show login form after 2 seconds of continuous face detection
                setTimeout(() => {
                    if (isFaceDetected) {
                        cameraContainer.style.display = 'none';
                        loginForm.classList.remove('hidden');
                    }
                }, 2000);
                
            } else {
                // No face detected
                isFaceDetected = false;
                faceStatus.textContent = 'No face detected. Please position your face in front of the camera.';
                faceStatus.className = 'no-face';
                
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        } catch (error) {
            console.error('Error during face detection:', error);
        }
    }, 100); // Check every 100ms
}

// Detect faces using BlazeFace
async function detectFaces() {
    if (!model) return [];
    
    // Pass in the video element to the model
    const predictions = await model.estimateFaces(video, false);
    return predictions;
}

// Draw face detections on canvas
function drawFaceDetections(predictions) {
    // Clear canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw each detected face
    predictions.forEach(prediction => {
        const start = prediction.topLeft;
        const end = prediction.bottomRight;
        const size = [end[0] - start[0], end[1] - start[1]];
        
        // Draw rectangle around face
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 4;
        ctx.strokeRect(start[0], start[1], size[0], size[1]);
        
        // Draw face landmarks (eyes, nose, mouth)
        const landmarks = prediction.landmarks;
        
        ctx.fillStyle = '#FF0000';
        landmarks.forEach(landmark => {
            ctx.beginPath();
            ctx.arc(landmark[0], landmark[1], 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Login form submission
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });
    
    // Register form submission
    registerAuthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister();
    });
    
    // Register link click
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });
    
    // Login link click
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
    
    // Retry button click
    retryButton.addEventListener('click', () => {
        accessDenied.classList.add('hidden');
        cameraContainer.style.display = 'block';
        startFaceDetection();
    });
    
    // Logout button click
    logoutButton.addEventListener('click', () => {
        logout();
    });
}

// Handle login submission
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Mock authentication (in real app, this would call an API)
    if (username && password) {
        // Get user from localStorage or use a default if not found
        const users = JSON.parse(localStorage.getItem('users')) || {};
        
        if (users[username] && users[username].password === password) {
            // Login successful
            loginForm.classList.add('hidden');
            dashboard.classList.remove('hidden');
            
            // Add login attempt to history
            addLoginAttempt(username, 'Success');
            
            // Display login history
            displayLoginHistory();
            
            // Clear face detection interval
            clearInterval(faceDetectionInterval);
        } else {
            // Login failed
            alert('Invalid username or password');
            addLoginAttempt(username, 'Failed - Wrong Credentials');
        }
    } else {
        alert('Please enter both username and password');
    }
}

// Handle register submission
function handleRegister() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // Get existing users or create empty object
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    // Check if username already exists
    if (users[username]) {
        alert('Username already exists. Please choose another one.');
        return;
    }
    
    // Add new user
    users[username] = {
        password: password,
        registeredDate: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Registration successful! You can now login.');
    
    // Switch to login form
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
}

// Add login attempt to history
function addLoginAttempt(username, status) {
    const loginAttempt = {
        username: username,
        timestamp: new Date().toISOString(),
        status: status,
        device: navigator.userAgent
    };
    
    // Get existing login attempts or create empty array
    const attempts = JSON.parse(localStorage.getItem('loginAttempts')) || [];
    attempts.push(loginAttempt);
    
    // Save to localStorage
    localStorage.setItem('loginAttempts', JSON.stringify(attempts));
}

// Display login history
function displayLoginHistory() {
    // Get login attempts from localStorage
    const attempts = JSON.parse(localStorage.getItem('loginAttempts')) || [];
    
    // Clear existing history
    historyData.innerHTML = '';
    
    // Add each attempt to the table
    attempts.reverse().forEach(attempt => {
        const row = document.createElement('tr');
        
        const dateCell = document.createElement('td');
        dateCell.textContent = new Date(attempt.timestamp).toLocaleString();
        
        const statusCell = document.createElement('td');
        statusCell.textContent = attempt.status;
        if (attempt.status.includes('Success')) {
            statusCell.style.color = 'green';
        } else {
            statusCell.style.color = 'red';
        }
        
        const deviceCell = document.createElement('td');
        deviceCell.textContent = getBrowserName(attempt.device);
        
        row.appendChild(dateCell);
        row.appendChild(statusCell);
        row.appendChild(deviceCell);
        
        historyData.appendChild(row);
    });
}

// Get browser name from user agent
function getBrowserName(userAgent) {
    if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
    if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
    if (userAgent.indexOf('Safari') > -1) return 'Safari';
    if (userAgent.indexOf('Edge') > -1) return 'Edge';
    if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) return 'Internet Explorer';
    return 'Unknown Browser';
}

// Logout function
function logout() {
    // Show camera and login form again
    dashboard.classList.add('hidden');
    cameraContainer.style.display = 'block';
    
    // Clear form fields
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    // Start face detection again
    startFaceDetection();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);