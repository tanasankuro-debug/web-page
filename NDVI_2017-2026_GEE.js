/**********************************************************************
 * GeoHeat Khon Kaen — NDVI รายปี พ.ศ. 2560–2569 (ค.ศ. 2017–2026)
 * ดาวเทียม Landsat 8–9 Collection 2 Level 2 (Surface Reflectance)
 * ฤดูแล้ง มกราคม–พฤษภาคม  (เหมือนที่ใช้ทำ NDBI)
 *
 * วิธีใช้:
 *   1. วาด polygon ขอบเขตเมืองไว้แล้ว (ตัวแปรชื่อ geometry) — สคริปต์นี้ใช้ geometry อัตโนมัติ
 *   2. กด Run  → ดูภาพ NDVI แต่ละปีบนแผนที่
 *   3. เปิดแท็บ Tasks (ขวาบน) → กด Run ทีละปี เพื่อ Export PNG ลง Google Drive
 **********************************************************************/

// ── 0) ขอบเขตพื้นที่ ──────────────────────────────────────────────
//  ใช้ polygon ที่คุณวาดไว้ชื่อ geometry
var aoi = geometry;
Map.centerObject(aoi, 12);

// ── 1) เลือกโทนสี ─────────────────────────────────────────────────
//  แบบ A = สไตล์เดียวกับ NDBI (น้ำเงิน→ขาว→แดง)
//  แบบ B = สไตล์ NDVI มาตรฐาน (น้ำตาล→เหลือง→เขียว)
var PALETTES = {
  ndbiStyle: ['#1d4ed8', '#93c5fd', '#f8fafc', '#fca5a5', '#ef4444'],   // แบบเดียวกับ NDBI ในเว็บ
  ndviGreen: ['#a16207', '#eab308', '#fde047', '#a3e635', '#16a34a', '#14532d']
};

var PALETTE = PALETTES.ndbiStyle;   // ← เปลี่ยนเป็น PALETTES.ndviGreen ถ้าอยากได้สีเขียว
var VIS_MIN = 0.0;                   // NDVI ต่ำ
var VIS_MAX = 0.6;                   // NDVI สูง (พืชพรรณหนาแน่น)

var visParams = { min: VIS_MIN, max: VIS_MAX, palette: PALETTE };

// ── 2) ฟังก์ชัน cloud mask + scale factor (Landsat C2 L2) ─────────
function prepLandsat(img) {
  // QA_PIXEL: บิต 3 = cloud, บิต 4 = cloud shadow
  var qa = img.select('QA_PIXEL');
  var mask = qa.bitwiseAnd(1 << 3).eq(0)
              .and(qa.bitwiseAnd(1 << 4).eq(0));
  // ปรับ scale factor ของแถบ SR ให้เป็นค่าสะท้อนจริง
  var sr = img.select('SR_B.').multiply(0.0000275).add(-0.2);
  return sr.updateMask(mask).copyProperties(img, ['system:time_start']);
}

// ── 3) รวมภาพ Landsat 8 + Landsat 9 ──────────────────────────────
var l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2');
var l9 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2');
var landsat = l8.merge(l9);

// ── 4) คำนวณ NDVI ต่อปี (ฤดูแล้ง ม.ค.–พ.ค.) ──────────────────────
//  NDVI = (NIR − Red) / (NIR + Red)  → Landsat 8–9 ใช้ SR_B5 และ SR_B4
function yearlyNDVI(year) {
  var start = ee.Date.fromYMD(year, 1, 1);
  var end   = ee.Date.fromYMD(year, 5, 31);

  var col = landsat
    .filterBounds(aoi)
    .filterDate(start, end)
    .filter(ee.Filter.lt('CLOUD_COVER', 60))
    .map(prepLandsat);

  var composite = col.median();
  var ndvi = composite.normalizedDifference(['SR_B5', 'SR_B4'])
                      .rename('NDVI')
                      .clip(aoi);
  return ndvi.set('year', year);
}

// ── 5) วนทุกปี 2017–2026: แสดงบนแผนที่ + ตั้งค่า Export ───────────
var years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

years.forEach(function (y) {
  var ndvi = yearlyNDVI(y);

  // แสดงบนแผนที่ (ติ๊กเปิด/ปิดได้ในหน้า Layers)
  Map.addLayer(ndvi, visParams, 'NDVI ' + y, false);

  // ภาพสีสำหรับ export (แปลงค่าเป็นภาพ RGB ตาม palette)
  var rgb = ndvi.visualize(visParams);

  Export.image.toDrive({
    image: rgb,
    description: 'NDVI_' + y + '_KhonKaen',
    folder: 'GeoHeat_NDVI',
    fileNamePrefix: 'ndvi-' + y,
    region: aoi,
    scale: 30,
    maxPixels: 1e13
  });
});

// ── 6) แถบสเกลสี (legend) บนแผนที่ ───────────────────────────────
var legend = ui.Panel({ style: { position: 'bottom-left', padding: '8px' } });
legend.add(ui.Label('NDVI (ต่ำ → สูง)', { fontWeight: 'bold' }));
var barPalette = PALETTE;
var bar = ui.Panel({ layout: ui.Panel.Layout.flow('horizontal') });
barPalette.forEach(function (c) {
  bar.add(ui.Label('', { backgroundColor: c, padding: '8px', margin: '0' }));
});
legend.add(bar);
legend.add(ui.Panel(
  [ui.Label(String(VIS_MIN), { margin: '2px 40px 2px 0' }),
   ui.Label(String(VIS_MAX), { margin: '2px 0' })],
  ui.Panel.Layout.flow('horizontal')
));
Map.add(legend);

print('เสร็จแล้ว — เปิดแท็บ Tasks แล้วกด Run เพื่อดาวน์โหลดภาพแต่ละปีลง Google Drive');
