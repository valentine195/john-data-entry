import Excel from 'exceljs';
import jetpack from 'fs-jetpack';


export default class ExcelHandler {
	constructor(path) {

		this.path = path;

		this.workbook = new Excel.Workbook();

		this.stagedWorkbook = new Excel.Workbook();

		this.init();
	}
	init() {

		this.loadWorkbook();

	}

	//#region getters

	//#endregion getters

	//#region setters

	//#endregion setters

	//#region methods
	async loadWorkbook() {

		if (!jetpack.exists(this.path)) {

			await this.saveWorkbook(this.path);

		}

		await this.workbook.xlsx.readFile(this.path);

		let date = new Date();
		let thisMonthsWorksheet = `${date.toLocaleString('default', { month: 'short' })}${date.toLocaleString('default', { year: 'numeric' })}`

		if (!this.workbook.worksheets.find(w => w.name == thisMonthsWorksheet)) {

			await this.createSheet(thisMonthsWorksheet);

		}

		this.workbook.eachSheet((s, id) => {

			if (/(s|S)heet\s*\d+/.test(s.name) && this.workbook.worksheets.length > 1) this.workbook.removeWorksheet(id);

		})

		await this.saveWorkbook();

		return this.workbook;

	}

	async saveWorkbook() {

		await this.workbook.xlsx.writeFile(this.path);

	}

	async createSheet(name) {

		const sheet = this.workbook.addWorksheet(name)

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
				header: 'Payment Type',
				key: 'paymentType',
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
			}
		];

		sheet.columns = ["Date", "UPS/FEDEX", "Carton Sales", "Labor", "Warehouse", "Shredding", "Printing", "Fax", "Rent", "Notary Fees", "Sales Tax"].map(i => {
			return {
				header: i,
				key: i
			}
		});
		sheet.spliceRows(3, 0, [
			"Total",
			...["B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].map(l => {
				return {
					formula: `SUM(${l}2:${l}2)`,
					value: 0
				}
			})
		])

		return sheet;

	}

	async insertData(data) {
		
		let worksheet, date = data[0];

		let workSheetName = `${date.toLocaleString('default', { month: 'short' })}${date.toLocaleString('default', { year: 'numeric' })}`

		if (!this.workbook.worksheets.find(w => w.name == workSheetName)) {

			worksheet = await this.createSheet(workSheetName);
			let sheets = this.workbook.worksheets; //.map(sheet => [monthIndexes[sheet.name.substring(0, 3)], sheet.name.substring(3)]);
			sheets.sort((sheet1, sheet2) => {
				if (monthIndexes[sheet1.name.substring(0, 3)] + 1 * sheet1.name.substring(3) > monthIndexes[sheet2.name.substring(0, 3)] + 1 * sheet2.name.substring(3)) {
					return 1;
				} else {
					return -1;
				}
			}).forEach((sheet, index) => {

				let w = this.workbook.worksheets.find(w => w.name == sheet.name);
				w.orderNo = index;

			});

		}

		worksheet = this.workbook.worksheets.find(w => w.name == workSheetName);

		worksheet.spliceRows(worksheet.lastRow.number - 1, 0, [
			...data,
			{
				formula: `SUM($B$${worksheet.lastRow.number - 1}:$K$${worksheet.lastRow.number - 1})`
			}
		])

		worksheet.lastRow.values = [
			"Total",
			...["B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"].map(l => {
				return {
					formula: `SUM($${l}$2:$${l}$${worksheet.lastRow.number - 1})`
				}
			})
		];


		await this.saveWorkbook();

	}
	//#endregion methods

}

let monthIndexes = {
	'Jan': 0,
	'Feb': 1,
	'Mar': 2,
	'Apr': 3,
	'May': 4,
	'Jun': 5,
	'Jul': 6,
	'Aug': 7,
	'Sep': 8,
	'Oct': 9,
	'Nov': 10,
	'Dec': 11
}