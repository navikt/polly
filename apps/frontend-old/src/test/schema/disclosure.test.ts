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
    processes: [
      {
        id: 'process-1',
        name: 'Process',
        number: 1,
        purposes: [],
        affiliation: {
          seksjoner: [],
          fylker: [],
          navKontorer: [],
          subDepartments: [],
          productTeams: [],
          products: [],
          disclosureDispatchers: [],
        },
        end: '2099-01-01',
        changeStamp: {
          lastModifiedBy: 'test',
          lastModifiedDate: '2099-01-01',
        },
      },
    ],
    processIds: ['process-1'],
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
