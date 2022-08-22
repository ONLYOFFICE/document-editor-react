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
};

const DocumentEditor = (props: DocumentEditorProps) => {
  const {
    id,

    documentserverUrl,

    config,
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
        console.log("Skip loading editor. Instance already exists", id);
        return;
      }

      if (!window?.DocEditor?.instances) {
        window.DocEditor = { instances: {} };
      }

      let initConfig = config || {};

      const editor = window.DocsAPI.DocEditor(id, initConfig);
      window.DocEditor.instances[id] = editor;
    } catch (err: any) {
      console.error(err);
    }
  };

  return <div id={id}></div>;
};

DocumentEditor.defaultProps = {
};

export default DocumentEditor;
