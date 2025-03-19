import Header from "../../components/common/header";
import HomeTranslate from "../../components/home-translate";

const Translate = () => {
    return (
        <>
            <Header title="translate" />
            <main>
                <HomeTranslate />
            </main>
        </>
    );
};

export default Translate;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
