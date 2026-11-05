'use client';
import Editor,{loader} from '@monaco-editor/react';
loader.config({paths:{vs:(process.env.NEXT_PUBLIC_BASE_PATH||'')+'/monaco/vs'}});
export default function SwiftEditor({value,onChange,theme}:{value:string;onChange:(value:string)=>void;theme:'light'|'dark'}){return <Editor height="390px" language="swift" theme={theme==='dark'?'vs-dark':'light'} value={value} onChange={v=>onChange(v||'')} loading={<p className="notice">Loading local editor assets…</p>} options={{fontSize:13,minimap:{enabled:false},padding:{top:20},scrollBeyondLastLine:false,wordWrap:'on',automaticLayout:true,accessibilitySupport:'on'}}/>}
