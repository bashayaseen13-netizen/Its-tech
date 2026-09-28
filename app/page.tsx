"use client";

import { useState } from "react";

type Source={title:string;url:string;type:string;summary:string;claims:string[]};
type Dossier={topic:string;sourceCount:number;sources:Source[];agreements:string[];disagreements:string[];gaps:string[];angles:string[];selectedAngle:string;practicalTakeaways:string[]};

export default function Home(){
 const [topic,setTopic]=useState(""); const [loading,setLoading]=useState(false); const [dossier,setDossier]=useState<Dossier|null>(null); const [article,setArticle]=useState(""); const [error,setError]=useState("");
 async function research(){if(!topic.trim())return;setLoading(true);setError("");setArticle("");try{const r=await fetch("/api/research",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic})});const d=await r.json();if(!r.ok)throw Error(d.error);setDossier(d)}catch(e){setError(e instanceof Error?e.message:"Research failed")}finally{setLoading(false)}}
 async function generate(){if(!dossier)return;setLoading(true);setError("");try{const r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({dossier})});const d=await r.json();if(!r.ok)throw Error(d.error);setArticle(d.article)}catch(e){setError(e instanceof Error?e.message:"Generation failed")}finally{setLoading(false)}}
 return <main className="shell"><header><small>ITS-TECH / EDITORIAL ENGINE</small><h1>Research first.<br/>Write independently.</h1><p>Turn a technology topic into a source-aware research dossier, then into an original editorial draft.</p></header>
 <section className="card"><label>Story topic</label><div className="row"><input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. iPhone 17 Pro battery life" onKeyDown={e=>e.key==="Enter"&&research()}/><button onClick={research} disabled={loading||!topic.trim()}>{loading?"Working…":"Research"}</button></div>{error&&<p className="error">{error}</p>}</section>
 {dossier&&<><section className="grid"><div className="card"><h2>Research dossier <span>{dossier.sourceCount} sources</span></h2><p><b>Selected angle:</b> {dossier.selectedAngle}</p><h3>Agreement</h3><ul>{dossier.agreements.map((x,i)=><li key={i}>{x}</li>)}</ul><h3>Disagreement</h3><ul>{dossier.disagreements.map((x,i)=><li key={i}>{x}</li>)}</ul><h3>Gaps</h3><ul>{dossier.gaps.map((x,i)=><li key={i}>{x}</li>)}</ul></div><div className="card"><h2>Editorial angles</h2><ol>{dossier.angles.map((x,i)=><li key={i}>{x}</li>)}</ol><h3>Takeaways</h3><ul>{dossier.practicalTakeaways.map((x,i)=><li key={i}>{x}</li>)}</ul><button className="wide" onClick={generate} disabled={loading}>{loading?"Writing…":"Generate article"}</button></div></section>
 <section className="card"><h2>Sources</h2><div className="sources">{dossier.sources.map((s,i)=><article key={i}><small>{s.type}</small><h3>{s.title}</h3><p>{s.summary}</p><a href={s.url} target="_blank">{s.url}</a></article>)}</div></section></>}
 {article&&<section className="card"><h2>Draft</h2><pre>{article}</pre></section>}
 </main>;
}