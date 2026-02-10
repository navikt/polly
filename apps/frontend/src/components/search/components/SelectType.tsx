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
    <div className="text-sm absolute top-full left-0 mt-1 bg-white w-fit max-w-[calc(100vw-1rem)] rounded-[var(--ax-radius-12)] border border-solid border-[#e6e6e6] shadow-[0px_0px_6px_3px_rgba(0,0,0,0.08)] z-50">
      <div className="px-3 py-2">
        <RadioGroup
          onChange={(value) => setType(value as TSearchType)}
          className="flex flex-col"
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
