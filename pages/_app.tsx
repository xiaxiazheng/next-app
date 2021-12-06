import { AppProps } from "next/app";
import "../styles/global.scss";
import AffixHome from "../components/affix/affix-home";

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <AffixHome />
        </>
    );
}

export default App;
