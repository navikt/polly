import {intl, theme, useAwait} from '../util'
import {Code, codelist, ListName} from '../service/Codelist'
import {H4, Label1} from 'baseui/typography'
import React from 'react'
import {Block} from 'baseui/block'
import {FlexGrid, FlexGridItem} from 'baseui/flex-grid'
import RouteLink from '../components/common/RouteLink'
import {primitives} from '../util/theme'
import {Button, KIND, SIZE as ButtonSize} from 'baseui/button';
import {Plus} from 'baseui/icon';
import {user} from '../service/User';
import ModalProcess from '../components/Purpose/Accordion/ModalProcess';
import {ProcessFormValues} from '../constants';
import {convertProcessToFormValues, createProcess} from '../api';

export const PurposeListPage = () => {
  useAwait(codelist.wait())

  const hasAccess = () => user.canWrite();
  const [showCreateProcessModal, setShowCreateProcessModal] = React.useState(false)
  const [errorProcessModal, setErrorProcessModal] = React.useState(null)


  const handleCreateProcess = async (process: ProcessFormValues) => {
    if (!process) return
    try {
      createProcess(process)
      setErrorProcessModal(null)
      setShowCreateProcessModal(false)
    } catch (err) {
      setErrorProcessModal(err.message)
    }
  }

  const codes = codelist.getCodes(ListName.PURPOSE)
    .sort((a, b) => a.shortName.localeCompare(b.shortName))
    .reduce((acc, cur) => {
      const letter = cur.shortName.toUpperCase()[0]
      acc[letter] = [...(acc[letter] || []), cur]
      return acc
    }, {} as { [letter: string]: Code[] })

  return (
    <>
      <H4>{intl.processingActivities}</H4>

      <Block display={'flex'} width={'100%'}  justifyContent={"space-between"}>
        <Block>
          <Label1>{intl.purposeSelect}</Label1>
        </Block>
        <Block marginTop={"auto"}>
          {hasAccess() && (
            <Button
              size={ButtonSize.compact}
              kind={KIND.minimal}
              onClick={() => setShowCreateProcessModal(true)}
              startEnhancer={() => <Block display='flex' justifyContent='center'><Plus size={22}/></Block>}
            >
              {intl.processingActivitiesNew}
            </Button>
          )}
        </Block>
      </Block>

      <Block marginBottom={theme.sizing.scale800}/>

      <ModalProcess
        title={intl.processingActivitiesNew}
        onClose={() => setShowCreateProcessModal(false)}
        isOpen={showCreateProcessModal}
        submit={(values: ProcessFormValues) => handleCreateProcess(values)}
        errorOnCreate={errorProcessModal}
        isEdit={false}
        initialValues={convertProcessToFormValues({purposeCode: ''})}
      />

      {Object.keys(codes).map(letter =>
        <Block key={letter} marginBottom={theme.sizing.scale800}>

          <Block display='flex' alignItems='center' marginBottom={theme.sizing.scale800}>
            <Block
              width={theme.sizing.scale900}
              height={theme.sizing.scale900}
              backgroundColor={primitives.primary150}
              $style={{borderRadius: '50%'}}
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <Label1 $style={{fontSize: '1.2em'}}>{letter}</Label1>
            </Block>

            <Block marginBottom={theme.sizing.scale800} marginRight={theme.sizing.scale400}/>
            <Block width='100%' $style={{borderBottomStyle: 'solid', borderBottomColor: theme.colors.mono500, borderBottomWidth: '2px'}}/>
          </Block>

          <FlexGrid flexGridRowGap={theme.sizing.scale600} flexGridColumnGap={theme.sizing.scale600} flexGridColumnCount={4}>
            {codes[letter].map(code =>
              <FlexGridItem key={code.code}>
                <RouteLink href={`/process/purpose/${code.code}`}>
                  {code.shortName}
                </RouteLink>
              </FlexGridItem>
            )}
          </FlexGrid>

        </Block>
      )}
    </>
  )
}
