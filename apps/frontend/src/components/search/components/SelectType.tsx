import { RadioGroup } from '@navikt/ds-react'
import { TSearchType } from '../../../constants'
import { SmallRadio } from './SmallRadio'

interface IProps {
  type: TSearchType
  setType: (type: TSearchType) => void
}

export const SelectType = (props: IProps) => {
  const { type, setType } = props

  return (
    <div className="text-sm absolute -mt-1 bg-[#F6F6F6] w-[40vw] rounded-l-lg rounded-r-lg">
      <div className="mx-0.75 mb-0.75">
        <RadioGroup
          onChange={(value) => setType(value as TSearchType)}
          className="flex flex-wrap"
          legend=""
          hideLegend
          value={type}
        >
          {SmallRadio('all', 'Alle')}
          {SmallRadio('informationType', 'Opplysningstype')}
          {SmallRadio('purpose', 'Formål')}
          {SmallRadio('process', 'Behandlinger')}
          {SmallRadio('dpprocess', 'Nav som databehandler')}
          {SmallRadio('team', 'Team')}
          {SmallRadio('productarea', 'Område')}
          {SmallRadio('department', 'Avdeling')}
          {SmallRadio('subDepartment', 'Linja')}
          {SmallRadio('thirdParty', 'Ekstern part')}
          {SmallRadio('system', 'System')}
          {SmallRadio('document', 'Dokument')}
          {SmallRadio('nationalLaw', 'Nasjonal lov')}
          {SmallRadio('gdprArticle', 'GDPR artikkel')}
        </RadioGroup>
      </div>
    </div>
  )
}
