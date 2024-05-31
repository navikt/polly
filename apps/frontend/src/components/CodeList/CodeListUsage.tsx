import * as React from 'react'
import { useEffect, useState } from 'react'
import { Block } from 'baseui/block'
import { LabelMedium, LabelXSmall } from 'baseui/typography'
import { Select, Value } from 'baseui/select'
import { Button } from 'baseui/button'

import { theme } from '../../util'
import { CodeUsage, ObjectType } from '../../constants'
import { ObjectLink } from '../common/RouteLink'
import { codelist, ListName } from '../../service/Codelist'
import { replaceCodelistUsage } from '../../api'
import { Spinner } from 'baseui/spinner'
import { Cell, HeadCell, Row, Table } from '../common/Table'

const UsageTable = (props: { usage: CodeUsage }) => {
  const { usage } = props
  const informationTypes = !!usage.informationTypes.length
  const processes = !!usage.processes.length
  const processors = !!usage.processors.length
  const dpProcesses = !!usage.dpProcesses.length
  const policies = !!usage.policies.length
  const disclosures = !!usage.disclosures.length
  const documents = !!usage.documents.length

  const rows = usage
    ? Math.max(
        usage.informationTypes.length,
        usage.processes.length,
        usage.processors.length,
        usage.dpProcesses.length,
        usage.policies.length,
        usage.disclosures.length,
        usage.documents.length,
      )
    : -1

  return (
    <Table
      emptyText='Ingen bruk'
      hoverColor={theme.colors.primary100}
      headers={
        <>
          {informationTypes && <HeadCell title='Opplysningstype' />}
          {processes && <HeadCell title='Behandling' />}
          {processors && <HeadCell title='Databehandlere' />}
          {dpProcesses && <HeadCell title='NAV som databehandler' />}
          {policies && <HeadCell title='Polis' />}
          {disclosures && <HeadCell title='Utleveringer' />}
          {documents && <HeadCell title='Dokumenter' />}
        </>
      }
    >
      {Array.from(Array(rows).keys()).map((index) => {
        const it = usage.informationTypes[index]
        const po = usage.policies[index]
        const pr = usage.processes[index]
        const pro = usage.processors[index]
        const dpr = usage.dpProcesses[index]
        const di = usage.disclosures[index]
        const doc = usage.documents[index]
        return (
          <Row key={index} $style={{ borderBottomStyle: 'none' }}>
            {informationTypes && (
              <Cell>
                {it && (
                  <ObjectLink id={it.id} type={ObjectType.INFORMATION_TYPE} withHistory={true}>
                    {it.name}
                  </ObjectLink>
                )}
              </Cell>
            )}
            {processes && (
              <Cell>
                {pr && (
                  <ObjectLink id={pr.id} type={ObjectType.PROCESS} withHistory={true}>
                    {codelist
                      .getShortnames(
                        ListName.PURPOSE,
                        pr.purposes.map((p) => p.code),
                      )
                      .join(', ')}{' '}
                    {pr.name}
                  </ObjectLink>
                )}
              </Cell>
            )}
            {processors && (
              <Cell>
                {pr && (
                  <ObjectLink id={pro.id} type={ObjectType.PROCESSOR} withHistory={true}>
                    {pro.name}
                  </ObjectLink>
                )}
              </Cell>
            )}
            {dpProcesses && (
              <Cell>
                {dpr && (
                  <ObjectLink id={dpr.id} type={ObjectType.DP_PROCESS} withHistory={true}>
                    {dpr.name}
                  </ObjectLink>
                )}
              </Cell>
            )}
            {policies && (
              <Cell>
                {po && (
                  <ObjectLink id={po.id} type={ObjectType.POLICY} withHistory={true}>
                    {codelist.getShortnames(ListName.PURPOSE, po.purposes).join(', ')} {po.name}
                  </ObjectLink>
                )}
              </Cell>
            )}
            {disclosures && (
              <Cell>
                {di && (
                  <ObjectLink id={di.id} type={ObjectType.DISCLOSURE} withHistory={true}>
                    {di.name}
                  </ObjectLink>
                )}
              </Cell>
            )}
            {documents && (
              <Cell>
                {doc && (
                  <ObjectLink id={doc.id} type={ObjectType.DOCUMENT} withHistory={true}>
                    {doc.name}
                  </ObjectLink>
                )}
              </Cell>
            )}
          </Row>
        )
      })}
    </Table>
  )
}

export const Usage = (props: { usage?: CodeUsage; refresh: () => void }) => {
  const [showReplace, setShowReplace] = useState(false)
  const [newValue, setNewValue] = useState<Value>([])
  const ref = React.createRef<HTMLDivElement>()

  const { usage, refresh } = props

  useEffect(() => {
    setShowReplace(false)
    setTimeout(() => ref.current && window.scrollTo({ top: ref.current.offsetTop }), 200)
  }, [usage])

  const replace = async () => {
    await replaceCodelistUsage(usage!.listName, usage!.code, newValue[0].id as string)
    refresh()
  }

  return (
    <Block marginTop="2rem" ref={ref}>
      <Block display="flex" justifyContent="space-between" marginBottom=".5rem">
        <LabelMedium font="font450">Bruk</LabelMedium>
        {!!usage?.inUse && (
          <Button type="button" kind="secondary" size="compact" onClick={() => setShowReplace(true)}>
            Erstatt all bruk
          </Button>
        )}
      </Block>

      {showReplace && usage && usage.listName && (
        <Block display="flex" margin="1rem" justifyContent="space-between">
          <Select
            size="compact"
            maxDropdownHeight="300px"
            searchable={true}
            placeholder='Ny verdi'
            options={codelist.getParsedOptions(usage.listName)}
            value={newValue}
            onChange={(params) => setNewValue(params.value)}
          />
          <Button type="button" size="compact" onClick={replace} disabled={!newValue.length}>
            Erstatt
          </Button>
        </Block>
      )}

      {usage && <UsageTable usage={usage} />}
      {!usage && <Spinner />}
      {usage && !usage.inUse && <LabelXSmall marginTop=".5rem">Fant ingen bruk</LabelXSmall>}
    </Block>
  )
}
