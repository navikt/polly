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
import { getProcessPurposeCount } from "../api"
import { RouteComponentProps } from "react-router-dom";
import { RadioGroup, Radio, ALIGN } from "baseui/radio";

const renderDescription = (description: string) => (
  <Block marginBottom="scale1000">
    <Label2 font="font400">{intl.purposeDescription}</Label2>
    <Paragraph2>{description}</Paragraph2>
  </Block>
)

export type PathParams = { context?: string, code?: string, processId?: string }

const PurposePage = (props: RouteComponentProps<PathParams>) => {
  const current_location = useLocation()
  const setDefaultSelectedRadioValue = () => {
    return current_location.pathname.includes('department') ? ListName.DEPARTMENT : ListName.PURPOSE
  }

  const [isLoading, setLoading] = React.useState(false);
  const [processCount, setProcessCount] = React.useState<{ [purpose: string]: number }>(({}));
  const [selectedRadioValue, setSelectedRadioValue] = React.useState(setDefaultSelectedRadioValue())
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
        <Block $style={{ opacity: .5 }}>{option.id && `${intl.processes}: ${processCount[option.id]}`}</Block>
      </Block>
    }
  }

  const handleRadioButtonChange = (listname: ListName) => {
    setLoading(true)
    setSelectedRadioValue(listname)
    if (listname === ListName.PURPOSE) props.history.replace("/process/purpose")
    else if (listname === ListName.DEPARTMENT) props.history.replace("/process/department")
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
    return selected === ListName.DEPARTMENT ? codelist.getParsedOptions(ListName.DEPARTMENT).map(purposeLabelView)
      : codelist.getParsedOptions(ListName.PURPOSE).map(purposeLabelView)
  }

  useEffect(() => {
    (async () => {
      if (current_location.pathname.includes('purpose')) {
        setSelectedRadioValue(ListName.PURPOSE)
        setProcessCount((await getProcessPurposeCount('purpose')).counts)
      }
      else if (current_location.pathname.includes('department')) {
        setSelectedRadioValue(ListName.DEPARTMENT)        
        setProcessCount((await getProcessPurposeCount('department')).counts)
      }

      if (props.match.params.code) setCurrentSelectedValue([{ id: props.match.params.code }])
      else setCurrentSelectedValue([])
    })()

  }, [props.match.params])

  return (
    <React.Fragment>
      {!isLoading && (
        <Block marginBottom="3rem">
          <H4>{intl.processingActivities}</H4>
          <Block display="flex" marginBottom="scale400">
            <RadioGroup
              value={selectedRadioValue}
              onChange={e => handleRadioButtonChange(e.target.value as ListName)}
              align={ALIGN.horizontal}
            >
              <Radio value={ListName.PURPOSE as ListName} overrides={{ Root: { style: { marginRight: '1rem' } } }}>{intl.purpose}</Radio>
              <Radio value={ListName.DEPARTMENT as ListName}>{intl.department}</Radio>
            </RadioGroup>
          </Block>

          <Block marginBottom="2rem"></Block>
          <Select
            value={currentSelectedValue}
            options={optionsForSelectedCode(selectedRadioValue)}
            placeholder={intl.purposeSelect}
            maxDropdownHeight="350px"
            onChange={params => {
              handleChangeSelect(params.option)
            }}
            overrides={{
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
          {renderDescription(codelist.getDescription(selectedRadioValue, currentSelectedValue[0].id as string))}
          <ProcessList listName={selectedRadioValue} code={currentSelectedValue[0].id as string} />
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
