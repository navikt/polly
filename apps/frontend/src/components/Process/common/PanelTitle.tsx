import { Block } from 'baseui/block'
import { LabelLarge } from 'baseui/typography'
import { theme } from '../../../util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import * as React from 'react'

const PanelTitle = (props: { title: string; expanded: boolean }) => {
  const { title, expanded } = props
  return (
    <>
      <div>
        <LabelLarge color={theme.colors.primary}>
          {expanded ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />}
          <span> </span>
          <span>{title}</span>
        </LabelLarge>
      </div>
    </>
  )
}

export default PanelTitle
