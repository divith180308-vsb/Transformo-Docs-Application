// Mock Data for Transformo Docs Application
const MOCK_DOCUMENTS = [
  {
    id: "doc_inv_001",
    title: "Invoice_ACME_Corp_9482.pdf",
    type: "invoice",
    fileSize: "1.2 MB",
    uploadDate: "2026-06-25",
    status: "Processed",
    ocrAccuracy: 98.7,
    rawText: `
INVOICE
ACME Corporation
123 Enterprise Way, Tech City, TC 94012
Email: billing@acme.com | Tel: (555) 019-2831

BILL TO:
Global Logistics Inc.
456 Commerce Blvd, Suite 100
Shipping Hub, SH 30219

Invoice Details:
Invoice Number: INV-2026-9482
Issue Date: June 20, 2026
Due Date: July 20, 2026
PO Number: PO-88392-X

---------------------------------------------------------
Description                 Qty    Unit Price     Amount
---------------------------------------------------------
Cloud Database Migration     1     $3,500.00    $3,500.00
API Gateway Integration      2       $750.00    $1,500.00
Dedicated Support (June)     1       $500.00      $500.00
---------------------------------------------------------
Subtotal:                                       $5,500.00
Tax (8.25%):                                      $453.75
Total Amount Due:                               $5,953.75
---------------------------------------------------------
Payment Terms: Net 30. Please send ACH transfers to routing bank code.
Thank you for your business!
    `,
    extractedData: {
      "Invoice Number": "INV-2026-9482",
      "Issue Date": "June 20, 2026",
      "Due Date": "July 20, 2026",
      "Vendor Name": "ACME Corporation",
      "Client Name": "Global Logistics Inc.",
      "Subtotal": "$5,500.00",
      "Tax": "$453.75",
      "Total Amount": "$5,953.75"
    },
    visualLayout: `
      <div class="doc-paper invoice-theme">
        <div class="doc-header">
          <div>
            <h2 class="doc-title-brand">ACME CORPORATION</h2>
            <p class="doc-subtext">Enterprise Cloud & API Solutions</p>
          </div>
          <div class="doc-meta-right">
            <span class="badge badge-primary">INVOICE</span>
          </div>
        </div>
        <hr class="doc-divider"/>
        <div class="doc-body-grid">
          <div>
            <strong>FROM:</strong>
            <p>ACME Corporation<br>123 Enterprise Way, Tech City</p>
          </div>
          <div>
            <strong>BILL TO:</strong>
            <p>Global Logistics Inc.<br>456 Commerce Blvd, Suite 100</p>
          </div>
        </div>
        <div class="doc-body-grid mt-2">
          <div>
            <strong>INVOICE NO:</strong> <span class="highlight-val">INV-2026-9482</span><br>
            <strong>PO NUMBER:</strong> PO-88392-X
          </div>
          <div>
            <strong>DATE:</strong> June 20, 2026<br>
            <strong>DUE DATE:</strong> July 20, 2026
          </div>
        </div>
        <table class="doc-table mt-3">
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cloud Database Migration</td>
              <td class="text-right">1</td>
              <td class="text-right">$3,500.00</td>
              <td class="text-right">$3,500.00</td>
            </tr>
            <tr>
              <td>API Gateway Integration</td>
              <td class="text-right">2</td>
              <td class="text-right">$750.00</td>
              <td class="text-right">$1,500.00</td>
            </tr>
            <tr>
              <td>Dedicated Support (June)</td>
              <td class="text-right">1</td>
              <td class="text-right">$500.00</td>
              <td class="text-right">$500.00</td>
            </tr>
          </tbody>
        </table>
        <div class="doc-totals">
          <p><strong>Subtotal:</strong> $5,500.00</p>
          <p><strong>Tax (8.25%):</strong> $453.75</p>
          <p class="doc-grand-total"><strong>Total Due:</strong> $5,953.75</p>
        </div>
      </div>
    `
  },
  {
    id: "doc_rec_002",
    title: "Receipt_TargetStore_38401.jpg",
    type: "receipt",
    fileSize: "420 KB",
    uploadDate: "2026-06-26",
    status: "Processed",
    ocrAccuracy: 94.2,
    rawText: `
TARGET STORES
STORE #1849 - MINNEAPOLIS EAST
3001 BROADWAY ST NE, MINNEAPOLIS, MN 55413
TEL: 612-359-2100

REG 03    TRN 99283   OPR 4492   DATE 06/24/2026 14:32

1   LOGITECH G502 MOUSE      $79.99  T
1   TYPE-C CHARGER CABLE     $19.99  T
2   USB-C HUB 6-IN-1 @ 29.99 $59.98  T
3   ENERGIZER AA BATTERY 8PK $12.49  T

SUBTOTAL                     $172.45
TAX (7.25%)                  $12.50
TOTAL                        $184.95

PAID VIA CREDIT CARD (VISA) ************9901
AUTH CODE: 048291
TRANS ID: T-8823901-44

THANK YOU FOR SHOPPING AT TARGET!
RETURN POLICY: 90 DAYS WITH RECEIPT
    `,
    extractedData: {
      "Store Name": "TARGET STORES",
      "Transaction Time": "06/24/2026 14:32",
      "Item 1 (Price)": "LOGITECH G502 MOUSE ($79.99)",
      "Item 2 (Price)": "TYPE-C CHARGER CABLE ($19.99)",
      "Item 3 (Price)": "USB-C HUB 6-IN-1 ($59.98)",
      "Item 4 (Price)": "ENERGIZER AA BATTERY 8PK ($12.49)",
      "Subtotal": "$172.45",
      "Total Tax": "$12.50",
      "Total Cost": "$184.95",
      "Payment Method": "VISA CREDIT CARD (*9901)"
    },
    visualLayout: `
      <div class="doc-paper receipt-theme">
        <div class="text-center">
          <h3 class="receipt-title">★ TARGET ★</h3>
          <p class="receipt-sub">Store #1849 - Minneapolis East<br>Tel: 612-359-2100</p>
        </div>
        <div class="receipt-divider-dash"></div>
        <div class="doc-body-grid text-sm">
          <div>
            <strong>REG:</strong> 03 | <strong>TRN:</strong> 99283
          </div>
          <div class="text-right">
            06/24/2026 14:32
          </div>
        </div>
        <div class="receipt-divider-dash"></div>
        <table class="receipt-table">
          <tbody>
            <tr>
              <td>1 LOGITECH G502 MOUSE</td>
              <td class="text-right">$79.99</td>
            </tr>
            <tr>
              <td>1 TYPE-C CHARGER CABLE</td>
              <td class="text-right">$19.99</td>
            </tr>
            <tr>
              <td>2 USB-C HUB 6-IN-1 @ 29.99</td>
              <td class="text-right">$59.98</td>
            </tr>
            <tr>
              <td>3 ENERGIZER AA BATTERY 8PK</td>
              <td class="text-right">$12.49</td>
            </tr>
          </tbody>
        </table>
        <div class="receipt-divider-dash"></div>
        <div class="receipt-totals text-sm">
          <p>Subtotal: <span class="float-right">$172.45</span></p>
          <p>Tax (7.25%): <span class="float-right">$12.50</span></p>
          <h4 class="receipt-grand">TOTAL: <span class="float-right">$184.95</span></h4>
        </div>
        <div class="receipt-divider-dash"></div>
        <div class="text-center text-xs mt-2 text-muted">
          PAID: VISA ************9901<br>
          AUTH CODE: 048291<br>
          THANK YOU FOR SHOPPING AT TARGET!
        </div>
      </div>
    `
  },
  {
    id: "doc_id_003",
    title: "ID_Card_Alex_Mercer_Scanned.png",
    type: "id_card",
    fileSize: "850 KB",
    uploadDate: "2026-06-27",
    status: "Processed",
    ocrAccuracy: 99.1,
    rawText: `
STATE OF CALIFORNIA
DEPARTMENT OF MOTOR VEHICLES
DRIVER LICENSE
DL NUMBER: N9928301
CLASS: C
NAME: ALEX MERCER
DOB: 08/14/1995
SEX: M
HAIR: BRN  EYES: BLU
HT: 5-11   WT: 175 LB
ADDRESS: 742 EVERGREEN TERRACE, SAN FRANCISCO, CA 94102
ISS: 09/10/2023
EXP: 08/14/2028
FN: California
    `,
    extractedData: {
      "Document ID": "N9928301",
      "Full Name": "ALEX MERCER",
      "Date of Birth": "08/14/1995",
      "Expiration Date": "08/14/2028",
      "Address": "742 EVERGREEN TERRACE, SAN FRANCISCO, CA 94102",
      "Issuer": "STATE OF CALIFORNIA DMV"
    },
    visualLayout: `
      <div class="doc-paper idcard-theme">
        <div class="id-header">
          <div class="id-seal"></div>
          <div>
            <h4 class="id-state">CALIFORNIA</h4>
            <p class="id-title">DRIVER LICENSE</p>
          </div>
          <div class="text-right">
            <span class="id-dl-label">DL NO.</span>
            <span class="id-dl-val">N9928301</span>
          </div>
        </div>
        <div class="id-content">
          <div class="id-photo">
            <div class="id-photo-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div class="id-sig">Alex Mercer</div>
          </div>
          <div class="id-details text-xs">
            <p><span class="label">FN:</span> <span class="val highlight-val">MERCER</span></p>
            <p><span class="label">LN:</span> <span class="val highlight-val">ALEX</span></p>
            <p><span class="label">ADDRESS:</span> <span class="val">742 EVERGREEN TERRACE, SAN FRANCISCO, CA 94102</span></p>
            <div class="doc-body-grid">
              <div>
                <p><span class="label">DOB:</span> <span class="val">08/14/1995</span></p>
                <p><span class="label">SEX:</span> <span class="val">M</span></p>
              </div>
              <div>
                <p><span class="label">ISS:</span> <span class="val">09/10/2023</span></p>
                <p><span class="label">EXP:</span> <span class="val text-danger">08/14/2028</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "doc_trn_004",
    title: "Transcript_Jane_Doe_University.pdf",
    type: "transcript",
    fileSize: "1.8 MB",
    uploadDate: "2026-06-27",
    status: "Processed",
    ocrAccuracy: 95.8,
    rawText: `
PACIFIC STATE UNIVERSITY
OFFICIAL ACADEMIC RECORD
OFFICE OF THE REGISTRAR

STUDENT NAME: JANE DOE
STUDENT ID: PSU-2023-8849
MAJOR: COMPUTER SCIENCE
GRADUATION DATE: MAY 15, 2026
CUMULATIVE GPA: 3.84 / 4.00

SEMESTER: SPRING 2026
COURSE CODE   COURSE TITLE                   CREDITS  GRADE
CS-401        DISTRIBUTED SYSTEMS              3.0      A
CS-499        CAPSTONE PROJECT                 4.0      A
CS-415        MACHINE LEARNING                 3.0      B+
MATH-302      PROBABILITY & STATISTICS         3.0      A-

TOTAL CREDITS COMPLETED: 120.0
ACADEMIC STANDING: DEAN'S LIST
REGISTRAR SIGNATURE: DR. ROBERT CHEN
    `,
    extractedData: {
      "Student Name": "JANE DOE",
      "Student ID": "PSU-2023-8849",
      "Major": "COMPUTER SCIENCE",
      "GPA": "3.84 / 4.00",
      "Graduation Date": "MAY 15, 2026",
      "Course 1 Grade": "CS-401 DISTRIBUTED SYSTEMS: A",
      "Course 2 Grade": "CS-499 CAPSTONE PROJECT: A",
      "Course 3 Grade": "CS-415 MACHINE LEARNING: B+",
      "Course 4 Grade": "MATH-302 PROBABILITY: A-"
    },
    visualLayout: `
      <div class="doc-paper transcript-theme">
        <div class="text-center">
          <h2 class="uni-title">PACIFIC STATE UNIVERSITY</h2>
          <p class="uni-sub">Official Academic Transcript</p>
        </div>
        <hr class="doc-divider"/>
        <div class="doc-body-grid text-sm mb-3">
          <div>
            <strong>STUDENT NAME:</strong> <span class="highlight-val">JANE DOE</span><br>
            <strong>STUDENT ID:</strong> PSU-2023-8849<br>
            <strong>MAJOR:</strong> COMPUTER SCIENCE
          </div>
          <div class="text-right">
            <strong>CUMULATIVE GPA:</strong> <span class="highlight-val">3.84 / 4.00</span><br>
            <strong>GRAD DATE:</strong> MAY 15, 2026<br>
            <strong>STATUS:</strong> Active / Dean's List
          </div>
        </div>
        <table class="doc-table text-sm">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th class="text-center">Credits</th>
              <th class="text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CS-401</td>
              <td>Distributed Systems</td>
              <td class="text-center">3.0</td>
              <td class="text-center"><strong>A</strong></td>
            </tr>
            <tr>
              <td>CS-499</td>
              <td>Capstone Project</td>
              <td class="text-center">4.0</td>
              <td class="text-center"><strong>A</strong></td>
            </tr>
            <tr>
              <td>CS-415</td>
              <td>Machine Learning</td>
              <td class="text-center">3.0</td>
              <td class="text-center"><strong>B+</strong></td>
            </tr>
            <tr>
              <td>MATH-302</td>
              <td>Probability & Statistics</td>
              <td class="text-center">3.0</td>
              <td class="text-center"><strong>A-</strong></td>
            </tr>
          </tbody>
        </table>
        <div class="transcript-footer mt-4">
          <div class="doc-body-grid text-xs">
            <div>
              <p>Total Credits: 120.0</p>
            </div>
            <div class="text-right">
              <span class="sig-placeholder">[Registrar Signature: Dr. Robert Chen]</span>
            </div>
          </div>
        </div>
      </div>
    `
  }
];

// Document Schema Template definitions (used for structural mapping)
const SCHEMA_TEMPLATES = {
  invoice: {
    description: "Financial invoices for business integrations",
    fields: [
      { key: "invoice_id", sourceKey: "Invoice Number", type: "string", transform: "none" },
      { key: "transaction_date", sourceKey: "Issue Date", type: "date", transform: "parseDate" },
      { key: "due_date", sourceKey: "Due Date", type: "date", transform: "parseDate" },
      { key: "vendor", sourceKey: "Vendor Name", type: "string", transform: "uppercase" },
      { key: "client", sourceKey: "Client Name", type: "string", transform: "none" },
      { key: "subtotal", sourceKey: "Subtotal", type: "float", transform: "numberOnly" },
      { key: "tax", sourceKey: "Tax", type: "float", transform: "numberOnly" },
      { key: "amount_due", sourceKey: "Total Amount", type: "float", transform: "numberOnly" }
    ]
  },
  receipt: {
    description: "Retail transactions and point of sale logs",
    fields: [
      { key: "merchant", sourceKey: "Store Name", type: "string", transform: "uppercase" },
      { key: "transaction_time", sourceKey: "Transaction Time", type: "datetime", transform: "none" },
      { key: "subtotal", sourceKey: "Subtotal", type: "float", transform: "numberOnly" },
      { key: "tax", sourceKey: "Total Tax", type: "float", transform: "numberOnly" },
      { key: "total_paid", sourceKey: "Total Cost", type: "float", transform: "numberOnly" },
      { key: "payment_method", sourceKey: "Payment Method", type: "string", transform: "none" }
    ]
  },
  id_card: {
    description: "Government-issued identity cards and license processing",
    fields: [
      { key: "identification_number", sourceKey: "Document ID", type: "string", transform: "none" },
      { key: "full_name", sourceKey: "Full Name", type: "string", transform: "uppercase" },
      { key: "date_of_birth", sourceKey: "Date of Birth", type: "date", transform: "parseDate" },
      { key: "expiration_date", sourceKey: "Expiration Date", type: "date", transform: "parseDate" },
      { key: "residential_address", sourceKey: "Address", type: "string", transform: "none" },
      { key: "issuing_authority", sourceKey: "Issuer", type: "string", transform: "none" }
    ]
  },
  transcript: {
    description: "University academic records and student performance",
    fields: [
      { key: "student_id", sourceKey: "Student ID", type: "string", transform: "none" },
      { key: "student_name", sourceKey: "Student Name", type: "string", transform: "uppercase" },
      { key: "major_subject", sourceKey: "Major", type: "string", transform: "none" },
      { key: "gpa_score", sourceKey: "GPA", type: "float", transform: "extractGPA" },
      { key: "graduation_date", sourceKey: "Graduation Date", type: "date", transform: "parseDate" }
    ]
  }
};
