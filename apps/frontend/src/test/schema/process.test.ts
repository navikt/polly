import { processSchema } from '../../components/common/schemaValidation'
import { EProcessStatus, ILegalBasisFormValues, IProcessFormValues } from '../../constants'
import { EListName, NATIONAL_LAW_GDPR_ARTICLES } from '../../service/Codelist'
import { addCode } from '../config/codelist'
import '../config/schemaValidator'

export const createProcess = (): IProcessFormValues => ({
  name: 'name',
  purposes: ['PURPOSE'],
  affiliation: {
    productTeams: [],
    products: [],
    subDepartments: [],
    disclosureDispatchers: [],
  },
  legalBases: new Array<ILegalBasisFormValues>(),
  legalBasesOpen: false,
  dataProcessing: {
    dataProcessor: true,
    processors: [],
  },
  retention: {
    retentionMonths: 2,
    retentionStart: 'august',
  },
  status: EProcessStatus.IN_PROGRESS,
  dpia: {
    noDpiaReasons: [],
    processImplemented: true,
  },
  disclosures: [],
})

it('Process', () => {
  const purposeList = [addCode(EListName.PURPOSE, 'PURPOSE')]

  const schema = processSchema(purposeList)

  test('Process ok', () => {
    expect(createProcess()).toBeSchema(schema)
  })

  test('Process purposes required', () => {
    const process = { ...createProcess(), purposes: [] }
    expect(process).toBeSchemaErrorAt(schema, 'purposes')
  })

  test('Process status needs to be a type ProcessStatus', () => {
    const process = { ...createProcess(), status: '' }
    expect(process).toBeSchemaErrorAt(schema, 'status')
  })

  test('Process disclosures required', () => {
    const process = { ...createProcess(), disclosures: '' }
    expect(process).toBeSchemaErrorAt(schema, 'disclosures')
  })

  test('Process legalBasis', () => {
    let process = {
      ...createProcess(),
      legalBases: [{ gdpr: NATIONAL_LAW_GDPR_ARTICLES[0], description: '', nationalLaw: '' }],
    }
    expect(process).toBeSchemaErrorAt(schema, 'legalBases[0].description')
    process = {
      ...createProcess(),
      legalBases: [{ gdpr: NATIONAL_LAW_GDPR_ARTICLES[0], description: 'desc', nationalLaw: '' }],
    }
    expect(process).toBeSchemaErrorAt(schema, 'legalBases[0].nationalLaw')
    process = {
      ...createProcess(),
      legalBases: [
        { gdpr: NATIONAL_LAW_GDPR_ARTICLES[0], description: 'desc', nationalLaw: 'LAW_1' },
      ],
    }
    expect(process).toBeSchema(schema)
  })
})
