/*
* (c) Copyright Ascensio System SIA 2026
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import React, { useEffect, useRef } from "react";
import loadScript from "./utils/loadScript";
import cloneDeep from "lodash/cloneDeep";
import type { Config, DocEditor } from "@onlyoffice/doceditor-types";

declare global {
  interface Window {
    DocsAPI?: {
      DocEditor: (id: string, config: Config) => DocEditor;
    };
    DocEditor?: {
      instances: Record<string, DocEditor | undefined>;
    };
  }
}

export type DocumentEditorProps = {
  id: string;

  documentServerUrl: string;
  shardkey?: string | boolean;

  config: Config;

  /**
   * @deprecated Use `config.document.fileType` instead.
   */
  document_fileType?: string;
  /**
   * @deprecated Use `config.document.title` instead.
   */
  document_title?: string;
  /**
   * @deprecated Use `config.documentType` instead.
   */
  documentType?: string;
  /**
   * @deprecated Use `config.editorConfig.lang` instead.
   */
  editorConfig_lang?: string;
  /**
   * @deprecated Use `config.height` instead.
   */
  height?: string;
  /**
   * @deprecated Use `config.type` instead.
   */
  type?: string;
  /**
   * @deprecated Use `config.width` instead.
   */
  width?: string;

  onLoadComponentError?: (errorCode: number, errorDescription: string) => void;

  /**
   * @deprecated Use `config.events.onAppReady` instead.
   */
  events_onAppReady?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onDocumentStateChange` instead.
   */
  events_onDocumentStateChange?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onMetaChange` instead.
   */
  events_onMetaChange?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onDocumentReady` instead.
   */
  events_onDocumentReady?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onInfo` instead.
   */
  events_onInfo?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onWarning` instead.
   */
  events_onWarning?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onError` instead.
   */
  events_onError?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onRequestSharingSettings` instead.
   */
  events_onRequestSharingSettings?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onRequestRename` instead.
   */
  events_onRequestRename?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onMakeActionLink` instead.
   */
  events_onMakeActionLink?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onRequestInsertImage` instead.
   */
  events_onRequestInsertImage?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onRequestSaveAs` instead.
   */
  events_onRequestSaveAs?: (event: object) => void;
  /**
   * @deprecated Deprecated since version 7.5, please use `config.events.onRequestSelectSpreadsheet` instead.
   */
  events_onRequestMailMergeRecipients?: (event: object) => void;
  /**
   * @deprecated Deprecated since version 7.5, please use `config.events.onRequestSelectDocument` instead.
   */
  events_onRequestCompareFile?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onRequestEditRights` instead.
   */
  events_onRequestEditRights?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onRequestHistory` instead.
   */
  events_onRequestHistory?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onRequestHistoryClose` instead.
   */
  events_onRequestHistoryClose?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onRequestHistoryData` instead.
   */
  events_onRequestHistoryData?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onRequestRefreshFile` instead.
   */
  events_onRequestRefreshFile?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onRequestRestore` instead.
   */
  events_onRequestRestore?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onRequestSelectSpreadsheet` instead.
   */
  events_onRequestSelectSpreadsheet?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onRequestSelectDocument` instead.
   */
  events_onRequestSelectDocument?: (event: object) => void;
  /**
   * @deprecated Use `config.events.onRequestUsers` instead.
   */
  events_onRequestUsers?: (event: object) => void;
};

const DocumentEditor = (props: DocumentEditorProps) => {
  const {
    id,

    documentServerUrl,
    shardkey = true,

    config,

    document_fileType,
    document_title,
    documentType,
    editorConfig_lang,
    height,
    type,
    width,

    onLoadComponentError,

    events_onAppReady,
    events_onDocumentStateChange,
    events_onMetaChange,
    events_onDocumentReady,
    events_onInfo,
    events_onWarning,
    events_onError,
    events_onRequestSharingSettings,
    events_onRequestRename,
    events_onMakeActionLink,
    events_onRequestInsertImage,
    events_onRequestSaveAs,
    events_onRequestMailMergeRecipients,
    events_onRequestCompareFile,
    events_onRequestEditRights,
    events_onRequestHistory,
    events_onRequestHistoryClose,
    events_onRequestHistoryData,
    events_onRequestRefreshFile,
    events_onRequestRestore,
    events_onRequestSelectSpreadsheet,
    events_onRequestSelectDocument,
    events_onRequestUsers,
  } = props;

  const onLoadRef = useRef<() => void>(() => {});
  const onErrorRef = useRef<(errorCode: number) => void>(() => {});

  useEffect(() => {
    onLoadRef.current = onLoad;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    if (window?.DocEditor?.instances[id]) {
      window.DocEditor.instances[id].destroyEditor();
      window.DocEditor.instances[id] = undefined;

      console.log("Important props have been changed. Load new Editor.");
      onLoad();
    }
  }, [
    documentServerUrl,

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
    let cancelled = false;

    let url = documentServerUrl;
    if (!url.endsWith("/")) url += "/";

    let docsApiUrl = `${url}web-apps/apps/api/documents/api.js`;
    if (shardkey) {
      if (typeof shardkey === "boolean") {
        docsApiUrl += `?shardkey=${config.document?.key}`;
      } else {
        docsApiUrl += `?shardkey=${shardkey}`;
      }
    }

    loadScript(docsApiUrl, "onlyoffice-api-script")
      .then(() => {
        if (cancelled) return;
        onLoadRef.current();
      })
      .catch(() => {
        if (cancelled) return;
        onErrorRef.current(-2);
      });

    return () => {
      cancelled = true;

      if (window?.DocEditor?.instances[id]) {
        window.DocEditor.instances[id].destroyEditor();
        window.DocEditor.instances[id] = undefined;
      }
    };
  }, []);

  const onLoad = () => {
    try {
      if (!window.DocsAPI) {
        onError(-3);
        return;
      }
      if (window?.DocEditor?.instances[id]) {
        console.log("Skip loading. Instance already exists", id);
        return;
      }

      if (!window?.DocEditor?.instances) {
        window.DocEditor = { instances: {} };
      }

      var cloneConfig = cloneDeep(config);

      var propsConfig: any = {
        documentType,
        events: {
          onAppReady: onAppReady,
          onDocumentStateChange: events_onDocumentStateChange,
          onMetaChange: events_onMetaChange,
          onDocumentReady: events_onDocumentReady,
          onInfo: events_onInfo,
          onWarning: events_onWarning,
          onError: events_onError,
          onRequestSharingSettings: events_onRequestSharingSettings,
          onRequestRename: events_onRequestRename,
          onMakeActionLink: events_onMakeActionLink,
          onRequestInsertImage: events_onRequestInsertImage,
          onRequestSaveAs: events_onRequestSaveAs,
          onRequestMailMergeRecipients: events_onRequestMailMergeRecipients,
          onRequestCompareFile: events_onRequestCompareFile,
          onRequestEditRights: events_onRequestEditRights,
          onRequestHistory: events_onRequestHistory,
          onRequestHistoryClose: events_onRequestHistoryClose,
          onRequestHistoryData: events_onRequestHistoryData,
          onRequestRefreshFile: events_onRequestRefreshFile,
          onRequestRestore: events_onRequestRestore,
          onRequestSelectSpreadsheet: events_onRequestSelectSpreadsheet,
          onRequestSelectDocument: events_onRequestSelectDocument,
          onRequestUsers: events_onRequestUsers,
        },
        height,
        type,
        width,
      };

      const document = getDocument();
      const editorConfig = getEditorConfig();

      if (document !== null) {
        propsConfig.document = document;
      }

      if (editorConfig !== null) {
        propsConfig.editorConfig = editorConfig;
      }

      let initConfig = Object.assign(propsConfig, cloneConfig || {});

      const editor = window.DocsAPI.DocEditor(id, initConfig);
      window.DocEditor.instances[id] = editor;
    } catch (err: any) {
      console.error(err);
      onError(-1);
    }
  };

  const getDocument = () => {
    var document: any = null;

    if (document_fileType) {
      document = document || {};
      document.fileType = document_fileType;
    }

    if (document_title) {
      document = document || {};
      document.document_title = document_title;
    }

    return document;
  };

  const getEditorConfig = () => {
    var editorConfig: any = null;

    if (editorConfig_lang) {
      editorConfig = editorConfig || {};
      editorConfig.lang = editorConfig_lang;
    }

    return editorConfig;
  };

  const onError = (errorCode: number) => {
    let message;

    switch (errorCode) {
      case -2:
        message = "Error load DocsAPI from " + documentServerUrl;
        break;
      case -3:
        message = "DocsAPI is not defined";
        break;
      default:
        message = "Unknown error loading component";
        errorCode = -1;
    }

    if (typeof onLoadComponentError == "undefined") {
      console.error(message);
    } else {
      onLoadComponentError(errorCode, message);
    }
  };

  const onAppReady = () => {
    events_onAppReady!(window.DocEditor?.instances[id] || {});
  };

  return (
    <div style={{ display: "contents" }}>
      <div id={id}></div>
    </div>
  );
};

export default DocumentEditor;
