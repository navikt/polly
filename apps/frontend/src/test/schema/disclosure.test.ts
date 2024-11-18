import { disclosureSchema } from '../../components/common/schemaValidation'
import { IDisclosureFormValues } from '../../constants'
import '../config/schemaValidator'

describe('Disclosure', () => {
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

  it('Disclosure ok', () => {
    expect(disclosure()).toBeSchema(schema)
  })

  it('Disclosure errors', () => {
    expect({ ...disclosure(), name: '' }).toBeSchemaErrorAt(schema, 'name')
    expect({ ...disclosure(), recipientPurpose: '' }).toBeSchemaErrorAt(schema, 'recipientPurpose')
  })
})
