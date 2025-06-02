// Global state
let currentPage = 'survey';
let surveys = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Survey app initialized');
    loadSurveys();
    showSurvey();
    
    // Add form submit listener
    document.getElementById('survey-form').addEventListener('submit', handleSubmit);
});

// Navigation functions
function showSurvey() {
    currentPage = 'survey';
    document.getElementById('survey-page').classList.remove('hidden');
    document.getElementById('results-page').classList.add('hidden');
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.nav-btn')[0].classList.add('active');
}

function showResults() {
    currentPage = 'results';
    document.getElementById('survey-page').classList.add('hidden');
    document.getElementById('results-page').classList.remove('hidden');
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.nav-btn')[1].classList.add('active');
    
    displayResults();
}

// Load surveys from localStorage
function loadSurveys() {
    const stored = localStorage.getItem('surveys');
    surveys = stored ? JSON.parse(stored) : [];
    console.log('Loaded surveys:', surveys);
}

// Save surveys to localStorage
function saveSurveys() {
    localStorage.setItem('surveys', JSON.stringify(surveys));
    console.log('Surveys saved to localStorage');
}

// Delete individual survey response
function deleteSurvey(surveyId) {
    if (confirm('Are you sure you want to delete this survey response?')) {
        surveys = surveys.filter(survey => survey.id !== surveyId);
        saveSurveys();
        showToast('Survey response deleted successfully', 'success');
        
        // Refresh the results display
        if (currentPage === 'results') {
            displayResults();
        }
    }
}

// Clear all survey data
function clearAllData() {
    if (confirm('Are you sure you want to delete ALL survey data? This action cannot be undone.')) {
        surveys = [];
        saveSurveys();
        showToast('All survey data cleared successfully', 'success');
        
        // Refresh the results display
        if (currentPage === 'results') {
            displayResults();
        }
    }
}

// Export surveys to CSV
function exportToCSV() {
    if (surveys.length === 0) {
        showToast('No data to export', 'error');
        return;
    }

    // Create CSV header
    const headers = [
        'ID',
        'Full Name',
        'Email',
        'Date of Birth',
        'Age',
        'Favorite Foods',
        'Pizza Rating',
        'Pasta Rating',
        'Pap & Wors Rating',
        'Eat Out Rating',
        'Submitted At'
    ];

    // Create CSV rows
    const rows = surveys.map(survey => [
        survey.id,
        survey.fullName,
        survey.email,
        survey.dateOfBirth,
        survey.age,
        survey.favoriteFoods.join('; '),
        survey.ratings.pizza,
        survey.ratings.pasta,
        survey.ratings.papAndWors,
        survey.ratings.other,
        new Date(survey.submittedAt).toLocaleString()
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `survey-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Survey data exported successfully!', 'success');
}

// Form validation
function validateForm() {
    const errors = {};
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const age = document.getElementById('age').value;
    
    // Validate required fields
    if (!fullName) errors.fullName = 'Full name is required';
    if (!email) errors.email = 'Email is required';
    if (!dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!age) errors.age = 'Age is required';
    
    // Validate age range
    const ageNum = parseInt(age);
    if (age && (isNaN(ageNum) || ageNum < 5 || ageNum > 120)) {
        errors.age = 'Age must be between 5 and 120';
    }
    
    // Validate ratings
    const pizzaRating = document.querySelector('input[name="pizzaRating"]:checked');
    const pastaRating = document.querySelector('input[name="pastaRating"]:checked');
    const papRating = document.querySelector('input[name="papRating"]:checked');
    const outRating = document.querySelector('input[name="outRating"]:checked');
    
    if (!pizzaRating) errors.pizzaRating = 'Pizza rating is required';
    if (!pastaRating) errors.pastaRating = 'Pasta rating is required';
    if (!papRating) errors.papRating = 'Pap and Wors rating is required';
    if (!outRating) errors.outRating = 'Eat out rating is required';
    
    // Display errors
    displayErrors(errors);
    
    return Object.keys(errors).length === 0;
}

// Display validation errors
function displayErrors(errors) {
    // Clear all previous errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    
    // Show new errors
    Object.keys(errors).forEach(field => {
        const errorEl = document.getElementById(field + '-error');
        if (errorEl) {
            errorEl.textContent = errors[field];
            errorEl.classList.add('show');
        }
    });
}

// Handle form submission
function handleSubmit(e) {
    e.preventDefault();
    console.log('Form submitted!');
    
    if (!validateForm()) {
        showToast('Please fix the errors in the form', 'error');
        return;
    }
    
    // Get form data
    const formData = getFormData();
    console.log('Saving survey data:', formData);
    
    // Save to surveys array and localStorage
    surveys.push(formData);
    saveSurveys();
    
    showToast('Survey submitted successfully!', 'success');
    
    // Reset form
    resetForm();
}

// Get form data
function getFormData() {
    const favoriteFoods = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        favoriteFoods.push(checkbox.value);
    });
    
    return {
        id: Date.now().toString(),
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        dateOfBirth: document.getElementById('dateOfBirth').value,
        age: parseInt(document.getElementById('age').value),
        favoriteFoods: favoriteFoods,
        ratings: {
            pizza: parseInt(document.querySelector('input[name="pizzaRating"]:checked').value),
            pasta: parseInt(document.querySelector('input[name="pastaRating"]:checked').value),
            papAndWors: parseInt(document.querySelector('input[name="papRating"]:checked').value),
            other: parseInt(document.querySelector('input[name="outRating"]:checked').value)
        },
        submittedAt: new Date().toISOString()
    };
}

// Reset form
function resetForm() {
    document.getElementById('survey-form').reset();
    displayErrors({});
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const messageEl = document.getElementById('toast-message');
    
    messageEl.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 3000);
}

// Display results
function displayResults() {
    loadSurveys();
    
    if (surveys.length === 0) {
        document.getElementById('no-data').classList.remove('hidden');
        document.getElementById('stats-grid').classList.add('hidden');
        document.getElementById('chart-container').classList.add('hidden');
        document.getElementById('responses-section').classList.add('hidden');
        document.getElementById('results-subtitle').textContent = 'No survey responses yet';
        return;
    }
    
    document.getElementById('no-data').classList.add('hidden');
    document.getElementById('stats-grid').classList.remove('hidden');
    document.getElementById('chart-container').classList.remove('hidden');
    document.getElementById('responses-section').classList.remove('hidden');
    document.getElementById('results-subtitle').textContent = `Comprehensive insights from ${surveys.length} survey responses`;
    
    const stats = calculateStats();
    displayStats(stats);
    displayChart();
    displayIndividualResponses();
}

// Display individual responses
function displayIndividualResponses() {
    const responsesList = document.getElementById('responses-list');
    
    if (surveys.length === 0) {
        responsesList.innerHTML = '<p class="text-gray-500">No responses to display.</p>';
        return;
    }
    
    responsesList.innerHTML = surveys.map(survey => `
        <div class="response-item">
            <div class="response-header">
                <div class="response-info">
                    <div class="response-name">${survey.fullName}</div>
                    <div class="response-email">${survey.email}</div>
                    <div class="response-date">Submitted: ${new Date(survey.submittedAt).toLocaleDateString()}</div>
                </div>
                <div class="response-actions">
                    <button class="delete-btn" onclick="deleteSurvey('${survey.id}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
            <div class="response-details">
                <div class="response-detail">
                    <span class="detail-label">Age</span>
                    <span class="detail-value">${survey.age} years old</span>
                </div>
                <div class="response-detail">
                    <span class="detail-label">Date of Birth</span>
                    <span class="detail-value">${new Date(survey.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div class="response-detail">
                    <span class="detail-label">Favorite Foods</span>
                    <div class="favorite-foods">
                        ${survey.favoriteFoods.map(food => `<span class="food-tag">${food}</span>`).join('')}
                    </div>
                </div>
                <div class="response-detail">
                    <span class="detail-label">Pizza Rating</span>
                    <span class="detail-value">${survey.ratings.pizza}/5</span>
                </div>
                <div class="response-detail">
                    <span class="detail-label">Pasta Rating</span>
                    <span class="detail-value">${survey.ratings.pasta}/5</span>
                </div>
                <div class="response-detail">
                    <span class="detail-label">Pap & Wors Rating</span>
                    <span class="detail-value">${survey.ratings.papAndWors}/5</span>
                </div>
                <div class="response-detail">
                    <span class="detail-label">Eat Out Frequency</span>
                    <span class="detail-value">${survey.ratings.other}/5</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Calculate statistics
function calculateStats() {
    const totalSurveys = surveys.length;
    
    // Calculate average age
    const totalAge = surveys.reduce((sum, survey) => sum + survey.age, 0);
    const averageAge = Math.round((totalAge / totalSurveys) * 10) / 10;
    
    // Find oldest and youngest
    const ages = surveys.map(survey => survey.age);
    const oldestPerson = Math.max(...ages);
    const youngestPerson = Math.min(...ages);
    
    // Calculate pizza percentage
    const pizzaLovers = surveys.filter(survey => 
        survey.favoriteFoods.includes('Pizza')
    ).length;
    const pizzaPercentage = Math.round((pizzaLovers / totalSurveys) * 1000) / 10;
    
    // Calculate average "eat out" rating
    const totalEatOutRating = surveys.reduce((sum, survey) => sum + survey.ratings.other, 0);
    const averageEatOutRating = Math.round((totalEatOutRating / totalSurveys) * 10) / 10;
    
    return {
        totalSurveys,
        averageAge,
        oldestPerson,
        youngestPerson,
        pizzaPercentage,
        averageEatOutRating
    };
}

// Display statistics
function displayStats(stats) {
    const statsGrid = document.getElementById('stats-grid');
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-header">
                <div class="stat-icon">👥</div>
                <span class="stat-badge">Total</span>
            </div>
            <h5 class="stat-title">Survey Responses</h5>
            <div class="stat-value">${stats.totalSurveys}</div>
            <p class="stat-subtitle">Completed surveys</p>
        </div>
        
        <div class="stat-card green">
            <div class="stat-header">
                <div class="stat-icon green">📅</div>
                <span class="stat-badge green">Average</span>
            </div>
            <h5 class="stat-title">Average Age</h5>
            <div class="stat-value green">${stats.averageAge}</div>
            <p class="stat-subtitle">Years old</p>
        </div>
        
        <div class="stat-card purple">
            <div class="stat-header">
                <div class="stat-icon purple">🏆</div>
                <span class="stat-badge purple">Range</span>
            </div>
            <h5 class="stat-title">Age Range</h5>
            <div class="stat-value purple">${stats.youngestPerson} - ${stats.oldestPerson}</div>
            <p class="stat-subtitle">Youngest to oldest</p>
        </div>
        
        <div class="stat-card red">
            <div class="stat-header">
                <div class="stat-icon red">🍕</div>
                <span class="stat-badge red">Pizza</span>
            </div>
            <h5 class="stat-title">Pizza Lovers</h5>
            <div class="stat-value red">${stats.pizzaPercentage}%</div>
            <p class="stat-subtitle">Of all respondents</p>
        </div>
        
        <div class="stat-card indigo">
            <div class="stat-header">
                <div class="stat-icon indigo">📈</div>
                <span class="stat-badge indigo">Rating</span>
            </div>
            <h5 class="stat-title">Average "Eat Out" Preference</h5>
            <div class="stat-value indigo">${stats.averageEatOutRating} / 5.0</div>
            <p class="stat-subtitle">Overall satisfaction rating</p>
        </div>
    `;
}

// Display chart (simple canvas-based bar chart)
function displayChart() {
    const canvas = document.getElementById('chart');
    const ctx = canvas.getContext('2d');
    
    // Calculate percentages for each food
    const totalSurveys = surveys.length;
    const foodData = [
        { name: 'Pizza', count: surveys.filter(s => s.favoriteFoods.includes('Pizza')).length },
        { name: 'Pasta', count: surveys.filter(s => s.favoriteFoods.includes('Pasta')).length },
        { name: 'Pap & Wors', count: surveys.filter(s => s.favoriteFoods.includes('Pap and Wors')).length },
        { name: 'Other', count: surveys.filter(s => s.favoriteFoods.includes('Other')).length }
    ];
    
    // Convert to percentages
    const chartData = foodData.map(item => ({
        name: item.name,
        percentage: Math.round((item.count / totalSurveys) * 1000) / 10
    }));
    
    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = 400;
    ctx.scale(2, 2);
    
    // Chart dimensions
    const chartWidth = canvas.offsetWidth - 80;
    const chartHeight = 300;
    const barWidth = chartWidth / chartData.length - 20;
    const maxPercentage = Math.max(...chartData.map(d => d.percentage)) || 100;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, 200);
    
    // Draw bars
    chartData.forEach((item, index) => {
        const barHeight = (item.percentage / maxPercentage) * chartHeight;
        const x = 40 + index * (barWidth + 20);
        const y = chartHeight - barHeight + 20;
        
        // Draw bar
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#3B82F6');
        gradient.addColorStop(1, '#6366F1');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw percentage label
        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${item.percentage}%`, x + barWidth / 2, y - 5);
        
        // Draw food name
        ctx.fillText(item.name, x + barWidth / 2, chartHeight + 40);
    });
    
    // Draw Y-axis label
    ctx.save();
    ctx.translate(15, chartHeight / 2 + 20);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Percentage (%)', 0, 0);
    ctx.restore();
}

// Export functions for global access
window.showSurvey = showSurvey;
window.showResults = showResults;
window.deleteSurvey = deleteSurvey;
window.clearAllData = clearAllData;
window.exportToCSV = exportToCSV;
