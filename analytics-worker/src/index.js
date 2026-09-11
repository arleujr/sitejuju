function json(data,status=200,headers={}){
  return new Response(JSON.stringify(data),{
    status,
    headers:{'content-type':'application/json; charset=utf-8',...headers}
  });
}
function corsHeaders(request,env){
  const origin=request.headers.get('Origin')||'';
  const allowed=(env.ALLOWED_ORIGIN||'*').trim();
  const value=allowed==='*'?'*':(origin===allowed?origin:allowed);
  return {
    'access-control-allow-origin':value,
    'access-control-allow-methods':'GET,POST,OPTIONS',
    'access-control-allow-headers':'content-type,authorization',
    'access-control-max-age':'86400',
    'vary':'Origin'
  };
}
function text(value,max=120){return String(value??'').trim().slice(0,max)}
function int(value,min,max){
  const n=Number.parseInt(value,10);
  return Number.isFinite(n)?Math.min(max,Math.max(min,n)):min;
}
async function body(request){
  try{return await request.json()}catch{return {}}
}
function authorized(request,env){
  const header=request.headers.get('Authorization')||'';
  return Boolean(env.ADMIN_TOKEN)&&header===`Bearer ${env.ADMIN_TOKEN}`;
}

export default {
  async fetch(request,env){
    const cors=corsHeaders(request,env);
    if(request.method==='OPTIONS') return new Response(null,{status:204,headers:cors});
    if(!env.DB) return json({error:'D1 binding DB não configurado'},500,cors);

    const url=new URL(request.url);
    const path=url.pathname.replace(/\/$/,'');

    try{
      if(request.method==='POST'&&path==='/api/visit'){
        const data=await body(request);
        const visitId=text(data.visitId,80);
        if(!visitId) return json({error:'visitId obrigatório'},400,cors);
        const recipient=text(data.recipient||'public',80)||'public';
        const device=text(data.device||'unknown',24)||'unknown';
        const pagePath=text(data.path||'/',160)||'/';
        await env.DB.prepare(`
          INSERT INTO visits (visit_id,recipient,device,page_path,first_seen,last_seen)
          VALUES (?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
          ON CONFLICT(visit_id) DO UPDATE SET
            recipient=excluded.recipient,
            device=excluded.device,
            page_path=excluded.page_path,
            last_seen=CURRENT_TIMESTAMP
        `).bind(visitId,recipient,device,pagePath).run();
        return json({ok:true},200,cors);
      }

      if(request.method==='POST'&&path==='/api/progress'){
        const data=await body(request);
        const visitId=text(data.visitId,80);
        if(!visitId) return json({error:'visitId obrigatório'},400,cors);
        const recipient=text(data.recipient||'public',80)||'public';
        const stageIndex=int(data.stageIndex,0,50);
        const stageId=text(data.stageId,60);
        const stageLabel=text(data.stageLabel,100);
        const stageProgress=int(data.stageProgress,0,100);
        const score=int(data.score,0,100000);
        const completed=data.completed?1:0;
        await env.DB.prepare(`
          INSERT INTO visits (
            visit_id,recipient,first_seen,last_seen,max_score,max_stage_index,
            max_stage_id,max_stage_label,max_stage_progress,completed
          ) VALUES (?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,?,?,?,?,?,?)
          ON CONFLICT(visit_id) DO UPDATE SET
            recipient=excluded.recipient,
            last_seen=CURRENT_TIMESTAMP,
            completed=MAX(visits.completed,excluded.completed),
            max_score=MAX(visits.max_score,excluded.max_score),
            max_stage_index=CASE WHEN excluded.max_score>=visits.max_score THEN excluded.max_stage_index ELSE visits.max_stage_index END,
            max_stage_id=CASE WHEN excluded.max_score>=visits.max_score THEN excluded.max_stage_id ELSE visits.max_stage_id END,
            max_stage_label=CASE WHEN excluded.max_score>=visits.max_score THEN excluded.max_stage_label ELSE visits.max_stage_label END,
            max_stage_progress=CASE WHEN excluded.max_score>=visits.max_score THEN excluded.max_stage_progress ELSE visits.max_stage_progress END
        `).bind(visitId,recipient,score,stageIndex,stageId,stageLabel,stageProgress,completed).run();
        return json({ok:true},200,cors);
      }

      if(request.method==='POST'&&path==='/api/vote'){
        const data=await body(request);
        const visitId=text(data.visitId,80);
        const recipient=text(data.recipient||'public',80)||'public';
        const vote=data.vote==='yes'?'yes':data.vote==='no'?'no':'';
        if(!visitId||!vote) return json({error:'voto inválido'},400,cors);
        await env.DB.prepare(`
          INSERT INTO visits (visit_id,recipient,first_seen,last_seen,vote,voted_at,completed)
          VALUES (?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,?,CURRENT_TIMESTAMP,1)
          ON CONFLICT(visit_id) DO UPDATE SET
            recipient=excluded.recipient,
            last_seen=CURRENT_TIMESTAMP,
            vote=excluded.vote,
            voted_at=CURRENT_TIMESTAMP,
            completed=1
        `).bind(visitId,recipient,vote).run();
        return json({ok:true,vote},200,cors);
      }

      if(request.method==='GET'&&path==='/api/admin/summary'){
        if(!authorized(request,env)) return json({error:'não autorizado'},401,cors);
        const recipient=text(url.searchParams.get('recipient')||'',80);
        const where=recipient?'WHERE recipient = ?':'';
        const stmt=env.DB.prepare(`
          SELECT visit_id,recipient,device,page_path,first_seen,last_seen,
                 max_stage_index,max_stage_id,max_stage_label,max_stage_progress,
                 completed,vote,voted_at
          FROM visits ${where}
          ORDER BY datetime(last_seen) DESC
          LIMIT 250
        `);
        const result=recipient?await stmt.bind(recipient).all():await stmt.all();
        const rows=result.results||[];
        const totals=rows.reduce((acc,row)=>{
          acc.visits+=1;
          if(row.completed) acc.completed+=1;
          if(row.vote==='yes') acc.yes+=1;
          if(row.vote==='no') acc.no+=1;
          return acc;
        },{visits:0,completed:0,yes:0,no:0});
        return json({ok:true,totals,visits:rows},200,cors);
      }

      if(path==='/api/health') return json({ok:true},200,cors);
      return json({error:'not found'},404,cors);
    }catch(error){
      console.error(error);
      return json({error:'erro interno'},500,cors);
    }
  }
};
