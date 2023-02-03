import React, {useEffect, useState} from 'react'
import {AaregAvtale} from '../../constants'
import {PLACEMENT, StatefulPopover} from 'baseui/popover'
import {StatefulMenu} from 'baseui/menu'
import {Block, BlockComponentType} from 'baseui/block'
import {intl, theme} from '../../util'
import Button from '../common/Button'
import {KIND} from 'baseui/button'
import {faChevronDown} from '@fortawesome/free-solid-svg-icons'
import {Pagination} from 'baseui/pagination'
import {HeadingLarge, LabelLarge} from 'baseui/typography'
import {Panel, StatelessAccordion} from 'baseui/accordion'
import DataText from "../common/DataText";

type AaregAvtaleTableProps = {
  aaregAvtaler: AaregAvtale[]
}

const marginBottom = "1rem"

export const sortAaregAvtaleList = (aaregAvtaler: AaregAvtale[]) => {
  return aaregAvtaler.sort((a, b) => {
    if (a.virksomhet > b.virksomhet) {
      return 1
    } else if (a.virksomhet < b.virksomhet) {
      return -1
    } else {
      if (a.avtalenummer > b.avtalenummer) {
        return 1
      } else if (a.avtalenummer < b.avtalenummer) {
        return -1
      } else {
        return 0
      }
    }
  })
}

export const AaregAvtaleTable = (props: AaregAvtaleTableProps) => {
  const [pageLimit, setPageLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [sortedAaregAvtale, setSortedAaregAvtale] = useState<AaregAvtale[]>([])
  const [selectedAaregAvtale, setSelectedAaregAvtale] = useState<string>()


  useEffect(() => {
    setSortedAaregAvtale(sortAaregAvtaleList(props.aaregAvtaler).slice(0, 10))
  }, [props.aaregAvtaler])

  useEffect(() => {

    setSortedAaregAvtale(
      sortAaregAvtaleList(props.aaregAvtaler).slice((page - 1) * pageLimit, pageLimit * page)
    )
  }, [pageLimit, page])

  return (
    <>
      <HeadingLarge>{intl.aaregContracts}</HeadingLarge>
      <StatelessAccordion
        onChange={({expanded}) => {
          setSelectedAaregAvtale(expanded[0] as string)
        }}
        expanded={selectedAaregAvtale ? [selectedAaregAvtale] : []}
      >
        {sortedAaregAvtale && sortedAaregAvtale.map(a => {
          return (
            <Panel
              key={a.avtalenummer}
              title={
                <Block width="100%">
                  <Block>{a.virksomhet} - {a.avtalenummer}</Block>
                </Block>
              }
              overrides={{
                ToggleIcon: {
                  component: () => null
                },
                Content: {
                  style: {
                    backgroundColor: theme.colors.white,
                    // Outline width
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    paddingLeft: '4px',
                    paddingRight: '4px',
                  }
                }
              }}>
              <Block $style={{
                outline: `4px ${theme.colors.primary200} solid`
              }}>
                <Block
                  paddingBottom={theme.sizing.scale800}
                  paddingLeft={theme.sizing.scale800}
                  paddingRight={theme.sizing.scale800}
                  paddingTop={theme.sizing.scale800}
                >
                  <LabelLarge marginBottom={marginBottom}>{intl.consumer}</LabelLarge>
                  <DataText label={intl.name} text={a.virksomhet || ''}/>
                  <DataText label={intl.organisationNumber} text={a.organisasjonsnummer || ''}/>
                  <LabelLarge marginBottom={marginBottom}>{intl.contractAareg}</LabelLarge>
                  <DataText label={intl.aaregContractNumber} text={a.avtalenummer || ''} />
                  <DataText label={intl.createdDate} text={a.opprettet} />
                  <LabelLarge marginBottom={marginBottom}>{intl.accessType}</LabelLarge>
                  <DataText label={intl.API} text={a.integrert_oppslag_api.toString() || ''} />
                  <DataText label={intl.extract} text={a.uttrekk.toString() || ''} />
                  <DataText label={intl.webLookup} text={a.web_oppslag.toString() || ''} />
                  <DataText label={intl.incidents} text={a.hendelser.toString() || ''} />
                  <LabelLarge marginBottom={marginBottom}>{intl.processor}</LabelLarge>
                  <DataText label={intl.organisationNumber} text={a.databehandler_organisasjonsnummer || ''} />
                  <DataText label={intl.name} text={a.databehandler_navn || ''} />
                </Block>
              </Block>
            </Panel>
          )
        })}
      </StatelessAccordion>

      <Block display="flex" justifyContent="space-between" marginTop="1rem">
        <StatefulPopover
          placement={PLACEMENT.bottom}
          content={({close}) => (
            <StatefulMenu
              items={[5, 10, 20, 50, 100].map(i => ({label: i,}))}
              onItemSelect={({item}) => {
                setPageLimit(item.label)
                close()
              }}
              overrides={{
                List: {
                  style: {height: '150px', width: '100px'},
                },
              }}
            />
          )}>
          <div><Button kind={KIND.tertiary} iconEnd={faChevronDown}>{`${pageLimit} ${intl.rows}`}</Button></div>
        </StatefulPopover>
        <Pagination
          currentPage={page}
          numPages={Math.ceil(props.aaregAvtaler.length / pageLimit)}
          onPageChange={a => setPage(a.nextPage)}
          labels={{nextButton: intl.nextButton, preposition: intl.of, prevButton: intl.prevButton}}
        />
      </Block>
    </>
  )
}

export default AaregAvtaleTable
