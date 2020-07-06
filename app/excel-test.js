const Excel = require('exceljs');

const workbook = new Excel.Workbook();
let worksheet;

(async () => {

    await workbook.xlsx.readFile('./PackagingPlusInvoices.xlsx');

    let date = new Date();
    let thisMonthsWorksheet = `${date.toLocaleString('default', { month: 'short' })}${date.toLocaleString('default', { year: 'numeric' })}`

    if (!workbook.worksheets.find(w => w.name == thisMonthsWorksheet)) {
        worksheet = createSheet(thisMonthsWorksheet, workbook);
    } else {
        worksheet = workbook.worksheets.find(w => w.name == thisMonthsWorksheet);
    }

    console.log(worksheet);

    worksheet.insertRows(1, [
        new Date(),
        Math.random()*50,
        Math.random()*50,
        Math.random()*50,
        Math.random()*50,
        Math.random()*50,
        Math.random()*50,
        Math.random()*50,
        Math.random()*50,
        Math.random()*50,
        Math.random()*50,
        Math.random()*50
    ])

    await workbook.xlsx.writeFile('./PackagingPlusInvoices.xlsx');

})()

const createSheet = async (name, workbook) => {

    const sheet = workbook.addWorksheet(name)

    sheet.columns = [{
            header: 'Invoice Date',
            key: 'date',
            width: 22,
            style: {
                font: {
                    bold: true
                }
            }
        },
        {
            header: "UPS/FEDEX",
            key: 'upsFedex',
            width: 11,
            style: {
                font: {
                    bold: true
                }
            }
        },
        {
            header: 'Carton Sales',
            key: 'cartonSales',
            width: 11,
            style: {
                font: {
                    bold: true
                }
            }
        },
        {
            header: 'Labor',
            key: 'labor',
            width: 11,
            style: {
                font: {
                    bold: true
                }
            }
        },
        {
            header: 'Warehouse',
            key: 'warehouse',
            width: 11,
            style: {
                font: {
                    bold: true
                }
            }
        },
        {
            header: 'Shredding',
            key: 'shredding',
            width: 11,
            style: {
                font: {
                    bold: true
                }
            }
        },
        {
            header: 'Printing',
            key: 'printing',
            width: 11,
            style: {
                font: {
                    bold: true
                }
            }
        },
        {
            header: 'Fax',
            key: 'fax',
            width: 11,
            style: {
                font: {
                    bold: true
                }
            }
        },
        {
            header: 'Rent',
            key: 'rent',
            width: 11,
            style: {
                font: {
                    bold: true
                }
            }
        },
        {
            header: 'Notary Fees',
            key: 'notaryFees',
            width: 11,
            style: {
                font: {
                    bold: true
                }
            }
        },
        {
            header: 'Sales Tax',
            key: 'salesTax',
            width: 11,
            style: {
                font: {
                    bold: true
                }
            }
        },
        {
            header: 'Total',
            key: 'total',
            width: 11,
            style: {
                font: {
                    bold: true
                }
            }
        },
        {
            header: 'Payment Type',
            key: 'paymentType',
            width: 11,
            style: {
                font: {
                    bold: true
                }
            }
        }
    ];

/*     sheet.addRow([
        undefined,
        { formula: 'B:B', result: 0 },
        { formula: 'C:C', result: 0 },
        { formula: 'D:D', result: 0 },
        { formula: 'E:E', result: 0 },
        { formula: 'F:F', result: 0 },
        { formula: 'G:G', result: 0 },
        { formula: 'H:H', result: 0 },
        { formula: 'I:I', result: 0 },
        { formula: 'J:J', result: 0 },
        { formula: 'K:K', result: 0 },
        { formula: 'L:L', result: 0 },
    ]) */

    return sheet;

}