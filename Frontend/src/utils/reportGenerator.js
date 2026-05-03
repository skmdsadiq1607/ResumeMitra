/**
 * PDF Report Generator using jsPDF
 */
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generateATSReport(result, fileName = 'ATS_Analysis_Report.pdf') {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // ── Header ──
  doc.setFillColor(8, 8, 26);
  doc.rect(0, 0, pageWidth, 45, 'F');
  doc.setTextColor(99, 102, 241);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Resume Mitra — ATS Analysis Report', 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 32);
  doc.text(`Score: ${result.totalScore}/100 — ${result.gradeLabel}`, 14, 40);
  y = 55;

  // ── Score Breakdown ──
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Score Breakdown', 14, y);
  y += 8;

  const breakdownData = [
    ['Keyword Match', `${result.breakdown.keyword.score}/${result.breakdown.keyword.maxScore}`],
    ['Skills Match', `${result.breakdown.skill.score}/${result.breakdown.skill.maxScore}`],
    ['Experience Relevance', `${result.breakdown.experience.score}/${result.breakdown.experience.maxScore}`],
    ['Structure & Sections', `${result.breakdown.structure.score}/${result.breakdown.structure.maxScore}`],
    ['ATS Formatting', `${result.breakdown.formatting.score}/${result.breakdown.formatting.maxScore}`],
    ['Impact & Achievements', `${result.breakdown.impact.score}/${result.breakdown.impact.maxScore}`],
    ['Grammar & Tone', `${result.breakdown.grammar.score}/${result.breakdown.grammar.maxScore}`],
    ['TOTAL', `${result.totalScore}/100`],
  ];

  doc.autoTable({
    startY: y,
    head: [['Dimension', 'Score']],
    body: breakdownData,
    theme: 'striped',
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 10 },
    margin: { left: 14 },
  });
  y = doc.lastAutoTable.finalY + 15;

  // ── Matched Keywords ──
  if (result.matchedKeywords.length > 0) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Matched Keywords (${result.matchedKeywords.length})`, 14, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129);
    const matchedText = result.matchedKeywords.join(', ');
    const matchedLines = doc.splitTextToSize(matchedText, pageWidth - 28);
    doc.text(matchedLines, 14, y);
    y += matchedLines.length * 5 + 8;
  }

  // ── Missing Keywords ──
  if (result.missingKeywords.length > 0) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Missing Keywords (${result.missingKeywords.length})`, 14, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(244, 63, 94);
    const missingText = result.missingKeywords.join(', ');
    const missingLines = doc.splitTextToSize(missingText, pageWidth - 28);
    doc.text(missingLines, 14, y);
    y += missingLines.length * 5 + 8;
  }

  // ── Skill Gap ──
  if (result.skillGap.length > 0) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Skill Gap', 14, y);
    y += 8;
    doc.autoTable({
      startY: y,
      head: [['Missing Skill', 'Status']],
      body: result.skillGap.map(s => [s, 'Not found in resume']),
      theme: 'striped',
      headStyles: { fillColor: [244, 63, 94] },
      styles: { fontSize: 9 },
      margin: { left: 14 },
    });
    y = doc.lastAutoTable.finalY + 15;
  }

  // ── Formatting Issues ──
  if (result.formattingIssues.length > 0) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Formatting Issues', 14, y);
    y += 8;
    doc.autoTable({
      startY: y,
      head: [['Problem', 'Fix']],
      body: result.formattingIssues.map(i => [i.problem, i.fix]),
      theme: 'striped',
      headStyles: { fillColor: [245, 158, 11] },
      styles: { fontSize: 9 },
      margin: { left: 14 },
    });
    y = doc.lastAutoTable.finalY + 15;
  }

  // ── Recruiter Verdict ──
  if (result.recruiterVerdict) {
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Recruiter Verdict', 14, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(75, 85, 99);
    const verdictLines = doc.splitTextToSize(result.recruiterVerdict, pageWidth - 28);
    doc.text(verdictLines, 14, y);
    y += verdictLines.length * 5 + 10;
  }

  // ── Footer ──
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Generated by Resume Mitra — AI-Powered ATS Resume Analyzer', 14, doc.internal.pageSize.getHeight() - 10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.getHeight() - 10);
  }

  doc.save(fileName);
}
