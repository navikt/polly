import * as React from "react";
import { Block, BlockProps } from "baseui/block";
import { Heading, HeadingLevel } from "baseui/heading";
import { StyledLink } from "baseui/link";
import { useStyletron } from 'baseui'
import { intl } from '../util/intl/intl'
import { Button } from "baseui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { user } from "../service/User"
import RouteLink from "./common/RouteLink"
import { AuditButton } from "../pages/AuditPage"


type BannerProps = {
    title: string | any | null;
    informationtypeId?: string;
};

const bannerBlockProps: BlockProps = {
    backgroundColor: "mono200",
    width: "100vw",
    left: "calc(-50vw + 50%)",
    position: "relative",
    paddingTop: '1rem',
    paddingBottom: '1rem',
    marginBottom: "2rem",
};

const bannerContentProps: BlockProps = {
    width: "80%",
    margin: "0 auto",
    display: 'flex'
};

const EditInformationtypeButton = (props: { id: string }) => {
    const [useCss, theme] = useStyletron()
    const link = useCss({textDecoration: 'none'});
    return (
        <Block alignSelf="center" marginTop="10px" display="flex">
            <AuditButton id={props.id}/>
            <RouteLink href={`/informationtype/edit/${props.id}`} className={link}>
                <Button size="compact" kind="secondary">
                    <FontAwesomeIcon icon={faEdit}/>
                    <Block marginLeft="10px">{intl.edit}</Block>
                </Button>
            </RouteLink>
        </Block>
    )
}

const Banner = ({title, informationtypeId}: BannerProps) => {
    return (
        <Block {...bannerBlockProps}>
            <Block {...bannerContentProps} justifyContent="space-between">
                <HeadingLevel>
                    <Heading styleLevel={5} marginRight="auto" marginLeft="auto">{title}</Heading>
                </HeadingLevel>
                {user.canWrite() && informationtypeId ? (
                    <EditInformationtypeButton id={informationtypeId}/>
                ) : <Block></Block>}
            </Block>

        </Block>
    );
};

export default Banner;