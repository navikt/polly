import '../config/schemaValidator'
import { disclosureSchema } from '../../components/common/schema'
import { DisclosureFormValues } from '../../constants'

const schema = disclosureSchema()
const disclosure: () => DisclosureFormValues = () => ({
  name: 'name',
  recipientPurpose: 'PURPOSE',
  abroad: {
    countries: [],
  },
  legalBases: [],
  legalBasesOpen: false,
  processes: [],
  processIds: [],
  assessedConfidentiality: false,
  confidentialityDescription: 'test'
})

test('Disclosure ok', () => {
  expect(disclosure()).toBeSchema(schema)
})

test('Disclosure errors', () => {
  expect({ ...disclosure(), name: '' }).toBeSchemaErrorAt(schema, 'name')
  expect({ ...disclosure(), recipientPurpose: '' }).toBeSchemaErrorAt(schema, 'recipientPurpose')
})
