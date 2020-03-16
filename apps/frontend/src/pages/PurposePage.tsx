import * as React from "react";
import {useEffect} from "react";

import ProcessList from "../components/Purpose";
import {Block} from "baseui/block";
import {codelist, ListName} from "../service/Codelist";
import {intl, theme, useAwait} from "../util"
import illustration from "../resources/purpose_illustration.svg"
import {H4, Label2, Paragraph2} from "baseui/typography";
import {useLocation} from "react-router";
import {RouteComponentProps} from "react-router-dom";

const routes = {
  subdepartment: 'subdepartment',
  department: 'department',
  purpose: 'purpose',
  team: 'team'
}

const renderDescription = (description: string) => (
  <Block marginBottom="scale1000">
    <Label2 font="font400">{intl.overallPurpose}</Label2>
    <Paragraph2>{description}</Paragraph2>
  </Block>
)

const setDefaultCurrentContext = (location: string) => {
  if (location.includes(routes.subdepartment)) return ListName.SUB_DEPARTMENT
  else if (location.includes(routes.department)) return ListName.DEPARTMENT
  else if (location.includes(routes.team)) return routes.team

  return ListName.PURPOSE
}

export type PathParams = { code?: string, processId?: string }

const PurposePage = (props: RouteComponentProps<PathParams>) => {
  const current_location = useLocation()
  const [isLoading, setLoading] = React.useState(false);
  const [currentContext, setCurrentContext] = React.useState<ListName | string>(setDefaultCurrentContext(current_location.pathname))
  const [title, setTitle] = React.useState<string>('')

  useAwait(codelist.wait())

  const getTitle = (codeName: string) => {
    let location = current_location.pathname
    if (location.includes(routes.subdepartment)) return codelist.getShortname(ListName.SUB_DEPARTMENT, codeName)
    else if (location.includes(routes.department)) return codelist.getShortname(ListName.DEPARTMENT, codeName)
    else if (location.includes(routes.purpose)) return codelist.getShortname(ListName.PURPOSE, codeName)

    return !props.match.params.code ? '' : props.match.params.code
  }

  const getCurrentListName = () => {
    let location = current_location.pathname
    if (location.includes(routes.subdepartment)) return ListName.SUB_DEPARTMENT
    else if (location.includes(routes.department)) return ListName.DEPARTMENT
    else if (location.includes(routes.purpose)) return ListName.PURPOSE

    return undefined
  }

  useEffect(() => {
    (async () => {
      setLoading(true)
      if (props.match.params.code) setTitle(getTitle(props.match.params.code))
      setLoading(false)
    })()

  }, [props.match.params])

  return (
    <React.Fragment>
      {!isLoading && props.match.params.code && (
        <React.Fragment>
        <Block marginBottom="3rem">
          <H4>{getTitle(props.match.params.code)}</H4>
        </Block>

        {renderDescription(codelist.getDescription(currentContext as ListName, title))}
        <ProcessList code={props.match.params.code} listName={getCurrentListName()} />
        </React.Fragment>
      )}


      {!props.match.params.code && (
        <Block display="flex" justifyContent="center" alignContent="center" marginTop={theme.sizing.scale2400}>
          <img src={illustration} alt={intl.treasureIllustration} style={{ maxWidth: "65%" }} />
        </Block>
      )}
    </React.Fragment>
  );
};

export default PurposePage;
