import Header from "../../components/common/header";
import MusicPlayerWrapper from "../../components/music-player-wrapper";

const Music = () => {
    return (
        <>
            <Header title="music" />
            <main>
                <MusicPlayerWrapper />
            </main>
        </>
    );
};

export default Music;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
