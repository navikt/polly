import {Block} from "baseui/block";
import {Label1} from "baseui/typography";
import {theme} from "../../../util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import * as React from "react";

const PanelTitle = (props: { title: string, expanded: boolean }) => {
  const {title, expanded} = props
  return <>
    <Block>
      <Label1 color={theme.colors.primary}>
        {expanded ? <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronRight}/>}
        <span> </span>
        <span>{title}</span>
      </Label1>
    </Block>
  </>
}

export default PanelTitle
