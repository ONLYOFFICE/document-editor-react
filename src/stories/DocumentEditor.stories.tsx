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

import { Meta, StoryObj } from "@storybook/react";
import config from "../config/default.json";
import './stories.css';

import DocumentEditor from "../DocumentEditor";

const meta = {
  title: "DocumentEditor",
  component: DocumentEditor,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ["autodocs"],
  argTypes: {
    documentType: {
      options: ["word", "cell", "slide"],
      control: { type: "select" },
    },
    editorConfig_lang: {
      options: [
        "en", "az", "be", "bg", "ca", "zh", "cs", "da", "nl", "fi",
        "fr", "gl", "de", "el", "hu", "id", "it", "ja", "ko", "lv",
        "lo", "nb", "pl", "pt", "ro", "ru", "sk", "sl", "es", "sv",
        "tr", "uk", "vi"
      ],
      control: { type: "select" },
    },
    type: {
      options: ["desktop", "mobile"],
      control: { type: "select" },
    },
    events_onAppReady: { action: "onAppReady" },
    events_onDocumentStateChange: { action: "onDocumentStateChange" },
    events_onMetaChange: { action: "onMetaChange" },
    events_onDocumentReady: { action: "onDocumentReady" },
    events_onInfo: { action: "onInfo" },
    events_onWarning: { action: "onWarning" },
    events_onError: { action: "onError" },
    events_onRequestSharingSettings: { action: "onRequestSharingSettings" },
    events_onRequestRename: { action: "onRequestRename" },
    events_onMakeActionLink: { action: "onMakeActionLink" },
    events_onRequestInsertImage: { action: "onRequestInsertImage" },
    events_onRequestSaveAs: { action: "onRequestSaveAs" },
    events_onRequestMailMergeRecipients: { action: "onRequestMailMergeRecipients" },
    events_onRequestCompareFile: { action: "onRequestCompareFile" },
    events_onRequestEditRights: { action: "onRequestEditRights" },
    events_onRequestHistory: { action: "onRequestHistory" },
    events_onRequestHistoryClose: { action: "onRequestHistoryClose" },
    events_onRequestHistoryData: { action: "onRequestHistoryData" },
    events_onRequestRestore: { action: "onRequestRestore" }
  },
} as Meta<typeof DocumentEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Document: Story = {
  args: {
    id: "docxEditor",
    documentServerUrl: config.documentServerUrl,
    config: {
      document: {
        fileType: "docx",
        key: "docx" + Math.random(),
        title: "demo.docx",
        url: config.demoStorage + "demo.docx",
      },
      documentType: "word",
    },
  }
};

export const Spreadsheet: Story = {
  args: {
    id: "xlsxEditor",
    documentServerUrl: config.documentServerUrl,
    config: {
      document: {
        fileType: "xlsx",
        key: "xlsx" + Math.random(),
        title: "demo.xlsx",
        url: config.demoStorage + "demo.xlsx",
      },
      documentType: "cell",
    },
  }
};

export const Presentation: Story = {
  args: {
    id: "pptxEditor",
    documentServerUrl: config.documentServerUrl,
    config: {
      document: {
        fileType: "pptx",
        key: "pptx" + Math.random(),
        title: "demo.pptx",
        url: config.demoStorage + "demo.pptx",
      },
      documentType: "slide",
    },
  }
};

export const Form: Story = {
  args: {
    id: "pdfEditor",
    documentServerUrl: config.documentServerUrl,
    config: {
      document: {
        fileType: "pdf",
        key: "pdf" + Math.random(),
        title: "oform.pdf",
        url: config.demoStorage + "oform.pdf",
      },
      documentType: "word",
    },
  }
};
