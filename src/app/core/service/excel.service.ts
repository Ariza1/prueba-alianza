import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }


  /**
   * Exporta un archivo en formato Excel con encabezados específicos.
   * @param  {any[]} json
   * @param  {string} excelFileName
   * @param  {any[]} headers
   * @returns void
   */
  public exportExcelWhitHeaders(json: any[],
    excelFileName: string,
    headers: any[]): void {
    const encabezados = [headers];
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(encabezados);
    XLSX.utils.sheet_add_json(worksheet, json, {
      skipHeader: true,
      origin: 'A2',
    });

    const workbook: XLSX.WorkBook = {
      Sheets: { Usuario: worksheet },
      SheetNames: ['Usuario'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }


  /**
     * Méthod que genera el archivo en formato excel para su descarga.
     * @param  {any} buffer
     * @param  {string} fileName
     * @returns void
     */
  public saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + EXCEL_EXTENSION
    );
  }

  /**
  * Valida un archivo en formato Excel.
  * @param  {any} evt
  * @returns any
  */
  public validarExcel(evt: any): any {

    const validFormats = ['xlsx', 'xls'];
    const target: DataTransfer = evt.target as DataTransfer;

    if (target.files.length !== 1) {
      throw new Error('No se puede cargar multiples archivos.');
    } else if (!validFormats.includes(target.files[0].name.split('.')[1])) {
      throw new Error('formato de archivo invalido.');
    }
  }

  /**
  * Conviente la información de un archivo de excel y la transforma en un objeto
  * Json.
  * @param  {} file
  */
  public convertExcelToJson(file: any) {
    const reader = new FileReader();
    let workbookkk: any;
    let XL_row_object;
    reader.readAsBinaryString(file);
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const data = reader.result;
        workbookkk = XLSX.read(data, { type: 'binary' });

        workbookkk.SheetNames.forEach((sheetName: any) => {
          // Here is your object
          XL_row_object = XLSX.utils.sheet_to_json(workbookkk.Sheets[sheetName], { defval: '' });
          resolve(XL_row_object);
        });
      };
    });
  }

}
