import { SearchType } from '../../../constants'
import { Block } from 'baseui/block'
import { theme } from '../../../util'
import { RadioGroup } from 'baseui/radio'
import { SmallRadio } from './SmallRadio'
import { default as React } from 'react'

export const SelectType = (props: { type: SearchType; setType: (type: SearchType) => void }) => (
  <Block
    font="ParagraphSmall"
    position="absolute"
    marginTop="-4px"
    backgroundColor={theme.colors.primary50}
    width="40vw"
    $style={{
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px',
    }}
  >
    <Block marginLeft="3px" marginRight="3px" marginBottom="3px">
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
    </Block>
  </Block>
)
