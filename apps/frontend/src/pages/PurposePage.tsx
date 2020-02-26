import * as React from "react";
import { useEffect } from "react";
import { Option, Select, Value } from 'baseui/select';

import ProcessList from "../components/Purpose";
import { Block } from "baseui/block";
import { codelist, ListName, List } from "../service/Codelist";
import { intl, theme, useAwait } from "../util"
import illustration from "../resources/purpose_illustration.svg"
import { H4, Label2, Paragraph2 } from "baseui/typography";
import { generatePath, useLocation } from "react-router";
import { getProcessPurposeCount, getAllTeams } from "../api"
import { RouteComponentProps } from "react-router-dom";
import { RadioGroup, Radio, ALIGN } from "baseui/radio";
import { Team } from "../constants";

const routes = {
  subdepartment: 'subdepartment',
  department: 'department',
  purpose: 'purpose',
  team: 'team'
}

const renderDescription = (description: string) => (
  <Block marginBottom="scale1000">
    <Label2 font="font400">{intl.purposeDescription}</Label2>
    <Paragraph2>{description}</Paragraph2>
  </Block>
)

const setDefaultSelectedRadioValue = (location: string) => {
  if (location.includes(routes.subdepartment)) return ListName.SUB_DEPARTMENT
  else if (location.includes(routes.department)) return ListName.DEPARTMENT
  else if (location.includes(routes.team)) return routes.team

  return ListName.PURPOSE
}

export type PathParams = { code?: string, processId?: string }

const PurposePage = (props: RouteComponentProps<PathParams>) => {
  const current_location = useLocation()


  const [isLoading, setLoading] = React.useState(false);
  const [allTeams, setAllTeams] = React.useState<Team[]>([])
  const [processCount, setProcessCount] = React.useState<{ [purpose: string]: number }>(({}));
  const [selectedRadioValue, setSelectedRadioValue] = React.useState<ListName | string>(setDefaultSelectedRadioValue(current_location.pathname))
  const [currentSelectedValue, setCurrentSelectedValue] = React.useState<Value>([])

  useAwait(codelist.wait())

  const updatePath = (params?: PathParams) => {
    let nextPath
    if (!params) nextPath = generatePath(props.match.path)
    else nextPath = generatePath(props.match.path, params)
    props.history.push(nextPath)
  }

  const purposeLabelView = (option: Option) => {
    return {
      id: option.id,
      label: <Block display="flex" justifyContent="space-between" width="100%">
        <span>{option.label}</span>
        <Block $style={{ opacity: .5 }}>{option.id && `${intl.processes}: ${!processCount[option.id] ? 0 : processCount[option.id]}`}</Block>
      </Block>
    }
  }

  const handleRadioButtonChange = (value: string) => {
    setLoading(true)
    setSelectedRadioValue(value)
    if (value === ListName.PURPOSE) props.history.replace("/process/purpose")
    else if (value === ListName.DEPARTMENT) props.history.replace("/process/department")
    else if (value === ListName.SUB_DEPARTMENT) props.history.replace("/process/subdepartment")
    else if (value === routes.team) props.history.replace("/process/team")
    setLoading(false)
  }

  const handleChangeSelect = (option: Option | undefined) => {
    if (!option) {
      setCurrentSelectedValue([])
      updatePath()
    }
    else {
      setCurrentSelectedValue([option])
      updatePath({ code: option.id as string, processId: props.match.params.processId })
    }
  }

  const optionsForSelectedCode = (selected: string) => {
    if (selected == ListName.SUB_DEPARTMENT)
      return codelist.getParsedOptions(ListName.SUB_DEPARTMENT).map(purposeLabelView)
    else if (selected === ListName.DEPARTMENT)
      return codelist.getParsedOptions(ListName.DEPARTMENT).map(purposeLabelView)
    else if (selected === routes.team) {
      return allTeams.map(team => ({ id: team.id, label: team.name })).map(purposeLabelView)
    }

    return codelist.getParsedOptions(ListName.PURPOSE).map(purposeLabelView)
  }

  const getPlaceholder = (selected: string) => {
    if (selected == ListName.SUB_DEPARTMENT)
      return intl.subDepartmentSelect
    else if (selected === ListName.DEPARTMENT)
      return intl.departmentSelect
    else if (selected === routes.team)
      return intl.teamSelect

    return intl.purposeSelect
  }

  useEffect(() => {
    (async () => {
      if (current_location.pathname.includes(routes.purpose)) {
        setSelectedRadioValue(ListName.PURPOSE)
        setProcessCount((await getProcessPurposeCount('purpose')).counts)
      }
      else if (current_location.pathname.includes(routes.subdepartment)) {
        setSelectedRadioValue(ListName.SUB_DEPARTMENT)
        setProcessCount((await getProcessPurposeCount('subDepartment')).counts)
      }
      else if (current_location.pathname.includes(routes.department)) {
        setSelectedRadioValue(ListName.DEPARTMENT)
        setProcessCount((await getProcessPurposeCount('department')).counts)
      }
      else if (current_location.pathname.includes(routes.team)) {
        setSelectedRadioValue(routes.team)
        setProcessCount((await getProcessPurposeCount('team')).counts)
      }

      if (props.match.params.code) setCurrentSelectedValue([{ id: props.match.params.code }])
      else setCurrentSelectedValue([])
    })()

  }, [props.match.params])

  useEffect(() => {
    (async () => {
      let res = await getAllTeams()
      res.content && setAllTeams(res.content)
    })()

  }, [])

  return (
    <React.Fragment>
      {!isLoading && (
        <Block marginBottom="3rem">
          <H4>{intl.processingActivities}</H4>
          <Block display="flex" marginBottom="1rem">
            <RadioGroup
              value={selectedRadioValue}
              onChange={e => handleRadioButtonChange(e.target.value as ListName)}
              align={ALIGN.horizontal}
            >
              <Radio value={ListName.PURPOSE as ListName} overrides={{ Root: { style: { marginRight: '1rem' } } }}>{intl.purpose}</Radio>
              <Radio value={ListName.DEPARTMENT as ListName} overrides={{ Root: { style: { marginRight: '1rem' } } }}>{intl.department}</Radio>
              <Radio value={ListName.SUB_DEPARTMENT as ListName} overrides={{ Root: { style: { marginRight: '1rem' } } }}>{intl.subDepartment}</Radio>
              <Radio value={routes.team}>{intl.productTeam}</Radio>
            </RadioGroup>
          </Block>

          <Select
            value={currentSelectedValue}
            options={optionsForSelectedCode(selectedRadioValue)}
            placeholder={getPlaceholder(selectedRadioValue)}
            maxDropdownHeight="350px"
            onChange={params => {
              handleChangeSelect(params.option)
            }}
            overrides={{
              Root: {
                style: {
                  width: "900px"
                }
              },
              SingleValue: {
                style: {
                  width: '100%',
                  paddingRight: theme.sizing.scale600
                }
              }
            }}
          />
        </Block>
      )}

      {currentSelectedValue.length > 0 && (
        <React.Fragment>
          {renderDescription(codelist.getDescription(selectedRadioValue as ListName, currentSelectedValue[0].id as string))}

          <ProcessList code={currentSelectedValue[0].id as string} listName={selectedRadioValue !== routes.team ? selectedRadioValue : undefined}
          />
        </React.Fragment>
      )}

      {currentSelectedValue.length < 1 && (
        <Block display="flex" justifyContent="center" alignContent="center" marginTop={theme.sizing.scale2400}>
          <img src={illustration} alt={intl.treasureIllustration} style={{ maxWidth: "65%" }} />
        </Block>
      )}
    </React.Fragment>
  );
};

export default PurposePage;
