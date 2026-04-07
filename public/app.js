const API_URL = '/api';

// UI Elements
const showSearchBtn = document.getElementById('showSearch');
const showInsightsBtn = document.getElementById('showInsights');
const searchSection = document.getElementById('searchSection');
const insightsSection = document.getElementById('insightsSection');
const searchForm = document.getElementById('searchForm');
const resultsBody = document.getElementById('resultsBody');
const insightsBody = document.getElementById('insightsBody');
const resultCountBadge = document.getElementById('resultCount');
const noResultsDiv = document.getElementById('noResults');
const resultsTable = document.getElementById('resultsTable');
const loadingIndicator = document.getElementById('loadingIndicator');

// Navigation
showSearchBtn.addEventListener('click', () => {
    setActiveTab('search');
});

showInsightsBtn.addEventListener('click', () => {
    setActiveTab('insights');
    fetchInsights();
});

function setActiveTab(tab) {
    if (tab === 'search') {
        showSearchBtn.classList.add('active');
        showInsightsBtn.classList.remove('active');
        searchSection.classList.add('active-section');
        insightsSection.classList.remove('active-section');
    } else {
        showInsightsBtn.classList.add('active');
        showSearchBtn.classList.remove('active');
        insightsSection.classList.add('active-section');
        searchSection.classList.remove('active-section');
    }
}

// Search Logic
async function fetchResults(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    showLoading(true);
    try {
        const response = await fetch(`${API_URL}/search?${queryString}`);
        const data = await response.json();
        
        if (!response.ok) {
            alert(data.message || 'Error fetching data');
            return;
        }

        renderResults(data);
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Could not connect to the server. Please ensure the backend is running.');
    } finally {
        showLoading(false);
    }
}

function showLoading(isLoading) {
    if (isLoading) {
        loadingIndicator.classList.remove('hidden');
        resultsBody.classList.add('muted');
    } else {
        loadingIndicator.classList.add('hidden');
        resultsBody.classList.remove('muted');
    }
}

function renderResults(products) {
    resultsBody.innerHTML = '';
    resultCountBadge.innerText = `${products.length} items`;

    if (products.length === 0) {
        noResultsDiv.classList.remove('hidden');
        resultsTable.classList.add('hidden');
        return;
    }

    noResultsDiv.classList.add('hidden');
    resultsTable.classList.remove('hidden');

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${product.product_name}</strong></td>
            <td>${product.category}</td>
            <td>${product.supplier_name || 'Unknown'}</td>
            <td>${product.quantity}</td>
            <td class="val-green">$${product.price.toFixed(2)}</td>
        `;
        resultsBody.appendChild(row);
    });
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
        q: document.getElementById('q').value,
        category: document.getElementById('category').value,
        minPrice: document.getElementById('minPrice').value,
        maxPrice: document.getElementById('maxPrice').value
    };
    fetchResults(formData);
});

document.getElementById('resetBtn').addEventListener('click', () => {
    setTimeout(() => fetchResults(), 0); // Reset then fetch all
});

// Insights Logic
async function fetchInsights() {
    insightsBody.innerHTML = '<tr><td colspan="3" class="no-data">Loading insights...</td></tr>';
    try {
        const response = await fetch(`${API_URL}/insights`);
        const data = await response.json();
        renderInsights(data);
    } catch (error) {
        console.error('Insights fetch error:', error);
    }
}

function renderInsights(insights) {
    insightsBody.innerHTML = '';
    if (insights.length === 0) {
        insightsBody.innerHTML = '<tr><td colspan="3" class="no-data">No supplier data available.</td></tr>';
        return;
    }

    insights.forEach(insight => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${insight.supplierName}</strong></td>
            <td>${insight.itemCount} items</td>
            <td class="val-green">$${insight.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
        `;
        insightsBody.appendChild(row);
    });
}

// Initial Load
window.addEventListener('DOMContentLoaded', () => {
    fetchResults();
});
