import React from "react";
import Head from "next/head";

const Header = (props) => {
    const { title } = props;

    return (
        <Head>
            <title>{title}</title>
            <link rel="icon" href="/favicon.ico" />
            {/* <meta
                content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;"
                name="viewport"
            /> */}
        </Head>
    );
};

export default Header;
