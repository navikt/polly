import { EListName, ICode } from '@/constants/codelistConstant'
import { codeListSchema } from '../../components/common/schemaValidation'
import '../config/schemaValidator'

const schema = codeListSchema()
const createCodelist: () => ICode = () => ({
  list: EListName.PURPOSE,
  code: 'CODE',
  description: 'desc',
  shortName: 'name',
})

test('Codelist ok', () => {
  expect(createCodelist()).toBeSchema(schema)
})

test('Codelist errors', () => {
  expect({ ...createCodelist(), list: undefined }).toBeSchemaErrorAt(schema, 'list')
  expect({ ...createCodelist(), code: '' }).toBeSchemaErrorAt(schema, 'code')
  expect({ ...createCodelist(), description: '' }).toBeSchemaErrorAt(schema, 'description')
  expect({ ...createCodelist(), shortName: '' }).toBeSchemaErrorAt(schema, 'shortName')
})
