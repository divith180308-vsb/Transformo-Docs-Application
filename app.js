// Transformo Docs - Application Logic

// Local State
let state = {
  documents: [...MOCK_DOCUMENTS],
  currentDocumentId: "doc_inv_001",
  activeView: "dashboard",
  schemas: JSON.parse(JSON.stringify(SCHEMA_TEMPLATES)), // Deep copy
  currentSchemaType: "invoice",
  exportFormat: "json",
  searchQuery: "",
  filterType: "all",
  minAccuracy: 90
};

// DOM Elements
const views = {
  dashboard: document.getElementById("view-dashboard"),
  ocr: document.getElementById("view-ocr"),
  schema: document.getElementById("view-schema"),
  export: document.getElementById("view-export")
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initDashboard();
  initOcrViewer();
  initSchemaMapper();
  initExportHub();
  
  // Load default document
  selectDocument(state.currentDocumentId);
});

// ==========================================
// 1. Navigation & Routing
// ==========================================
function initNavigation() {
  const tabs = document.querySelectorAll(".nav-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetView = tab.getAttribute("data-tab");
      
      // Update Tab CSS
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      // Switch view panels
      document.querySelectorAll(".view-panel").forEach(panel => {
        panel.classList.remove("active");
      });
      document.getElementById(`view-${targetView}`).classList.add("active");
      
      state.activeView = targetView;
      
      // Refresh views if necessary
      if (targetView === "dashboard") {
        updateDashboardMetrics();
      } else if (targetView === "schema") {
        renderSchemaRows();
        updateSchemaSandbox();
      } else if (targetView === "export") {
        renderExportList();
      }
    });
  });
}

// ==========================================
// 2. Dashboard Component
// ==========================================
function initDashboard() {
  updateDashboardMetrics();
}

function updateDashboardMetrics() {
  const docs = state.documents;
  const totalDocs = docs.length;
  
  // Calculate average accuracy
  const totalAcc = docs.reduce((acc, doc) => acc + doc.ocrAccuracy, 0);
  const avgAcc = totalDocs > 0 ? (totalAcc / totalDocs).toFixed(1) : 0;
  
  // Count by status
  const processedCount = docs.filter(d => d.status === "Processed").length;
  const errorCount = docs.filter(d => d.status === "Failed").length;
  const processingCount = docs.filter(d => d.status === "Processing").length;
  
  // Update HTML elements
  document.getElementById("metric-total-docs").innerText = totalDocs;
  document.getElementById("metric-accuracy").innerText = `${avgAcc}%`;
  document.getElementById("metric-processed").innerText = processedCount;
  document.getElementById("metric-failed").innerText = errorCount;
  
  // Render charts
  renderAccuracyChart();
  renderDistributionChart();
  renderRecentActivity();
}

function renderAccuracyChart() {
  const container = document.getElementById("accuracy-bar-chart");
  if (!container) return;
  
  container.innerHTML = "";
  
  // Create 6 days of dummy historical ingestion + today
  const dailyIngestion = [
    { day: "Mon", count: 4 },
    { day: "Tue", count: 6 },
    { day: "Wed", count: 3 },
    { day: "Thu", count: 8 },
    { day: "Fri", count: 5 },
    { day: "Sat", count: 2 },
    { day: "Sun (Today)", count: state.documents.length }
  ];
  
  const maxCount = Math.max(...dailyIngestion.map(d => d.count), 10);
  
  dailyIngestion.forEach(item => {
    const barWrapper = document.createElement("div");
    barWrapper.className = "bar-wrapper";
    
    const heightPercent = (item.count / maxCount) * 100;
    
    barWrapper.innerHTML = `
      <div style="font-size: 0.75rem; font-weight: bold; color: var(--accent-cyan);">${item.count}</div>
      <div class="bar-fill-container">
        <div class="bar-fill" style="height: ${heightPercent}%"></div>
      </div>
      <span class="bar-label">${item.day}</span>
    `;
    container.appendChild(barWrapper);
  });
}

function renderDistributionChart() {
  const container = document.getElementById("distribution-donut-chart");
  if (!container) return;
  
  // Count frequencies
  const counts = { invoice: 0, receipt: 0, id_card: 0, transcript: 0 };
  state.documents.forEach(doc => {
    if (counts[doc.type] !== undefined) {
      counts[doc.type]++;
    }
  });
  
  const total = state.documents.length;
  const pInv = total > 0 ? (counts.invoice / total) * 100 : 0;
  const pRec = total > 0 ? (counts.receipt / total) * 100 : 0;
  const pId = total > 0 ? (counts.id_card / total) * 100 : 0;
  const pTrn = total > 0 ? (counts.transcript / total) * 100 : 0;
  
  // Render SVG Circular Donut Chart
  // Radius = 35 -> Circumference = 2 * PI * 35 = ~220
  const circ = 220;
  
  const offsetInv = 0;
  const dashInv = (pInv / 100) * circ;
  
  const offsetRec = dashInv;
  const dashRec = (pRec / 100) * circ;
  
  const offsetId = dashInv + dashRec;
  const dashId = (pId / 100) * circ;
  
  const offsetTrn = dashInv + dashRec + dashId;
  const dashTrn = (pTrn / 100) * circ;

  container.innerHTML = `
    <div class="dist-chart-container">
      <svg class="svg-donut" width="160" height="160" viewBox="0 0 100 100">
        <circle class="donut-ring" cx="50" cy="50" r="35" fill="transparent" stroke="rgba(255,255,255,0.03)" stroke-width="10"></circle>
        
        <!-- Invoices (Cyan) -->
        <circle class="donut-segment" cx="50" cy="50" r="35" fill="transparent" 
                stroke="var(--accent-cyan)" stroke-width="10" 
                stroke-dasharray="${dashInv} ${circ - dashInv}" 
                stroke-dashoffset="${circ - offsetInv}"></circle>
        
        <!-- Receipts (Purple) -->
        <circle class="donut-segment" cx="50" cy="50" r="35" fill="transparent" 
                stroke="var(--accent-purple)" stroke-width="10" 
                stroke-dasharray="${dashRec} ${circ - dashRec}" 
                stroke-dashoffset="${circ - offsetRec}"></circle>
                
        <!-- ID Cards (Green) -->
        <circle class="donut-segment" cx="50" cy="50" r="35" fill="transparent" 
                stroke="var(--accent-green)" stroke-width="10" 
                stroke-dasharray="${dashId} ${circ - dashId}" 
                stroke-dashoffset="${circ - offsetId}"></circle>
                
        <!-- Transcripts (Pink) -->
        <circle class="donut-segment" cx="50" cy="50" r="35" fill="transparent" 
                stroke="var(--accent-pink)" stroke-width="10" 
                stroke-dasharray="${dashTrn} ${circ - dashTrn}" 
                stroke-dashoffset="${circ - offsetTrn}"></circle>
      </svg>
      <div class="donut-center">
        <span class="donut-center-value">${total}</span>
        <span class="donut-center-label">Files</span>
      </div>
    </div>
    <div class="chart-legends">
      <div class="legend-item">
        <div class="legend-color" style="background: var(--accent-cyan)"></div>
        <span>Invoice (${counts.invoice})</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: var(--accent-purple)"></div>
        <span>Receipt (${counts.receipt})</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: var(--accent-green)"></div>
        <span>ID Card (${counts.id_card})</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: var(--accent-pink)"></div>
        <span>Transcript (${counts.transcript})</span>
      </div>
    </div>
  `;
}

function renderRecentActivity() {
  const container = document.getElementById("recent-activity-list");
  if (!container) return;
  
  container.innerHTML = "";
  
  // Sort docs by upload date (most recent first)
  const sorted = [...state.documents].sort((a,b) => b.uploadDate.localeCompare(a.uploadDate));
  
  sorted.forEach(doc => {
    const item = document.createElement("div");
    item.className = "activity-item";
    
    let typeColor = "var(--accent-cyan)";
    if (doc.type === "receipt") typeColor = "var(--accent-purple)";
    if (doc.type === "id_card") typeColor = "var(--accent-green)";
    if (doc.type === "transcript") typeColor = "var(--accent-pink)";
    
    item.innerHTML = `
      <div class="activity-info">
        <div class="activity-icon-wrap success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <div class="activity-name">${doc.title}</div>
          <span class="activity-time">${doc.uploadDate}</span>
        </div>
      </div>
      <div class="activity-action" style="color: ${typeColor}">${doc.type.replace("_"," ").toUpperCase()}</div>
      <div class="badge-status processed">${doc.status}</div>
    `;
    container.appendChild(item);
  });
}

// ==========================================
// 3. Ingestor & OCR Screen
// ==========================================
function initOcrViewer() {
  // Sidebar List
  renderOcrSidebar();
  
  // Drag and drop setup
  const dropZone = document.getElementById("ocr-drop-zone");
  const fileInput = document.getElementById("ocr-file-input");
  
  dropZone.addEventListener("click", () => fileInput.click());
  
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });
  
  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });
  
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    if (e.dataTransfer.files.length > 0) {
      simulateFileUpload(e.dataTransfer.files[0]);
    }
  });
  
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      simulateFileUpload(e.target.files[0]);
    }
  });
}

function renderOcrSidebar() {
  const container = document.getElementById("ocr-doc-sidebar-list");
  if (!container) return;
  
  container.innerHTML = "";
  
  state.documents.forEach(doc => {
    const activeClass = doc.id === state.currentDocumentId ? "active" : "";
    const item = document.createElement("div");
    item.className = `activity-item cursor-pointer ${activeClass}`;
    item.style.cursor = "pointer";
    item.addEventListener("click", () => selectDocument(doc.id));
    
    item.innerHTML = `
      <div class="activity-info">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;color:var(--text-muted);">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <div>
          <div class="activity-name" style="max-width: 140px;">${doc.title}</div>
          <span style="font-size:0.7rem;color:var(--text-muted);">${doc.fileSize} | Acc: ${doc.ocrAccuracy}%</span>
        </div>
      </div>
      <div class="badge-status ${doc.status.toLowerCase()}">${doc.status}</div>
    `;
    container.appendChild(item);
  });
}

function selectDocument(docId) {
  state.currentDocumentId = docId;
  const doc = state.documents.find(d => d.id === docId);
  
  // Highlight active in list
  renderOcrSidebar();
  
  if (!doc) return;
  
  // Update details pane
  const visualPane = document.getElementById("ocr-visual-preview");
  const metaTitle = document.getElementById("ocr-meta-title");
  const metaSize = document.getElementById("ocr-meta-size");
  const metaAcc = document.getElementById("ocr-meta-accuracy");
  const rawTextConsole = document.getElementById("ocr-raw-text-console");
  
  metaTitle.innerText = doc.title;
  metaSize.innerText = doc.fileSize;
  metaAcc.innerText = `${doc.ocrAccuracy}%`;
  
  // Add visual mockup
  visualPane.innerHTML = doc.visualLayout;
  
  // Add Raw OCR string output
  rawTextConsole.textContent = doc.rawText.trim();
  
  // Render Editable Keys/Values table
  renderExtractedFieldsEditor(doc);
}

function renderExtractedFieldsEditor(doc) {
  const tbody = document.getElementById("ocr-extracted-fields-tbody");
  if (!tbody) return;
  
  tbody.innerHTML = "";
  
  Object.entries(doc.extractedData).forEach(([key, val]) => {
    const row = document.createElement("tr");
    
    row.innerHTML = `
      <td><span class="field-key-badge">${key}</span></td>
      <td>
        <input type="text" class="field-value-input" value="${val}" data-key="${key}">
      </td>
    `;
    
    // Add event listener to update values
    const input = row.querySelector("input");
    input.addEventListener("input", (e) => {
      doc.extractedData[e.target.dataset.key] = e.target.value;
      // If we are currently mapping this schema, update preview instantly
      updateSchemaSandbox();
    });
    
    tbody.appendChild(row);
  });
}

function simulateFileUpload(file) {
  const dropZone = document.getElementById("ocr-drop-zone");
  const laser = document.getElementById("ocr-scanner-laser");
  
  // Verify document type
  let type = "invoice";
  if (file.name.toLowerCase().includes("receipt")) type = "receipt";
  else if (file.name.toLowerCase().includes("card") || file.name.toLowerCase().includes("license") || file.name.toLowerCase().includes("id")) type = "id_card";
  else if (file.name.toLowerCase().includes("transcript") || file.name.toLowerCase().includes("record") || file.name.toLowerCase().includes("gpa")) type = "transcript";
  
  // Create virtual document object
  const newId = "doc_uploaded_" + Date.now();
  
  // Get corresponding schema templates or build default mockup values
  let preMadeDoc = null;
  if (type === "invoice") preMadeDoc = MOCK_DOCUMENTS[0];
  else if (type === "receipt") preMadeDoc = MOCK_DOCUMENTS[1];
  else if (type === "id_card") preMadeDoc = MOCK_DOCUMENTS[2];
  else preMadeDoc = MOCK_DOCUMENTS[3];
  
  const uploadDoc = {
    id: newId,
    title: file.name,
    type: type,
    fileSize: (file.size / 1024).toFixed(0) + " KB",
    uploadDate: new Date().toISOString().split("T")[0],
    status: "Processing",
    ocrAccuracy: parseFloat((92 + Math.random() * 7.5).toFixed(1)),
    rawText: preMadeDoc.rawText,
    extractedData: JSON.parse(JSON.stringify(preMadeDoc.extractedData)), // copy values
    visualLayout: preMadeDoc.visualLayout
  };
  
  // Add to local state
  state.documents.push(uploadDoc);
  selectDocument(newId);
  
  // Start scan animations
  laser.classList.add("active");
  
  // Simulated logs
  const rawTextConsole = document.getElementById("ocr-raw-text-console");
  rawTextConsole.textContent = "INGESTION PIPELINE INITIALIZED...\n[1/4] Reading file stream...\n[2/4] Executing Neural Network OCR layout analysis...";
  
  setTimeout(() => {
    rawTextConsole.textContent += "\n[3/4] Parsing document bounding boxes & text segments...\n[4/4] Normalizing key-value coordinates...";
  }, 1000);
  
  setTimeout(() => {
    uploadDoc.status = "Processed";
    laser.classList.remove("active");
    selectDocument(newId);
    updateDashboardMetrics();
  }, 2500);
}

// ==========================================
// 4. Schema Mapping Component
// ==========================================
function initSchemaMapper() {
  const typeSelector = document.getElementById("schema-template-selector");
  if (!typeSelector) return;
  
  typeSelector.addEventListener("change", (e) => {
    state.currentSchemaType = e.target.value;
    renderSchemaRows();
    updateSchemaSandbox();
  });
  
  document.getElementById("btn-add-schema-row").addEventListener("click", addSchemaRow);
  
  renderSchemaRows();
  updateSchemaSandbox();
}

function renderSchemaRows() {
  const container = document.getElementById("schema-rows-container");
  if (!container) return;
  
  container.innerHTML = "";
  
  const currentSchema = state.schemas[state.currentSchemaType];
  const fields = currentSchema.fields;
  
  // Find current doc of this type to prefill source keys dropdown options
  const relativeDoc = state.documents.find(d => d.type === state.currentSchemaType) || state.documents[0];
  const ocrKeys = Object.keys(relativeDoc.extractedData);
  
  fields.forEach((field, index) => {
    const row = document.createElement("div");
    row.className = "schema-row";
    
    // Select option builder for source keys
    let sourceOptions = `<option value="">[Ignore field]</option>`;
    ocrKeys.forEach(k => {
      const selected = k === field.sourceKey ? "selected" : "";
      sourceOptions += `<option value="${k}" ${selected}>${k}</option>`;
    });
    
    row.innerHTML = `
      <div>
        <input type="text" class="schema-input field-target-key" value="${field.key}" data-index="${index}" placeholder="target_key">
      </div>
      <div>
        <select class="schema-select field-source-key" data-index="${index}">
          ${sourceOptions}
        </select>
      </div>
      <div>
        <select class="schema-select field-datatype" data-index="${index}">
          <option value="string" ${field.type === "string" ? "selected" : ""}>String</option>
          <option value="integer" ${field.type === "integer" ? "selected" : ""}>Integer</option>
          <option value="float" ${field.type === "float" ? "selected" : ""}>Float</option>
          <option value="date" ${field.type === "date" ? "selected" : ""}>Date (ISO)</option>
          <option value="datetime" ${field.type === "datetime" ? "selected" : ""}>DateTime</option>
        </select>
      </div>
      <div>
        <select class="schema-select field-transform" data-index="${index}">
          <option value="none" ${field.transform === "none" ? "selected" : ""}>None</option>
          <option value="uppercase" ${field.transform === "uppercase" ? "selected" : ""}>Uppercase</option>
          <option value="lowercase" ${field.transform === "lowercase" ? "selected" : ""}>Lowercase</option>
          <option value="numberOnly" ${field.transform === "numberOnly" ? "selected" : ""}>Extract Currency/Number</option>
          <option value="parseDate" ${field.transform === "parseDate" ? "selected" : ""}>Convert Date Format</option>
          <option value="extractGPA" ${field.transform === "extractGPA" ? "selected" : ""}>Extract GPA (X.XX)</option>
        </select>
      </div>
      <div>
        <button class="schema-btn-action" data-index="${index}" onclick="removeSchemaRow(${index})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    `;
    
    // Add change listeners to update rules in state
    row.querySelector(".field-target-key").addEventListener("input", (e) => {
      currentSchema.fields[e.target.dataset.index].key = e.target.value;
      updateSchemaSandbox();
    });
    row.querySelector(".field-source-key").addEventListener("change", (e) => {
      currentSchema.fields[e.target.dataset.index].sourceKey = e.target.value;
      updateSchemaSandbox();
    });
    row.querySelector(".field-datatype").addEventListener("change", (e) => {
      currentSchema.fields[e.target.dataset.index].type = e.target.value;
      updateSchemaSandbox();
    });
    row.querySelector(".field-transform").addEventListener("change", (e) => {
      currentSchema.fields[e.target.dataset.index].transform = e.target.value;
      updateSchemaSandbox();
    });
    
    container.appendChild(row);
  });
}

function addSchemaRow() {
  const schema = state.schemas[state.currentSchemaType];
  schema.fields.push({
    key: "new_field",
    sourceKey: "",
    type: "string",
    transform: "none"
  });
  renderSchemaRows();
  updateSchemaSandbox();
}

function removeSchemaRow(index) {
  const schema = state.schemas[state.currentSchemaType];
  schema.fields.splice(index, 1);
  renderSchemaRows();
  updateSchemaSandbox();
}

// Transformation engine
function applyTransformation(val, transform, targetType) {
  if (val === undefined || val === null) return null;
  let result = val.toString().trim();
  
  if (transform === "uppercase") {
    result = result.toUpperCase();
  } else if (transform === "lowercase") {
    result = result.toLowerCase();
  } else if (transform === "numberOnly") {
    // Strip dollar signs, commas, letters
    result = result.replace(/[^0-9.-]/g, "");
    if (result === "") return null;
  } else if (transform === "parseDate") {
    // Convert "June 20, 2026" or "06/24/2026" into standard YYYY-MM-DD
    try {
      const parsedDate = new Date(result);
      if (!isNaN(parsedDate.getTime())) {
        result = parsedDate.toISOString().split("T")[0];
      }
    } catch(e) {
      // Return original if conversion fails
    }
  } else if (transform === "extractGPA") {
    // extract gpa e.g. "3.84 / 4.00" -> 3.84
    const match = result.match(/([0-9]\.[0-9]+)/);
    if (match) {
      result = match[1];
    }
  }
  
  // Cast data types
  if (targetType === "integer") {
    const num = parseInt(result, 10);
    return isNaN(num) ? null : num;
  } else if (targetType === "float") {
    const num = parseFloat(result);
    return isNaN(num) ? null : num;
  }
  
  return result;
}

function updateSchemaSandbox() {
  const outputConsole = document.getElementById("schema-sandbox-output");
  if (!outputConsole) return;
  
  // Get active document of this schema type
  const targetDoc = state.documents.find(d => d.type === state.currentSchemaType && d.status === "Processed");
  if (!targetDoc) {
    outputConsole.textContent = "// No processed documents available for this template type.";
    return;
  }
  
  const mappedObj = transformDocument(targetDoc, state.schemas[state.currentSchemaType].fields);
  outputConsole.textContent = JSON.stringify(mappedObj, null, 2);
}

function transformDocument(doc, fields) {
  const output = {
    _meta: {
      document_id: doc.id,
      original_filename: doc.title,
      extraction_accuracy: doc.ocrAccuracy,
      processed_timestamp: doc.uploadDate + "T12:00:00Z"
    }
  };
  
  fields.forEach(field => {
    if (!field.key) return;
    const rawVal = doc.extractedData[field.sourceKey];
    output[field.key] = applyTransformation(rawVal, field.transform, field.type);
  });
  
  return output;
}

// ==========================================
// 5. Export & Search Hub
// ==========================================
function initExportHub() {
  const searchInput = document.getElementById("export-search");
  const typeSelector = document.getElementById("export-filter-type");
  const accuracySlider = document.getElementById("export-filter-accuracy");
  const accuracyVal = document.getElementById("export-accuracy-val");
  
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.toLowerCase();
    renderExportList();
  });
  
  typeSelector.addEventListener("change", (e) => {
    state.filterType = e.target.value;
    renderExportList();
  });
  
  accuracySlider.addEventListener("input", (e) => {
    state.minAccuracy = parseInt(e.target.value, 10);
    accuracyVal.innerText = `${state.minAccuracy}%`;
    renderExportList();
  });
  
  // Format buttons
  const formatButtons = document.querySelectorAll(".format-btn");
  formatButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      formatButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.exportFormat = btn.dataset.format;
      updateExportCodePanel();
    });
  });
  
  document.getElementById("btn-download-export").addEventListener("click", triggerDownload);
  
  renderExportList();
}

function renderExportList() {
  const container = document.getElementById("export-document-list");
  if (!container) return;
  
  container.innerHTML = "";
  
  // Filter docs
  const filtered = state.documents.filter(doc => {
    if (doc.status !== "Processed") return false;
    if (doc.ocrAccuracy < state.minAccuracy) return false;
    if (state.filterType !== "all" && doc.type !== state.filterType) return false;
    if (state.searchQuery && !doc.title.toLowerCase().includes(state.searchQuery)) return false;
    return true;
  });
  
  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-muted text-center p-3">No matching documents.</div>`;
    updateExportCodePanel();
    return;
  }
  
  filtered.forEach((doc, index) => {
    const item = document.createElement("div");
    item.className = `activity-item cursor-pointer mb-2`;
    item.style.cursor = "pointer";
    item.innerHTML = `
      <div class="activity-info">
        <input type="checkbox" class="export-select-checkbox" data-id="${doc.id}" checked onclick="event.stopPropagation(); updateExportCodePanel();">
        <div>
          <div class="activity-name">${doc.title}</div>
          <span style="font-size:0.7rem;color:var(--text-muted);">${doc.type.toUpperCase()} | Acc: ${doc.ocrAccuracy}%</span>
        </div>
      </div>
    `;
    
    // Toggle check on click
    item.addEventListener("click", (e) => {
      if (e.target.type !== "checkbox") {
        const cb = item.querySelector(".export-select-checkbox");
        cb.checked = !cb.checked;
        updateExportCodePanel();
      }
    });
    
    container.appendChild(item);
  });
  
  updateExportCodePanel();
}

function getSelectedDocumentsForExport() {
  const checkboxes = document.querySelectorAll(".export-select-checkbox:checked");
  const selectedIds = Array.from(checkboxes).map(cb => cb.dataset.id);
  return state.documents.filter(doc => selectedIds.includes(doc.id));
}

function updateExportCodePanel() {
  const panel = document.getElementById("export-code-panel");
  const langLabel = document.getElementById("export-code-lang");
  if (!panel) return;
  
  const targetDocs = getSelectedDocumentsForExport();
  if (targetDocs.length === 0) {
    panel.textContent = "// No files selected for export.";
    return;
  }
  
  // Map documents using their schemas
  const mappedResults = targetDocs.map(doc => {
    const schemaFields = state.schemas[doc.type].fields;
    return transformDocument(doc, schemaFields);
  });
  
  // Format based on active format
  const format = state.exportFormat;
  let outputString = "";
  
  if (format === "json") {
    langLabel.innerText = "JSON STRUCTURE";
    panel.style.color = "#38ef7d";
    outputString = JSON.stringify(mappedResults, null, 2);
  } else if (format === "xml") {
    langLabel.innerText = "XML MARKUP";
    panel.style.color = "#ffdd67";
    outputString = convertToXML(mappedResults);
  } else if (format === "yaml") {
    langLabel.innerText = "YAML DATA";
    panel.style.color = "#4ba3ff";
    outputString = convertToYAML(mappedResults);
  } else if (format === "csv") {
    langLabel.innerText = "CSV DATASHEET";
    panel.style.color = "#ff88c2";
    outputString = convertToCSV(mappedResults);
  }
  
  panel.textContent = outputString;
  
  // Update mock API endpoints curls
  updateMockApiDisplay(mappedResults);
}

// Convert JSON to XML
function convertToXML(objList) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<DocumentDatabase>\n';
  objList.forEach(obj => {
    xml += '  <Document>\n';
    
    // Meta
    xml += '    <_meta>\n';
    Object.entries(obj._meta).forEach(([k, v]) => {
      xml += `      <${k}>${v}</${k}>\n`;
    });
    xml += '    </_meta>\n';
    
    // Data fields
    Object.entries(obj).forEach(([k, v]) => {
      if (k === "_meta") return;
      xml += `    <${k}>${v !== null ? v : ""}</${k}>\n`;
    });
    
    xml += '  </Document>\n';
  });
  xml += '</DocumentDatabase>';
  return xml;
}

// Convert JSON to YAML
function convertToYAML(objList) {
  let yaml = "";
  objList.forEach((obj, idx) => {
    yaml += `- document_index: ${idx}\n`;
    yaml += `  _meta:\n`;
    Object.entries(obj._meta).forEach(([k, v]) => {
      yaml += `    ${k}: ${v}\n`;
    });
    yaml += `  data:\n`;
    Object.entries(obj).forEach(([k, v]) => {
      if (k === "_meta") return;
      yaml += `    ${k}: ${v !== null ? v : ""}\n`;
    });
  });
  return yaml;
}

// Convert JSON to CSV
function convertToCSV(objList) {
  if (objList.length === 0) return "";
  
  // Extract all unique headers (excluding _meta keys)
  const headers = new Set(["document_id", "accuracy", "file_type"]);
  objList.forEach(obj => {
    Object.keys(obj).forEach(k => {
      if (k !== "_meta") headers.add(k);
    });
  });
  
  const headersArray = Array.from(headers);
  let csv = headersArray.join(",") + "\n";
  
  objList.forEach(obj => {
    const row = headersArray.map(header => {
      let val = "";
      if (header === "document_id") val = obj._meta.document_id;
      else if (header === "accuracy") val = obj._meta.extraction_accuracy;
      else if (header === "file_type") {
        const matchingDoc = state.documents.find(d => d.id === obj._meta.document_id);
        val = matchingDoc ? matchingDoc.type : "unknown";
      }
      else val = obj[header] !== undefined && obj[header] !== null ? obj[header] : "";
      
      // Escape commas & quotes
      val = val.toString().replace(/"/g, '""');
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        val = `"${val}"`;
      }
      return val;
    });
    csv += row.join(",") + "\n";
  });
  
  return csv;
}

function triggerDownload() {
  const panel = document.getElementById("export-code-panel");
  const content = panel.textContent;
  
  let mime = "text/plain";
  let extension = "txt";
  
  if (state.exportFormat === "json") { mime = "application/json"; extension = "json"; }
  else if (state.exportFormat === "xml") { mime = "application/xml"; extension = "xml"; }
  else if (state.exportFormat === "yaml") { mime = "text/yaml"; extension = "yaml"; }
  else if (state.exportFormat === "csv") { mime = "text/csv"; extension = "csv"; }
  
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transformo_export_${Date.now()}.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function updateMockApiDisplay(mappedResults) {
  const apiCode = document.getElementById("api-curl-mock");
  if (!apiCode) return;
  
  const singleResult = mappedResults[0] || {};
  
  apiCode.textContent = `
# Fetch processed documents database via API endpoint
curl -X GET "https://api.transformo-docs.edu/v1/documents" \\
  -H "Authorization: Bearer tf_live_9481a0e8d" \\
  -H "Content-Type: application/json"

# Response Ingestion Webhook payload
{
  "event": "document.transformation.completed",
  "timestamp": "${new Date().toISOString()}",
  "data": ${JSON.stringify(singleResult, null, 2).replace(/\n/g, "\n  ")}
}
  `.trim();
}
