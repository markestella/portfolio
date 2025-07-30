const { jsPDF } = window.jspdf;

const navLinks = document.querySelectorAll('nav a');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

const invoiceForm = document.getElementById('invoice-form');
const reportForm = document.getElementById('report-form');
const letterForm = document.getElementById('letter-form');
const invoicePreview = document.getElementById('invoice-preview');
const reportPreview = document.getElementById('report-preview');
const letterPreview = document.getElementById('letter-preview');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    navLinks.forEach(l => l.classList.remove('active'));

    link.classList.add('active');

    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    window.scrollTo({
      top: targetSection.offsetTop - 80,
      behavior: 'smooth'
    });
  });
});

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');

    const tabId = btn.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

function generateInvoice() {
  const invoiceNumber = document.getElementById('invoice-number').value;
  const invoiceDate = new Date(document.getElementById('invoice-date').value).toLocaleDateString();
  const dueDate = new Date(document.getElementById('due-date').value).toLocaleDateString();
  const fromCompany = document.getElementById('from-company').value.split('\n').join('<br>');
  const toCompany = document.getElementById('to-company').value.split('\n').join('<br>');
  const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;
  const notes = document.getElementById('notes').value;

  const itemDescs = document.querySelectorAll('.item-desc');
  const itemQtys = document.querySelectorAll('.item-qty');
  const itemPrices = document.querySelectorAll('.item-price');

  let itemsHTML = '';
  let subtotal = 0;

  for (let i = 0; i < itemDescs.length; i++) {
    const desc = itemDescs[i].value;
    const qty = parseInt(itemQtys[i].value) || 0;
    const price = parseFloat(itemPrices[i].value) || 0;
    const total = qty * price;
    subtotal += total;

    itemsHTML += `
          <tr>
            <td>${desc}</td>
            <td>${qty}</td>
            <td>$${price.toFixed(2)}</td>
            <td>$${total.toFixed(2)}</td>
          </tr>
        `;
  }

  const taxAmount = subtotal * (taxRate / 100);
  const grandTotal = subtotal + taxAmount;

  invoicePreview.innerHTML = `
        <div class="header">
          <div>
            <h2>INVOICE</h2>
            <div class="company-info">${fromCompany}</div>
          </div>
          <div class="invoice-details">
            <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
            <p><strong>Date:</strong> ${invoiceDate}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
          </div>
        </div>
        
        <div class="billing-info">
          <div>
            <h3>Bill To:</h3>
            <div>${toCompany}</div>
          </div>
        </div>
        
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div class="totals-row">
            <span>Tax (${taxRate}%):</span>
            <span>$${taxAmount.toFixed(2)}</span>
          </div>
          <div class="totals-row grand-total">
            <span>Total:</span>
            <span>$${grandTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="notes">
          <p><strong>Notes:</strong> ${notes}</p>
        </div>
      `;
}

function generateReport() {
  const title = document.getElementById('report-title').value;
  const subtitle = document.getElementById('report-subtitle').value;
  const author = document.getElementById('report-author').value;
  const date = new Date(document.getElementById('report-date').value).toLocaleDateString();
  const intro = document.getElementById('report-intro').value;
  const metrics = document.getElementById('report-metrics').value;
  const conclusion = document.getElementById('report-conclusion').value;

  reportPreview.innerHTML = `
        <div class="report-header">
          <h1 class="report-title">${title}</h1>
          <h2 class="report-subtitle">${subtitle}</h2>
          <div class="report-meta">
            <span>Prepared by: ${author}</span> | 
            <span>Date: ${date}</span>
          </div>
        </div>
        
        <div class="report-section">
          <h3>Introduction</h3>
          <p>${intro.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div class="report-section">
          <h3>Key Metrics</h3>
          <p>${metrics.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div class="report-section">
          <h3>Conclusion</h3>
          <p>${conclusion.replace(/\n/g, '<br>')}</p>
        </div>
      `;
}

function generateLetter() {
  const letterDate = new Date(document.getElementById('letter-date').value).toLocaleDateString();
  const senderAddress = document.getElementById('sender-address').value.split('\n').join('<br>');
  const recipientName = document.getElementById('recipient-name').value;
  const recipientTitle = document.getElementById('recipient-title').value;
  const recipientCompany = document.getElementById('recipient-company').value;
  const recipientAddress = document.getElementById('recipient-address').value.split('\n').join('<br>');
  const subject = document.getElementById('letter-subject').value;
  const salutation = document.getElementById('letter-salutation').value;
  const body = document.getElementById('letter-body').value;
  const closing = document.getElementById('letter-closing').value;
  const sender = document.getElementById('letter-sender').value;

  letterPreview.innerHTML = `
        <div class="letter-header">
          <div class="letter-sender">
            ${senderAddress}
            <p>Date: ${letterDate}</p>
          </div>
        </div>
        
        <div class="letter-recipient">
          <p>${recipientName}</p>
          <p>${recipientTitle}</p>
          <p>${recipientCompany}</p>
          <div class="letter-address">${recipientAddress}</div>
        </div>
        
        <div class="letter-subject">
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <div class="letter-body">
          <p>${salutation}</p>
          <p>${body.replace(/\n/g, '</p><p>')}</p>
          <p>${closing}</p>
          <div class="letter-signature">
            <p>${sender}</p>
          </div>
        </div>
      `;
}

function printToPDF(elementId, filename) {
  const element = document.getElementById(elementId);

  html2canvas(element, {
    scale: 2, // higher resolution for better text clarity
    useCORS: true
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();   // 210 mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm

    const margin = 15; // 15 mm margin on all sides
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    // Scale so that the content fits inside the margins
    const ratio = Math.min(usableWidth / canvas.width, usableHeight / canvas.height);
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;

    // Center image within the margin box
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save(filename);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  generateInvoice();
  generateReport();
  generateLetter();

  document.querySelector('footer p').innerHTML = `&copy; ${new Date().getFullYear()} Mark Estella. All rights reserved.`;
});

invoiceForm.addEventListener('input', generateInvoice);
reportForm.addEventListener('input', generateReport);
letterForm.addEventListener('input', generateLetter);

document.getElementById('print-invoice').addEventListener('click', () => {
  printToPDF('invoice-preview', 'invoice.pdf');
});

document.getElementById('print-report').addEventListener('click', () => {
  printToPDF('report-preview', 'report.pdf');
});

document.getElementById('print-letter').addEventListener('click', () => {
  printToPDF('letter-preview', 'letter.pdf');
});

const img = document.querySelector('.about-image img');
if (img && img.complete) {
  document.querySelector('.about-image .initials').style.display = 'none';
}

const API_URL = "https://portfolio-contact-api-j0fi.onrender.com/api/contact";
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    alert('Thanks for reaching out! I’ll get back to you soon.');
    e.target.reset();
  } else {
    alert('Failed to send message. Please try again later.');
  }
});

window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
});