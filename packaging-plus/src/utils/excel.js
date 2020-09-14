import Excel from 'exceljs';
import jetpack from 'fs-jetpack';
import fs from 'fs';


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

			this.worksheet = await this.createSheet(thisMonthsWorksheet);

		} else {

			this.worksheet = this.workbook.worksheets.find(w => w.name == thisMonthsWorksheet);

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


		this.worksheet.spliceRows(this.worksheet.lastRow.number - 1, 0, [
			...data,
			{
				formula: `SUM($B$${this.worksheet.lastRow.number - 1}:$K$${this.worksheet.lastRow.number - 1})`
			}
		])

		this.worksheet.lastRow.values = [
			"Total",
			...["B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"].map(l => {
				return {
					formula: `SUM($${l}$2:$${l}$${this.worksheet.lastRow.number - 1})`
				}
			})
		];


		await this.saveWorkbook();

	}
	//#endregion methods

}

/* const workbook = new Excel.Workbook();
let path;
export var worksheet;

export const loadWorkbook = async (p) => {

	console.log('path', p);
	path = p;

	return new Promise(async (resolve, reject) => {

		if (!jetpack.exists(path)) {

			await saveWorkbook(path);

		}

		await workbook.xlsx.readFile(path);

		let date = new Date();
		let thisMonthsWorksheet = `${date.toLocaleString('default', { month: 'short' })}${date.toLocaleString('default', { year: 'numeric' })}`

		if (!workbook.worksheets.find(w => w.name == thisMonthsWorksheet)) {

			worksheet = await createSheet(thisMonthsWorksheet, workbook);

		} else {

			worksheet = workbook.worksheets.find(w => w.name == thisMonthsWorksheet);

		}

		workbook.eachSheet((s, id) => {

			if (/(s|S)heet\s*\d+/.test(s.name) && workbook.worksheets.length > 1) workbook.removeWorksheet(id);

		})

		await saveWorkbook(path);

		resolve(workbook);

	});

}

export const createSheet = async (name, workbook) => {

	return new Promise(async (resolve, reject) => {

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

		resolve(sheet);
	})

}

export const insertData = async (data, worksheet) => {

	return new Promise(async (resolve, reject) => {

		try {
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

		} catch (e) {

			reject(e);

		}

		await saveWorkbook(path);

		resolve(worksheet);

	});

}

export const saveWorkbook = async (path) => {

	return new Promise(async (resolve, reject) => {

		try {

			await workbook.xlsx.writeFile(path);

		} catch (e) {
			reject(e)
		}

		resolve(workbook);

	})

} */