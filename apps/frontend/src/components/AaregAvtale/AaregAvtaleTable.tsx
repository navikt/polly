import React, {useEffect, useState} from 'react'
import {AaregAvtale} from '../../constants'
import {PLACEMENT, StatefulPopover} from 'baseui/popover'
import {StatefulMenu} from 'baseui/menu'
import {Block} from 'baseui/block'
import {intl, theme} from '../../util'
import Button from '../common/Button'
import {KIND} from 'baseui/button'
import {faChevronDown, faChevronRight} from '@fortawesome/free-solid-svg-icons'
import {Pagination} from 'baseui/pagination'
import {HeadingLarge, LabelLarge} from 'baseui/typography'
import {Panel, StatelessAccordion} from 'baseui/accordion'
import DataText from "../common/DataText";
import AAregHjemmelDataText from './AAregHjemmelDataText'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

type AaregAvtaleTableProps = {
  aaregAvtaler: AaregAvtale[]
}

const marginBottom = "1rem"
const marginTop = "2rem"

const CustomPanelLabel = ({ text }: { text: any }) => {
  return (
    <Block width="100%" marginBottom={marginBottom} $style={{ boderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'grey' }}>
      <LabelLarge marginTop={marginTop}>{text}</LabelLarge>
    </Block>
  )
}

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
        onChange={({ expanded }) => {
          setSelectedAaregAvtale(expanded[0] as string)
        }}
        expanded={selectedAaregAvtale ? [selectedAaregAvtale] : []}
      >
        {sortedAaregAvtale && sortedAaregAvtale.map(a => {
          const expanded = selectedAaregAvtale === a.avtalenummer
          return (
            <Panel
              key={a.avtalenummer}
              title={
                <Block width="100%">
                  <LabelLarge color={theme.colors.primary}>
                    {expanded ?
                      <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />}
                    <span> </span>
                    <span>{a.virksomhet} - ({intl.aaregContractNumber}-{a.avtalenummer.replace('AVT-', '')})</span>
                  </LabelLarge>
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
                  <CustomPanelLabel text={intl.consumer} />
                  <DataText label={intl.name} text={a.virksomhet || intl.emptyMessage} />
                  <DataText label={intl.organisationNumber} text={a.organisasjonsnummer || intl.emptyMessage} />

                  <CustomPanelLabel text={intl.contractAareg} />
                  <DataText label={intl.aaregContractNumber} text={a.avtalenummer || intl.emptyMessage} />
                  <DataText label={intl.createdDate} text={a.opprettet || intl.emptyMessage} />

                  <CustomPanelLabel text={intl.purposeAuthorityLegalBasis} />

                  <AAregHjemmelDataText data={a.hjemmel_behandlingsgrunnlag_formal} />

                  <CustomPanelLabel text={intl.accessType} />
                  <DataText label={intl.API} text={a.integrert_oppslag_api.toString() || ''} />
                  <DataText label={intl.extract} text={a.uttrekk.toString() || ''} />
                  <DataText label={intl.webLookup} text={a.web_oppslag.toString() || ''} />
                  <DataText label={intl.incidents} text={a.hendelser.toString() || ''} />

                  <CustomPanelLabel text={intl.processor} />
                  <DataText label={intl.organisationNumber} text={a.databehandler_organisasjonsnummer || intl.emptyMessage} />
                  <DataText label={intl.name} text={a.databehandler_navn || intl.emptyMessage} />
                </Block>
              </Block>
            </Panel>
          )
        })}
      </StatelessAccordion>

      <Block display="flex" justifyContent="space-between" marginTop="1rem">
        <StatefulPopover
          placement={PLACEMENT.bottom}
          content={({ close }) => (
            <StatefulMenu
              items={[5, 10, 20, 50, 100].map(i => ({ label: i, }))}
              onItemSelect={({ item }) => {
                setPageLimit(item.label)
                close()
              }}
              overrides={{
                List: {
                  style: { height: '150px', width: '100px' },
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
          labels={{ nextButton: intl.nextButton, preposition: intl.of, prevButton: intl.prevButton }}
        />
      </Block>
    </>
  )
}

export default AaregAvtaleTable
