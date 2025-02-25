// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

// DOM Elements
const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const bulkActions = document.getElementById("bulkActions");
const processAllBtn = document.getElementById("processAllBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const previewSection = document.getElementById("previewSection");
const generateBtn = document.getElementById("generateBtn");
const resetBtn = document.getElementById("resetBtn");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");
const processedFiles = document.getElementById("processedFiles");
const processedFilesList = document.getElementById("processedFilesList");
const downloadAllBtn = document.getElementById("downloadAllBtn");
const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const page3 = document.getElementById("page3");
const page4 = document.getElementById("page4");

// Variables
let uploadedFiles = [];
let processedPdfs = [];
let currentPreviewFile = null;

// Event Listeners
dropArea.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", handleFileSelect);
dropArea.addEventListener("dragover", handleDragOver);
dropArea.addEventListener("dragleave", handleDragLeave);
dropArea.addEventListener("drop", handleDrop);
generateBtn.addEventListener("click", generateSingleBookletPdf);
resetBtn.addEventListener("click", resetPreview);
processAllBtn.addEventListener("click", processAllFiles);
clearAllBtn.addEventListener("click", clearAllFiles);
downloadAllBtn.addEventListener("click", downloadAllAsZip);

// Functions
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  dropArea.classList.add("dragover");
}

function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  dropArea.classList.remove("dragover");
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  dropArea.classList.remove("dragover");

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFiles(files);
  }
}

function handleFileSelect() {
  if (fileInput.files.length > 0) {
    handleFiles(fileInput.files);
  }
}

function handleFiles(files) {
  const pdfFiles = Array.from(files).filter(
    (file) => file.type === "application/pdf"
  );

  if (pdfFiles.length === 0) {
    alert("Please upload PDF files only.");
    return;
  }

  // Add files to the list
  pdfFiles.forEach((file) => {
    // Check if file is already in the list
    if (
      !uploadedFiles.some((f) => f.name === file.name && f.size === file.size)
    ) {
      uploadedFiles.push(file);
      addFileToList(file);
    }
  });

  // Show bulk actions if there are files
  if (uploadedFiles.length > 0) {
    bulkActions.style.display = "flex";
  }
}

function addFileToList(file) {
  const fileItem = document.createElement("div");
  fileItem.className = "file-item";

  const fileName = document.createElement("div");
  fileName.className = "file-item-name";
  fileName.textContent = file.name;

  const fileActions = document.createElement("div");
  fileActions.className = "file-item-actions";

  const previewBtn = document.createElement("button");
  previewBtn.className = "process-btn";
  previewBtn.innerHTML = '<i class="fas fa-eye"></i> Preview';
  previewBtn.title = "Preview";
  previewBtn.onclick = () => previewFile(file);

  const removeBtn = document.createElement("button");
  removeBtn.innerHTML = '<i class="fas fa-times"></i> Remove';
  removeBtn.title = "Remove";
  removeBtn.onclick = () => removeFile(file, fileItem);

  fileActions.appendChild(previewBtn);
  fileActions.appendChild(removeBtn);

  fileItem.appendChild(fileName);
  fileItem.appendChild(fileActions);

  fileList.appendChild(fileItem);
}

function removeFile(file, fileItem) {
  uploadedFiles = uploadedFiles.filter((f) => f !== file);
  fileItem.remove();

  // Hide bulk actions if no files
  if (uploadedFiles.length === 0) {
    bulkActions.style.display = "none";
  }

  // If the removed file was being previewed, reset the preview
  if (currentPreviewFile === file) {
    resetPreview();
  }
}

function clearAllFiles() {
  uploadedFiles = [];
  fileList.innerHTML = "";
  bulkActions.style.display = "none";
  resetPreview();
}

async function previewFile(file) {
  // Show loading overlay
  loadingText.textContent = "Loading preview...";
  loadingOverlay.style.display = "flex";

  try {
    currentPreviewFile = file;

    // Load the PDF document
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdfDoc.numPages;

    // Check if PDF has at least 4 pages
    if (numPages < 4) {
      alert(
        `Warning: This PDF has only ${numPages} pages. Blank pages will be added to make a 4-page booklet.`
      );
    }

    // Generate preview
    await generatePreview(pdfDoc, numPages);

    // Show preview section
    previewSection.style.display = "block";
  } catch (error) {
    console.error("Error loading PDF:", error);
    alert("Error loading PDF. Please try again with a different file.");
  } finally {
    // Hide loading overlay
    loadingOverlay.style.display = "none";
  }
}

async function generatePreview(pdfDoc, numPages) {
  // Clear previous previews
  page1.innerHTML = "";
  page2.innerHTML = "";
  page3.innerHTML = "";
  page4.innerHTML = "";

  // Create canvas elements for each page
  for (let i = 1; i <= Math.min(numPages, 4); i++) {
    const page = await pdfDoc.getPage(i);
    const scale = 0.2; // Scale down for preview
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    // Add canvas to the appropriate preview div
    document.getElementById("page" + i).appendChild(canvas);
  }

  // If less than 4 pages, show placeholders
  for (let i = numPages + 1; i <= 4; i++) {
    const placeholder = document.createElement("div");
    placeholder.className = "placeholder";
    placeholder.textContent = "Blank Page";
    document.getElementById("page" + i).appendChild(placeholder);
  }
}

function resetPreview() {
  currentPreviewFile = null;
  previewSection.style.display = "none";
  page1.innerHTML = "Page 1";
  page2.innerHTML = "Page 2";
  page3.innerHTML = "Page 3";
  page4.innerHTML = "Page 4";
}

async function processAllFiles() {
  if (uploadedFiles.length === 0) return;

  // Show loading overlay
  loadingText.textContent = "Processing all files...";
  loadingOverlay.style.display = "flex";

  try {
    // Process each file
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      loadingText.textContent = `Processing file ${i + 1} of ${
        uploadedFiles.length
      }: ${file.name}`;

      const bookletPdfBlob = await processFile(file);
      if (bookletPdfBlob) {
        // Add to processed files
        processedPdfs.push({
          originalName: file.name,
          bookletName: `booklet-${file.name}`,
          blob: bookletPdfBlob,
        });
      }
    }

    // Update processed files list
    updateProcessedFilesList();

    // Show processed files section
    processedFiles.style.display = "block";
  } catch (error) {
    console.error("Error processing files:", error);
    alert("Error processing files. Please try again.");
  } finally {
    // Hide loading overlay
    loadingOverlay.style.display = "none";
  }
}

async function generateSingleBookletPdf() {
  if (!currentPreviewFile) return;

  // Show loading overlay
  loadingText.textContent = "Generating booklet PDF...";
  loadingOverlay.style.display = "flex";

  try {
    const bookletPdfBlob = await processFile(currentPreviewFile);
    if (bookletPdfBlob) {
      // Add to processed files
      processedPdfs.push({
        originalName: currentPreviewFile.name,
        bookletName: `booklet-${currentPreviewFile.name}`,
        blob: bookletPdfBlob,
      });

      // Update processed files list
      updateProcessedFilesList();

      // Show processed files section
      processedFiles.style.display = "block";
    }
  } catch (error) {
    console.error("Error generating booklet PDF:", error);
    alert("Error generating booklet PDF. Please try again.");
  } finally {
    // Hide loading overlay
    loadingOverlay.style.display = "none";
  }
}

async function processFile(file) {
  try {
    // Load the PDF document
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdfDoc.numPages;

    // Create a new jsPDF instance (landscape for side-by-side pages)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    // Get page dimensions
    const page = await pdfDoc.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    const pageWidth = viewport.width;
    const pageHeight = viewport.height;

    // Calculate scale to fit two pages side by side on A4 landscape
    // A4 landscape dimensions in points: 841.89 × 595.28
    const docWidth = 841.89;
    const docHeight = 595.28;
    const scale = Math.min(docWidth / (pageWidth * 2), docHeight / pageHeight);

    // Calculate dimensions for each page in the booklet
    const scaledWidth = pageWidth * scale;
    const scaledHeight = pageHeight * scale;
    const xOffset = (docWidth - scaledWidth * 2) / 2;
    const yOffset = (docHeight - scaledHeight) / 2;

    // First sheet (front): Page 4 and Page 1
    await addPagesToSheet(
      doc,
      pdfDoc,
      numPages,
      4,
      1,
      xOffset,
      yOffset,
      scaledWidth,
      scaledHeight
    );

    // Add separator line for the first sheet
    doc.setDrawColor(200, 200, 200); // Light gray color
    doc.setLineWidth(1);
    doc.line(
      docWidth / 2,
      yOffset + 10,
      docWidth / 2,
      yOffset + scaledHeight - 10
    );

    // Add branding to the first sheet
    // addBranding(doc, docWidth, docHeight);

    // First sheet (back): Page 2 and Page 3
    doc.addPage();
    await addPagesToSheet(
      doc,
      pdfDoc,
      numPages,
      2,
      3,
      xOffset,
      yOffset,
      scaledWidth,
      scaledHeight
    );

    // Add separator line for the second sheet
    doc.setDrawColor(200, 200, 200); // Light gray color
    doc.setLineWidth(1);
    doc.line(
      docWidth / 2,
      yOffset + 10,
      docWidth / 2,
      yOffset + scaledHeight - 10
    );

    // Add branding to the second sheet
    addBranding(doc, docWidth, docHeight);

    // Convert to blob
    const pdfBlob = doc.output("blob");
    return pdfBlob;
  } catch (error) {
    console.error(`Error processing file ${file.name}:`, error);
    return null;
  }
}

// Function to add branding to PDF pages
// function addBranding(doc, docWidth, docHeight) {
//   // Set small font size and gray color for the branding
//   doc.setFontSize(8);
//   doc.setTextColor(150, 150, 150);

//   // Add branding text at the bottom of the page
//   const brandingText =
//     "Created with 2Fold by Vaibhav Kumar Singh (linkedin.com/in/vaib215)";
//   const textWidth =
//     (doc.getStringUnitWidth(brandingText) * 8) / doc.internal.scaleFactor;

//   // Center the text
//   doc.text(brandingText, docWidth / 2 - textWidth / 2, docHeight - 10);
// }

async function addPagesToSheet(
  doc,
  pdfDoc,
  totalPages,
  leftPageNum,
  rightPageNum,
  xOffset,
  yOffset,
  width,
  height
) {
  // Add left page if it exists
  if (leftPageNum <= totalPages) {
    const leftPage = await pdfDoc.getPage(leftPageNum);
    const leftViewport = leftPage.getViewport({ scale: 1 });

    // Create a canvas for the left page
    const leftCanvas = document.createElement("canvas");
    const leftContext = leftCanvas.getContext("2d");
    leftCanvas.width = leftViewport.width;
    leftCanvas.height = leftViewport.height;

    // Render the left page to the canvas
    await leftPage.render({
      canvasContext: leftContext,
      viewport: leftViewport,
    }).promise;

    // Add the left page to the PDF
    const leftImgData = leftCanvas.toDataURL("image/jpeg", 0.95);
    doc.addImage(
      leftImgData,
      "JPEG",
      xOffset,
      yOffset,
      width,
      height,
      undefined,
      "FAST"
    );
  }

  // Add right page if it exists
  if (rightPageNum <= totalPages) {
    const rightPage = await pdfDoc.getPage(rightPageNum);
    const rightViewport = rightPage.getViewport({ scale: 1 });

    // Create a canvas for the right page
    const rightCanvas = document.createElement("canvas");
    const rightContext = rightCanvas.getContext("2d");
    rightCanvas.width = rightViewport.width;
    rightCanvas.height = rightViewport.height;

    // Render the right page to the canvas
    await rightPage.render({
      canvasContext: rightContext,
      viewport: rightViewport,
    }).promise;

    // Add the right page to the PDF
    const rightImgData = rightCanvas.toDataURL("image/jpeg", 0.95);
    doc.addImage(
      rightImgData,
      "JPEG",
      xOffset + width,
      yOffset,
      width,
      height,
      undefined,
      "FAST"
    );
  }
}

function updateProcessedFilesList() {
  // Clear the list
  processedFilesList.innerHTML = "";

  // Add each processed file
  processedPdfs.forEach((pdf, index) => {
    const fileItem = document.createElement("div");
    fileItem.className = "processed-file-item";

    const fileName = document.createElement("div");
    fileName.className = "processed-file-item-name";
    fileName.textContent = pdf.bookletName;

    const downloadBtn = document.createElement("button");
    downloadBtn.className = "download-btn";
    downloadBtn.textContent = "Download";
    downloadBtn.onclick = () => downloadSinglePdf(pdf);

    fileItem.appendChild(fileName);
    fileItem.appendChild(downloadBtn);

    processedFilesList.appendChild(fileItem);
  });
}

function downloadSinglePdf(pdf) {
  const url = URL.createObjectURL(pdf.blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = pdf.bookletName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function downloadAllAsZip() {
  if (processedPdfs.length === 0) return;

  // Show loading overlay
  loadingText.textContent = "Creating ZIP file...";
  loadingOverlay.style.display = "flex";

  try {
    // Create a new JSZip instance
    const zip = new JSZip();

    // Add each PDF to the ZIP
    processedPdfs.forEach((pdf) => {
      zip.file(pdf.bookletName, pdf.blob);
    });

    // Generate the ZIP file
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Download the ZIP file
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "booklet-pdfs.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error creating ZIP file:", error);
    alert("Error creating ZIP file. Please try again.");
  } finally {
    // Hide loading overlay
    loadingOverlay.style.display = "none";
  }
}
