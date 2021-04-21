import {createDocumentSchema} from '../../components/common/schema'
import {CreateDocumentFormValues} from '../../constants'
import '../config/schemaValidator'


const schema = createDocumentSchema()
const createDocument: () => CreateDocumentFormValues = () => ({
  name: 'name',
  description: 'description',
  informationTypes: [
    {
      subjectCategories: ['BRUKER'],
      informationTypeId: 'id'
    }
  ]
})

test('CreateDocument ok', () => {
  expect(createDocument()).toBeSchema(schema)
})

test('CreateDocument errors', () => {
  expect({...createDocument(), name: ''}).toBeSchemaErrorAt(schema, 'name')
  expect({...createDocument(), description: ''}).toBeSchemaErrorAt(schema, 'description')
  expect({...createDocument(), informationTypes: []}).toBeSchemaErrorAt(schema, 'informationTypes')

  const doc = createDocument()
  const it = doc.informationTypes[0]
  it.informationTypeId = ''
  expect(doc).toBeSchemaErrorAt(schema, 'informationTypes[0].informationTypeId')
  it.informationTypeId = 'id'
  it.subjectCategories = []
  expect(doc).toBeSchemaErrorAt(schema, 'informationTypes[0].subjectCategories')
})
