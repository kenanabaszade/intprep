import { openDB } from 'idb';
import { z } from 'zod';
import { initialState } from './learning';
import type { State } from './types';
const progress = z.object({openedAt:z.number().nonnegative(), readAt:z.number().optional(), notes:z.string().max(100000).optional(),nextReview:z.number().optional(),interval:z.number().optional()});
const turn = z.object({questionId:z.string(),question:z.string(),answer:z.string().max(100000),modelAnswer:z.string(),followup:z.string(),scores:z.array(z.number().min(0).max(4)).length(5),at:z.number()});
export const snapshotSchema = z.object({schemaVersion:z.literal(1),repository:z.string().max(300),head:z.string().regex(/^[a-f0-9]{40,64}$/),generatedAt:z.iso.datetime(),authorFilter:z.string().optional(),files:z.array(z.object({path:z.string().max(1000).refine(p=>!p.startsWith('/')&&!p.split(/[\\/]/).includes('..')&&!p.includes('\0')),hash:z.string().regex(/^[a-f0-9]{64}$/),lines:z.number().int().positive(),imports:z.array(z.string()).max(500),declarations:z.array(z.string()).max(1000)})).max(30000),modules:z.array(z.object({id:z.string().max(200),files:z.array(z.string()).max(30000),dependencies:z.array(z.string()).max(1000)})).max(1000),contributions:z.array(z.object({commit:z.string().regex(/^[a-f0-9]{40,64}$/),authorName:z.string(),authorEmail:z.string(),subject:z.string(),date:z.string(),files:z.array(z.string())})).max(5000)}).superRefine((snap,ctx)=>{
 const files=new Set(snap.files.map(f=>f.path)),mods=new Set(snap.modules.map(m=>m.id));
 if(files.size!==snap.files.length||mods.size!==snap.modules.length)ctx.addIssue({code:'custom',message:'Duplicate file or module identities'});
 for(const m of snap.modules){if(m.files.some(f=>!files.has(f))||m.dependencies.some(d=>!mods.has(d)))ctx.addIssue({code:'custom',message:'Invalid module references'});}
});
export const stateSchema = z.object({schemaVersion:z.literal(1),locale:z.enum(['en','az']),theme:z.enum(['dark','light']),progress:z.record(z.string(),progress),attempts:z.array(z.object({id:z.string(),topicId:z.string(),questionId:z.string(),correct:z.boolean(),at:z.number(),format:z.enum(['choice','prediction','review'])})).max(100000),sessions:z.array(z.object({id:z.string(),mode:z.string(),level:z.enum(['junior','middle','senior']),turns:z.array(turn),startedAt:z.number(),endedAt:z.number().optional()})).max(10000),lastTopic:z.string(),ai:z.object({kind:z.enum(['ollama','openai-compatible']),endpoint:z.string().max(1000),model:z.string().max(200)}).optional(),report:z.string().max(5_000_000).optional(),snapshot:snapshotSchema.optional(),privateNotes:z.record(z.string(),z.string()),playground:z.string().optional()});
export function parseBackup(input:unknown):State { return stateSchema.parse(input); }
export function parseSnapshot(input:unknown) { return snapshotSchema.parse(input); }
const db = () => openDB('ios-academy',1,{upgrade(d){ d.createObjectStore('state'); }});
export async function loadState():Promise<State> { const d = await db(); const raw = await d.get('state','current'); return raw ? parseBackup(raw) : {...initialState}; }
export async function saveState(state:State) { const d = await db(); await d.put('state',parseBackup(state),'current'); }
export function downloadJSON(value:unknown,name:string) { const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})); const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000); }
