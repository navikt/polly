import {infoTypeSchema} from '../components/common/schema'
import {InformationtypeFormValues} from '../constants'
import './config/schemaValidator'

const schema = infoTypeSchema()
const data: InformationtypeFormValues = {
  name: 'name',
  description: '',
  sensitivity: 'SEN',
  categories: ['CAT'],
  keywords: [],
  productTeams: [],
  sources: []
}

test('infoTypeSchema ok', () => {
  expect(data).toBeSchema(schema)
});

test('infoTypeSchema req sensitivty', () => {
  data.sensitivity = ''
  expect(data).toBeSchemaErrorAt(schema, 'sensitivity')
});

test('infoTypeSchema req category', () => {
  data.categories = []
  expect(data).toBeSchemaErrorAt(schema, 'categories', 'påkrevd')
});
