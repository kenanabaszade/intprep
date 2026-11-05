import {Suspense} from 'react';
import {Playground} from '@/components/playground';
export default function Page(){return <Suspense fallback={<p>Loading playground…</p>}><Playground/></Suspense>}
