// ===== LabDash JavaScript =====

// Sample Data
let patients = [
    { id: 'P001', name: 'Rahul Kumar', age: 35, gender: 'Male', phone: '9876543210', tests: 3, status: 'completed' },
    { id: 'P002', name: 'Priya Singh', age: 28, gender: 'Female', phone: '9876543211', tests: 1, status: 'pending' },
    { id: 'P003', name: 'Amit Verma', age: 45, gender: 'Male', phone: '9876543212', tests: 2, status: 'processing' },
    { id: 'P004', name: 'Sneha Gupta', age: 32, gender: 'Female', phone: '9876543213', tests: 4, status: 'completed' },
    { id: 'P005', name: 'Vikram Singh', age: 50, gender: 'Male', phone: '9876543214', tests: 1, status: 'pending' }
];

let tests = [
    { id: 'TEST001', name: 'Complete Blood Count (CBC)', category: 'blood', price: 350 },
    { id: 'TEST002', name: 'Lipid Profile', category: 'blood', price: 550 },
    { id: 'TEST003', name: 'Liver Function Test (LFT)', category: 'blood', price: 650 },
    { id: 'TEST004', name: 'Kidney Function Test (KFT)', category: 'blood', price: 600 },
    { id: 'TEST005', name: 'Chest X-Ray', category: 'imaging', price: 450 },
    { id: 'TEST006', name: 'Thyroid Profile', category: 'blood', price: 750 }
];

// ===== Login Functionality =====
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (in real app, use proper authentication)
    if (username && password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', username);
        window.location.href = 'pages/dashboard.html';
    } else {
        showNotification('Please enter valid credentials', 'error');
    }
});

// ===== Modal Functions =====
function openModal(modalName) {
    document.getElementById(modalName + 'Modal').classList.add('show');
}

function closeModal(modalName) {
    document.getElementById(modalName + 'Modal').classList.remove('show');
}

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
        }
    });
});

// ===== Patient Functions =====
function loadPatients() {
    const tbody = document.querySelector('#patientsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    patients.forEach(patient => {
        tbody.innerHTML += `
            <tr>
                <td>#${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${patient.phone}</td>
                <td>${patient.tests}</td>
                <td><span class="status ${patient.status}">${capitalizeFirst(patient.status)}</span></td>
                <td>
                    <button class="btn-sm" onclick="viewPatient('${patient.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-sm" onclick="editPatient('${patient.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-sm btn-danger" onclick="deletePatient('${patient.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// Add Patient Form Submit
document.getElementById('addPatientForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const newPatient = {
        id: 'P' + String(patients.length + 1).padStart(3, '0'),
        name: formData.get('name'),
        age: formData.get('age'),
        gender: capitalizeFirst(formData.get('gender')),
        phone: formData.get('phone'),
        tests: 0,
        status: 'pending'
    };
    
    patients.push(newPatient);
    loadPatients();
    closeModal('addPatient');
    this.reset();
    showNotification('Patient added successfully!', 'success');
});

function viewPatient(id) {
    const patient = patients.find(p => p.id === id);
    if (patient) {
        alert(`Patient Details:\n\nName: ${patient.name}\nAge: ${patient.age}\nGender: ${patient.gender}\nPhone: ${patient.phone}\nTests: ${patient.tests}\nStatus: ${patient.status}`);
    }
}

function editPatient(id) {
    // In real app, open edit modal with pre-filled data
    console.log('Edit patient:', id);
}

function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
        patients = patients.filter(p => p.id !== id);
        loadPatients();
        showNotification('Patient deleted successfully!', 'success');
    }
}

// ===== Test Functions =====
function loadTests(category = 'all') {
    const grid = document.getElementById('testsGrid');
    if (!grid) return;
    
    const filteredTests = category === 'all' 
        ? tests 
        : tests.filter(t => t.category === category);
    
    grid.innerHTML = '';
    filteredTests.forEach(test => {
        grid.innerHTML += `
            <div class="test-card">
                <div class="test-icon">
                    <i class="fas ${getTestIcon(test.category)}"></i>
                </div>
                <h4>${test.name}</h4>
                <p class="test-code">${test.id}</p>
                <p class="test-price">₹${test.price}</p>
                <div class="test-actions">
                    <button class="btn-sm" onclick="editTest('${test.id}')">Edit</button>
                    <button class="btn-sm btn-danger" onclick="deleteTest('${test.id}')">Delete</button>
                </div>
            </div>
        `;
    });
}

function getTestIcon(category) {
    const icons = {
        'blood': 'fa-tint',
        'urine': 'fa-flask',
        'imaging': 'fa-x-ray',
        'pathology': 'fa-microscope'
    };
    return icons[category] || 'fa-vial';
}

// Category Buttons
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        loadTests(this.dataset.category);
    });
});

// Add Test Form Submit
document.getElementById('addTestForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const newTest = {
        id: formData.get('testCode'),
        name: formData.get('testName'),
        category: formData.get('category'),
        price: parseInt(formData.get('price'))
    };
    
    tests.push(newTest);
    loadTests();
    closeModal('addTest');
    this.reset();
    showNotification('Test added successfully!', 'success');
});

function editTest(id) {
    console.log('Edit test:', id);
}

function deleteTest(id) {
    if (confirm('Are you sure you want to delete this test?')) {
        tests = tests.filter(t => t.id !== id);
        loadTests();
        showNotification('Test deleted successfully!', 'success');
    }
}

// ===== Search & Filter Functions =====
document.getElementById('searchPatient')?.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.id.toLowerCase().includes(searchTerm)
    );
    renderFilteredPatients(filteredPatients);
});

function applyFilters() {
    const gender = document.getElementById('filterGender')?.value;
    const date = document.getElementById('filterDate')?.value;
    
    let filtered = [...patients];
    
    if (gender) {
        filtered = filtered.filter(p => p.gender.toLowerCase() === gender);
    }
    
    renderFilteredPatients(filtered);
}

function renderFilteredPatients(filteredPatients) {
    const tbody = document.querySelector('#patientsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    filteredPatients.forEach(patient => {
        tbody.innerHTML += `
            <tr>
                <td>#${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${patient.phone}</td>
                <td>${patient.tests}</td>
                <td><span class="status ${patient.status}">${capitalizeFirst(patient.status)}</span></td>
                <td>
                    <button class="btn-sm" onclick="viewPatient('${patient.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-sm" onclick="editPatient('${patient.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-sm btn-danger" onclick="deletePatient('${patient.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// ===== Pagination =====
let currentPage = 1;
const itemsPerPage = 10;

function nextPage() {
    currentPage++;
    updatePageInfo();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePageInfo();
    }
}

function updatePageInfo() {
    const totalPages = Math.ceil(patients.length / itemsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
}

// ===== Report Generation =====
function generateReport(patientId) {
    // In real app, generate PDF report
    console.log('Generating report for patient:', patientId);
    showNotification('Report generated successfully!', 'success');
}

// ===== Utility Functions =====
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===== Mobile Menu Toggle =====
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('show');
}

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', function() {
    loadPatients();
    loadTests();
    updatePageInfo();
    
    // Check if user is logged in
    if (!localStorage.getItem('isLoggedIn') && !window.location.href.includes('index.html')) {
        // window.location.href = '../index.html';
    }
});

// ===== Logout Function =====
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

// ===== Print Report =====
function printReport(patientId) {
    window.print();
}

// ===== Export to Excel =====
function exportToExcel() {
    // In real app, use library like SheetJS
    console.log('Exporting to Excel...');
    showNotification('Data exported to Excel!', 'success');
}

// ===== Dashboard Stats Update =====
function updateDashboardStats() {
    // Update stats dynamically
    const stats = {
        totalPatients: patients.length,
        testsToday: 856,
        pendingReports: patients.filter(p => p.status === 'pending').length,
        todayRevenue: 52450
    };
    
    // Update DOM elements if they exist
    // document.querySelector('.stat-patients').textContent = stats.totalPatients;
}