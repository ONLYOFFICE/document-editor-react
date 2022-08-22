type Config = {
    document: Document;
    documentType: string;
    editorConfig?: EditorConfig;
    height?: string;
    token?: string;
    type?: string;
    width?: string;
}

type Document = {
    fileType: string;
    key?: string;
    title: string;
    permissions?: Permissions;
    url: string;
};

type Permissions = {
    comment?: boolean;
    download?: boolean;
    edit?: boolean;
    review?: boolean;
}

type EditorConfig = {
    callbackUrl?: string;
    lang?: string,
    mode?: string;
    user?: User;
}

type User = {
    id?: string;
    name?: string;
}

export default Config;