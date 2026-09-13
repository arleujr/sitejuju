function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = String(env.ALLOWED_ORIGIN || '*').trim();
  const value = allowed === '*' ? '*' : (origin === allowed ? origin : allowed);
  return {
    'access-control-allow-origin': value,
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type,authorization',
    'access-control-max-age': '86400',
    'vary': 'Origin',
  };
}

function text(value, max = 120) {
  return String(value ?? '').trim().slice(0, max);
}

function int(value, min, max) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
}

async function body(request) {
  try { return await request.json(); } catch { return {}; }
}

function authorized(request, env) {
  const header = request.headers.get('Authorization') || '';
  return Boolean(env.ADMIN_TOKEN) && header === `Bearer ${env.ADMIN_TOKEN}`;
}

function geoFromRequest(request) {
  const cf = request.cf || {};
  return {
    city: text(cf.city, 100),
    region: text(cf.region || cf.regionCode, 100),
    countryCode: text(cf.country, 8).toUpperCase(),
    cfTimezone: text(cf.timezone, 80),
    colo: text(cf.colo, 16),
  };
}

function clientMeta(data) {
  return {
    recipient: text(data.recipient || 'public', 80) || 'public',
    deviceId: text(data.deviceId || data.visitId, 100),
    sessionId: text(data.sessionId, 100),
    deviceClass: text(data.deviceClass || data.device || 'unknown', 30) || 'unknown',
    browser: text(data.browser || 'unknown', 50) || 'unknown',
    os: text(data.os || 'unknown', 50) || 'unknown',
    locale: text(data.locale || '', 40),
    clientTimezone: text(data.timezone || '', 80),
    pagePath: text(data.path || '/', 180) || '/',
    referrer: text(data.referrer || '', 240),
  };
}

async function upsertDevice(env, meta, geo) {
  if (!meta.deviceId) return;
  await env.DB.prepare(`
    INSERT INTO recipient_devices (
      recipient,device_id,device_class,browser,os,locale,client_timezone,
      city,region,country_code,cf_timezone,colo,first_seen,last_seen
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
    ON CONFLICT(recipient,device_id) DO UPDATE SET
      device_class=excluded.device_class,
      browser=excluded.browser,
      os=excluded.os,
      locale=CASE WHEN excluded.locale<>'' THEN excluded.locale ELSE recipient_devices.locale END,
      client_timezone=CASE WHEN excluded.client_timezone<>'' THEN excluded.client_timezone ELSE recipient_devices.client_timezone END,
      city=CASE WHEN excluded.city<>'' THEN excluded.city ELSE recipient_devices.city END,
      region=CASE WHEN excluded.region<>'' THEN excluded.region ELSE recipient_devices.region END,
      country_code=CASE WHEN excluded.country_code<>'' THEN excluded.country_code ELSE recipient_devices.country_code END,
      cf_timezone=CASE WHEN excluded.cf_timezone<>'' THEN excluded.cf_timezone ELSE recipient_devices.cf_timezone END,
      colo=CASE WHEN excluded.colo<>'' THEN excluded.colo ELSE recipient_devices.colo END,
      last_seen=CURRENT_TIMESTAMP
  `).bind(
    meta.recipient, meta.deviceId, meta.deviceClass, meta.browser, meta.os,
    meta.locale, meta.clientTimezone, geo.city, geo.region, geo.countryCode,
    geo.cfTimezone, geo.colo,
  ).run();
}

async function legacyVisit(request, env, data, cors) {
  const visitId = text(data.visitId, 80);
  if (!visitId) return json({ error: 'visitId obrigatório' }, 400, cors);
  const recipient = text(data.recipient || 'public', 80) || 'public';
  const device = text(data.device || 'unknown', 24) || 'unknown';
  const pagePath = text(data.path || '/', 160) || '/';
  await env.DB.prepare(`
    INSERT INTO visits (visit_id,recipient,device,page_path,first_seen,last_seen)
    VALUES (?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
    ON CONFLICT(visit_id) DO UPDATE SET
      recipient=excluded.recipient,
      device=excluded.device,
      page_path=excluded.page_path,
      last_seen=CURRENT_TIMESTAMP
  `).bind(visitId, recipient, device, pagePath).run();
  return json({ ok: true, legacy: true }, 200, cors);
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (!env.DB) return json({ error: 'D1 binding DB não configurado' }, 500, cors);

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '');

    try {
      // Mantido para instalações antigas do frontend. A versão nova usa /session/start.
      if (request.method === 'POST' && path === '/api/visit') {
        return legacyVisit(request, env, await body(request), cors);
      }

      if (request.method === 'POST' && path === '/api/session/start') {
        const data = await body(request);
        const meta = clientMeta(data);
        if (!meta.sessionId || !meta.deviceId) {
          return json({ error: 'sessionId e deviceId obrigatórios' }, 400, cors);
        }
        const geo = geoFromRequest(request);
        await upsertDevice(env, meta, geo);
        await env.DB.prepare(`
          INSERT INTO sessions (
            session_id,recipient,device_id,device_class,browser,os,locale,client_timezone,
            entry_path,referrer,city,region,country_code,cf_timezone,colo,
            started_at,last_seen,active_seconds
          ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,0)
          ON CONFLICT(session_id) DO UPDATE SET
            last_seen=CURRENT_TIMESTAMP
        `).bind(
          meta.sessionId, meta.recipient, meta.deviceId, meta.deviceClass,
          meta.browser, meta.os, meta.locale, meta.clientTimezone,
          meta.pagePath, meta.referrer, geo.city, geo.region, geo.countryCode,
          geo.cfTimezone, geo.colo,
        ).run();
        return json({ ok: true }, 200, cors);
      }

      if (request.method === 'POST' && path === '/api/session/ping') {
        const data = await body(request);
        const meta = clientMeta(data);
        if (!meta.sessionId) return json({ error: 'sessionId obrigatório' }, 400, cors);
        const activeSeconds = int(data.activeSeconds, 0, 60 * 60 * 24 * 30);
        await env.DB.prepare(`
          UPDATE sessions SET
            last_seen=CURRENT_TIMESTAMP,
            active_seconds=MAX(active_seconds,?)
          WHERE session_id=?
        `).bind(activeSeconds, meta.sessionId).run();
        if (meta.deviceId) {
          await env.DB.prepare(`
            UPDATE recipient_devices SET last_seen=CURRENT_TIMESTAMP
            WHERE recipient=? AND device_id=?
          `).bind(meta.recipient, meta.deviceId).run();
        }
        return json({ ok: true }, 200, cors);
      }

      if (request.method === 'POST' && path === '/api/session/end') {
        const data = await body(request);
        const meta = clientMeta(data);
        if (!meta.sessionId) return json({ error: 'sessionId obrigatório' }, 400, cors);
        const activeSeconds = int(data.activeSeconds, 0, 60 * 60 * 24 * 30);
        await env.DB.prepare(`
          UPDATE sessions SET
            last_seen=CURRENT_TIMESTAMP,
            ended_at=COALESCE(ended_at,CURRENT_TIMESTAMP),
            active_seconds=MAX(active_seconds,?)
          WHERE session_id=?
        `).bind(activeSeconds, meta.sessionId).run();
        if (meta.deviceId) {
          await env.DB.prepare(`
            UPDATE recipient_devices SET last_seen=CURRENT_TIMESTAMP
            WHERE recipient=? AND device_id=?
          `).bind(meta.recipient, meta.deviceId).run();
        }
        return json({ ok: true }, 200, cors);
      }

      if (request.method === 'POST' && path === '/api/progress') {
        const data = await body(request);
        const sessionId = text(data.sessionId, 100);

        // Compatibilidade com o tracker antigo.
        if (!sessionId) {
          const visitId = text(data.visitId, 80);
          if (!visitId) return json({ error: 'sessionId obrigatório' }, 400, cors);
          const recipient = text(data.recipient || 'public', 80) || 'public';
          const stageIndex = int(data.stageIndex, 0, 50);
          const stageId = text(data.stageId, 60);
          const stageLabel = text(data.stageLabel, 100);
          const stageProgress = int(data.stageProgress, 0, 100);
          const score = int(data.score, 0, 100000);
          const completed = data.completed ? 1 : 0;
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
          `).bind(visitId, recipient, score, stageIndex, stageId, stageLabel, stageProgress, completed).run();
          return json({ ok: true, legacy: true }, 200, cors);
        }

        const meta = clientMeta(data);
        const stageIndex = int(data.stageIndex, 0, 50);
        const stageId = text(data.stageId, 60);
        const stageLabel = text(data.stageLabel, 100);
        const stageProgress = int(data.stageProgress, 0, 100);
        const score = int(data.score, 0, 100000);
        const completed = data.completed ? 1 : 0;
        const activeSeconds = int(data.activeSeconds, 0, 60 * 60 * 24 * 30);

        await env.DB.prepare(`
          UPDATE sessions SET
            last_seen=CURRENT_TIMESTAMP,
            active_seconds=MAX(active_seconds,?),
            completed=MAX(completed,?),
            max_stage_index=CASE WHEN ?>=max_score THEN ? ELSE max_stage_index END,
            max_stage_id=CASE WHEN ?>=max_score THEN ? ELSE max_stage_id END,
            max_stage_label=CASE WHEN ?>=max_score THEN ? ELSE max_stage_label END,
            max_stage_progress=CASE WHEN ?>=max_score THEN ? ELSE max_stage_progress END,
            max_score=MAX(max_score,?)
          WHERE session_id=?
        `).bind(
          activeSeconds, completed,
          score, stageIndex,
          score, stageId,
          score, stageLabel,
          score, stageProgress,
          score, sessionId,
        ).run();
        if (meta.deviceId) {
          await env.DB.prepare(`
            UPDATE recipient_devices SET last_seen=CURRENT_TIMESTAMP
            WHERE recipient=? AND device_id=?
          `).bind(meta.recipient, meta.deviceId).run();
        }
        return json({ ok: true }, 200, cors);
      }

      if (request.method === 'POST' && path === '/api/vote') {
        const data = await body(request);
        const vote = data.vote === 'yes' ? 'yes' : data.vote === 'no' ? 'no' : '';
        if (!vote) return json({ error: 'voto inválido' }, 400, cors);
        const sessionId = text(data.sessionId, 100);

        if (sessionId) {
          const meta = clientMeta(data);
          const activeSeconds = int(data.activeSeconds, 0, 60 * 60 * 24 * 30);
          await env.DB.prepare(`
            UPDATE sessions SET
              last_seen=CURRENT_TIMESTAMP,
              active_seconds=MAX(active_seconds,?),
              vote=?,
              voted_at=CURRENT_TIMESTAMP,
              completed=1
            WHERE session_id=?
          `).bind(activeSeconds, vote, sessionId).run();
          if (meta.deviceId) {
            await env.DB.prepare(`
              UPDATE recipient_devices SET last_seen=CURRENT_TIMESTAMP
              WHERE recipient=? AND device_id=?
            `).bind(meta.recipient, meta.deviceId).run();
          }
          return json({ ok: true, vote }, 200, cors);
        }

        // Compatibilidade com a versão anterior.
        const visitId = text(data.visitId, 80);
        const recipient = text(data.recipient || 'public', 80) || 'public';
        if (!visitId) return json({ error: 'identificador inválido' }, 400, cors);
        await env.DB.prepare(`
          INSERT INTO visits (visit_id,recipient,first_seen,last_seen,vote,voted_at,completed)
          VALUES (?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,?,CURRENT_TIMESTAMP,1)
          ON CONFLICT(visit_id) DO UPDATE SET
            recipient=excluded.recipient,
            last_seen=CURRENT_TIMESTAMP,
            vote=excluded.vote,
            voted_at=CURRENT_TIMESTAMP,
            completed=1
        `).bind(visitId, recipient, vote).run();
        return json({ ok: true, vote, legacy: true }, 200, cors);
      }

      if (request.method === 'GET' && path === '/api/admin/summary') {
        if (!authorized(request, env)) return json({ error: 'não autorizado' }, 401, cors);
        const recipient = text(url.searchParams.get('recipient') || '', 80);
        const whereSessions = recipient ? 'WHERE recipient = ?' : '';
        const whereDevices = recipient ? 'WHERE d.recipient = ?' : '';
        const args = recipient ? [recipient] : [];

        const totalsStmt = env.DB.prepare(`
          SELECT
            COUNT(*) AS accesses,
            COUNT(DISTINCT recipient) AS recipients,
            SUM(CASE WHEN completed=1 THEN 1 ELSE 0 END) AS completed,
            SUM(CASE WHEN vote='yes' THEN 1 ELSE 0 END) AS yes,
            SUM(CASE WHEN vote='no' THEN 1 ELSE 0 END) AS no,
            MIN(started_at) AS first_seen,
            MAX(last_seen) AS last_seen
          FROM sessions ${whereSessions}
        `);
        const deviceCountStmt = env.DB.prepare(`
          SELECT COUNT(*) AS devices FROM recipient_devices ${recipient ? 'WHERE recipient = ?' : ''}
        `);
        const recipientsStmt = env.DB.prepare(`
          SELECT
            recipient,
            COUNT(*) AS accesses,
            COUNT(DISTINCT device_id) AS devices,
            SUM(CASE WHEN completed=1 THEN 1 ELSE 0 END) AS completed,
            SUM(CASE WHEN vote='yes' THEN 1 ELSE 0 END) AS yes,
            SUM(CASE WHEN vote='no' THEN 1 ELSE 0 END) AS no,
            MIN(started_at) AS first_seen,
            MAX(last_seen) AS last_seen
          FROM sessions ${whereSessions}
          GROUP BY recipient
          ORDER BY datetime(last_seen) DESC
          LIMIT 200
        `);
        const devicesStmt = env.DB.prepare(`
          SELECT
            d.recipient,d.device_id,d.device_class,d.browser,d.os,d.locale,d.client_timezone,
            d.city,d.region,d.country_code,d.cf_timezone,d.colo,d.first_seen,d.last_seen,
            COUNT(s.session_id) AS access_count,
            SUM(CASE WHEN s.completed=1 THEN 1 ELSE 0 END) AS completed_count,
            SUM(CASE WHEN s.vote='yes' THEN 1 ELSE 0 END) AS yes_count,
            SUM(CASE WHEN s.vote='no' THEN 1 ELSE 0 END) AS no_count,
            COALESCE(SUM(s.active_seconds),0) AS total_active_seconds
          FROM recipient_devices d
          LEFT JOIN sessions s ON s.recipient=d.recipient AND s.device_id=d.device_id
          ${whereDevices}
          GROUP BY d.recipient,d.device_id
          ORDER BY datetime(d.last_seen) DESC
          LIMIT 300
        `);
        const sessionsStmt = env.DB.prepare(`
          SELECT * FROM (
            SELECT
              s.session_id,s.recipient,s.device_id,s.device_class,s.browser,s.os,s.locale,s.client_timezone,
              s.entry_path,s.referrer,s.city,s.region,s.country_code,s.cf_timezone,s.colo,
              s.started_at,s.last_seen,s.ended_at,s.active_seconds,
              s.max_stage_index,s.max_stage_id,s.max_stage_label,s.max_stage_progress,
              s.completed,s.vote,s.voted_at,
              ROW_NUMBER() OVER (
                PARTITION BY s.recipient,s.device_id
                ORDER BY datetime(s.started_at),s.session_id
              ) AS access_number,
              COUNT(*) OVER (PARTITION BY s.recipient,s.device_id) AS device_access_total
            FROM sessions s ${whereSessions}
          ) ranked
          ORDER BY datetime(started_at) DESC
          LIMIT 750
        `);

        const [totalsRes, deviceCountRes, recipientsRes, devicesRes, sessionsRes] = await Promise.all([
          args.length ? totalsStmt.bind(...args).first() : totalsStmt.first(),
          args.length ? deviceCountStmt.bind(...args).first() : deviceCountStmt.first(),
          args.length ? recipientsStmt.bind(...args).all() : recipientsStmt.all(),
          args.length ? devicesStmt.bind(...args).all() : devicesStmt.all(),
          args.length ? sessionsStmt.bind(...args).all() : sessionsStmt.all(),
        ]);

        // Dados da versão antiga permanecem disponíveis para não apagar histórico.
        const legacyStmt = env.DB.prepare(`
          SELECT visit_id,recipient,device,page_path,first_seen,last_seen,
                 max_stage_index,max_stage_id,max_stage_label,max_stage_progress,
                 completed,vote,voted_at
          FROM visits ${recipient ? 'WHERE recipient = ?' : ''}
          ORDER BY datetime(last_seen) DESC
          LIMIT 250
        `);
        const legacyRes = args.length ? await legacyStmt.bind(...args).all() : await legacyStmt.all();

        const totals = {
          accesses: Number(totalsRes?.accesses || 0),
          devices: Number(deviceCountRes?.devices || 0),
          recipients: Number(totalsRes?.recipients || 0),
          completed: Number(totalsRes?.completed || 0),
          yes: Number(totalsRes?.yes || 0),
          no: Number(totalsRes?.no || 0),
          first_seen: totalsRes?.first_seen || null,
          last_seen: totalsRes?.last_seen || null,
        };

        return json({
          ok: true,
          totals,
          recipients: recipientsRes.results || [],
          devices: devicesRes.results || [],
          sessions: sessionsRes.results || [],
          legacy: legacyRes.results || [],
          notes: {
            location: 'Cidade/região são aproximadas, derivadas pela Cloudflare da conexão. GPS e IP não são armazenados.',
            devices: 'Dispositivos são IDs aleatórios persistidos no navegador; não provam a identidade física de uma pessoa.',
          },
        }, 200, cors);
      }

      if (path === '/api/health') return json({ ok: true, analytics: 'v2' }, 200, cors);
      return json({ error: 'not found' }, 404, cors);
    } catch (error) {
      console.error(error);
      return json({ error: 'erro interno' }, 500, cors);
    }
  },
};
