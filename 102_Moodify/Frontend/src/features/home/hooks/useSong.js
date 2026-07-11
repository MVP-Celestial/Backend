import { getSong } from "../service/song.api";
import { useContext } from "react";
import { songContext } from "../pages/song.context";

export const useSong = () => {
    const context = useContext(songContext)
    const { loading, setLoading, song, setSong } = context

    async function handleGetSong({ mood }) {
        setLoading(true)
        try {
            const data = await getSong({ mood })
            setSong(data.song)
        } catch (err) {
            setSong(null)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return ({ loading, setLoading, song, setSong, handleGetSong })
}