import * as React from 'react'
import { CodeUsage } from '../../constants'
import RouteLink from '../common/RouteLink'
import { Block } from 'baseui/block'
import { useStyletron } from 'baseui'
import { Accordion, Panel } from 'baseui/accordion'
import { ListItem, ListItemLabel } from 'baseui/list'
import { intl, theme } from '../../util'
import { codelist, ListName } from '../../service/Codelist'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { Heading, HeadingLevel } from 'baseui/heading'
import { useQueryParam } from '../../util/hooks'
import { ParagraphLarge } from 'baseui/typography'
import { toggleOverride } from '../common/Accordion'

type InformationTypeAccordionProps = {
  categoryUsages: CodeUsage[] | undefined
}

const ListCategoryInformationtype = ({ categoryUsages }: InformationTypeAccordionProps) => {
  const [css] = useStyletron()
  const category = useQueryParam('category')
  const categoryNotInUse = !!category && !categoryUsages?.filter((c) => c.code === category).flatMap((u) => u.informationTypes).length

  const panelList = () => {
    if (!categoryUsages) return
    return categoryUsages
      .filter((categoryUsage) => categoryUsage.informationTypes.length > 0)
      .sort((a, b) => codelist.getShortname(a.listName, a.code).localeCompare(codelist.getShortname(b.listName, b.code), intl.getLanguage()))
      .map((categoryUsage) => {
        return (
          <Panel
            title={
              <Block display="flex" width="100%">
                <Block minWidth="80%">{codelist.getShortname(ListName.CATEGORY, categoryUsage.code)}</Block>
                <Block
                  marginRight="50px"
                  minWidth="20%"
                  overrides={{
                    Block: {
                      style: {
                        opacity: '0.5',
                        color: '#545454',
                        fontSize: '.9rem',
                      },
                    },
                  }}
                >
                  {intl.informationTypes}: {categoryUsage.informationTypes.length}
                </Block>
              </Block>
            }
            overrides={{
              Content: {
                style: {
                  backgroundColor: 'transparent',
                  paddingLeft: '0',
                  paddingRight: '0',
                },
              },
              ToggleIcon: toggleOverride,
            }}
            key={categoryUsage.code}
          >
            <ul
              className={css({
                paddingLeft: 0,
                paddingRight: 0,
              })}
            >
              {categoryUsage.informationTypes
                .sort((a, b) => a.name.localeCompare(b.name, intl.getLanguage()))
                .map((informationType) => {
                  return (
                    <ListItem
                      overrides={{
                        Content: {
                          style: {
                            height: '40px',
                          },
                        },
                        ArtworkContainer: {},
                        EndEnhancerContainer: {},
                        Root: {},
                      }}
                      key={informationType.id}
                    >
                      <ListItemLabel>
                        <RouteLink href={`/informationtype/${informationType.id}`}>{informationType.name}</RouteLink>
                      </ListItemLabel>
                    </ListItem>
                  )
                })}
            </ul>
          </Panel>
        )
      })
  }

  return (
    <>
      {categoryNotInUse && (
        <ParagraphLarge marginBottom={theme.sizing.scale1200}>
          <FontAwesomeIcon icon={faExclamationTriangle} color={theme.colors.negative400} />
          <Block marginRight={theme.sizing.scale200} display="inline" />
          {intl.formatString(intl.categoryNotInUse, codelist.getShortname(ListName.CATEGORY, category!))}
        </ParagraphLarge>
      )}

      <Block>
        <HeadingLevel>
          <Heading styleLevel={5} paddingLeft="20px">
            {intl.categories}
          </Heading>
        </HeadingLevel>
        <Accordion initialState={{ expanded: category ? [category] : [] }}>{panelList()}</Accordion>
      </Block>
    </>
  )
}

export default ListCategoryInformationtype
