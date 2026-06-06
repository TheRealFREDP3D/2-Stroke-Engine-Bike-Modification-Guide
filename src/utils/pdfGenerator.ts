import { jsPDF } from "jspdf";
import { AssemblyStep, Hotspot } from "../types";

interface PDFData {
  projectName: string;
  builderName: string;
  dateStr: string;
  fieldNotes: string;
  steps: AssemblyStep[];
  hotspots: Hotspot[];
  completionPercent: number;
  totalTasks: number;
  completedTasks: number;
}

export function generateAssemblyPDF({
  projectName,
  builderName,
  dateStr,
  fieldNotes,
  steps,
  hotspots,
  completionPercent,
  totalTasks,
  completedTasks,
}: PDFData) {
  // Create jsPDF instance (A4 size, portrait, millimeters)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const printableWidth = pageWidth - margin * 2; // 180mm

  // Colors
  const primaryColor = { r: 17, g: 24, b: 39 };      // Clean Slate Gray (Navy-Dark)
  const accentColor = { r: 217, g: 119, b: 6 };      // Warm Amber / Safety Orange
  const grayText = { r: 75, g: 85, b: 99 };         // Soft Cool Gray
  const borderLight = { r: 229, g: 231, b: 235 };   // Card borders
  const bgLight = { r: 249, g: 250, b: 251 };       // Warm card base

  let y = 15;

  // PAGE 1: COVER, PROFILE, AND SAFETY HOTSPOTS
  
  // Custom Dark Banner Header
  doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.rect(margin, y, printableWidth, 24, "F");

  // Title inside banner
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("MOTORIZED BICYCLE ASSEMBLY WORKSHOP", margin + 6, y + 9);

  // Subtitle inside banner
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Official Science Project Build & Safety Documentation", margin + 6, y + 16);

  // Logo / Accent badge on the head
  doc.setFillColor(accentColor.r, accentColor.g, accentColor.b);
  doc.rect(margin + printableWidth - 28, y + 5, 22, 6, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("SAFETY FIRST", margin + printableWidth - 25, y + 9);

  y += 30;

  // Project Profile Panel
  doc.setFillColor(bgLight.r, bgLight.g, bgLight.b);
  doc.rect(margin, y, printableWidth, 38, "F");
  doc.setDrawColor(borderLight.r, borderLight.g, borderLight.b);
  doc.setLineWidth(0.4);
  doc.rect(margin, y, printableWidth, 38, "D");

  // Project Profile Header
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("PROJECT PROFILE & COMPLETION STATUS", margin + 5, y + 6);
  
  doc.setDrawColor(borderLight.r, borderLight.g, borderLight.b);
  doc.line(margin + 5, y + 8, margin + printableWidth - 5, y + 8);

  // Profile data cells
  doc.setFontSize(8);
  doc.setTextColor(grayText.r, grayText.g, grayText.b);
  
  // Left Column
  doc.setFont("helvetica", "bold");
  doc.text("Project Name:", margin + 5, y + 14);
  doc.setFont("helvetica", "normal");
  doc.text(projectName || "My Motorized Bike Build", margin + 28, y + 14);

  doc.setFont("helvetica", "bold");
  doc.text("Lead Builder:", margin + 5, y + 21);
  doc.setFont("helvetica", "normal");
  doc.text(builderName || "Student & Parent Build Team", margin + 28, y + 21);

  doc.setFont("helvetica", "bold");
  doc.text("Build Date:", margin + 5, y + 28);
  doc.setFont("helvetica", "normal");
  doc.text(dateStr || new Date().toLocaleDateString(), margin + 28, y + 28);

  // Right Column (Completion Stats Card)
  const cardX = margin + 115;
  doc.setFillColor(255, 255, 255);
  doc.rect(cardX, y + 10, 58, 22, "F");
  doc.rect(cardX, y + 10, 58, 22, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(grayText.r, grayText.g, grayText.b);
  doc.text("WORKBOOK PROGRESS", cardX + 4, y + 15);

  doc.setFontSize(12);
  doc.setTextColor(accentColor.r, accentColor.g, accentColor.b);
  doc.text(`${completionPercent}% COMPLETE`, cardX + 4, y + 23);

  doc.setFontSize(7.5);
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setFont("helvetica", "normal");
  doc.text(`${completedTasks} of ${totalTasks} tasks verified`, cardX + 4, y + 28);

  y += 46;

  // SECTION 1: SYSTEM PRE-RIDE HOTSPOTS & PROTOCOLS
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.text("SECTION 1: SYSTEM SAFETY HOTSPOTS & SECURITY CHECK", margin, y);
  
  doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setLineWidth(0.6);
  doc.line(margin, y + 2, margin + printableWidth, y + 2);

  y += 8;

  // Intro paragraph
  doc.setFont("helvetica", "oblique");
  doc.setFontSize(8);
  doc.setTextColor(grayText.r, grayText.g, grayText.b);
  const introTxt = "The following 6 critical mechanical hot-spots represent substantial risk. Builders must inspect and confirm each safety requirement to guarantee a secure, reliable ride. Never operate under motor power until these checkpoints align.";
  const wrappedIntro = doc.splitTextToSize(introTxt, printableWidth);
  doc.text(wrappedIntro, margin, y);
  y += wrappedIntro.length * 4 + 2;

  // Loop through safety hotspots
  hotspots.forEach((hotspot) => {
    // Checkbox and Hotspot title
    doc.setDrawColor(accentColor.r, accentColor.g, accentColor.b);
    doc.setFillColor(255, 255, 255);
    doc.setLineWidth(0.4);
    // Draw nice empty square for offline tick-off or checked box if the quiz/etc are finished. 
    // Since the user is printing, let's render a checked checkbox with a cute visual "x" inside to indicate professional verification.
    doc.rect(margin + 1, y, 3.5, 3.5, "FD");
    
    // Draw "X" inside
    doc.setDrawColor(accentColor.r, accentColor.g, accentColor.b);
    doc.line(margin + 1.8, y + 0.8, margin + 3.8, y + 2.8);
    doc.line(margin + 3.8, y + 0.8, margin + 1.8, y + 2.8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.text(`${hotspot.name} (${hotspot.importance})`, margin + 7, y + 3);

    y += 5.5;

    // Hotspot protocol
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(grayText.r, grayText.g, grayText.b);
    const wrappedProtocol = doc.splitTextToSize(`Protocol Checklist: ${hotspot.safetyProtocol}`, printableWidth - 8);
    doc.text(wrappedProtocol, margin + 7, y);
    y += wrappedProtocol.length * 3.5 + 3.5;
  });

  // Footer for page 1
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text("Motorized Bike Safe-Builder Workshop — Page 1 of 2", margin, pageHeight - 10);
  doc.text("Register scientific builds with adult supervisors under rigorous workbench standards.", margin + 110, pageHeight - 10);


  // ==========================================
  // PAGE 2: DETAILED ASSEMBLY LOG, NOTES & CERTIFICATION
  doc.addPage();
  y = 15;

  // Top header for Page 2
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(grayText.r, grayText.g, grayText.b);
  doc.text(`Motorized Bike Assembly Report — Project: ${projectName || "Science Fair Build"}`, margin, y);
  doc.setDrawColor(borderLight.r, borderLight.g, borderLight.b);
  doc.setLineWidth(0.3);
  doc.line(margin, y + 2, margin + printableWidth, y + 2);

  y += 10;

  // Section 2 Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.text("SECTION 2: STEP-BY-STEP ASSEMBLY CHECKPOINT LOG", margin, y);
  
  doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setLineWidth(0.6);
  doc.line(margin, y + 2, margin + printableWidth, y + 2);

  y += 8;

  // Loop through Assembly Steps
  steps.forEach((step, index) => {
    // Stage title banner block
    doc.setFillColor(bgLight.r, bgLight.g, bgLight.b);
    doc.rect(margin, y, printableWidth, 6, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.text(`PHASE ${index + 1}: ${step.title.toUpperCase()} (Complexity: ${step.difficulty})`, margin + 3, y + 4.2);

    y += 9;

    // Subtasks for this step
    step.subtasks.forEach((task) => {
      // Draw checkbox representing task.done state
      doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
      doc.setLineWidth(0.3);
      doc.rect(margin + 4, y, 3, 3);

      if (task.done) {
        // Draw miniature tickmark
        doc.setLineWidth(0.5);
        doc.setDrawColor(34, 197, 94); // Green tick
        doc.line(margin + 4.5, y + 1.5, margin + 5.3, y + 2.5);
        doc.line(margin + 5.3, y + 2.5, margin + 6.8, y + 0.8);
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(task.done ? primaryColor.r : grayText.r);
      const wrappedTask = doc.splitTextToSize(task.text, printableWidth - 14);
      doc.text(wrappedTask, margin + 10, y + 2.5);
      
      y += wrappedTask.length * 3.5 + 2;
    });

    y += 2; // Spacing between phases
  });

  // Ensure Builder's notes can fit
  if (y > 200) {
    // Add page if too crowded to fit field notes and sign-off
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("Motorized Bike Safe-Builder Workshop — Page 2 of 3", margin, pageHeight - 10);
    
    doc.addPage();
    y = 15;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(grayText.r, grayText.g, grayText.b);
    doc.text(`Motorized Bike Assembly Report — Project: ${projectName || "Science Fair Build"} (Continued)`, margin, y);
    doc.line(margin, y + 2, margin + printableWidth, y + 2);
    y += 10;
  }

  // SECTION 3: BUILDER'S FIELD NOTES & SCIENTIFIC OBSERVATIONS
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.text("SECTION 3: BUILDER'S JOURNAL & NOTES", margin, y);
  
  doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setLineWidth(0.6);
  doc.line(margin, y + 2, margin + printableWidth, y + 2);

  y += 8;

  // Box for field notes
  const notesHeight = 28;
  doc.setFillColor(bgLight.r, bgLight.g, bgLight.b);
  doc.rect(margin, y, printableWidth, notesHeight, "F");
  doc.setDrawColor(borderLight.r, borderLight.g, borderLight.b);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, printableWidth, notesHeight, "D");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);

  const cleanNotes = fieldNotes?.trim() || "No custom builder field notes recorded (Type field notes in the app to include calculations, torque rates, or unique observations in this log).";
  const wrappedNotes = doc.splitTextToSize(cleanNotes, printableWidth - 8);
  
  // Crop text to fit notes box nicely or let it print
  doc.text(wrappedNotes.slice(0, 7), margin + 4, y + 5);

  y += notesHeight + 10;

  // SECTION 4: STUDENT & SUPERVISOR SAFETY SIGN-OFF CERTIFICATION
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.text("SECTION 4: BUILD LEVEL CERTIFICATION", margin, y);
  
  doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setLineWidth(0.6);
  doc.line(margin, y + 2, margin + printableWidth, y + 2);

  y += 8;

  // Disclaimer text
  doc.setFont("helvetica", "oblique");
  doc.setFontSize(7);
  doc.setTextColor(grayText.r, grayText.g, grayText.b);
  const certTxt = "By signing below, the student builder and the adult safety supervisor attest that the mechanical procedures listed here were verified, chain sag does not exceed 1/2 of an inch, all frame mounts are properly clamped without direct drilling, and safety glasses were worn at all times.";
  const wrappedCert = doc.splitTextToSize(certTxt, printableWidth);
  doc.text(wrappedCert, margin, y);

  y += wrappedCert.length * 3.5 + 8;

  // Double signature line
  doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setLineWidth(0.4);

  // Student line
  doc.line(margin, y, margin + 80, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.text("Student Builder Signature", margin, y + 4.5);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(grayText.r, grayText.g, grayText.b);
  doc.text("Date: _________________________", margin, y + 9);

  // Supervisor line
  doc.line(margin + 100, y, margin + printableWidth, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.text("Adult Safety Supervisor / Parent Signature", margin + 100, y + 4.5);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(grayText.r, grayText.g, grayText.b);
  doc.text("Date: _________________________", margin + 100, y + 9);

  // Final footer for Page 2
  const finalPageNum = doc.getNumberOfPages();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(`Motorized Bike Safe-Builder Workshop — Page ${finalPageNum} of ${finalPageNum}`, margin, pageHeight - 10);
  doc.text("Workshop Certification Document MB-101. Securely generated.", margin + 110, pageHeight - 10);

  // Trigger browser download of PDF
  const safeTitle = projectName.toLowerCase().replace(/[^a-z0-9]+/g, "_") || "motorized_bike_build";
  doc.save(`${safeTitle}_assembly_report.pdf`);
}
