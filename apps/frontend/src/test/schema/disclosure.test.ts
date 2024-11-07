import { disclosureSchema } from '../../components/common/schemaValidation'
import { IDisclosureFormValues } from '../../constants'
import '../config/schemaValidator'

it('Disclosure', () => {
  const schema = disclosureSchema()

  const disclosure: () => IDisclosureFormValues = () => ({
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
    confidentialityDescription: 'test',
  })

  test('Disclosure ok', () => {
    expect(disclosure()).toBeSchema(schema)
  })

  test('Disclosure errors', () => {
    expect({ ...disclosure(), name: '' }).toBeSchemaErrorAt(schema, 'name')
    expect({ ...disclosure(), recipientPurpose: '' }).toBeSchemaErrorAt(schema, 'recipientPurpose')
  })
})
