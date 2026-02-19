import React from 'react';
import { EditorProvider } from './context/EditorContext';
import FileTree from './components/FileTree';
import EditorTabs from './components/EditorTabs';
import CodeEditor from './components/CodeEditor';

function App() {
  return (
    <EditorProvider>
      <div className="app-container">
        <FileTree />
        <div className="editor-area">
          <EditorTabs />
          <CodeEditor />
        </div>
      </div>
    </EditorProvider>
  );
}

export default App;
