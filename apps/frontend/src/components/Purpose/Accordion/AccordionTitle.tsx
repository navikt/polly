import {UseWithPurpose} from '../../../constants'
import {Block} from 'baseui/block'
import {Label1} from 'baseui/typography'
import {intl, theme} from '../../../util'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronDown, faChevronRight, faEdit, faFileWord, faTrash} from '@fortawesome/free-solid-svg-icons'
import {codelist, ListName} from '../../../service/Codelist'
import {AuditButton} from '../../audit/AuditButton'
import {StyledLink} from 'baseui/link'
import {env} from '../../../util/env'
import Button from '../../common/Button'
import {SIZE as ButtonSize} from 'baseui/button'
import * as React from 'react'

const AccordionTitle = (props: { process: UseWithPurpose, expanded: boolean, hasAccess: boolean, editProcess: () => void, deleteProcess: () => void }) => {
  const {process, expanded, hasAccess} = props
  return <>
    <Block>
      <Label1 color={theme.colors.primary}>
        {expanded ?
          <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronRight}/>}
        <span> </span>
        <span>{codelist.getShortname(ListName.PURPOSE, process.purposeCode)}: </span>
        <span>{process.name}</span>
      </Label1>
    </Block>
    <div onClick={(e) => {
      e.stopPropagation()
    }}>
      {expanded &&
      <>
        <AuditButton id={process.id} marginRight/>
        <StyledLink
          style={{textDecoration: 'none'}}
          href={`${env.pollyBaseUrl}/export/process?processId=${process.id}`}>
          <Button
            kind={'outline'}
            size={ButtonSize.compact}
            icon={faFileWord}
            tooltip={intl.export}
            marginRight
          >
            {intl.export}
          </Button>
        </StyledLink>
      </>
      }
      {hasAccess && expanded && (
        <>
          <Button
            kind={'outline'}
            size={ButtonSize.compact}
            icon={faEdit}
            tooltip={intl.edit}
            onClick={props.editProcess}
            marginRight
          >
            {intl.edit}
          </Button>
          <Button
            kind={'outline'}
            size={ButtonSize.compact}
            icon={faTrash}
            tooltip={intl.delete}
            onClick={props.deleteProcess}
          >
            {intl.delete}
          </Button>
        </>
      )}
    </div>
  </>
}

export default AccordionTitle
