document.addEventListener('DOMContentLoaded', function() {
    // Fetch available models
    fetch('/models')
        .then(response => response.json())
        .then(data => {
            const modelList = document.getElementById('model-list');
            modelList.innerHTML = '';
            
            data.forEach(model => {
                const modelName = model.name;
                const div = document.createElement('div');
                div.className = 'model-checkbox';
                div.innerHTML = `
                    <input type="checkbox" id="${modelName}" name="model" value="${modelName}" class="form-check-input">
                    <label for="${modelName}" class="form-check-label">${modelName}</label>
                `;
                modelList.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error fetching models:', error);
            document.getElementById('model-list').innerHTML = '<div class="alert alert-danger">Error loading models</div>';
        });
    
    // Run selected models
    document.getElementById('run-btn').addEventListener('click', () => {
        const selectedModels = Array.from(document.querySelectorAll('input[name="model"]:checked')).map(el => el.value);
        const prompt = document.getElementById('prompt').value;
        
        if (selectedModels.length === 0) {
            alert('Please select at least one model');
            return;
        }
        
        // Show loading indicator
        const outputContainer = document.getElementById('output-container');
        outputContainer.innerHTML = '<div class="text-center my-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
        
        // Create output areas for each model
        outputContainer.innerHTML = '';
        selectedModels.forEach(model => {
            const div = document.createElement('div');
            div.className = 'model-output';
            div.innerHTML = `
                <h3>${model}</h3>
                <pre id="${model}-output" class="model-response" data-model="${model}">Loading...</pre>
            `;
            outputContainer.appendChild(div);
        });
        
        // Make the POST request and handle the stream
        fetch('/generate-multi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                models: selectedModels,
                prompt: prompt
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = '';
            
            function processStream() {
                return reader.read().then(({ done, value }) => {
                    if (done) return;
                    
                    // Convert the chunk to text and add to buffer
                    buffer += decoder.decode(value, { stream: true });
                    
                    // Process complete events in buffer
                    const lines = buffer.split('\n\n');
                    buffer = lines.pop() || ''; // Keep the incomplete event in buffer
                    
                    lines.forEach(line => {
                        if (!line.trim()) return;
                        
                        // Parse the event type and data
                        const eventMatch = line.match(/event: ([^\n]+)/);
                        const dataMatch = line.match(/data: (.+)/);
                        
                        if (eventMatch && dataMatch) {
                            const eventType = eventMatch[1];
                            const eventData = JSON.parse(dataMatch[1]);
                            
                            // Handle different event types
                            switch (eventType) {
                                case 'start':
                                    console.log('Generation started:', eventData);
                                    break;
                                case 'model-update':
                                    const outputEl = document.getElementById(`${eventData.model}-output`);
                                    if (outputEl) {
                                        outputEl.textContent = eventData.full_text;
                                    }
                                    break;
                                case 'model-complete':
                                    console.log(`Model ${eventData.model} completed`);
                                    const modelEl = document.getElementById(`${eventData.model}-output`);
                                    if (modelEl) {
                                        modelEl.classList.add('completed');
                                    }
                                    break;
                                case 'end':
                                    console.log('All models completed');
                                    // Enable the analyze button when all models finish
                                    document.getElementById('analyze-btn').disabled = false;
                                    break;
                            }
                        }
                    });
                    
                    return processStream();
                });
            }
            
            // Disable analyze button during generation
            document.getElementById('analyze-btn').disabled = true;
            
            return processStream();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        });
    });
});

// Function to analyze differences between model outputs
function analyzeDifferences() {
    // Show loading indicator
    document.getElementById('analysis-content').innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Analyzing model differences...</p></div>';
    document.getElementById('analysis-results').style.display = 'block';
    
    // Get all model outputs
    const modelOutputs = {};
    
    // Collect outputs from all active models
    document.querySelectorAll('.model-response').forEach(element => {
        const modelName = element.dataset.model;
        const outputText = element.textContent || element.innerText;
        if (outputText && outputText !== 'Loading...') {
            modelOutputs[modelName] = outputText;
        }
    });
    
    // Only proceed if we have at least two models
    if (Object.keys(modelOutputs).length < 2) {
        document.getElementById('analysis-content').innerHTML = 
            '<div class="alert alert-warning">Please run at least two models to perform comparison.</div>';
        return;
    }
    
    // Send request to analyze
    fetch('/analyze-differences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outputs: modelOutputs }),
    })
    .then(response => response.json())
    .then(data => {
        displayAnalysisResults(data);
    })
    .catch(error => {
        console.error('Error analyzing differences:', error);
        document.getElementById('analysis-content').innerHTML = 
            '<div class="alert alert-danger">Failed to analyze model differences.</div>';
    });
}

function displayAnalysisResults(data) {
    const resultsDiv = document.getElementById('analysis-content');
    resultsDiv.innerHTML = '';
    
    // Summary section
    const summarySection = document.createElement('div');
    summarySection.className = 'analysis-summary p-3 mb-4 bg-light rounded';
    summarySection.innerHTML = `
        <h4 class="text-primary">Summary</h4>
        <div class="row">
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Average Similarity</h5>
                        <div class="display-4">${data.summary.average_similarity}%</div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Most Similar</h5>
                        <div class="h5">${data.summary.most_similar_pair?.replace('_vs_', ' vs ') || 'N/A'}</div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Least Similar</h5>
                        <div class="h5">${data.summary.least_similar_pair?.replace('_vs_', ' vs ') || 'N/A'}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    resultsDiv.appendChild(summarySection);
    
    // Detail sections
    const accordion = document.createElement('div');
    accordion.className = 'accordion';
    accordion.id = 'comparisonAccordion';
    
    let i = 0;
    Object.entries(data.analysis).forEach(([pairKey, results]) => {
        const [model1, model2] = pairKey.split('_vs_');
        const cardId = `comparison-${i}`;
        
        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.innerHTML = `
            <div class="card-header" id="heading-${i}">
                <h2 class="mb-0">
                    <button class="btn btn-link btn-block text-left collapsed" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#${cardId}" aria-expanded="false" aria-controls="${cardId}">
                        <div class="d-flex justify-content-between align-items-center">
                            <span>${model1} vs ${model2}</span>
                            <span class="badge ${results.similarity_score > 75 ? 'bg-success' : results.similarity_score > 50 ? 'bg-warning' : 'bg-danger'} p-2">
                                ${results.similarity_score}% similar
                            </span>
                        </div>
                    </button>
                </h2>
            </div>
            <div id="${cardId}" class="collapse" aria-labelledby="heading-${i}" data-bs-parent="#comparisonAccordion">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="metrics mb-4">
                                <h5 class="text-muted">Key Metrics</h5>
                                <div class="metric d-flex align-items-center mb-3">
                                    <span class="me-2 text-nowrap">Similarity:</span>
                                    <div class="progress flex-grow-1">
                                        <div class="progress-bar" role="progressbar" style="width: ${results.similarity_score}%" 
                                             aria-valuenow="${results.similarity_score}" aria-valuemin="0" aria-valuemax="100">
                                            ${results.similarity_score}%
                                        </div>
                                    </div>
                                </div>
                                <div class="metric d-flex justify-content-between">
                                    <span>Word count difference:</span>
                                    <span class="badge bg-info">${results.word_count_diff}</span>
                                </div>
                                <div class="metric d-flex justify-content-between">
                                    <span>Sentiment difference:</span>
                                    <span class="badge bg-info">${results.sentiment_diff}</span>
                                </div>
                                <div class="metric d-flex justify-content-between">
                                    <span>Response time difference:</span>
                                    <span class="badge bg-info">${results.response_time_diff}</span>
                                </div>
                            </div>
                            
                            <div class="insights mb-3">
                                <h5 class="text-muted">Key Insights</h5>
                                <ul class="list-group">
                                    ${results.key_insights.map(insight => 
                                        `<li class="list-group-item">${insight}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="unique-concepts">
                                <h5 class="text-muted mb-3">Unique Concepts</h5>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="card bg-light h-100">
                                            <div class="card-header">
                                                <h6 class="mb-0">${model1}</h6>
                                            </div>
                                            <div class="card-body">
                                                <ul class="list-unstyled">
                                                    ${results.unique_concepts[model1].map(concept => 
                                                        `<li class="mb-1"><span class="badge bg-primary">${concept}</span></li>`).join('')}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card bg-light h-100">
                                            <div class="card-header">
                                                <h6 class="mb-0">${model2}</h6>
                                            </div>
                                            <div class="card-body">
                                                <ul class="list-unstyled">
                                                    ${results.unique_concepts[model2].map(concept => 
                                                        `<li class="mb-1"><span class="badge bg-secondary">${concept}</span></li>`).join('')}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        accordion.appendChild(card);
        i++;
    });
    
    resultsDiv.appendChild(accordion);
    
    // Add visualization section
    const visualSection = document.createElement('div');
    visualSection.className = 'visualization-section mt-4';
    visualSection.innerHTML = `
        <h4 class="text-primary">Similarity Visualization</h4>
        <div class="visualization-container p-3 rounded" style="height: 300px;">
            <canvas id="similarityChart"></canvas>
        </div>
    `;
    resultsDiv.appendChild(visualSection);
    
    // Create chart visualization
    setTimeout(() => {
        const models = [];
        const similarities = [];
        
        Object.entries(data.analysis).forEach(([pairKey, results]) => {
            models.push(pairKey.replace('_vs_', ' vs '));
            similarities.push(results.similarity_score);
        });
        
        const ctx = document.getElementById('similarityChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: models,
                datasets: [{
                    label: 'Similarity Score (%)',
                    data: similarities,
                    backgroundColor: similarities.map(score => 
                        score > 75 ? 'rgba(40, 167, 69, 0.7)' : 
                        score > 50 ? 'rgba(255, 193, 7, 0.7)' : 
                        'rgba(220, 53, 69, 0.7)'
                    ),
                    borderColor: similarities.map(score => 
                        score > 75 ? 'rgb(40, 167, 69)' : 
                        score > 50 ? 'rgb(255, 193, 7)' : 
                        'rgb(220, 53, 69)'
                    ),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }, 100);
}