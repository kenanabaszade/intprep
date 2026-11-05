import {topics} from '@/lib/curriculum';
import {LessonView} from '@/components/lesson-view';
export function generateStaticParams(){return topics.map(t=>({topic:t.id}));}
export const dynamicParams=false;
export default async function Page({params}:{params:Promise<{topic:string}>}){const {topic}=await params;return <LessonView id={topic}/>}
