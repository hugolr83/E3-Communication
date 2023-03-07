// eslint-disable-next-line no-use-before-define
import React, { Fragment } from 'react'
import { Typography } from '@material-ui/core'
import '../../App.css'
import LenniLogo from '../../assets/images/lenni-logo.png'
import { ButtonContainer, ButtonText, Categorie, RouteButton, SectionAccordionDetails, SectionAccordionSummary, SectionAccordion, Top, Container, Logo, Icon, Bottom } from './Styled'
import { useRecoilState } from 'recoil'
import { routesState } from './../../Recoil/GlobalState'
import { Section } from '../../Api/Core/Interfaces'
import ExpandMoreSharpIcon from '@material-ui/icons/ExpandMoreSharp'
import { useHistory, useLocation } from 'react-router-dom'

const Navbar = () => {
  // eslint-disable-next-line no-unused-vars
  const [routes, _] = useRecoilState(routesState)
  const history = useHistory()
  const location = useLocation()

  const handleChangeRoute = (link: string) => {
    if (link !== '') {
      history.push(link)
    }
  }

  // this should be in the global state, reduced from a selectors of routes for example.

  const checkActiveSection = (section: Section) => {
    const pathroot = location.pathname.split('/')[2]
    if (pathroot === section.text.toLowerCase()) { return true }
    if (pathroot === undefined && section.text.toLowerCase() === 'dashboard') { return true }
    return false
  }

  const checkActiveRoute = (section: Section) => {
    const pathsub = location.pathname.split('/')[3]
    if (pathsub !== undefined) { return false }
    return checkActiveSection(section)
  }

  const checkActiveSubRoute = (sous: any) => {
    const pathroot = location.pathname.split('/')[2]
    if (pathroot !== sous.link.split('/')[2]) { return false }
    const pathsub = location.pathname.split('/')[3]
    if (pathsub === undefined) { return false }
    if (pathsub.toLowerCase() === sous.text.toLowerCase().replace(/\s/g, '')) { return true }
    return false
  }

  return (
    <Container>
      <Top>
        <Logo href="#">
          <Icon src={LenniLogo} />
          <Typography variant="h5">Lenni-app</Typography>
        </Logo>
      </Top>
      <Bottom>
        {
          routes.all.map((route, index) =>
            <Fragment key={index}>
              {route.categorie &&
                <Categorie>{route.categorie}</Categorie>
              }
              <Fragment>
                {route.sections.map((section, index) =>
                  <ButtonContainer selected={checkActiveSection(section)} key={index}>
                    { !section.sub
                      ? (
                        <RouteButton
                          onClick={() => handleChangeRoute(section.link)}
                          key={index}
                          color="secondary"
                          startIcon={section.icon}
                        >
                          <ButtonText selected={checkActiveRoute(section)}>{section.text}</ButtonText>
                        </RouteButton>
                      )
                      : (
                        <SectionAccordion elevation={0}>
                          <SectionAccordionSummary
                            expandIcon={<ExpandMoreSharpIcon color="secondary" fontSize="small" />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <RouteButton
                              key={index}
                              startIcon={section.icon}
                            >
                              <ButtonText selected={false}>{section.text}</ButtonText>
                            </RouteButton>
                          </SectionAccordionSummary>
                            {section.sub && section.sub.map((sous, index) =>
                              <SectionAccordionDetails>
                                <RouteButton
                                  onClick={() => handleChangeRoute(sous.link)}
                                  key={index}
                                  color="secondary"
                                >
                                  <ButtonText selected={checkActiveSubRoute(sous)}>{sous.text}</ButtonText>
                                </RouteButton>
                              </SectionAccordionDetails>
                            )}
                        </SectionAccordion>
                      )
                    }
                  </ButtonContainer>
                )}
              </Fragment>
            </Fragment>
          )
        }
      </Bottom>
    </Container>
  )
}

export default Navbar
