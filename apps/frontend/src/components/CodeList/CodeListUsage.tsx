import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Block } from 'baseui/block'
import { Label2, Label4 } from 'baseui/typography'
import { Select, Value } from 'baseui/select'
import { Button } from 'baseui/button'

import { intl, theme } from '../../util'
import { CodeUsage, ObjectType } from '../../constants'
import { ObjectLink } from '../common/RouteLink'
import { codelist, ListName } from '../../service/Codelist'
import { replaceCodelistUsage } from '../../api'
import { StyledSpinnerNext } from 'baseui/spinner'
import { Cell, HeadCell, Row, Table } from '../common/Table'

const UsageTable = (props: { usage: CodeUsage, rows: number }) => {
  const {usage, rows} = props
  const informationTypes = !!usage.informationTypes.length
  const processes = !!usage.processes.length
  const policies = !!usage.policies.length
  const disclosures = !!usage.disclosures.length
  const documents = !!usage.documents.length
  return (
    <Table
      emptyText={intl.usage}
      hoverColor={theme.colors.primary100}
      headers={
        <>
          {informationTypes && <HeadCell title={intl.informationType}/>}
          {processes && <HeadCell title={intl.process}/>}
          {policies && <HeadCell title={intl.policy}/>}
          {disclosures && <HeadCell title={intl.disclosure}/>}
          {documents && <HeadCell title={intl.documents}/>}
        </>
      }
    >
      {Array.from(Array(rows).keys()).map(index => {
        const it = usage.informationTypes[index]
        const po = usage.policies[index]
        const pr = usage.processes[index]
        const di = usage.disclosures[index]
        const doc = usage.documents[index]
        return (
          <Row key={index} $style={{borderBottomStyle: 'none'}}>
            {informationTypes && <Cell>
              {it && <ObjectLink id={it.id} type={ObjectType.INFORMATION_TYPE} withHistory={true}>{it.name}</ObjectLink>}
            </Cell>}
            {processes && <Cell>
              {pr && <ObjectLink id={pr.id} type={ObjectType.PROCESS} withHistory={true}>{codelist.getShortname(ListName.PURPOSE, pr.purpose.code)} {pr.name}</ObjectLink>}
            </Cell>}
            {policies && <Cell>
              {po && <ObjectLink id={po.id} type={ObjectType.POLICY} withHistory={true}>{codelist.getShortname(ListName.PURPOSE, po.purposeCode)} {po.name}</ObjectLink>}
            </Cell>}
            {disclosures && <Cell>
              {di && <ObjectLink id={di.id} type={ObjectType.DISCLOSURE} withHistory={true}>{di.name}</ObjectLink>}
            </Cell>}
            {documents && <Cell>
              {doc && <ObjectLink id={doc.id} type={ObjectType.DOCUMENT} withHistory={true}>{doc.name}</ObjectLink>}
            </Cell>}
          </Row>
        )
      })}
    </Table>
  )
}

export const Usage = (props: { usage?: CodeUsage, refresh: () => void }) => {
  const [showReplace, setShowReplace] = useState(false)
  const [newValue, setNewValue] = useState<Value>([])
  const ref = useRef<HTMLElement>()

  const {usage, refresh} = props
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
      {!usage && <StyledSpinnerNext/>}
      {noUsage && <Label4 marginTop=".5rem">{intl.usageNotFound}</Label4>}
    </Block>
  )
}
