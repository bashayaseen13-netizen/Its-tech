import OpenAI from "openai";

export type Source={title:string;url:string;type:string;summary:string;claims:string[]};
export type Dossier={topic:string;sourceCount:number;sources:Source[];agreements:string[];disagreements:string[];gaps:string[];angles:string[];selectedAngle:string;practicalTakeaways:string[]};

const rules=`You are the research and editorial engine for Its-tech. Do not rewrite or imitate other publications. Build independent synthesis from evidence. Separate facts, interpretation and opinion. Never fabricate testing, quotes, benchmarks, sources or first-person experience. Prefer primary sources. Surface disagreements and uncertainty. Avoid generic AI introductions, hype and filler.`;

async function ask(input:string, search=true){
 const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
 const response=await client.responses.create({model:process.env.OPENAI_MODEL||"gpt-5.5",tools:search?[{type:"web_search",search_context_size:"high"}]:[],input:[{role:"system",content:rules},{role:"user",content:input}]});
 return response.output_text;
}

export async function buildResearchDossier(topic:string):Promise<Dossier>{
 const raw=await ask(`Research this technology topic deeply: ${topic}

Perform live web research. Seek roughly 8-15 useful sources when available. Prioritize official manufacturer/regulator/company documents, reputable technical publications, independent reviews and reporting. Compare sources rather than merely summarizing one.

Return ONLY valid JSON with this shape:
{"sources":[{"title":"","url":"","type":"primary|review|news|analysis|other","summary":"","claims":["..."]}],"agreements":["..."],"disagreements":["..."],"gaps":["..."],"angles":["..."],"selectedAngle":"...","practicalTakeaways":["..."]}

Do not invent URLs. Every source URL must be a URL actually retrieved. Make disagreements specific and identify what evidence is behind them.`);
 try{const x=JSON.parse(raw);return{topic,sourceCount:x.sources?.length||0,sources:x.sources||[],agreements:x.agreements||[],disagreements:x.disagreements||[],gaps:x.gaps||[],angles:x.angles||[],selectedAngle:x.selectedAngle||"",practicalTakeaways:x.practicalTakeaways||[]}}catch{throw new Error("Research model did not return valid structured data")}
}

export async function generateArticle(dossier:Dossier){return ask(`Write an original technology article using this research dossier.

${JSON.stringify(dossier,null,2)}

Rules:
- Use the selected angle, not a generic product summary.
- Explain what matters, why, trade-offs and who should care.
- Do not claim personal testing unless the dossier explicitly proves it.
- Do not copy any source's wording, structure or argument order.
- Attribute important source-derived facts naturally.
- Preserve uncertainty and disagreements.
- Avoid SEO filler and AI clichés.
- Make the prose sound like a thoughtful human technology publication.
- Finish with a concise useful takeaway.
- Include a Sources section using only the URLs in the dossier.` ,false)}
