/**
 * QUIZ DUNGEON — Google Apps Script Backend
 * ==========================================
 * Deploy as: Extensions → Apps Script → Deploy → New Deployment
 *            Type: Web App, Execute as: Me, Access: Anyone
 *
 * Google Sheets Structure:
 * ┌──────────────────────────────────────────────────────────┐
 * │ Sheet "題目"  │ A:題號 │ B:題目 │ C:A │ D:B │ E:C │ F:D │ G:解答 │
 * ├──────────────────────────────────────────────────────────┤
 * │ Sheet "回答"  │ A:ID │ B:闖關次數 │ C:總分 │ D:最高分 │
 * │              │ E:第一次通關分數 │ F:花了幾次通關 │ G:最近遊玩時間 │
 * └──────────────────────────────────────────────────────────┘
 */

var SS = SpreadsheetApp.getActiveSpreadsheet()
var QUESTION_SHEET = '題目'
var ANSWER_SHEET = '回答'

// ── CORS helper ──────────────────────────────────────────────
function cors(output) {
  return output
    .setMimeType(ContentService.MimeType.JSON)
}

function jsonResponse(obj) {
  return cors(ContentService.createTextOutput(JSON.stringify(obj)))
}

// ── GET handler ──────────────────────────────────────────────
// All actions go through GET + query params.
// POST with Content-Type: application/json triggers a CORS preflight
// that GAS Web Apps cannot respond to — the request is silently dropped.
function doGet(e) {
  try {
    var action = e.parameter.action
    if (action === 'getQuestions') {
      return handleGetQuestions(e)
    }
    if (action === 'submitScore') {
      return handleSubmitScore(e.parameter)
    }
    return jsonResponse({ error: 'Unknown action: ' + action })
  } catch (err) {
    return jsonResponse({ error: err.message })
  }
}

// ── POST handler (kept as fallback, not used by client) ───────
function doPost(e) {
  return jsonResponse({ error: 'Use GET requests only.' })
}

// ── getQuestions ─────────────────────────────────────────────
function handleGetQuestions(e) {
  var count = parseInt(e.parameter.count || '10', 10)
  var sheet = SS.getSheetByName(QUESTION_SHEET)

  if (!sheet) return jsonResponse({ error: 'Sheet "題目" not found' })

  var data = sheet.getDataRange().getValues()
  var headers = data[0] // [題號, 題目, A, B, C, D, 解答]
  var rows = data.slice(1) // skip header row

  // Shuffle
  for (var i = rows.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var tmp = rows[i]; rows[i] = rows[j]; rows[j] = tmp
  }

  var selected = rows.slice(0, Math.min(count, rows.length))

  // Map to objects — DO NOT include 解答 column
  var questions = selected.map(function (row) {
    return {
      id:       row[0],
      question: row[1],
      A:        row[2],
      B:        row[3],
      C:        row[4],
      D:        row[5],
      answer:   row[6], // ← client needs this to check answers locally
      // Note: if you want server-side answer checking, remove this field
      // and add a separate "checkAnswer" action
    }
  })

  return jsonResponse({ questions: questions })
}

// ── submitScore ───────────────────────────────────────────────
// Accepts e.parameter (GET query params): playerId, score, total, passed ('1'/'0')
function handleSubmitScore(params) {
  var playerId = String(params.playerId || '').trim()
  var score    = Number(params.score)
  var total    = Number(params.total)
  var passed   = params.passed === '1' || params.passed === 'true'

  if (!playerId) return jsonResponse({ error: 'playerId is required' })

  var sheet = SS.getSheetByName(ANSWER_SHEET)
  if (!sheet) return jsonResponse({ error: 'Sheet "回答" not found' })

  var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss')

  // Find existing row for this player
  var data = sheet.getDataRange().getValues()
  var rowIndex = -1
  for (var i = 1; i < data.length; i++) { // skip header
    if (String(data[i][0]).trim() === playerId) {
      rowIndex = i + 1 // 1-based sheet row
      break
    }
  }

  if (rowIndex === -1) {
    // ── New player: append row ──
    // Cols: ID | 闖關次數 | 總分 | 最高分 | 第一次通關分數 | 花了幾次通關 | 最近遊玩時間
    var firstClear = passed ? score : ''
    var clearedCount = passed ? 1 : 0
    sheet.appendRow([playerId, 1, score, score, firstClear, clearedCount, now])
  } else {
    // ── Existing player: update ──
    var existingRow = data[rowIndex - 1]
    var attempts    = (Number(existingRow[1]) || 0) + 1
    var totalScore  = Number(existingRow[2]) || 0  // 累計總分 (optional)
    var highScore   = Math.max(Number(existingRow[3]) || 0, score)
    var firstClearScore = existingRow[4]             // preserve existing
    var clearedCount    = Number(existingRow[5]) || 0

    // Only record first clear score once
    if (passed && (firstClearScore === '' || firstClearScore === null || firstClearScore === undefined)) {
      firstClearScore = score
    }
    if (passed) {
      clearedCount += 1
    }

    sheet.getRange(rowIndex, 2).setValue(attempts)
    sheet.getRange(rowIndex, 3).setValue(totalScore + score) // 累計
    sheet.getRange(rowIndex, 4).setValue(highScore)
    sheet.getRange(rowIndex, 5).setValue(firstClearScore)
    sheet.getRange(rowIndex, 6).setValue(clearedCount)
    sheet.getRange(rowIndex, 7).setValue(now)
  }

  return jsonResponse({ success: true })
}
