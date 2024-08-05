import { RadioGroup } from 'baseui/radio'
import { ChangeEvent } from 'react'
import { SearchType } from '../../../constants'
import { SmallRadio } from './SmallRadio'

interface IProps {
  type: SearchType
  setType: (type: SearchType) => void
}

export const SelectType = (props: IProps) => {
  const { type, setType } = props

  return (
    <div className="text-sm absolute mt-[-4px] bg-[#F6F6F6] w-[40vw] rounded-l-lg rounded-r-lg">
      <div className="mx-[3px] mb-[3px]">
        <RadioGroup onChange={(event: ChangeEvent<HTMLInputElement>) => setType(event.target.value as SearchType)} align="horizontal" value={type}>
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
