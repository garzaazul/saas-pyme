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

/**
 * Generates a professional Quote PDF.
 */
export const generateQuotePDF = (quote: any) => {
    const doc = new jsPDF();
    const date = new Date(quote.created_at).toLocaleDateString('es-CL');
    const validUntil = quote.valid_until ? new Date(quote.valid_until).toLocaleDateString('es-CL') : 'N/A';
    const org = quote.organization || {};
    const companyName = org.name || 'FLUXU';
    const whatsapp = org.whatsapp || '';

    // 1. Header with branding
    let headerY = 25;
    if (org.logo_url) {
        try {
            // Logo scaling: 40mm width, proportional height (0)
            doc.addImage(org.logo_url, 'PNG', 20, 15, 40, 0);
            headerY = Math.max(50, 15 + 15); // Adjust based on expected height or fixed offset
            // User requested: If logo exists, DON'T show company name text.
            headerY = 55;
        } catch (e) {
            console.error("Error loading logo in PDF:", e);
            // Fallback to text name if logo fails
            doc.setFontSize(24);
            doc.setTextColor(30, 41, 59);
            doc.setFont('helvetica', 'bold');
            doc.text(companyName, 20, 30);
            headerY = 40;
        }
    } else {
        // No logo: Show company name as text
        doc.setFontSize(24);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text(companyName, 20, 30);
        headerY = 40;
    }

    // Document Type Label
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('helvetica', 'bold');
    doc.text('COTIZACIÓN', 20, headerY);

    // Folio & Dates on the right
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(140, 15, 50, 40, 'F');
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.rect(140, 15, 50, 40, 'D');

    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text(`FOLIO: #${quote.folio}`, 145, 25);

    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('FECHA EMISIÓN:', 145, 35);
    doc.text(date, 145, 39);
    doc.text('VÁLIDO HASTA:', 145, 47);
    doc.text(validUntil, 145, 51);

    // 2. Client Section
    const clientY = Math.max(80, headerY + 25);
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text('DATOS DEL CLIENTE:', 20, clientY);

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('helvetica', 'bold');
    doc.text(quote.client?.business_name || quote.clients?.business_name || 'Cliente Genérico', 20, clientY + 7);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`RUT: ${quote.client?.rut || quote.clients?.rut || 'N/A'}`, 20, clientY + 13);
    doc.text(`Dirección: ${quote.client?.address || quote.clients?.address || quote.client?.direccion || 'N/A'}`, 20, clientY + 19);
    doc.text(`Email: ${quote.client?.email || quote.clients?.email || 'N/A'}`, 20, clientY + 25);

    // 3. Items Table
    const tableData = quote.items.map((item: any) => [
        item.description,
        item.quantity,
        new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(item.unit_price),
        new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(item.total_line)
    ]);

    autoTable(doc, {
        startY: clientY + 35,
        head: [['DESCRIPCIÓN / PRODUCTO', 'CANT.', 'P. UNITARIO', 'TOTAL']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [15, 23, 42], // slate-900
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'left'
        },
        styles: {
            fontSize: 9,
            cellPadding: 5
        },
        columnStyles: {
            1: { halign: 'center' },
            2: { halign: 'right' },
            3: { halign: 'right' }
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250]
        }
    });

    // 4. Totals & Observations
    // @ts-ignore
    let finalY = doc.lastAutoTable.finalY + 10;

    // Totals Grid on the right
    const totalX = 140;
    const neto = quote.items.reduce((acc: number, item: any) => acc + (item.total_line || 0), 0);
    const iva = Math.round(neto * 0.19);
    const total = Number(quote.total_amount);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('TOTAL NETO:', totalX, finalY + 5);
    doc.text('IVA (19%):', totalX, finalY + 13);

    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL FINAL:', totalX, finalY + 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(neto), 195, finalY + 5, { align: 'right' });
    doc.text(new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(iva), 195, finalY + 13, { align: 'right' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(total), 195, finalY + 25, { align: 'right' });

    // 5. Observations & Transfer Details
    finalY += 35;

    // Observations
    if (quote.observations) {
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text('NOTAS / CONDICIONES:', 20, finalY);
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'normal');
        const splitObs = doc.splitTextToSize(quote.observations, 100);
        doc.text(splitObs, 20, finalY + 7);
        finalY += (splitObs.length * 5) + 10;
    }

    // Payment Condition
    if (quote.payment_condition) {
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text('CONDICIÓN DE PAGO:', 20, finalY);
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(quote.payment_condition, 20, finalY + 7);
        finalY += 15;
    }

    // Transfer Details
    if (org.transfer_details) {
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text('DATOS PARA TRANSFERENCIA:', 20, finalY);
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        const splitDetails = doc.splitTextToSize(org.transfer_details, 100);
        doc.text(splitDetails, 20, finalY + 7);
    }

    // Footer
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.setFont('helvetica', 'italic');

    const footerText = `Gracias por su preferencia. Propuesta generada automáticamente por ${companyName}${whatsapp ? ` • WhatsApp: ${whatsapp}` : ''} via FLUXU SaaS.`;
    doc.text(footerText, pageSize.width / 2, pageHeight - 15, { align: 'center' });

    doc.save(`Cotizacion_Ref_${quote.folio}_${quote.client?.business_name || 'CLIENTE'}.pdf`);
};
