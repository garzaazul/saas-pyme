import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Exports data to Excel format.
 * @param data Array of objects to export.
 * @param fileName Name of the file (without extension).
 * @param columnMapping Object mapping original keys to display names.
 */
export const exportToExcel = (data: any[], fileName: string, columnMapping: Record<string, string>) => {
    // Transform data using mapping
    const transformedData = data.map(item => {
        const newItem: any = {};
        Object.keys(columnMapping).forEach(key => {
            newItem[columnMapping[key]] = item[key] || '';
        });
        return newItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Exports data to PDF format.
 * @param reportTitle Title to show in the header.
 * @param data Array of objects to export.
 * @param columns Array of objects with header and dataKey for the table.
 * @param companyName Name of the company for the header.
 */
export const exportToPDF = (
    reportTitle: string,
    data: any[],
    columns: { header: string; dataKey: string }[],
    companyName: string = 'Mi Empresa SpA'
) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('es-CL');

    // Header logic
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(companyName, 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(reportTitle, 14, 30);

    doc.setFontSize(10);
    doc.text(`Fecha: ${date}`, 196, 22, { align: 'right' });

    // Elegant line
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 35, 196, 35);

    // Table
    autoTable(doc, {
        startY: 40,
        head: [columns.map(col => col.header)],
        body: data.map(item => columns.map(col => item[col.dataKey] || '')),
        theme: 'striped',
        headStyles: {
            fillColor: [79, 70, 229], // indigo-600
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 9,
            cellPadding: 3
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251]
        },
        margin: { top: 40 },
        didDrawPage: (data) => {
            // Footer with pagination
            const str = `Página ${data.pageNumber}`;
            doc.setFontSize(8);
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            doc.text(str, 196, pageHeight - 10, { align: 'right' });
        }
    });

    doc.save(`${reportTitle.toLowerCase().replace(/\s+/g, '_')}_${date.replace(/\//g, '-')}.pdf`);
};
