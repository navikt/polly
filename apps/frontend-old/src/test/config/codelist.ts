// Mock codelist
import { EListName } from '../../service/Codelist'

export const addCode = (list: EListName, code: string) => {
  const newCode = {
    list,
    code,
    shortName: code + ' name',
    description: code + ' desc',
  }
  return newCode
}
