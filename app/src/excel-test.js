import { loadWorkbook, insertData, worksheet } from './excel';


(async () => {
    const workbook = await loadWorkbook('../../PackagingPlusInvoices.xlsx');
    console.log(worksheet.name);

    

})()