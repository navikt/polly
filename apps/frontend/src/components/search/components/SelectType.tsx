import { SearchType } from '../../../constants'
import { Block } from 'baseui/block'
import { intl, theme } from '../../../util'
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
        {SmallRadio('all', intl.all)}
        {SmallRadio('informationType', intl.informationType)}
        {SmallRadio('purpose', intl.purpose)}
        {SmallRadio('process', intl.processes)}
        {SmallRadio('dpprocess', intl.dpProcess)}
        {SmallRadio('team', intl.team)}
        {SmallRadio('productarea', intl.productArea)}
        {SmallRadio('department', intl.department)}
        {SmallRadio('subDepartment', intl.subDepartmentShort)}
        {SmallRadio('thirdParty', intl.thirdParty)}
        {SmallRadio('system', intl.system)}
        {SmallRadio('document', intl.document)}
        {SmallRadio('nationalLaw', intl.nationalLaw)}
        {SmallRadio('gdprArticle', intl.gdprArticle)}
      </RadioGroup>
    </Block>
  </Block>
)
