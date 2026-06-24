'use strict';

/* ── WMO weather-code map (Thai labels) ───────────────────────────────────── */
const WMO = {
  0:  { icon: '☀️',  label: 'ท้องฟ้าแจ่มใส',         risk: 'low'    },
  1:  { icon: '🌤️',  label: 'เมฆบางส่วน',              risk: 'low'    },
  2:  { icon: '⛅',  label: 'มีเมฆ',                   risk: 'low'    },
  3:  { icon: '☁️',  label: 'มีเมฆมาก',               risk: 'low'    },
  45: { icon: '🌫️',  label: 'หมอก',                   risk: 'low'    },
  48: { icon: '🌫️',  label: 'หมอกน้ำแข็ง',            risk: 'low'    },
  51: { icon: '🌦️',  label: 'ฝนปรอยเบา',              risk: 'medium' },
  53: { icon: '🌦️',  label: 'ฝนปรอย',                 risk: 'medium' },
  55: { icon: '🌦️',  label: 'ฝนปรอยหนัก',             risk: 'medium' },
  61: { icon: '🌧️',  label: 'ฝนเบา',                  risk: 'medium' },
  63: { icon: '🌧️',  label: 'ฝนปานกลาง',              risk: 'high'   },
  65: { icon: '🌧️',  label: 'ฝนหนัก',                 risk: 'high'   },
  71: { icon: '🌨️',  label: 'หิมะเบา',                risk: 'low'    },
  73: { icon: '🌨️',  label: 'หิมะ',                   risk: 'medium' },
  75: { icon: '🌨️',  label: 'หิมะหนัก',               risk: 'high'   },
  80: { icon: '🌧️',  label: 'ฝนกระโชก',               risk: 'high'   },
  81: { icon: '🌧️',  label: 'ฝนกระโชกหนัก',           risk: 'high'   },
  82: { icon: '⛈️',  label: 'ฝนกระโชกรุนแรง',         risk: 'danger' },
  95: { icon: '⛈️',  label: 'พายุฝนฟ้าคะนอง',         risk: 'danger' },
  96: { icon: '⛈️',  label: 'พายุรุนแรง + ลูกเห็บ',   risk: 'danger' },
  99: { icon: '⛈️',  label: 'พายุรุนแรงมาก',          risk: 'danger' },
};

function wmo(code) {
  return WMO[+code] ?? WMO[Math.floor(+code / 10) * 10] ?? { icon: '🌡️', label: 'ไม่มีข้อมูล', risk: 'low' };
}

const RISK_COLOR = { low: '#22C55E', medium: '#FACC15', high: '#FB923C', danger: '#EF4444' };

function riskColor(risk) { return RISK_COLOR[risk] ?? '#94a3b8'; }

const DAYS_TH = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

/* Guard: fall back to plain fetch if helper not loaded */
const _fetchRain = typeof fetchWithTimeout === 'function' ? fetchWithTimeout : fetch;

function dayLabel(dateStr) {
  return DAYS_TH[new Date(dateStr + 'T00:00:00+07:00').getDay()];
}

function hourLabel(iso) {
  return new Date(iso).getHours().toString().padStart(2, '0') + ':00';
}

/* ── Fetch ─────────────────────────────────────────────────────────────────── */
async function fetchRainForecast() {
  const url = window.HSKK_CONFIG?.rainWeatherUrl;
  if (!url) throw new Error('no config');
  const res = await _fetchRain(url, {}, 10000);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

/* ── Current conditions ────────────────────────────────────────────────────── */
function renderCurrent(data, currentProb) {
  const el = document.getElementById('rain-current');
  if (!el) return;
  const c    = data.current;
  const info = wmo(c.weathercode);
  const col  = riskColor(info.risk);

  el.innerHTML = `
    <div class="rwc-icon">${getWeatherIcon(c.weathercode, c.is_day === 1)}</div>
    <div class="rwc-main">
      <div class="rwc-temp">${Math.round(c.temperature_2m)}<span>°C</span></div>
      <div class="rwc-desc" style="color:${col};">${wmoLabel(c.weathercode)}</div>
      ${currentProb > 0 ? `<div class="rwc-prob">โอกาสฝน <strong>${currentProb}%</strong></div>` : ''}
    </div>
    <div class="rwc-stats">
      <div class="rwc-stat">
        <span class="rwc-stat-icon" aria-hidden="true">${typeof getMetricIcon === 'function' ? getMetricIcon('precip') : '🌧️'}</span>
        <span class="rwc-stat-val">${(c.precipitation ?? 0).toFixed(1)}</span>
        <span class="rwc-stat-lbl">ฝน (mm)</span>
      </div>
      <div class="rwc-stat">
        <span class="rwc-stat-icon" aria-hidden="true">${typeof getMetricIcon === 'function' ? getMetricIcon('wind') : '💨'}</span>
        <span class="rwc-stat-val">${Math.round(c.windspeed_10m)}</span>
        <span class="rwc-stat-lbl">ลม (km/h)</span>
      </div>
      <div class="rwc-stat">
        <span class="rwc-stat-icon" aria-hidden="true">${typeof getMetricIcon === 'function' ? getMetricIcon('gust') : '💥'}</span>
        <span class="rwc-stat-val">${Math.round(c.windgusts_10m ?? 0)}</span>
        <span class="rwc-stat-lbl">กระโชก (km/h)</span>
      </div>
      <div class="rwc-stat">
        <span class="rwc-stat-icon" aria-hidden="true">${typeof getMetricIcon === 'function' ? getMetricIcon('humidity') : '💧'}</span>
        <span class="rwc-stat-val">${c.relative_humidity_2m}</span>
        <span class="rwc-stat-lbl">ความชื้น (%)</span>
      </div>
    </div>`;

  const panel = el.closest('.rw-panel');
  if (panel) {
    panel.className = panel.className.replace(/\bwx-\S+/g, '').trim();
    panel.classList.add(weatherTheme(c.weathercode, c.is_day === 1));
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', `สภาพอากาศปัจจุบัน: ${wmoLabel(c.weathercode)}`);
  }
}

/* ── Hourly precipitation chart (next 12 h) ───────────────────────────────── */
function renderHourly(data) {
  const el = document.getElementById('rain-hourly');
  if (!el) return;

  const now      = new Date();
  const times    = data.hourly.time;
  const probs    = data.hourly.precipitation_probability;
  const precips  = data.hourly.precipitation;
  const codes    = data.hourly.weathercode;
  const isDayArr = data.hourly.is_day;

  /* find index of current or next hour */
  let start = 0;
  for (let i = 0; i < times.length; i++) {
    if (new Date(times[i]) >= now) { start = i; break; }
  }

  const bars = [];
  for (let i = start; i < Math.min(start + 12, times.length); i++) {
    bars.push({ time: times[i], prob: probs[i] ?? 0, rain: precips[i] ?? 0, code: codes[i], isDay: isDayArr?.[i] ?? 0 });
  }

  const maxRain = Math.max(...bars.map(b => b.rain), 0.1);

  el.innerHTML = `
    <div class="rh-bars" role="img" aria-label="กราฟโอกาสฝน 12 ชั่วโมง">
      ${bars.map(b => {
        const info   = wmo(b.code);
        const probH  = Math.max(b.prob, 2);
        const rainPx = Math.round((b.rain / maxRain) * 56);
        return `
          <div class="rh-col">
            <div class="rh-icon">${getWeatherIcon(b.code, b.isDay === 1)}</div>
            <div class="rh-bar-wrap">
              <div class="rh-bar-prob" style="height:${probH}%;" title="โอกาสฝน ${b.prob}%"></div>
              ${b.rain > 0 ? `<div class="rh-bar-rain" style="height:${Math.max(rainPx,3)}px;" title="ฝน ${b.rain} mm"></div>` : ''}
            </div>
            <div class="rh-prob">${b.prob}%</div>
            <div class="rh-time">${hourLabel(b.time)}</div>
          </div>`;
      }).join('')}
    </div>
    <div class="rh-legend" aria-hidden="true">
      <span class="rh-leg rh-leg-prob">โอกาสฝน (%)</span>
      <span class="rh-leg rh-leg-rain">ปริมาณฝน (mm)</span>
    </div>`;
}

/* ── 7-day daily forecast cards ───────────────────────────────────────────── */
function renderDaily(data) {
  const el = document.getElementById('rain-daily');
  if (!el) return;
  const d = data.daily;

  el.innerHTML = d.time.map((date, i) => {
    const info    = wmo(d.weathercode[i]);
    const col     = riskColor(info.risk);
    const precip  = (d.precipitation_sum[i] ?? 0).toFixed(1);
    const probMax = d.precipitation_probability_max[i] ?? 0;
    const windMax = Math.round(d.windspeed_10m_max[i] ?? 0);
    const gustMax = Math.round(d.windgusts_10m_max?.[i] ?? 0);
    const isToday = i === 0;

    return `
      <div class="rd-card${isToday ? ' rd-today' : ''}">
        <div class="rd-day">${isToday ? 'วันนี้' : dayLabel(date)}</div>
        <div class="rd-icon">${getWeatherIcon(d.weathercode[i], true)}</div>
        <div class="rd-desc" style="color:${col};">${wmoLabel(d.weathercode[i])}</div>
        <div class="rd-temp">
          <span class="rd-tmax">${Math.round(d.temperature_2m_max[i])}°</span>
          <span class="rd-tmin">${Math.round(d.temperature_2m_min[i])}°</span>
        </div>
        <div class="rd-rain" title="ฝนสะสม">🌧️ ${precip} mm</div>
        <div class="rd-prob" title="โอกาสฝนสูงสุด">${probMax}%</div>
        ${windMax > 0 ? `<div class="rd-wind" title="ลมสูงสุด / กระโชก">💨 ${windMax}${gustMax > windMax ? ' / ' + gustMax : ''}</div>` : ''}
      </div>`;
  }).join('');
}

/* ── Main entry ────────────────────────────────────────────────────────────── */
window.initRainWeather = async function () {
  const status = document.getElementById('rain-weather-status');

  /* Reset to loading state on (re)try */
  if (status) { status.textContent = 'กำลังโหลดข้อมูล...'; status.hidden = false; }

  try {
    const data = await fetchRainForecast();

    /* get precipitation_probability for current hour from hourly array */
    const now      = new Date();
    const times    = data.hourly.time;
    let currentIdx = 0;
    for (let i = 0; i < times.length; i++) {
      if (new Date(times[i]) <= now) currentIdx = i;
      else break;
    }
    const currentProb = data.hourly.precipitation_probability?.[currentIdx] ?? 0;

    renderCurrent(data, currentProb);
    renderHourly(data);
    renderDaily(data);

    if (status) status.remove();

    const src = document.getElementById('rain-source-label');
    if (src) src.textContent = 'ข้อมูล: Open-Meteo · ขอนแก่น (16.44°N, 102.82°E) · อัปเดตอัตโนมัติ';

  } catch (e) {
    console.error('[rainweather]', e);
    if (status) {
      if (typeof showFetchError === 'function') {
        showFetchError(status, window.initRainWeather);
      } else {
        status.textContent = 'โหลดข้อมูลพยากรณ์ไม่สำเร็จ — กรุณาลองใหม่';
      }
    }
  }
};
