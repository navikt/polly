import * as React from 'react'
import {intl, theme} from '../../util'
import {Block, BlockProps} from 'baseui/block'
import {H6, Paragraph4} from 'baseui/typography'
import {features} from '../../util/feature-toggle'
import NavLogo from '../../resources/navlogo.svg'
import BKLogo from '../../resources/Behandlingskatalog_logo.svg'
import SlackLogo from '../../resources/Slack_Monochrome_White.svg'
import {StyledLink} from 'baseui/link'
import NavItem from './NavItem'

const sideBarProps: BlockProps = {
  position: 'fixed',
  height: '100%',
  width: '240px',
  backgroundColor: theme.colors.primaryA,
}

const items: BlockProps = {
  marginLeft: '1rem',
  paddingLeft: '1rem'
}

const Brand = () => (

    <Block display="flex" flexDirection={"column"} padding="1rem" marginTop="1rem">
      <StyledLink style={{textDecoration: 'none', textAlign: 'center'}} href="/">
        <img src={BKLogo}/>
        <H6 color="white" marginTop="1rem" marginLeft="5px" marginBottom="2rem">Behandlingskatalog</H6>
      </StyledLink>
    </Block>
)

const SideBar = () => {
  return (
    <Block {...sideBarProps}>
      <Brand/>
      <Block {...items}>
        <NavItem to="/process" text={intl.processingActivities}/>
        <NavItem to="/informationtype" text={intl.informationTypes}/>
        <NavItem to="/document" text={intl.documents}/>
        {features.enableThirdParty && <NavItem to="/thirdparty" text={intl.thirdParty}/>}
      </Block>

      <Block position="absolute" bottom="0" width="100%">
        <Block display="flex" justifyContent="center">
          <Block paddingBottom={theme.sizing.scale600} width="40%">
            <img src={NavLogo} alt='NAV logo' width="100%"/>
          </Block>
        </Block>
        <a href="slack://channel?team=T5LNAMWNA&id=CR1B19E6L" style={{textDecoration: 'none'}}>
          <Block display="flex" justifyContent="center" paddingBottom={theme.sizing.scale400} alignItems="center">
            <img src={SlackLogo} width="60px" alt="slack logo"/>
            <Paragraph4 color={theme.colors.white}>#behandlingskatalogen</Paragraph4>
          </Block>
        </a>
      </Block>
    </Block>
  )
}

export default SideBar
