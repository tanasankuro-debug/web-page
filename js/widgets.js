/* ==========================================================================
   Heat Safe Khon Kaen — widgets.js
   Temperature scale slider widget
   ========================================================================== */
'use strict';

const RISK_LEVELS = [
  { min: 25, max: 29, level: 'safe',     label: 'ปลอดภัย',       desc: 'อุณหภูมิอยู่ในระดับปกติสำหรับภูมิภาคนี้ สามารถทำกิจกรรมกลางแจ้งได้ตามปกติ แต่ควรดื่มน้ำให้เพียงพอ' },
  { min: 30, max: 33, level: 'warn',     label: 'ระวัง',           desc: 'เริ่มรู้สึกไม่สบาย ควรดื่มน้ำสม่ำเสมอและหลีกเลี่ยงการออกกำลังกายหนักกลางแจ้งในช่วงเที่ยง' },
  { min: 34, max: 37, level: 'danger',   label: 'อันตราย',         desc: 'ความเสี่ยงสูงต่อความเครียดจากความร้อน แรงงานกลางแจ้งและผู้สูงอายุควรหยุดพักในที่ร่มบ่อยครั้ง' },
  { min: 38, max: 41, level: 'critical', label: 'อันตรายมาก',      desc: 'ควรหลีกเลี่ยงการอยู่กลางแจ้ง อันตรายต่อกลุ่มเสี่ยงทุกคน เปิดเครื่องปรับอากาศหรือไปอยู่ในที่เย็น' },
  { min: 42, max: 50, level: 'extreme',  label: 'อันตรายรุนแรง',   desc: 'อันตรายรุนแรงต่อทุกคน! หลีกเลี่ยงการอยู่กลางแจ้งโดยเด็ดขาด ดูแลผู้สูงอายุและเด็กอย่างใกล้ชิด โทรขอความช่วยเหลือหากมีอาการผิดปกติ' }
];

function getRiskLevel(temp) {
  return RISK_LEVELS.find(r => temp >= r.min && temp <= r.max) || RISK_LEVELS[RISK_LEVELS.length - 1];
}

function initTempWidget() {
  const slider    = $('#temp-slider');
  const indicator = $('#temp-indicator');
  const valEl     = $('#temp-val');
  const riskEl    = $('#temp-risk');
  const descEl    = $('#temp-desc');

  if (!slider || !indicator || !valEl || !riskEl || !descEl) return;

  function update() {
    const temp = parseInt(slider.value, 10);
    const min  = parseInt(slider.min,   10);
    const max  = parseInt(slider.max,   10);
    const pct  = ((temp - min) / (max - min)) * 100;
    const risk = getRiskLevel(temp);

    indicator.style.left    = `${pct}%`;
    valEl.textContent        = `${temp}°C`;
    riskEl.textContent       = risk.label;
    descEl.textContent       = risk.desc;
    valEl.dataset.level      = risk.level;
    riskEl.dataset.level     = risk.level;

    slider.setAttribute('aria-valuenow',  temp);
    slider.setAttribute('aria-valuetext', `${temp} องศา — ${risk.label}`);
  }

  slider.addEventListener('input',  update);
  slider.addEventListener('change', update);
  update();
}
