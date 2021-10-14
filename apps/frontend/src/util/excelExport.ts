import XLSX from 'xlsx'
import { processStatusText } from '../components/Process/Accordion/ProcessData'
import { ProcessShortWithEmail } from '../constants'

export const handleExcelExport = (processes: ProcessShortWithEmail[], fileName: string) => {
  const newWorkBook = XLSX.utils.book_new()

  const workSheetData: any[] = []

  processes.forEach((p) => {
    workSheetData.push({
      name: p.purposes[0].shortName + ': ' + p.name,
      affiliation: p.affiliation.department?.shortName,
      status: processStatusText(p.status),
      department: p.commonExternalProcessResponsible?.shortName,
      lastModifieBy: p.changeStamp.lastModifiedBy,
      email: p.lastModifiedEmail
    })
  })

  workSheetData.sort((a, b) => a.name > b.name ? 1 : -1)

  XLSX.utils.book_append_sheet(newWorkBook, XLSX.utils.json_to_sheet(workSheetData))
  XLSX.writeFile(newWorkBook, fileName + '.xlsx')
}
export default handleExcelExport