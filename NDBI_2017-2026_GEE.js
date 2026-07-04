/**********************************************************************
 * GeoHeat Khon Kaen — NDBI ดัชนีสิ่งปลูกสร้าง (BUILT-UP)
 * รายปี พ.ศ. 2560–2569 (ค.ศ. 2017–2026)
 * Landsat 8–9 Collection 2 Level 2 · ฤดูแล้ง ม.ค.–พ.ค.
 *
 *  โทนสีของหน้านี้ = แดง
 *    แดง = สิ่งปลูกสร้างหนาแน่น (NDBI สูง)  → พื้นที่ร้อน / เกาะความร้อนเมือง
 *    น้ำเงิน = พืชพรรณ น้ำ พื้นที่ชุ่มน้ำ (NDBI ต่ำ)
 *  (NDVI ใช้อีกไฟล์แยก โทนสีเขียว = พืชพรรณ)
 *
 * วิธีใช้: วาด polygon (ตัวแปร geometry) แล้วกด Run → เปิดแท็บ Tasks กด Run ดาวน์โหลด
 **********************************************************************/

// ── 0) ขอบเขตพื้นที่ (polygon ที่คุณวาดไว้) ───────────────────────
var aoi = geometry;
Map.centerObject(aoi, 12);

// ── 1) โทนสี NDBI = แดง ──────────────────────────────────────────
//  น้ำเงิน(ต่ำ=พืช/น้ำ) → ขาว → แดง(สูง=สิ่งปลูกสร้าง)
var PALETTE = ['#1d4ed8', '#93c5fd', '#f8fafc', '#fca5a5', '#ef4444'];
var VIS_MIN = -0.15;   // NDBI ต่ำ = พืชพรรณ/น้ำ
var VIS_MAX =  0.15;   // NDBI สูง = สิ่งปลูกสร้าง
var visParams = { min: VIS_MIN, max: VIS_MAX, palette: PALETTE };

// ── 2) cloud mask + scale factor (Landsat C2 L2) ─────────────────
function prepLandsat(img) {
  var qa = img.select('QA_PIXEL');
  var mask = qa.bitwiseAnd(1 << 3).eq(0)
              .and(qa.bitwiseAnd(1 << 4).eq(0));
  var sr = img.select('SR_B.').multiply(0.0000275).add(-0.2);
  return sr.updateMask(mask).copyProperties(img, ['system:time_start']);
}

// ── 3) รวม Landsat 8 + 9 ─────────────────────────────────────────
var landsat = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
                .merge(ee.ImageCollection('LANDSAT/LC09/C02/T1_L2'));

// ── 4) NDBI ต่อปี = (SWIR − NIR)/(SWIR + NIR) = (SR_B6 − SR_B5) ───
function yearlyNDBI(year) {
  var col = landsat
    .filterBounds(aoi)
    .filterDate(ee.Date.fromYMD(year, 1, 1), ee.Date.fromYMD(year, 5, 31))
    .filter(ee.Filter.lt('CLOUD_COVER', 60))
    .map(prepLandsat);
  return col.median()
            .normalizedDifference(['SR_B6', 'SR_B5'])
            .rename('NDBI')
            .clip(aoi)
            .set('year', year);
}

// ── 5) วน 2017–2026: แสดงแผนที่ + ตั้ง Export ─────────────────────
var years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
years.forEach(function (y) {
  var ndbi = yearlyNDBI(y);
  Map.addLayer(ndbi, visParams, 'NDBI ' + y, false);
  Export.image.toDrive({
    image: ndbi.visualize(visParams),
    description: 'NDBI_' + y + '_KhonKaen',
    folder: 'GeoHeat_NDBI',
    fileNamePrefix: 'ndbi-' + y,
    region: aoi,
    scale: 30,
    maxPixels: 1e13
  });
});

// ── 6) legend ────────────────────────────────────────────────────
var legend = ui.Panel({ style: { position: 'bottom-left', padding: '8px' } });
legend.add(ui.Label('NDBI — ดัชนีสิ่งปลูกสร้าง (แดง = เมือง/ร้อน)', { fontWeight: 'bold' }));
var bar = ui.Panel({ layout: ui.Panel.Layout.flow('horizontal') });
PALETTE.forEach(function (c) { bar.add(ui.Label('', { backgroundColor: c, padding: '8px', margin: '0' })); });
legend.add(bar);
legend.add(ui.Panel(
  [ui.Label('พืช/น้ำ', { margin: '2px 40px 2px 0' }), ui.Label('สิ่งปลูกสร้าง', { margin: '2px 0' })],
  ui.Panel.Layout.flow('horizontal')));
Map.add(legend);

print('NDBI (แดง) เสร็จแล้ว — เปิดแท็บ Tasks กด Run เพื่อดาวน์โหลดภาพแต่ละปี');
