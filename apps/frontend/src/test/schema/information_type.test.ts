import { infoTypeSchema } from '../../components/common/schema'
import { InformationtypeFormValues } from '../../constants'
import '../config/schemaValidator'

const schema = infoTypeSchema()
const createInfoType: () => InformationtypeFormValues = () => ({
  name: 'name',
  description: '',
  sensitivity: 'SEN',
  categories: ['CAT'],
  keywords: [],
  productTeams: [],
  sources: [],
})

test('informationType ok', () => {
  expect(createInfoType()).toBeSchema(schema)
})

test('informationType req sensitivty', () => {
  const it = createInfoType()
  it.sensitivity = ''
  expect(it).toBeSchemaErrorAt(schema, 'sensitivity')
})

test('informationType req category', () => {
  const it = { ...createInfoType(), categories: [] }
  expect(it).toBeSchemaErrorAt(schema, 'categories', 'påkrevd')
})
