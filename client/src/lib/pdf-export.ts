import jsPDF from 'jspdf';
import type { UserStory, Epic } from '@shared/schema';

interface PDFExportOptions {
  story: UserStory;
  epic?: Epic | null;
}

export function exportStoryToPDF({ story, epic }: PDFExportOptions) {
  // Create new PDF document (A4 size)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Page dimensions
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);
  
  // Colors
  const primaryColor = '#ea580c'; // Orange
  const textColor = '#1f2937'; // Dark gray
  const lightGray = '#6b7280';
  const borderColor = '#e5e7eb';

  let yPos = margin;

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10, color: string = textColor, fontStyle: 'normal' | 'bold' | 'italic' = 'normal') => {
    pdf.setFontSize(fontSize);
    pdf.setTextColor(color);
    pdf.setFont('helvetica', fontStyle);
    
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    
    return y + (lines.length * (fontSize * 0.4)); // Return new Y position
  };

  // Header: Story Name | Story ID | Feature
  pdf.setFillColor(primaryColor);
  pdf.rect(0, 0, pageWidth, 15, 'F');
  
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  
  const headerText = `${story.title.substring(0, 60)}${story.title.length > 60 ? '...' : ''} | ${story.id} | ${story.feature || 'General'}`;
  pdf.text(headerText, margin, 10);
  
  yPos = 25;

  // Story ID and Epic Info
  pdf.setFontSize(10);
  pdf.setTextColor(lightGray);
  pdf.setFont('helvetica', 'normal');
  const epicText = epic ? ` • Epic: ${epic.name}` : '';
  pdf.text(`ID: ${story.id}${epicText}`, margin, yPos);
  yPos += 8;

  // Draw separator line
  pdf.setDrawColor(borderColor);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  // Title Section
  pdf.setFontSize(14);
  pdf.setTextColor(primaryColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text('User Story', margin, yPos);
  yPos += 7;
  
  pdf.setFontSize(11);
  pdf.setTextColor(textColor);
  pdf.setFont('helvetica', 'normal');
  yPos = addText(story.title, margin, yPos, contentWidth, 11);
  yPos += 8;

  // Metadata Grid
  const metadataY = yPos;
  pdf.setFillColor(249, 250, 251); // Light background
  pdf.rect(margin, yPos - 3, contentWidth, 28, 'F');
  
  pdf.setFontSize(9);
  const colWidth = contentWidth / 3;
  
  // Column 1: Status, Priority
  pdf.setTextColor(lightGray);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Status:', margin + 3, yPos + 3);
  pdf.setTextColor(textColor);
  pdf.setFont('helvetica', 'normal');
  pdf.text(story.status.toUpperCase(), margin + 3, yPos + 8);
  
  pdf.setTextColor(lightGray);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Priority:', margin + 3, yPos + 15);
  pdf.setTextColor(textColor);
  pdf.setFont('helvetica', 'normal');
  pdf.text(story.priority.toUpperCase(), margin + 3, yPos + 20);
  
  // Column 2: Story Points, Assignee
  pdf.setTextColor(lightGray);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Story Points:', margin + colWidth + 3, yPos + 3);
  pdf.setTextColor(textColor);
  pdf.setFont('helvetica', 'normal');
  pdf.text(String(story.storyPoints), margin + colWidth + 3, yPos + 8);
  
  pdf.setTextColor(lightGray);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Assignee:', margin + colWidth + 3, yPos + 15);
  pdf.setTextColor(textColor);
  pdf.setFont('helvetica', 'normal');
  pdf.text(story.assignee || 'Unassigned', margin + colWidth + 3, yPos + 20);
  
  // Column 3: Product Manager, Tech Lead
  pdf.setTextColor(lightGray);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Product Manager:', margin + (colWidth * 2) + 3, yPos + 3);
  pdf.setTextColor(textColor);
  pdf.setFont('helvetica', 'normal');
  pdf.text(story.productManager || 'Unassigned', margin + (colWidth * 2) + 3, yPos + 8);
  
  pdf.setTextColor(lightGray);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Tech Lead:', margin + (colWidth * 2) + 3, yPos + 15);
  pdf.setTextColor(textColor);
  pdf.setFont('helvetica', 'normal');
  pdf.text(story.techLead || 'Unassigned', margin + (colWidth * 2) + 3, yPos + 20);
  
  yPos += 33;

  // Story Composition Guidance
  if (story.feature || story.value || story.requirement) {
    pdf.setFontSize(12);
    pdf.setTextColor(primaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Story Composition', margin, yPos);
    yPos += 7;

    if (story.feature) {
      pdf.setFontSize(9);
      pdf.setTextColor(lightGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Feature:', margin + 3, yPos);
      pdf.setTextColor(textColor);
      pdf.setFont('helvetica', 'normal');
      yPos = addText(story.feature, margin + 20, yPos, contentWidth - 20, 9);
      yPos += 2;
    }

    if (story.value) {
      pdf.setFontSize(9);
      pdf.setTextColor(lightGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Value:', margin + 3, yPos);
      pdf.setTextColor(textColor);
      pdf.setFont('helvetica', 'normal');
      yPos = addText(story.value, margin + 20, yPos, contentWidth - 20, 9);
      yPos += 2;
    }

    if (story.requirement) {
      pdf.setFontSize(9);
      pdf.setTextColor(lightGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Requirement:', margin + 3, yPos);
      pdf.setTextColor(textColor);
      pdf.setFont('helvetica', 'normal');
      yPos = addText(story.requirement, margin + 20, yPos, contentWidth - 20, 9);
      yPos += 2;
    }

    yPos += 6;
  }

  // Description
  if (story.description) {
    pdf.setFontSize(12);
    pdf.setTextColor(primaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Description', margin, yPos);
    yPos += 7;
    
    pdf.setFontSize(10);
    pdf.setTextColor(textColor);
    pdf.setFont('helvetica', 'normal');
    yPos = addText(story.description, margin, yPos, contentWidth, 10);
    yPos += 8;
  }

  // Check if we need a new page
  if (yPos > pageHeight - 60) {
    pdf.addPage();
    yPos = margin;
  }

  // Acceptance Criteria (Gherkin)
  pdf.setFontSize(12);
  pdf.setTextColor(primaryColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Acceptance Criteria (Gherkin)', margin, yPos);
  yPos += 7;
  
  // Background for code block
  const acLines = pdf.splitTextToSize(story.acceptanceCriteria, contentWidth - 6);
  const codeBlockHeight = acLines.length * 4.5 + 6;
  
  pdf.setFillColor(245, 247, 250); // Light code background
  pdf.rect(margin, yPos - 3, contentWidth, codeBlockHeight, 'F');
  
  pdf.setFontSize(9);
  pdf.setTextColor('#374151');
  pdf.setFont('courier', 'normal');
  pdf.text(acLines, margin + 3, yPos + 2);
  yPos += codeBlockHeight + 5;

  // Labels
  if (story.labels && story.labels.length > 0) {
    if (yPos > pageHeight - 30) {
      pdf.addPage();
      yPos = margin;
    }

    pdf.setFontSize(12);
    pdf.setTextColor(primaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Labels', margin, yPos);
    yPos += 7;
    
    pdf.setFontSize(9);
    pdf.setTextColor(textColor);
    pdf.setFont('helvetica', 'normal');
    pdf.text(story.labels.map(l => `#${l}`).join('  '), margin, yPos);
    yPos += 8;
  }

  // Footer
  const footerY = pageHeight - 10;
  pdf.setFontSize(8);
  pdf.setTextColor(lightGray);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, footerY);
  pdf.text(`Page 1 of ${pdf.getNumberOfPages()}`, pageWidth - margin - 20, footerY);

  // Generate filename
  const sanitizedTitle = story.title
    .substring(0, 50)
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase();
  const filename = `${story.id}_${sanitizedTitle}.pdf`;

  // Download PDF
  pdf.save(filename);
}

export function exportMultipleStoriesToPDF(stories: UserStory[], epics: Epic[]) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const primaryColor = '#ea580c';

  // Cover Page
  pdf.setFillColor(primaryColor);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('User Stories Export', pageWidth / 2, 80, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Total Stories: ${stories.length}`, pageWidth / 2, 100, { align: 'center' });
  pdf.text(`Export Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 110, { align: 'center' });

  // Table of Contents
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.setTextColor(primaryColor);
  pdf.setFont('helvetica', 'bold');
  let yPos = margin;
  pdf.text('Table of Contents', margin, yPos);
  yPos += 15;

  pdf.setFontSize(10);
  pdf.setTextColor('#1f2937');
  pdf.setFont('helvetica', 'normal');
  
  stories.forEach((story, index) => {
    if (yPos > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
    }
    
    pdf.text(`${index + 1}. ${story.id}: ${story.title.substring(0, 60)}...`, margin + 5, yPos);
    yPos += 7;
  });

  // Individual Stories
  stories.forEach((story, index) => {
    const epic = epics.find(e => e.id === story.epicId);
    
    // Each story on a new page
    pdf.addPage();
    
    // Use the same export logic as single story
    // (For brevity, we'll just add basic info here. In production, replicate the full story detail)
    yPos = margin;
    
    // Header
    pdf.setFillColor(primaryColor);
    pdf.rect(0, 0, pageWidth, 15, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${story.title.substring(0, 60)} | ${story.id} | ${story.feature || 'General'}`, margin, 10);
    
    yPos = 25;
    pdf.setFontSize(11);
    pdf.setTextColor('#1f2937');
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(story.title, pageWidth - (2 * margin));
    pdf.text(lines, margin, yPos);
    yPos += lines.length * 5 + 10;
    
    // Acceptance Criteria
    pdf.setFontSize(10);
    pdf.setFont('courier', 'normal');
    const acLines = pdf.splitTextToSize(story.acceptanceCriteria, pageWidth - (2 * margin) - 6);
    pdf.setFillColor(245, 247, 250);
    pdf.rect(margin, yPos - 3, pageWidth - (2 * margin), acLines.length * 4.5 + 6, 'F');
    pdf.text(acLines, margin + 3, yPos + 2);
    
    // Page number
    const footerY = pageHeight - 10;
    pdf.setFontSize(8);
    pdf.setTextColor('#6b7280');
    pdf.text(`Page ${index + 2} of ${stories.length + 2}`, pageWidth - margin - 20, footerY);
  });

  const filename = `user-stories-export_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
}

