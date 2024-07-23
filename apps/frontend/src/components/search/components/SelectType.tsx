import { SearchType } from '../../../constants'
import { Block } from 'baseui/block'
import { theme } from '../../../util'
import { RadioGroup } from 'baseui/radio'
import { SmallRadio } from './SmallRadio'
import { default as React } from 'react'

export const SelectType = (props: { type: SearchType; setType: (type: SearchType) => void }) => (
  <div className="text-sm absolute mt-[-4px] bg-[#F6F6F6] w-[40vw] rounded-l-lg rounded-r-lg">
    <div className="mx-[3px] mb-[3px]">
      <RadioGroup onChange={(e) => props.setType(e.target.value as SearchType)} align="horizontal" value={props.type}>
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
