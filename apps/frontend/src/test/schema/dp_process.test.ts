import { dpProcessSchema } from '../../components/common/schema'
import { DpProcessFormValues } from '../../constants'
import '../config/schemaValidator'

const schema = dpProcessSchema()
const createDp: () => DpProcessFormValues = () => ({
  name: 'name',
  dataProcessingAgreements: [],
  affiliation: {
    department: '',
    productTeams: [],
    products: [],
    subDepartments: [],
    disclosureDispatchers:[]
  },
  retention: {
    retentionMonths: 2,
    retentionStart: 'august'
  },
  subDataProcessing: {
    dataProcessor: true,
    processors: [],
  }
})

test('dpProcess ok', () => {
  expect(createDp()).toBeSchema(schema)
})
