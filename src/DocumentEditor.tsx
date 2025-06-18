/*
 * (c) Copyright Ascensio System SIA 2025
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

import React, { useEffect } from "react";
import { IConfig } from "./model/config";
import loadScript from "./utils/loadScript";
import cloneDeep from "lodash/cloneDeep";

declare global {
  interface Window {
    DocsAPI?: any;
    DocEditor?: any;
  }
}

export type DocumentEditorProps = {
  id: string;

  documentServerUrl: string;
  shardkey?: string | boolean;

  config: IConfig;

  document_fileType?: string;
  document_title?: string;
  documentType?: string;
  editorConfig_lang?: string;
  height?: string;
  type?: string;
  width?: string;

  onLoadComponentError?: (errorCode: number, errorDescription: string) => void;

  events_onAppReady?: (event: object) => void;
  events_onDocumentStateChange?: (event: object) => void;
  events_onMetaChange?: (event: object) => void;
  events_onDocumentReady?: (event: object) => void;
  events_onInfo?: (event: object) => void;
  events_onWarning?: (event: object) => void;
  events_onError?: (event: object) => void;
  events_onRequestSharingSettings?: (event: object) => void;
  events_onRequestRename?: (event: object) => void;
  events_onMakeActionLink?: (event: object) => void;
  events_onRequestInsertImage?: (event: object) => void;
  events_onRequestSaveAs?: (event: object) => void;
  /**
   * @deprecated Deprecated since version 7.5, please use events_onRequestSelectSpreadsheet instead.
   */
  events_onRequestMailMergeRecipients?: (event: object) => void;
  /**
   * @deprecated Deprecated since version 7.5, please use onRequestSelectDocument instead.
   */
  events_onRequestCompareFile?: (event: object) => void;
  events_onRequestEditRights?: (event: object) => void;
  events_onRequestHistory?: (event: object) => void;
  events_onRequestHistoryClose?: (event: object) => void;
  events_onRequestHistoryData?: (event: object) => void;
  events_onRequestRefreshFile?: (event: object) => void;
  events_onRequestRestore?: (event: object) => void;
  events_onRequestSelectSpreadsheet?: (event: object) => void;
  events_onRequestSelectDocument?: (event: object) => void;
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
      .then(() => onLoad())
      .catch(() => onError(-2));

    return () => {
      if (window?.DocEditor?.instances[id]) {
        window.DocEditor.instances[id].destroyEditor();
        window.DocEditor.instances[id] = undefined;
      }
    };
  }, []);

  const onLoad = () => {
    try {
      if (!window.DocsAPI) onError(-3);
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
    events_onAppReady!(window.DocEditor.instances[id]);
  };

  return <div id={id}></div>;
};

export default DocumentEditor;
