import { useState } from 'react';

import { DocumentEditor } from '@onlyoffice/document-editor-react';
import type { Config } from '@onlyoffice/doceditor-types';

declare global {
  interface Window {
    __e2eEvents__?: string[];
    __e2eErrors__?: Array<{ errorCode: number; errorDescription: string }>;
  }
}

const config: Config = {
  document: {
    fileType: 'docx',
    key: 'e2e-test-key',
    title: 'e2e-test-document.docx',
    url: 'http://e2e-document-server.test/e2e-test-document.docx',
  },
  documentType: 'word',
  editorConfig: {
    callbackUrl: 'http://e2e-document-server.test/callback',
  },
  events: {
    onAppReady: () => {
      (window.__e2eEvents__ ??= []).push('appReady');
    },
  },
};

const onLoadComponentError = (errorCode: number, errorDescription: string) => {
  (window.__e2eErrors__ ??= []).push({ errorCode, errorDescription });
};

export const changedDocumentKey = 'e2e-changed-key';

export default function App() {
  const [mounted, setMounted] = useState(true);
  const [documentKey, setDocumentKey] = useState(config.document!.key!);

  return (
    <>
      <button data-testid="toggle-editor" onClick={() => setMounted((value) => !value)}>
        {mounted ? 'unmount' : 'mount'}
      </button>
      <button data-testid="change-key" onClick={() => setDocumentKey(changedDocumentKey)}>
        change key
      </button>
      {mounted && (
        <DocumentEditor
          id="e2e-editor"
          documentServerUrl="http://e2e-document-server.test/"
          config={{ ...config, document: { ...config.document!, key: documentKey } }}
          onLoadComponentError={onLoadComponentError}
        />
      )}
    </>
  );
}
