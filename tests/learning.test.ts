import {describe,it,expect} from 'vitest';
import {DAY,initialState,statusFor,addAttempt} from '@/lib/learning';
import {parseBackup,parseSnapshot} from '@/lib/storage';
import {lessons} from '@/content/lessons';
import {topics,curriculum} from '@/lib/curriculum';
import type {Attempt} from '@/lib/types';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {extractReportQuestions} from '@/lib/private-report';
import {validateEndpoint,feedbackPayload} from '@/lib/providers';
const evidence=(questionId:string,at:number,format:Attempt['format']='choice',correct=true):Attempt=>({id:questionId+at,topicId:'topic-02',questionId,at,format,correct});
describe('curriculum import and lesson content',()=>{
 it('retains every original nonempty source line, ordered, without changing its text',()=>{const raw=readFileSync('docs/syllabus.txt','utf8');const source=raw.split(/\r?\n/).map((text,index)=>({text,line:index+1})).filter(x=>x.text.trim());expect(curriculum.inventory.map(({text,line})=>({text,line}))).toEqual(source);expect(createHash('sha256').update(raw).digest('hex')).toBe(curriculum.source.sha256);expect(curriculum.phases).toHaveLength(17);expect(topics).toHaveLength(61);expect(new Set(curriculum.inventory.map(x=>x.id)).size).toBe(source.length);});
 it('has one bilingual case lesson for every original section with valid quiz keys and prerequisites',()=>{expect(lessons).toHaveLength(61);expect(new Set(lessons.map(l=>l.id))).toEqual(new Set(topics.map(t=>t.id)));for(const l of lessons){for(const field of [l.intro,l.mechanism,l.judgment,l.trap,l.exercise,l.solution,l.question,l.followup]){expect(field.en.length).toBeGreaterThan(5);expect(field.az.length).toBeGreaterThan(5)}for(const choice of l.choices){expect(choice.en.trim()).not.toBe('');expect(choice.az.trim()).not.toBe('');}expect(l.choices[l.correct]).toBeDefined();expect(l.code.length).toBeGreaterThan(30);for(const id of l.prerequisites)expect(topics.some(t=>t.id===id)).toBe(true);}});
});
describe('mastery evidence and scheduling',()=>{
 it('never marks reading or repeated identical correct answers as mastery',()=>{const progress={'topic-02':{openedAt:1,readAt:2}};expect(statusFor('topic-02',progress,[])).toBe('learning');const a=[evidence('same',10),evidence('same',20),evidence('same',8*DAY)];expect(statusFor('topic-02',progress,a)).not.toBe('mastered');});
 it('requires distinct questions, multiple formats and retention over time',()=>{const early=[evidence('a',10),evidence('b',20,'prediction'),evidence('c',30)];expect(statusFor('topic-02',{},early)).toBe('interview-ready');expect(statusFor('topic-02',{},[...early,evidence('a',8*DAY,'review')])).toBe('mastered');expect(statusFor('topic-02',{},[...early,evidence('a',8*DAY,'review',false)])).toBe('needs-review');});
 it('retains progress and notes when answers schedule a new review',()=>{const state={...initialState,progress:{'topic-02':{openedAt:1,readAt:2,notes:'my reasoning'}}};const next=addAttempt(state,evidence('q',100,'choice',false));expect(next.progress['topic-02'].notes).toBe('my reasoning');expect(next.progress['topic-02'].nextReview).toBe(100+DAY);expect(state.attempts).toHaveLength(0);});
});
describe('persistent private data validation',()=>{
 it('round-trips a valid backup and rejects corrupt or future schemas',()=>{expect(parseBackup(JSON.parse(JSON.stringify(initialState)))).toEqual(initialState);expect(()=>parseBackup({...initialState,schemaVersion:999})).toThrow();expect(()=>parseBackup({...initialState,attempts:[{correct:'true'}]})).toThrow();});
 it('rejects traversal, unknown graph targets and duplicate file identity',()=>{const base={schemaVersion:1,repository:'test',head:'a'.repeat(40),generatedAt:new Date().toISOString(),files:[{path:'A/File.swift',hash:'b'.repeat(64),lines:10,imports:[],declarations:[]}],modules:[{id:'A',files:['A/File.swift'],dependencies:[]}],contributions:[]};expect(parseSnapshot(base).files).toHaveLength(1);expect(()=>parseSnapshot({...base,files:[{...base.files[0],path:'../secret.swift'}]})).toThrow();expect(()=>parseSnapshot({...base,modules:[{...base.modules[0],dependencies:['Unknown']}]})).toThrow();expect(()=>parseSnapshot({...base,files:[base.files[0],base.files[0]]})).toThrow();});
 it('extracts historical questions as inert text and keeps source lines',()=>{const q=extractReportQuestions('#### Q1. Is this TCA?\n\n**Middle answer:** No.\n**Follow-up:** What guarantees exist?\n<script>fetch("https://bad")</script>');expect(q[0].answer).toBe('No.');expect(q[0].line).toBe(1);expect(q[0].raw).toContain('<script>');});
});
describe('optional provider boundaries',()=>{
 it('rejects credentials and insecure remote URLs while supporting local Ollama',()=>{expect(validateEndpoint('http://localhost:11434/api/chat')).toContain('localhost');for(const url of ['http://example.com/chat','https://user:secret@example.com/chat','https://example.com/chat?key=secret'])expect(()=>validateEndpoint(url)).toThrow();});
 it('constructs only the visible practice question and answer, with no private-state argument',()=>{const config={kind:'ollama' as const,endpoint:'http://localhost:11434/api/chat',model:'test'};const payload=feedbackPayload(config,'What is ARC?','Reference ownership.');expect(payload.stream).toBe(false);expect(JSON.parse(payload.messages[1].content)).toEqual({question:'What is ARC?',answer:'Reference ownership.'});expect(JSON.stringify(payload)).not.toContain('snapshot');});
});
