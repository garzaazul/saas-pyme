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
 * Formatea montos en pesos chilenos (CLP)
 */
const formatCLP = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Math.round(amount));
};

/**
 * Generates a professional Quote PDF with FLUXU aesthetic.
 */
export const generateQuotePDF = (quote: any) => {
    const doc = new jsPDF();
    const date = new Date(quote.created_at).toLocaleDateString('es-CL');
    const validUntil = quote.valid_until ? new Date(quote.valid_until).toLocaleDateString('es-CL') : 'N/A';
    const org = quote.organization || {};
    const companyName = org.name || 'FLUXU';

    // System Colors
    const primaryColor = [15, 23, 42]; // slate-900 (Main text)
    const accentColor = [37, 99, 235]; // blue-600
    const secondaryColor = [100, 116, 139]; // slate-500 (Etiquetas)
    const mutedColor = [241, 245, 249]; // slate-100 (Borders/Cards)

    // 1. Header: Logo (Top Left) & Folio Block (Top Right)
    let headerY = 15;

    // Logo Identity
    if (org.logo_url) {
        try {
            // Logo larger and with generous margin
            doc.addImage(org.logo_url, 'PNG', 14, 15, 52, 0);
            headerY = 55;
        } catch (e) {
            console.error("Error loading logo in PDF:", e);
            doc.setFontSize(22);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setFont('helvetica', 'bold');
            doc.text(companyName, 14, 25);
            headerY = 35;
        }
    } else {
        doc.setFontSize(22);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(companyName, 14, 25);
        headerY = 35;
    }

    // Folio Block (Top Right) - Highlighted & Centered
    const folioBoxX = 140;
    const folioBoxWidth = 56;
    const folioCenterX = folioBoxX + (folioBoxWidth / 2);

    doc.setFillColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.roundedRect(folioBoxX, 15, folioBoxWidth, 35, 3, 3, 'F');

    doc.setFontSize(10);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('FOLIO PROPUESTA:', folioCenterX, 25, { align: 'center' });

    doc.setFontSize(18);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text(`#${quote.folio}`, folioCenterX, 33, { align: 'center' });

    doc.setFontSize(10); // Aumentado de 8 a 10
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${date}`, folioCenterX, 42, { align: 'center' });

    // 2. Client Information Block (Card style)
    const clientY = Math.max(headerY + 10, 65);

    // Client Card Background
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(14, clientY, 182, 35, 2, 2, 'D');

    doc.setFontSize(9); // Aumentado de 8 a 9
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('PROPUESTA PARA:', 20, clientY + 8);

    doc.setFontSize(14); // Aumentado de 12 a 14
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(quote.client?.business_name || quote.clients?.business_name || 'Cliente', 20, clientY + 16);

    doc.setFontSize(10); // Aumentado de 9 a 10
    doc.setFont('helvetica', 'normal');
    const labelX = 20;
    const valueOffset = 25;

    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('RUT:', labelX, clientY + 23);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(quote.client?.rut || quote.clients?.rut || 'N/A', labelX + 10, clientY + 23);

    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('Email:', labelX + 60, clientY + 23);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(quote.client?.email || quote.clients?.email || 'N/A', labelX + 72, clientY + 23);

    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('Validez:', labelX + 130, clientY + 23);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(validUntil, labelX + 145, clientY + 23);

    // 3. Items Table (Dashboard Style)
    const tableData = quote.items.map((item: any) => [
        item.description,
        item.quantity,
        formatCLP(item.unit_price),
        formatCLP(item.total_line)
    ]);

    autoTable(doc, {
        startY: clientY + 45,
        head: [['DESCRIPCIÓN / SERVICIO', 'CANT.', 'UNITARIO', 'SUBTOTAL']],
        body: tableData,
        theme: 'plain',
        headStyles: {
            fillColor: [248, 250, 252], // slate-50
            textColor: [71, 85, 105], // slate-600
            fontSize: 8,
            fontStyle: 'bold',
            halign: 'left',
            cellPadding: 4
        },
        styles: {
            fontSize: 9,
            cellPadding: 6,
            textColor: [15, 23, 42], // slate-900
            lineColor: [241, 245, 249], // slate-100
            lineWidth: 0.1
        },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { halign: 'center', cellWidth: 20 },
            2: { halign: 'right', cellWidth: 35 },
            3: { halign: 'right', cellWidth: 35, fontStyle: 'bold' }
        },
        // Dibujar solo líneas horizontales sutiles
        didDrawCell: (data) => {
            if (data.section === 'body') {
                doc.setDrawColor(241, 245, 249); // slate-100
                doc.setLineWidth(0.1);
                doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
            }
        },
        margin: { left: 14, right: 14 }
    });

    // 4. Totals Block (Bottom Right)
    // @ts-ignore
    let finalY = doc.lastAutoTable.finalY + 15;
    const totalsX = 130;
    const neto = quote.items.reduce((acc: number, item: any) => acc + (item.total_line || 0), 0);
    const iva = Math.round(neto * 0.19);
    const total = Number(quote.total_amount);

    doc.setFontSize(9);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('NETO:', totalsX, finalY);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(formatCLP(neto), 195, finalY, { align: 'right' });

    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('IVA (19%):', totalsX, finalY + 8);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(formatCLP(iva), 195, finalY + 8, { align: 'right' });

    // Total Highlight with internal padding
    const totalBoxWidth = 76; // Aumentado para dar padding
    doc.setFillColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.roundedRect(196 - totalBoxWidth, finalY + 14, totalBoxWidth, 18, 2, 2, 'F');

    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL FINAL:', 196 - totalBoxWidth + 5, finalY + 26); // +5 padding X, centrado Y

    doc.setFontSize(18);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text(formatCLP(total), 196 - 5, finalY + 26, { align: 'right' }); // -5 padding X

    // 5. Notes & Conditions
    let helpY = finalY + 45;

    if (quote.observations) {
        doc.setFontSize(8);
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.text('NOTAS Y CONDICIONES:', 14, helpY);
        doc.setFontSize(8);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont('helvetica', 'normal');
        const splitObs = doc.splitTextToSize(quote.observations, 120);
        doc.text(splitObs, 14, helpY + 6);
        helpY += (splitObs.length * 4) + 12;
    }

    if (quote.payment_condition) {
        doc.setFontSize(8);
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.text('CONDICIÓN DE PAGO:', 14, helpY);
        doc.setFontSize(9);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(quote.payment_condition, 14, helpY + 6);
        helpY += 15;
    }

    // Transfer Data (Bank Info)
    if (org.transfer_details) {
        doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.setLineWidth(0.5);
        doc.line(14, helpY, 30, helpY);

        doc.setFontSize(8);
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.text('DATOS DE TRANSFERENCIA:', 14, helpY + 8);
        doc.setFontSize(8);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont('helvetica', 'bold');
        const splitDetails = doc.splitTextToSize(org.transfer_details, 120);
        doc.text(splitDetails, 14, helpY + 14);
    }

    // 6. Footer Marca Blanca (Absolute Bottom)
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    doc.setDrawColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.line(14, pageHeight - 20, 196, pageHeight - 20);

    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.setFont('helvetica', 'normal');
    doc.text('Propuesta comercial generada vía FLUXU SaaS', 14, pageHeight - 12);
    doc.text(`Gracias por confiar en ${companyName}`, 196, pageHeight - 12, { align: 'right' });

    doc.save(`Cotizacion_${quote.folio}_${quote.client?.business_name || 'PROPUESTA'}.pdf`);
};
