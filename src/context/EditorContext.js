import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const EditorContext = createContext(null);

// Sample file system structure
const initialFileSystem = {
  id: 'root',
  name: 'project',
  type: 'folder',
  children: [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      children: [
        {
          id: 'index-js',
          name: 'index.js',
          type: 'file',
          language: 'javascript',
          content: `// Welcome to CodeOn!\n// This is your main JavaScript file.\n\nfunction greet(name) {\n  return \`Hello, \${name}! Welcome to CodeOn.\`;\n}\n\nconsole.log(greet('Developer'));`
        },
        {
          id: 'app-js', 
          name: 'App.js',
          type:'file', 
          language:'javascript', 
          content:`import React from "\nfunction App() {\n  returnreact";\n (\n    <div className="App">\n      <h1>Hello World</h1>\n    </div>\n  );\n}\nexport default App;`
        },
        {
          id:'styles-css', 
          name:'styles.css', 
          type:'file', 
          language:'css', 
          content:`/* Main Styles */\nbody {\n  padding: 20px;\n  background-color: #f5f5f5;\n}\nh1 { color: #333; }`
        }
      ]
    },
    {
      id:'public-folder',  
      name:'public',  
      type:'folder',  
      children:[{
         id:"index-html",  
         name:"index.html",  
         type:"file",  
         language:"html",  
         content:"<!DOCTYPE html>\n<html>\n<head>\n  <title>My App</title>\n</head>\n<body>\n  <div id=\"root\"></div>\n</body>\n</html>"
       }]
     },
     {id:"readme-md",name:"README.md",type:"file",language:"markdown",
       content:"# My Project\n\nWelcome to my awesome project!"}
   ]
 };

export function EditorProvider({ children }) {
 const [files] = useState(initialFileSystem);
 const [openFiles , setOpenFiles] = useState([]);
 const [activeFileId , setActiveFileId] = useState(null);
 const [modifiedFiles , setModifiedFiles]=useState({});

 // Find a file by ID in the tree
 const findFileById=(node , targetId)=>{
   if(node.id===targetId)return node;
   if(node.children){
     for(const child of node.children){
       const found=findFileById(child , targetId);
       if(found)return found;
     }
   }
   return null;
 };

 // Open a file in a new tab
 const openFile=(fileId)=>{
   const file=findFileById(files , fileId);
   if(!file||file.type==='folder')return;

   // Check if already open
   if(!openFiles.find(f=>f.id===file.id)){
     setOpenFiles(prev=>[...prev,{...file}]);
   }
   setActiveFileId(fileId);
 };
 
 // Close a tab
 const closeFile=(fileId)=>{
   setOpenFiles(prev=>prev.filter(f=>f.id!==fileId));
   if(activeFileId===fileId){
     setActiveFileId(openFiles.length>1?openFiles[0].id:null);
   }
 };

 // Set active file
 const setActiveFile=(fileId)=>{
   setActiveFileId(fileId);
 };

 // Update file content
 const updateFileContent=(fileId, content)=>{
   setModifiedFiles(prev=>({...prev, [fileId]: true}));
   setOpenFiles(prev=>prev.map(f=>
     f.id===fileId?{...f, content}:f
   ));
 };

 // Save file (clear modified flag)
 const saveFile=(fileId)=>{
   setModifiedFiles(prev=>{
     const newModified={...prev};
     delete newModified[fileId];
     return newModified;
   });
 };

 const value={
   files,
   openFiles,
   activeFileId,
   modifiedFiles,
   openFile,
   closeFile,
   setActiveFile,
   updateFileContent,
   saveFile,
   findFileById
 };

 return(
   <EditorContext.Provider value={value}>
     {children}
   </EditorContext.Provider>
 );
}

export function useEditor(){
  const context=useContext(EditorContext);
  if(!context){
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
}

export default EditorContext;
