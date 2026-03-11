import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportPdfOptions {
    title: string;
    headers: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[][];
    filename: string;
}

export const exportToPdf = ({ title, headers, data, filename }: ExportPdfOptions) => {
    const doc = new jsPDF('landscape');

    // Add Title
    doc.setFontSize(18);
    doc.text(title, 14, 22);

    // Add Date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // Add Table
    autoTable(doc, {
        startY: 36,
        head: [headers],
        body: data,
        theme: 'grid',
        headStyles: { fillColor: [14, 116, 144] },
        styles: { fontSize: 10, cellPadding: 3 },
    });

    // Save
    doc.save(`${filename}.pdf`);
};

