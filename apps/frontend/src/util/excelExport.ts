import { utils, writeFile } from 'xlsx'
import { processStatusText } from '../components/Process/Accordion/ProcessData'
import { IProcessShortWithEmail } from '../constants'

export const handleExcelExport = (processes: IProcessShortWithEmail[], fileName: string) => {
  const newWorkBook = utils.book_new()

  const workSheetData: any[] = []

  processes.forEach((p) => {
    const newProcessObject: any = {}

    newProcessObject['Behandling'] = p.purposes[0].shortName + ': ' + p.name
    newProcessObject['Avdeling'] = p.affiliation.department?.shortName
    newProcessObject['Status'] = processStatusText(p.status)
    newProcessObject['Felles behandlingsansvarlig'] = p.commonExternalProcessResponsible?.shortName
    newProcessObject['Sist endret av'] = p.changeStamp.lastModifiedBy
    newProcessObject['Email'] = p.lastModifiedEmail

    workSheetData.push(newProcessObject)
  })

  workSheetData.sort((a, b) => (a.name > b.name ? 1 : -1))

  utils.book_append_sheet(newWorkBook, utils.json_to_sheet(workSheetData))
  writeFile(newWorkBook, fileName + '.xlsx')
}
export default handleExcelExport
