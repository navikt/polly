import { dpProcessSchema } from '../../components/common/schemaValidation'
import { IDpProcessFormValues } from '../../constants'
import '../config/schemaValidator'

const schema = dpProcessSchema()
const createDp: () => IDpProcessFormValues = () => ({
  name: 'name',
  dataProcessingAgreements: [],
  affiliation: {
    department: '',
    nomDepartmentId: '',
    nomDepartmentName: '',
    seksjoner: [],
    fylker: [],
    navKontorer: [],
    productTeams: [],
    products: [],
    subDepartments: [],
    disclosureDispatchers: [],
  },
  retention: {
    retentionMonths: 2,
    retentionStart: 'august',
  },
  subDataProcessing: {
    dataProcessor: true,
    processors: [],
  },
})

test('dpProcess ok', () => {
  expect(createDp()).toBeSchema(schema)
})
