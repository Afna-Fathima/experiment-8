// Use a relative API base so the frontend works regardless of which port the server binds to
const API_BASE_URL = '/api';

// User profile and selections stored in localStorage
let userProfile = {
    name: 'Fitness Enthusiast',
    level: '',
    goal: ''
};

let selectedPlans = {
    trainings: [],
    diets: []
};

// ==================== INITIALIZATION ====================
window.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadSelectedPlans();
    setupTabNavigation();
    loadTrainings();
});

// ==================== USER PROFILE ====================
function saveProfile() {
    userProfile.name = document.getElementById('userName').value || 'Fitness Enthusiast';
    userProfile.level = document.getElementById('userLevel').value || '';
    userProfile.goal = document.getElementById('userGoal').value || '';
    
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    showAlert('✅ Profile saved successfully!', 'success');
    
    // Show recommendation alert if profile is complete
    if (userProfile.level && userProfile.goal) {
        document.getElementById('recommendationAlert').classList.remove('alert-hidden');
    }
}

function loadUserProfile() {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
        userProfile = JSON.parse(saved);
        document.getElementById('userName').value = userProfile.name;
        document.getElementById('userLevel').value = userProfile.level;
        document.getElementById('userGoal').value = userProfile.goal;
        
        if (userProfile.level && userProfile.goal) {
            document.getElementById('recommendationAlert').classList.remove('alert-hidden');
        }
    }
}

function loadSelectedPlans() {
    const saved = localStorage.getItem('selectedPlans');
    if (saved) {
        selectedPlans = JSON.parse(saved);
    }
}

function saveSelectedPlans() {
    localStorage.setItem('selectedPlans', JSON.stringify(selectedPlans));
}

// ==================== TAB NAVIGATION ====================
function setupTabNavigation() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Update buttons
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update content
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(tabName).classList.add('active');
            
            // Load data for the tab
            if (tabName === 'trainings') {
                loadTrainings();
            } else if (tabName === 'diets') {
                loadDiets();
            } else if (tabName === 'myplans') {
                displayMyPlans();
            }
        });
    });
}

// ==================== TRAINING PLANS ====================
async function loadTrainings() {
    try {
        const response = await fetch(`${API_BASE_URL}/trainings`);
        if (!response.ok) throw new Error('Failed to load trainings');
        
        const trainings = await response.json();
        displayTrainings(trainings);
    } catch (error) {
        console.error('Error loading trainings:', error);
        showAlert('Error loading training plans', 'error');
    }
}

function displayTrainings(trainings) {
    const container = document.getElementById('trainingsList');
    
    if (trainings.length === 0) {
        container.innerHTML = '<p class="empty-state">No training plans found.</p>';
        return;
    }
    
    container.innerHTML = trainings.map(training => {
        const isSelected = selectedPlans.trainings.includes(training._id);
        const difficultyClass = training.difficulty?.toLowerCase() || '';
        
        return `
            <div class="plan-card ${isSelected ? 'selected' : ''}">
                <div class="plan-header">
                    <h3 class="plan-title">${training.name}</h3>
                    <div class="plan-meta">
                        <span class="plan-badge ${difficultyClass}">${training.difficulty || 'All Levels'}</span>
                        <span class="plan-badge">${training.category || 'General'}</span>
                    </div>
                </div>
                
                <p class="plan-description">${training.description || 'No description available'}</p>
                
                <div class="plan-details">
                    <div class="plan-detail-row">
                        <span class="plan-detail-label">⏱️ Duration:</span>
                        <span class="plan-detail-value">${training.duration} min</span>
                    </div>
                    <div class="plan-detail-row">
                        <span class="plan-detail-label">🔥 Intensity:</span>
                        <span class="plan-detail-value">${training.intensity}</span>
                    </div>
                    <div class="plan-detail-row">
                        <span class="plan-detail-label">💪 Calories:</span>
                        <span class="plan-detail-value">${training.caloriesBurned || 'N/A'} kcal</span>
                    </div>
                </div>
                
                <div class="plan-actions">
                    <button class="btn-select ${isSelected ? 'selected' : ''}" onclick="toggleTrainingSelection('${training._id}', this)">
                        ${isSelected ? '✓ Selected' : 'Select Plan'}
                    </button>
                    <button class="btn-view" onclick="showPlanModal('training', '${training._id}')">View Details</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add filter listeners
    document.getElementById('difficultyFilter')?.addEventListener('change', applyTrainingFilters);
    document.getElementById('categoryFilter')?.addEventListener('change', applyTrainingFilters);
}

async function applyTrainingFilters() {
    const difficulty = document.getElementById('difficultyFilter')?.value || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    
    try {
        let url = `${API_BASE_URL}/trainings?`;
        if (difficulty) url += `difficulty=${difficulty}&`;
        if (category) url += `category=${category}&`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load trainings');
        
        const trainings = await response.json();
        displayTrainings(trainings);
    } catch (error) {
        console.error('Error applying filters:', error);
        showAlert('Error applying filters', 'error');
    }
}

function toggleTrainingSelection(trainingId, buttonEl) {
    const index = selectedPlans.trainings.indexOf(trainingId);
    if (index > -1) {
        selectedPlans.trainings.splice(index, 1);
        buttonEl.textContent = 'Select Plan';
        buttonEl.classList.remove('selected');
        buttonEl.closest('.plan-card').classList.remove('selected');
        showAlert('❌ Training plan deselected', 'info');
    } else {
        selectedPlans.trainings.push(trainingId);
        buttonEl.textContent = '✓ Selected';
        buttonEl.classList.add('selected');
        buttonEl.closest('.plan-card').classList.add('selected');
        showAlert('✅ Training plan selected!', 'success');
    }
    saveSelectedPlans();
}

// ==================== DIET PLANS ====================
async function loadDiets() {
    try {
        const response = await fetch(`${API_BASE_URL}/diets`);
        if (!response.ok) throw new Error('Failed to load diets');
        
        const diets = await response.json();
        displayDiets(diets);
    } catch (error) {
        console.error('Error loading diets:', error);
        showAlert('Error loading diet plans', 'error');
    }
}

function displayDiets(diets) {
    const container = document.getElementById('dietsList');
    
    if (diets.length === 0) {
        container.innerHTML = '<p class="empty-state">No diet plans found.</p>';
        return;
    }
    
    container.innerHTML = diets.map(diet => {
        const isSelected = selectedPlans.diets.includes(diet._id);
        
        return `
            <div class="plan-card ${isSelected ? 'selected' : ''}">
                <div class="plan-header">
                    <h3 class="plan-title">${diet.name}</h3>
                    <div class="plan-meta">
                        <span class="plan-badge">${diet.goal || 'General'}</span>
                    </div>
                </div>
                
                <p class="plan-description">${diet.description || 'No description available'}</p>
                
                <div class="plan-details">
                    <div class="plan-detail-row">
                        <span class="plan-detail-label">🍽️ Daily Calories:</span>
                        <span class="plan-detail-value">${diet.calorieTarget} kcal</span>
                    </div>
                    ${diet.macros ? `
                        <div class="plan-detail-row">
                            <span class="plan-detail-label">📊 Protein:</span>
                            <span class="plan-detail-value">${diet.macros.protein}g</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="plan-actions">
                    <button class="btn-select ${isSelected ? 'selected' : ''}" onclick="toggleDietSelection('${diet._id}', this)">
                        ${isSelected ? '✓ Selected' : 'Select Plan'}
                    </button>
                    <button class="btn-view" onclick="showPlanModal('diet', '${diet._id}')">View Details</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add filter listeners
    document.getElementById('goalFilter')?.addEventListener('change', applyDietFilters);
}

async function applyDietFilters() {
    const goal = document.getElementById('goalFilter')?.value || '';
    
    try {
        let url = `${API_BASE_URL}/diets?`;
        if (goal) url += `goal=${goal}&`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load diets');
        
        const diets = await response.json();
        displayDiets(diets);
    } catch (error) {
        console.error('Error applying filters:', error);
        showAlert('Error applying filters', 'error');
    }
}

function toggleDietSelection(dietId, buttonEl) {
    const index = selectedPlans.diets.indexOf(dietId);
    if (index > -1) {
        selectedPlans.diets.splice(index, 1);
        buttonEl.textContent = 'Select Plan';
        buttonEl.classList.remove('selected');
        buttonEl.closest('.plan-card').classList.remove('selected');
        showAlert('❌ Diet plan deselected', 'info');
    } else {
        selectedPlans.diets.push(dietId);
        buttonEl.textContent = '✓ Selected';
        buttonEl.classList.add('selected');
        buttonEl.closest('.plan-card').classList.add('selected');
        showAlert('✅ Diet plan selected!', 'success');
    }
    saveSelectedPlans();
}

// ==================== MY PLANS TAB ====================
async function displayMyPlans() {
    const container = document.getElementById('myPlansContent');
    
    try {
        // Fetch selected training plans
        let trainingCards = '';
        if (selectedPlans.trainings.length > 0) {
            const trainingIds = selectedPlans.trainings.join(',');
            const trainingResponse = await fetch(`${API_BASE_URL}/trainings?ids=${trainingIds}`);
            if (trainingResponse.ok) {
                const trainings = await trainingResponse.json();
                trainingCards = trainings.map(training => `
                    <div class="my-plan-item">
                        <div class="my-plan-info">
                            <h4>${training.name}</h4>
                            <p>📅 ${training.category} - ${training.difficulty}</p>
                            <p>⏱️ ${training.duration} min | 🔥 ${training.intensity}</p>
                        </div>
                        <button class="btn-deselect" onclick="toggleTrainingSelectionFromMyPlans('${training._id}')">Remove</button>
                    </div>
                `).join('');
            }
        }
        
        // Fetch selected diet plans
        let dietCards = '';
        if (selectedPlans.diets.length > 0) {
            const dietIds = selectedPlans.diets.join(',');
            const dietResponse = await fetch(`${API_BASE_URL}/diets?ids=${dietIds}`);
            if (dietResponse.ok) {
                const diets = await dietResponse.json();
                dietCards = diets.map(diet => `
                    <div class="my-plan-item">
                        <div class="my-plan-info">
                            <h4>${diet.name}</h4>
                            <p>🎯 ${diet.goal}</p>
                            <p>🍽️ ${diet.calorieTarget} kcal/day</p>
                        </div>
                        <button class="btn-deselect" onclick="toggleDietSelectionFromMyPlans('${diet._id}')">Remove</button>
                    </div>
                `).join('');
            }
        }
        
        let content = '';
        
        if (selectedPlans.trainings.length === 0 && selectedPlans.diets.length === 0) {
            content = `
                <div class="empty-state">
                    <p>No plans selected yet. Browse and select plans from the Training and Diet tabs to get started!</p>
                </div>
            `;
        } else {
            content = '';
            
            if (trainingCards) {
                content += `
                    <div class="my-plans-section">
                        <h3>🏋️ My Training Plans (${selectedPlans.trainings.length})</h3>
                        <div class="my-plans-grid">
                            ${trainingCards}
                        </div>
                    </div>
                `;
            }
            
            if (dietCards) {
                content += `
                    <div class="my-plans-section">
                        <h3>🍽️ My Diet Plans (${selectedPlans.diets.length})</h3>
                        <div class="my-plans-grid">
                            ${dietCards}
                        </div>
                    </div>
                `;
            }
        }
        
        container.innerHTML = content;
    } catch (error) {
        console.error('Error displaying my plans:', error);
        showAlert('Error loading your selected plans', 'error');
    }
}

function toggleTrainingSelectionFromMyPlans(trainingId) {
    const index = selectedPlans.trainings.indexOf(trainingId);
    if (index > -1) {
        selectedPlans.trainings.splice(index, 1);
        saveSelectedPlans();
        displayMyPlans();
        showAlert('❌ Training plan removed', 'info');
    }
}

function toggleDietSelectionFromMyPlans(dietId) {
    const index = selectedPlans.diets.indexOf(dietId);
    if (index > -1) {
        selectedPlans.diets.splice(index, 1);
        saveSelectedPlans();
        displayMyPlans();
        showAlert('❌ Diet plan removed', 'info');
    }
}

// ==================== PLAN DETAIL MODAL ====================
async function showPlanModal(type, planId) {
    const modal = document.getElementById('planModal');
    const modalBody = document.getElementById('modalBody');
    
    try {
        const endpoint = type === 'training' ? 'trainings' : 'diets';
        const response = await fetch(`${API_BASE_URL}/${endpoint}/${planId}`);
        if (!response.ok) throw new Error('Failed to load plan details');
        
        const plan = await response.json();
        
        let content = '';
        if (type === 'training') {
            content = `
                <h2>${plan.name}</h2>
                <p>${plan.description}</p>
                <div class="plan-details">
                    <p><strong>📅 Category:</strong> ${plan.category}</p>
                    <p><strong>📊 Difficulty:</strong> ${plan.difficulty}</p>
                    <p><strong>⏱️ Duration:</strong> ${plan.duration} minutes</p>
                    <p><strong>🔥 Intensity:</strong> ${plan.intensity}</p>
                    <p><strong>💪 Calories Burned:</strong> ${plan.caloriesBurned} kcal</p>
                    <p><strong>📅 Frequency:</strong> ${plan.frequency}</p>
                    ${plan.exercises?.length ? `<p><strong>🏋️ Exercises:</strong> ${plan.exercises.join(', ')}</p>` : ''}
                    ${plan.targetMuscles?.length ? `<p><strong>🎯 Target Muscles:</strong> ${plan.targetMuscles.join(', ')}</p>` : ''}
                    ${plan.notes ? `<p><strong>📝 Notes:</strong> ${plan.notes}</p>` : ''}
                </div>
            `;
        } else {
            content = `
                <h2>${plan.name}</h2>
                <p>${plan.description}</p>
                <div class="plan-details">
                    <p><strong>🎯 Goal:</strong> ${plan.goal}</p>
                    <p><strong>🍽️ Daily Calories:</strong> ${plan.calorieTarget} kcal</p>
                    ${plan.macros ? `
                        <p><strong>📊 Macros:</strong></p>
                        <p>Protein: ${plan.macros.protein}g | Carbs: ${plan.macros.carbs}g | Fats: ${plan.macros.fats}g</p>
                    ` : ''}
                    ${plan.mealCount ? `<p><strong>🥗 Meals per day:</strong> ${plan.mealCount}</p>` : ''}
                    ${plan.meals?.length ? `<p><strong>🍲 Meal Plan:</strong> ${plan.meals.join(', ')}</p>` : ''}
                    ${plan.supplements?.length ? `<p><strong>💊 Supplements:</strong> ${plan.supplements.join(', ')}</p>` : ''}
                    ${plan.notes ? `<p><strong>📝 Notes:</strong> ${plan.notes}</p>` : ''}
                </div>
            `;
        }
        
        modalBody.innerHTML = content;
        modal.classList.add('show');
    } catch (error) {
        console.error('Error loading plan details:', error);
        showAlert('Error loading plan details', 'error');
    }
}

function closePlanModal() {
    const modal = document.getElementById('planModal');
    modal.classList.remove('show');
}

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    const modal = document.getElementById('planModal');
    if (event.target === modal) {
        closePlanModal();
    }
});

// ==================== UTILITY FUNCTIONS ====================
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}
