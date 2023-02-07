import { utils, writeFile } from 'xlsx'
import { intl } from '.'
import { processStatusText } from '../components/Process/Accordion/ProcessData'
import { ProcessShortWithEmail } from '../constants'

export const handleExcelExport = (processes: ProcessShortWithEmail[], fileName: string) => {
  const newWorkBook = utils.book_new()

  const workSheetData: any[] = []

  processes.forEach((p) => {
    const newProcessObject: any = {}

    newProcessObject[`${intl.process}`] = p.purposes[0].shortName + ': ' + p.name
    newProcessObject[`${intl.department}`] = p.affiliation.department?.shortName
    newProcessObject[`${intl.status}`] = processStatusText(p.status)
    newProcessObject[`${intl.commonExternalProcessResponsible}`] = p.commonExternalProcessResponsible?.shortName
    newProcessObject[`${intl.formatString(intl.lastModified, '', '').toString().slice(0, -2)}`] = p.changeStamp.lastModifiedBy
    newProcessObject[`${intl.email}`] = p.lastModifiedEmail

    workSheetData.push(newProcessObject)
  })

  workSheetData.sort((a, b) => (a.name > b.name ? 1 : -1))

  utils.book_append_sheet(newWorkBook, utils.json_to_sheet(workSheetData))
  writeFile(newWorkBook, fileName + '.xlsx')
}
export default handleExcelExport
