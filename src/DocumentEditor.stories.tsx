import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import DocumentEditor from "./DocumentEditor";

export default {
    title: "DocumentEditor",
    component: DocumentEditor,
    parameters: {},
    decorators: [
        (Story) => (
            <div style={{ height: "400px" }}>
                <Story />
            </div>
        ),
    ],
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
        events_onAppReady: { action: 'onAppReady' },
        events_onDocumentReady: { action: 'onDocumentReady' },
        events_onDocumentStateChange: { action: 'onDocumentStateChange' },
        events_onError: { action: 'onError' }
    },
} as ComponentMeta<typeof DocumentEditor>;

const Template: ComponentStory<typeof DocumentEditor> = (args) => <DocumentEditor {...args} />

export const FormTemplate = Template.bind({});
FormTemplate.storyName = "Form";
FormTemplate.args = {
    id: "oformEditor",
    documentserverUrl: "http://documentserver/",
    config: {
        document: {
            fileType: "oform",
            title: "demo.oform",
            url: "https://d2nlctn12v279m.cloudfront.net/assets/docs/samples/demo.oform",
        },
        documentType: "word",
    },
};

export const DocumentTemplate = Template.bind({});
DocumentTemplate.storyName = "Document";
DocumentTemplate.args = {
    id: "docxEditor",
    documentserverUrl: "http://documentserver/",
    config: {
        document: {
            fileType: "docx",
            title: "demo.docx",
            url: "https://d2nlctn12v279m.cloudfront.net/assets/docs/samples/demo.docx",
        },
        documentType: "word",
    },
};

export const SpreadsheetTemplate = Template.bind({});
SpreadsheetTemplate.storyName = "Spreadsheet";
SpreadsheetTemplate.args = {
    id: "xlsxEditor",
    documentserverUrl: "http://documentserver/",
    config: {
        document: {
            fileType: "xlsx",
            title: "demo.xlsx",
            url: "https://d2nlctn12v279m.cloudfront.net/assets/docs/samples/demo.xlsx",
        },
        documentType: "cell",
    },
};

export const PresentationTemplate = Template.bind({});
PresentationTemplate.storyName = "Presentation";
PresentationTemplate.args = {
    id: "pptxEditor",
    documentserverUrl: "http://documentserver/",
    config: {
        document: {
            fileType: "pptx",
            title: "demo.pptx",
            url: "https://d2nlctn12v279m.cloudfront.net/assets/docs/samples/demo.pptx",
        },
        documentType: "slide",
    },
};
