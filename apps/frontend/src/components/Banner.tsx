import * as React from "react";
import { Block, BlockProps } from "baseui/block";
import { Heading, HeadingLevel } from "baseui/heading";
import { Paragraph3 } from "baseui/typography";

type BannerProps = {
    title: string | any | null;
};

const bannerBlockProps: BlockProps = {
    backgroundColor: "mono200",
    width: "100vw",
    left: "calc(-50vw + 50%)",
    position: "relative",
    padding: "1rem",
    marginBottom: "2rem"
};

const bannerContentProps: BlockProps = {
    width: "80%",
    margin: "0 auto",
    display: 'flex',
};

const Banner = ({ title }: BannerProps) => {
    return (
        <Block {...bannerBlockProps}>
            <Block {...bannerContentProps} justifyContent="center">
                <HeadingLevel>
                    <Heading styleLevel={5}>{title}</Heading>
                </HeadingLevel>
            </Block>
        </Block>
    );
};

export default Banner;