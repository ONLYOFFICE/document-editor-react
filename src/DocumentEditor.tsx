import React, { useEffect } from "react";
import loadScript from "./utils/loadScript";

import Config from "./types/Config";

declare global {
  interface Window {
    DocsAPI?: any;
    DocEditor?: any;
  }
}

type DocumentEditorProps = {
  id: string;

  documentserverUrl: string;

  config: Config;

  document_fileType?: string;
  document_title?: string;
  documentType?: string;
  editorConfig_lang?: string,
  height?: string,
  type?: string;
  width?: string;

  events_onAppReady?: (editor: object) => void;
  events_onDocumentReady?: (editor: object) => void;
  events_onDocumentStateChange?: (data: object) => void;
  events_onError?: (error: string) => void;
};

const DocumentEditor = (props: DocumentEditorProps) => {
  const {
    id,

    documentserverUrl,

    config,

    document_fileType,
    document_title,
    documentType,
    editorConfig_lang,
    height,
    type,
    width,

    events_onAppReady,
    events_onDocumentReady,
    events_onDocumentStateChange,
    events_onError,
  } = props;

  useEffect(() => {
    if (window?.DocEditor?.instances[id]) {
      window.DocEditor.instances[id].destroyEditor();
      window.DocEditor.instances[id] = undefined;

      console.log("Important props have been changed. Load new Editor.");
      onLoad();
    }
  }, [
    documentserverUrl,

    JSON.stringify(config),

    document_fileType,
    document_title,
    documentType,
    editorConfig_lang,
    height,
    type,
    width,
  ]);

  useEffect(() => {
    let url = documentserverUrl;
    if (!url.endsWith("/")) url += "/";

    const docApiUrl = `${url}web-apps/apps/api/documents/api.js`;
    loadScript(docApiUrl, "onlyoffice-api-script")
      .then(() => onLoad())
      .catch((err) => console.error(err));

    return () => {
      if (window?.DocEditor?.instances[id]) {
        window.DocEditor.instances[id].destroyEditor();
        window.DocEditor.instances[id] = undefined;
      }
    };
  }, []);

  const onLoad = () => {
    try {
      if (!window.DocsAPI) throw new Error("DocsAPI is not defined");
      if (window?.DocEditor?.instances[id]) {
        console.log("Skip loading. Instance already exists", id);
        return;
      }

      if (!window?.DocEditor?.instances) {
        window.DocEditor = { instances: {} };
      }

      let initConfig = Object.assign({
        document: {
          fileType: document_fileType,
          title: document_title,
        },
        documentType,
        editorConfig: {
          lang: editorConfig_lang,
        },
        events: {
          onAppReady: events_onAppReady,
          onDocumentReady: events_onDocumentReady,
          onDocumentStateChange: events_onDocumentStateChange,
          onError: events_onError,
        },
        height,
        type,
        width,
      }, config || {});

      const editor = window.DocsAPI.DocEditor(id, initConfig);
      window.DocEditor.instances[id] = editor;
    } catch (err: any) {
      console.error(err);
      events_onError!(err);
    }
  };

  return <div id={id}></div>;
};

DocumentEditor.defaultProps = {
  height: "100%",
  width: "100%",
};

export default DocumentEditor;
