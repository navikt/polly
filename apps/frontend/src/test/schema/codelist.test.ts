import { codeListSchema } from '../../components/common/schema'
import { Code, ListName } from '../../service/Codelist'
import '../config/schemaValidator'

const schema = codeListSchema()
const createCodelist: () => Code = () => ({
  list: ListName.PURPOSE,
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
