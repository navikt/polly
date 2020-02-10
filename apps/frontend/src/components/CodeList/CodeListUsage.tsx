import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { Block } from "baseui/block"
import { StyledBody, StyledCell, StyledHead, StyledHeadCell, StyledRow, StyledTable } from "baseui/table"
import { Spinner } from "baseui/icon"
import { Label2, Label4 } from "baseui/typography"
import { Select, Value } from "baseui/select"
import { Button } from "baseui/button"

import { intl } from "../../util"
import { CodeUsage, ObjectType } from "../../constants"
import { ObjectLink } from "../common/RouteLink"
import { codelist, ListName } from "../../service/Codelist"
import { replaceCodelistUsage } from "../../api"

const UsageTable = (props: { usage: CodeUsage, rows: number }) => {
  const {usage, rows} = props;
  const informationTypes = !!usage.informationTypes.length
  const processes = !!usage.processes.length
  const policies = !!usage.policies.length
  const disclosures = !!usage.disclosures.length
  const documents = !!usage.documents.length
  return (
    <StyledTable>
      <StyledHead>
        {informationTypes && <StyledHeadCell> {intl.informationType} </StyledHeadCell>}
        {processes && <StyledHeadCell> {intl.process} </StyledHeadCell>}
        {policies && <StyledHeadCell> {intl.policy} </StyledHeadCell>}
        {disclosures && <StyledHeadCell> {intl.disclosure} </StyledHeadCell>}
        {documents && <StyledHeadCell> {intl.documents} </StyledHeadCell>}
      </StyledHead>
      <StyledBody>
        {Array.from(Array(rows).keys()).map(index => {
          const it = usage.informationTypes[index]
          const po = usage.policies[index]
          const pr = usage.processes[index]
          const di = usage.disclosures[index]
          const doc = usage.documents[index]
          return (
            <StyledRow key={index}>
              {informationTypes && <StyledCell>
                {it && <ObjectLink id={it.id} type={ObjectType.INFORMATION_TYPE} withHistory={true}>{it.name}</ObjectLink>}
              </StyledCell>}
              {processes && <StyledCell>
                {pr && <ObjectLink id={pr.id} type={ObjectType.PROCESS} withHistory={true}>{codelist.getShortname(ListName.PURPOSE, pr.purposeCode)} {pr.name}</ObjectLink>}
              </StyledCell>}
              {policies && <StyledCell>
                {po && <ObjectLink id={po.id} type={ObjectType.POLICY} withHistory={true}>{codelist.getShortname(ListName.PURPOSE, po.purposeCode)} {po.name}</ObjectLink>}
              </StyledCell>}
              {disclosures && <StyledCell>
                {di && <ObjectLink id={di.id} type={ObjectType.DISCLOSURE} withHistory={true}>{di.name}</ObjectLink>}
              </StyledCell>}
              {documents && <StyledCell>
                {doc && <ObjectLink id={doc.id} type={ObjectType.DOCUMENT} withHistory={true}>{doc.name}</ObjectLink>}
              </StyledCell>}
            </StyledRow>
          )
        })}
      </StyledBody>
    </StyledTable>
  )
}

export const Usage = (props: { usage?: CodeUsage, refresh: () => void }) => {
  const [showReplace, setShowReplace] = useState(false)
  const [newValue, setNewValue] = useState<Value>([])
  const ref = useRef<HTMLElement>()

  const {usage, refresh} = props;
  const maxRows = usage ? Math.max(usage.disclosures.length, usage.informationTypes.length, usage.processes.length, usage.policies.length) : -1
  const noUsage = maxRows === 0

  useEffect(() => {
    setShowReplace(false)
    setTimeout(() => ref.current && window.scrollTo({top: ref.current.offsetTop}), 200)
  }, [usage])

  const replace = async () => {
    await replaceCodelistUsage(usage!.listName, usage!.code, newValue![0].id as string)
    refresh()
  }

  return (
    <Block marginTop="2rem" ref={ref}>
      <Block display="flex" justifyContent="space-between" marginBottom=".5rem">
        <Label2 font="font450">{intl.usage}</Label2>
        {!noUsage && <Button type="button" kind="secondary" size="compact" onClick={() => setShowReplace(true)}>{intl.replaceAllUse}</Button>}
      </Block>

      {showReplace && usage && usage.listName && (
        <Block display="flex" margin="1rem" justifyContent="space-between">
          <Select size="compact"
                  maxDropdownHeight="300px" searchable={true} placeholder={intl.newValue}
                  options={codelist.getParsedOptions(usage.listName)} value={newValue} onChange={params => setNewValue(params.value)}/>
          <Button type="button" size="compact" onClick={replace} disabled={!newValue.length}>{intl.replace}</Button>
        </Block>
      )}

      {usage && <UsageTable usage={usage} rows={maxRows}/>}
      {!usage && <Spinner/>}
      {noUsage && <Label4 marginTop=".5rem">{intl.usageNotFound}</Label4>}
    </Block>
  )
}
