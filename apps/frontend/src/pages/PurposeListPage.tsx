import { intl, theme } from '../util'
import { HeadingXXLarge, LabelLarge } from 'baseui/typography'
import { Block } from 'baseui/block'
import { SIZE as ButtonSize } from 'baseui/button'
import { Plus } from 'baseui/icon'
import { user } from '../service/User'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import { PurposeList } from './ListSearchPage'

export const PurposeListPage = () => {
  const navigate = useNavigate()
  const hasAccess = () => user.canWrite()

  return (
    <Block overrides={{ Block: { props: { role: 'main' } } }}>
      <>
        <HeadingXXLarge>{intl.processingActivities}</HeadingXXLarge>

        <Block display={'flex'} width={'100%'} justifyContent={'space-between'}>
          <Block>
            <LabelLarge>{intl.purposeSelect}</LabelLarge>
          </Block>

          <Block marginTop={'auto'}>
            {hasAccess() && (
              <Button
                size={ButtonSize.compact}
                kind={'outline'}
                onClick={() => navigate("/process/new")}
                startEnhancer={
                  <Block display="flex" justifyContent="center">
                    <Plus size={22} />
                  </Block>
                }
              >
                {intl.processingActivitiesNew}
              </Button>
            )}
          </Block>
        </Block>

        <Block marginBottom={theme.sizing.scale800} />

        <PurposeList />
      </>
    </Block>
  )
}
