'use client';
import {useMemo} from 'react';
import {ReactFlow,Background,Controls,type Node,type Edge} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {useAcademy} from './provider';
export type GraphNode={id:string;label:string;description:string};
export function Graph({nodes,edges,onSelect}:{nodes:GraphNode[];edges:{source:string;target:string}[];onSelect:(id:string)=>void}){
 const {state}=useAcademy();
 const rfNodes:Node[]=useMemo(()=>nodes.map((n,i)=>({id:n.id,data:{label:n.label},position:{x:(i%3)*220+25,y:Math.floor(i/3)*130+25}})),[nodes]);
 const rfEdges:Edge[]=useMemo(()=>edges.map((e,i)=>({...e,id:`e-${i}`,animated:false})),[edges]);
 return <div className="graph-wrap" role="region" aria-label="Interactive dependency graph"><ReactFlow nodes={rfNodes} edges={rfEdges} onNodeClick={(_,node)=>onSelect(node.id)} colorMode={state.theme} nodesDraggable={false} fitView minZoom={.1} maxZoom={1.5}><Background color={state.theme==='dark'?'#354038':'#c7d1c2'} gap={20}/><Controls showInteractive={false}/></ReactFlow></div>
}
