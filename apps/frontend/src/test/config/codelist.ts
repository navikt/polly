// Mock codelist
import {codelist, ListName} from '../../service/Codelist'

codelist.lists = {
  codelist: {}
}
export const addCode = (list: ListName, code: string) => codelist.lists!.codelist[list] = [...(codelist.lists?.codelist[list] || []), {
  list,
  code,
  shortName: code + ' name',
  description: code + ' desc'
}]
