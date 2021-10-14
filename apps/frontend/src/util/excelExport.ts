import XLSX from 'xlsx'
import { ProcessShortWithEmail } from '../constants'

export const handleExcelExport = (processes: ProcessShortWithEmail[], fileName: string) => {
  const workSheet = XLSX.utils.json_to_sheet(processes)
  const newWorkBook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(newWorkBook, workSheet)
  XLSX.writeFile(newWorkBook, fileName)
}
export default handleExcelExport