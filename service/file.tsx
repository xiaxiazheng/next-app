import { getFetch, postFetch } from ".";

export interface FileType {
    cTime: string;
    file_id: string;
    filename: string;
    originalname: string;
    other_id: string;
    type: string;
    username: string;
    size: string;
}

export interface FType extends FileType {
    fileUrl: string;
}

export const getFileListByOtherId = async (otherId: string, username: string): Promise<FileType[] | boolean> => {
    const res = await getFetch(`/file/getFileListByOtherId?otherId=${otherId}&username=${username}`);
    if (res) {
        const data = await res.json();
        return data.data;
    } else {
        return false;
    }
};
