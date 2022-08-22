type Config = {
    document: Document;
    documentType: string;
    editorConfig?: EditorConfig;
    token?: string;
}

type Document = {
    fileType: string;
    key?: string;
    title: string;
    url: string;
};

type EditorConfig = {
    callbackUrl?: string;
}

export default Config;