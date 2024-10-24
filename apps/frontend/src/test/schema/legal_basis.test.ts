import { legalBasisSchema } from '../../components/common/schemaValidation'
import { ILegalBasisFormValues } from '../../constants'
import { CodelistService, NATIONAL_LAW_GDPR_ARTICLES } from '../../service/Codelist'
import '../config/schemaValidator'

it('Legal basis', () => {
  const [codelistUtils] = CodelistService()
  const schema = legalBasisSchema(codelistUtils)
  const legalBasis: () => ILegalBasisFormValues = () => ({
    gdpr: NATIONAL_LAW_GDPR_ARTICLES[0],
    nationalLaw: 'LAW_1',
    description: 'desc',
  })

  test('LegalBasis ok', () => {
    expect(legalBasis()).toBeSchema(schema)
    expect({ gdpr: 'ART61A' }).toBeSchema(schema)
    expect({ gdpr: 'ART61F', description: 'desc' }).toBeSchema(schema)
  })

  test('LegalBasis', () => {
    expect({ ...legalBasis(), description: '' }).toBeSchemaErrorAt(schema, 'description')
    expect({ ...legalBasis(), nationalLaw: '' }).toBeSchemaErrorAt(schema, 'nationalLaw')
  })
})
