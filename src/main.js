import Phaser from 'phaser'
import './style.css'

const GAME_WIDTH = 960
const GAME_HEIGHT = 600
const LEVELS = [
  {
    name: 'LOWLAND APPROACH',
    sector: '07-A',
    padName: 'PAD 03',
    gravity: 34,
    gravityDisplay: '1.62',
    fuel: 100,
    fuelBurnRate: 15,
    start: { x: 174, y: 112 },
    scoreBonus: 1000,
    landing: { left: 710, right: 850, y: 462, horizontal: 52, vertical: 72, angle: 0.22, tolerance: '± 13°' },
    terrain: [
      { x: 0, y: 520 }, { x: 90, y: 498 }, { x: 160, y: 530 }, { x: 250, y: 470 },
      { x: 350, y: 510 }, { x: 440, y: 435 }, { x: 530, y: 490 }, { x: 620, y: 455 },
      { x: 710, y: 462 }, { x: 850, y: 462 }, { x: 885, y: 510 }, { x: GAME_WIDTH, y: 486 },
    ],
    ridges: [[68, 532, 91, 514], [192, 545, 218, 527], [294, 506, 320, 487], [396, 527, 424, 505], [486, 474, 510, 458], [570, 509, 603, 484], [898, 532, 928, 514]],
    craters: [[125, 556, 18], [278, 555, 13], [468, 540, 16], [650, 535, 20], [915, 556, 17]],
  },
  {
    name: 'CRATER RIM',
    sector: '11-C',
    padName: 'PAD 07',
    gravity: 39,
    gravityDisplay: '1.86',
    fuel: 88,
    fuelBurnRate: 17,
    start: { x: 805, y: 92 },
    scoreBonus: 1500,
    landing: { left: 430, right: 560, y: 468, horizontal: 46, vertical: 66, angle: 0.18, tolerance: '± 10°' },
    terrain: [
      { x: 0, y: 512 }, { x: 72, y: 478 }, { x: 140, y: 530 }, { x: 214, y: 502 },
      { x: 282, y: 430 }, { x: 350, y: 500 }, { x: 430, y: 468 }, { x: 560, y: 468 },
      { x: 620, y: 520 }, { x: 690, y: 446 }, { x: 760, y: 505 }, { x: 850, y: 458 }, { x: GAME_WIDTH, y: 500 },
    ],
    ridges: [[47, 526, 74, 505], [174, 545, 202, 523], [240, 486, 269, 455], [315, 523, 343, 506], [590, 540, 614, 516], [674, 483, 700, 459], [805, 530, 834, 500]],
    craters: [[112, 554, 16], [254, 553, 20], [387, 548, 13], [650, 555, 18], [904, 548, 21]],
  },
  {
    name: 'DARK SIDE',
    sector: '19-F',
    padName: 'PAD 12',
    gravity: 44,
    gravityDisplay: '2.11',
    fuel: 78,
    fuelBurnRate: 19,
    start: { x: 470, y: 86 },
    scoreBonus: 2200,
    landing: { left: 780, right: 900, y: 455, horizontal: 40, vertical: 58, angle: 0.14, tolerance: '± 8°' },
    terrain: [
      { x: 0, y: 500 }, { x: 74, y: 530 }, { x: 130, y: 455 }, { x: 210, y: 510 },
      { x: 285, y: 424 }, { x: 350, y: 505 }, { x: 425, y: 468 }, { x: 500, y: 530 },
      { x: 580, y: 445 }, { x: 650, y: 515 }, { x: 720, y: 405 }, { x: 780, y: 455 },
      { x: 900, y: 455 }, { x: GAME_WIDTH, y: 510 },
    ],
    ridges: [[38, 518, 64, 528], [151, 490, 178, 474], [239, 535, 265, 502], [323, 534, 347, 515], [456, 500, 483, 521], [602, 486, 630, 501], [704, 454, 733, 419]],
    craters: [[102, 555, 18], [245, 555, 15], [396, 550, 21], [612, 550, 15], [942, 552, 18]],
  },
]

document.querySelector('#app').innerHTML = `
  <div class="mission-shell">
    <header class="site-header">
      <div class="brand-lockup">
        <span class="brand-mark" aria-hidden="true"><span></span></span>
        <div>
          <p class="brand-eyebrow">FIELD SYSTEMS / LUNAR PROGRAM</p>
          <h1>LUNAR DESCENT</h1>
        </div>
      </div>
      <div class="flight-status" aria-live="polite">
        <span class="status-dot"></span>
        <span id="flight-status">STANDBY</span>
        <span class="status-divider"></span>
        <span>FLIGHT 07</span>
      </div>
    </header>

    <main class="mission-layout">
      <section class="flight-deck" aria-label="Lunar lander flight deck">
        <div class="deck-heading">
          <div>
            <p class="section-kicker">LIVE NAVIGATION FEED</p>
            <h2><span id="level-name">LOWLAND APPROACH</span> <span>/</span> <span id="pad-name">PAD 03</span></h2>
          </div>
          <div class="coordinate-readout">
            <span>SECTOR</span>
            <strong>07-A</strong>
          </div>
        </div>

        <div class="game-frame">
          <div id="game" aria-label="Playable lunar lander game"></div>
          <div id="result-overlay" class="result-overlay is-hidden" aria-live="polite">
            <p id="result-kicker" class="result-kicker">MISSION EVENT</p>
            <h2 id="result-title">TOUCHDOWN</h2>
            <p id="result-detail">The landing struts are stable.</p>
            <div class="result-stats">
              <span>FLIGHT SCORE <strong id="result-score">0000</strong></span>
              <span>FUEL REMAINING <strong id="result-fuel">00%</strong></span>
            </div>
            <div class="score-breakdown" aria-label="Flight score breakdown">
              <div class="score-row"><span>LEVEL COMPLETION</span><strong id="result-level-bonus">+0000</strong></div>
              <div class="score-row"><span>FUEL PRESERVED</span><strong id="result-fuel-bonus">+0000</strong></div>
              <div class="score-row score-row--total"><span>TOTAL AWARDED</span><strong id="result-total">0000</strong></div>
            </div>
            <button id="result-button" class="primary-action" type="button">
              <span class="button-glyph" aria-hidden="true">&#8635;</span>
              <span id="result-button-label">RETRY DESCENT</span>
            </button>
          </div>
        </div>

        <div class="control-dock" aria-label="Flight controls">
          <button class="control-button" type="button" data-control="left" aria-label="Rotate left" title="Rotate left">
            <span class="control-glyph" aria-hidden="true">&#8592;</span>
            <span class="control-caption">ROTATE</span>
            <kbd>A</kbd>
          </button>
          <button class="control-button control-button--thrust" type="button" data-control="thrust" aria-label="Fire descent thruster" title="Fire descent thruster">
            <span class="control-glyph" aria-hidden="true">&#9650;</span>
            <span class="control-caption">THRUST</span>
            <kbd>W</kbd>
          </button>
          <button class="control-button" type="button" data-control="right" aria-label="Rotate right" title="Rotate right">
            <span class="control-glyph" aria-hidden="true">&#8594;</span>
            <span class="control-caption">ROTATE</span>
            <kbd>D</kbd>
          </button>
          <button id="reset-button" class="control-button control-button--reset" type="button" aria-label="Reset flight" title="Reset flight">
            <span class="control-glyph" aria-hidden="true">&#8635;</span>
            <span class="control-caption">RESET</span>
            <kbd>R</kbd>
          </button>
        </div>
      </section>

      <aside class="telemetry-panel" aria-label="Flight telemetry">
        <div class="panel-heading">
          <div>
            <p class="section-kicker">ONBOARD TELEMETRY</p>
            <h2>DESCENT DATA</h2>
          </div>
          <span id="level-index" class="panel-index">LEVEL 1 / 3</span>
        </div>

        <div class="mission-state-row">
          <span>MISSION STATE</span>
          <strong id="mission-state">FLIGHT READY</strong>
        </div>

        <div class="readout-grid">
          <div class="readout-cell readout-cell--wide">
            <span class="readout-label">ALTITUDE</span>
            <strong><span id="altitude-readout">--.-</span><small> M</small></strong>
          </div>
          <div class="readout-cell">
            <span class="readout-label">VERTICAL</span>
            <strong><span id="vertical-readout">--</span><small> M/S</small></strong>
          </div>
          <div class="readout-cell">
            <span class="readout-label">HORIZONTAL</span>
            <strong><span id="horizontal-readout">--</span><small> M/S</small></strong>
          </div>
          <div class="readout-cell">
            <span class="readout-label">ATTITUDE</span>
            <strong><span id="angle-readout">0</span><small> DEG</small></strong>
          </div>
        </div>

        <div class="fuel-block">
          <div class="fuel-heading">
            <span>PROPELLANT</span>
            <strong id="fuel-readout">100%</strong>
          </div>
          <div class="fuel-track"><span id="fuel-fill"></span></div>
          <div class="fuel-scale"><span>FULL</span><span>RESERVE</span><span>EMPTY</span></div>
        </div>

        <div class="flight-note">
          <span class="note-mark" aria-hidden="true"></span>
          <div>
            <span class="readout-label">CURRENT VECTOR</span>
            <strong id="mission-note">PAD 03 / HOLD FOR LAUNCH</strong>
          </div>
        </div>

        <div class="telemetry-log">
          <div class="log-heading"><span>MISSION LOG</span><span>UTC 07:42</span></div>
          <div class="log-entry"><span class="log-status log-status--ready"></span><span>Guidance system armed</span><time>07:39</time></div>
          <div class="log-entry"><span class="log-status"></span><span>Landing pad acquired</span><time>07:40</time></div>
          <div class="log-entry"><span class="log-status"></span><span id="log-current">Awaiting descent burn</span><time>NOW</time></div>
        </div>

        <button id="launch-button" class="primary-action primary-action--wide" type="button">
          <span class="button-glyph" aria-hidden="true">&#9650;</span>
          <span id="launch-label">LAUNCH DESCENT</span>
        </button>
      </aside>
    </main>

    <footer class="site-footer">
      <span>GRAVITY <strong id="gravity-readout">1.62 M/S²</strong></span>
      <span class="footer-rule"></span>
      <span>ATTITUDE TOLERANCE <strong id="tolerance-readout">± 13°</strong></span>
      <span class="footer-rule"></span>
      <span>MANUAL GUIDANCE</span>
    </footer>
  </div>
`

const hud = {
  status: document.querySelector('#flight-status'),
  levelName: document.querySelector('#level-name'),
  padName: document.querySelector('#pad-name'),
  sector: document.querySelector('.coordinate-readout strong'),
  levelIndex: document.querySelector('#level-index'),
  gravity: document.querySelector('#gravity-readout'),
  tolerance: document.querySelector('#tolerance-readout'),
  missionState: document.querySelector('#mission-state'),
  missionNote: document.querySelector('#mission-note'),
  launchButton: document.querySelector('#launch-button'),
  launchLabel: document.querySelector('#launch-label'),
  altitude: document.querySelector('#altitude-readout'),
  vertical: document.querySelector('#vertical-readout'),
  horizontal: document.querySelector('#horizontal-readout'),
  angle: document.querySelector('#angle-readout'),
  fuel: document.querySelector('#fuel-readout'),
  fuelFill: document.querySelector('#fuel-fill'),
  currentLog: document.querySelector('#log-current'),
  resultOverlay: document.querySelector('#result-overlay'),
  resultKicker: document.querySelector('#result-kicker'),
  resultTitle: document.querySelector('#result-title'),
  resultDetail: document.querySelector('#result-detail'),
  resultButtonLabel: document.querySelector('#result-button-label'),
  resultScore: document.querySelector('#result-score'),
  resultFuel: document.querySelector('#result-fuel'),
  resultLevelBonus: document.querySelector('#result-level-bonus'),
  resultFuelBonus: document.querySelector('#result-fuel-bonus'),
  resultTotal: document.querySelector('#result-total'),
}

const stateCopy = {
  ready: {
    status: 'STANDBY',
    mission: 'FLIGHT READY',
    note: 'PAD 03 / HOLD FOR LAUNCH',
    log: 'Awaiting descent burn',
    button: 'LAUNCH DESCENT',
  },
  playing: {
    status: 'IN FLIGHT',
    mission: 'DESCENT ACTIVE',
    note: 'PAD 03 / CORRECTING VECTOR',
    log: 'Manual guidance active',
    button: 'DESCENT IN PROGRESS',
  },
  landed: {
    status: 'TOUCHDOWN',
    mission: 'LANDING CONFIRMED',
    note: 'PAD 03 / STRUTS STABLE',
    log: 'Landing sequence complete',
    button: 'FLIGHT AGAIN',
  },
  crashed: {
    status: 'SIGNAL LOST',
    mission: 'HULL IMPACT',
    note: 'PAD 03 / FLIGHT TERMINATED',
    log: 'Emergency recovery pending',
    button: 'RETRY DESCENT',
  },
}

function setMissionState(state, buttonOverride = null) {
  const copy = stateCopy[state]
  hud.status.textContent = copy.status
  hud.missionState.textContent = copy.mission
  hud.missionNote.textContent = copy.note
  hud.currentLog.textContent = copy.log
  hud.launchLabel.textContent = buttonOverride || copy.button
  hud.launchButton.disabled = state === 'playing'
  hud.launchButton.classList.toggle('is-disabled', state === 'playing')
}

class LanderScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LanderScene' })
  }

  create() {
    this.cursorKeys = this.input.keyboard.createCursorKeys()
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.touchControls = new Set()
    this.elapsed = 0
    this.lastThrustParticle = 0
    this.particles = []
    this.levelIndex = 0
    this.level = null

    this.background = this.add.graphics()
    this.terrainGraphics = this.add.graphics()
    this.guideGraphics = this.add.graphics()
    this.fxGraphics = this.add.graphics()
    this.landerGraphics = this.add.graphics()
    this.stars = Array.from({ length: 92 }, (_, index) => ({
      x: 18 + ((index * 83) % 924),
      y: 28 + ((index * 47) % 365),
      size: index % 11 === 0 ? 1.7 : index % 4 === 0 ? 1.2 : 0.75,
      alpha: index % 5 === 0 ? 0.82 : 0.48,
      color: index % 9 === 0 ? 0xb7e9d0 : 0x8aaeb1,
    }))

    this.sectorText = this.add.text(28, 24, '', {
      color: '#9ac4b5',
      fontFamily: 'DM Mono, Consolas, monospace',
      fontSize: '12px',
      letterSpacing: 2,
    })
    this.padText = this.add.text(0, 0, '', {
      color: '#8cf1c7',
      fontFamily: 'DM Mono, Consolas, monospace',
      fontSize: '11px',
      letterSpacing: 1,
    })

    this.loadLevel(this.levelIndex)
  }

  loadLevel(levelIndex) {
    this.levelIndex = Phaser.Math.Clamp(levelIndex, 0, LEVELS.length - 1)
    this.level = LEVELS[this.levelIndex]
    this.terrainPoints = this.level.terrain.map((point) => ({ ...point }))
    this.sectorText.setText(`SECTOR ${this.level.sector} // DESCENT`)
    this.padText.setText(this.level.padName)
    this.padText.setPosition(this.level.landing.left + 8, this.level.landing.y - 34)
    hud.levelName.textContent = this.level.name
    hud.padName.textContent = this.level.padName
    hud.sector.textContent = this.level.sector
    hud.levelIndex.textContent = `LEVEL ${this.levelIndex + 1} / ${LEVELS.length}`
    hud.gravity.textContent = `${this.level.gravityDisplay} M/S²`
    hud.tolerance.textContent = this.level.landing.tolerance
    this.drawWorld()
    this.resetFlight()
  }

  drawWorld() {
    const bg = this.background
    bg.clear()
    bg.fillStyle(0x071318, 1)
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    bg.fillStyle(0x102e35, 0.25)
    bg.fillCircle(780, 162, 178)
    bg.fillStyle(0x12303a, 0.11)
    bg.fillCircle(210, 170, 126)

    this.stars.forEach((star) => {
      bg.fillStyle(star.color, star.alpha)
      bg.fillCircle(star.x, star.y, star.size)
    })

    bg.lineStyle(1, 0x23464d, 0.2)
    bg.beginPath()
    for (let x = 42; x < GAME_WIDTH; x += 46) {
      bg.moveTo(x, 70)
      bg.lineTo(x, 430)
    }
    for (let y = 74; y < 430; y += 46) {
      bg.moveTo(0, y)
      bg.lineTo(GAME_WIDTH, y)
    }
    bg.strokePath()

    const terrain = this.terrainGraphics
    terrain.clear()
    terrain.fillStyle(0x13272b, 1)
    terrain.beginPath()
    terrain.moveTo(0, GAME_HEIGHT)
    this.terrainPoints.forEach((point) => terrain.lineTo(point.x, point.y))
    terrain.lineTo(GAME_WIDTH, GAME_HEIGHT)
    terrain.closePath()
    terrain.fillPath()

    terrain.lineStyle(2, 0x527b78, 0.95)
    terrain.beginPath()
    this.terrainPoints.forEach((point, index) => {
      if (index === 0) terrain.moveTo(point.x, point.y)
      else terrain.lineTo(point.x, point.y)
    })
    terrain.strokePath()

    terrain.lineStyle(1, 0x36595a, 0.7)
    this.level.ridges.forEach(([x1, y1, x2, y2]) => terrain.lineBetween(x1, y1, x2, y2))
    this.level.craters.forEach(([x, y, radius]) => terrain.strokeCircle(x, y, radius))

    const { landing } = this.level
    const padCenter = (landing.left + landing.right) / 2
    terrain.lineStyle(12, 0x5ce5b2, 0.12)
    terrain.lineBetween(landing.left, landing.y, landing.right, landing.y)
    terrain.lineStyle(4, 0x8cf1c7, 1)
    terrain.lineBetween(landing.left, landing.y, landing.right, landing.y)
    terrain.lineStyle(1, 0xb0f7d2, 0.85)
    terrain.lineBetween(landing.left + 18, landing.y + 8, landing.left + 18, landing.y + 19)
    terrain.lineBetween(landing.right - 18, landing.y + 8, landing.right - 18, landing.y + 19)

    const guides = this.guideGraphics
    guides.clear()
    guides.lineStyle(1, 0x6bd6b2, 0.24)
    guides.lineBetween(padCenter, landing.y - 126, padCenter, landing.y - 12)
    guides.lineBetween(padCenter - 38, landing.y - 98, padCenter - 38, landing.y - 12)
    guides.lineBetween(padCenter + 38, landing.y - 98, padCenter + 38, landing.y - 12)
    guides.lineStyle(1, 0x8cf1c7, 0.75)
    guides.lineBetween(padCenter - 5, landing.y - 126, padCenter + 5, landing.y - 126)
    guides.lineBetween(padCenter - 5, landing.y - 126, padCenter, landing.y - 119)
    guides.lineBetween(padCenter + 5, landing.y - 126, padCenter, landing.y - 119)
  }

  resetFlight() {
    this.state = 'ready'
    this.ship = {
      x: this.level.start.x,
      y: this.level.start.y,
      vx: 0,
      vy: 0,
      angle: 0,
      fuel: this.level.fuel,
      thrusting: false,
    }
    this.lastThrustParticle = 0
    this.particles.length = 0
    this.touchControls.clear()
    this.hideResult()
    setMissionState(this.state)
    this.drawLander()
    this.updateHud()
  }

  startFlight() {
    if (this.state === 'playing') return
    if (this.state === 'landed') {
      const nextLevel = this.levelIndex === LEVELS.length - 1 ? 0 : this.levelIndex + 1
      this.loadLevel(nextLevel)
    } else if (this.state === 'crashed') this.resetFlight()
    this.state = 'playing'
    setMissionState(this.state)
  }

  setTouchControl(control, active) {
    if (active) this.touchControls.add(control)
    else this.touchControls.delete(control)
  }

  clearTouchControls() {
    this.touchControls.clear()
  }

  update(_time, delta) {
    const dt = Math.min(delta / 1000, 0.035)
    this.elapsed += dt

    if (this.state === 'ready' && (Phaser.Input.Keyboard.JustDown(this.keySpace) || Phaser.Input.Keyboard.JustDown(this.cursorKeys.up))) {
      this.startFlight()
    }
    if ((this.state === 'landed' || this.state === 'crashed') && Phaser.Input.Keyboard.JustDown(this.keyR)) {
      this.resetFlight()
    }

    if (this.state === 'playing') this.simulateFlight(dt)
    this.updateParticles(dt)
    this.drawParticles()
    this.drawLander()
    this.updateHud()
  }

  simulateFlight(dt) {
    const rotateLeft = this.cursorKeys.left.isDown || this.keyA.isDown || this.touchControls.has('left')
    const rotateRight = this.cursorKeys.right.isDown || this.keyD.isDown || this.touchControls.has('right')
    const wantsThrust = this.cursorKeys.up.isDown || this.keyW.isDown || this.touchControls.has('thrust')

    if (rotateLeft && !rotateRight) this.ship.angle -= 1.55 * dt
    if (rotateRight && !rotateLeft) this.ship.angle += 1.55 * dt
    this.ship.angle = Phaser.Math.Clamp(this.ship.angle, -0.92, 0.92)

    this.ship.thrusting = wantsThrust && this.ship.fuel > 0
    if (this.ship.thrusting) {
      const thrustPower = 92
      this.ship.vx += Math.sin(this.ship.angle) * thrustPower * dt
      this.ship.vy -= Math.cos(this.ship.angle) * thrustPower * dt
      this.ship.fuel = Math.max(0, this.ship.fuel - this.level.fuelBurnRate * dt)
      this.lastThrustParticle += dt
      if (this.lastThrustParticle > 0.026) {
        this.emitThrustParticle()
        this.lastThrustParticle = 0
      }
    } else {
      this.lastThrustParticle = 0
    }

    this.ship.vy += this.level.gravity * dt
    this.ship.vx *= Math.pow(0.999, dt * 60)
    this.ship.x += this.ship.vx * dt
    this.ship.y += this.ship.vy * dt

    if (this.ship.x < 24) {
      this.ship.x = 24
      this.ship.vx = Math.abs(this.ship.vx) * 0.35
    }
    if (this.ship.x > GAME_WIDTH - 24) {
      this.ship.x = GAME_WIDTH - 24
      this.ship.vx = -Math.abs(this.ship.vx) * 0.35
    }

    if (this.ship.y + 24 >= this.groundYAt(this.ship.x)) this.resolveImpact()
  }

  groundYAt(x) {
    for (let index = 0; index < this.terrainPoints.length - 1; index += 1) {
      const current = this.terrainPoints[index]
      const next = this.terrainPoints[index + 1]
      if (x <= next.x) {
        const ratio = (x - current.x) / (next.x - current.x)
        return current.y + (next.y - current.y) * ratio
      }
    }
    return this.terrainPoints[this.terrainPoints.length - 1].y
  }

  resolveImpact() {
    this.ship.y = this.groundYAt(this.ship.x) - 24
    const { landing } = this.level
    const safeLanding = this.ship.x >= landing.left + 10
      && this.ship.x <= landing.right - 10
      && Math.abs(this.ship.vx) <= landing.horizontal
      && Math.abs(this.ship.vy) <= landing.vertical
      && Math.abs(this.ship.angle) <= landing.angle

    if (safeLanding) this.land()
    else {
      const reasons = []
      if (this.ship.x < landing.left + 10 || this.ship.x > landing.right - 10) {
        reasons.push('LANDING PAD MISSED')
      }
      if (Math.abs(this.ship.vx) > landing.horizontal) {
        reasons.push('HORIZONTAL VELOCITY EXCEEDED')
      }
      if (Math.abs(this.ship.vy) > landing.vertical) {
        reasons.push('VERTICAL VELOCITY EXCEEDED')
      }
      if (Math.abs(this.ship.angle) > landing.angle) {
        const actualAngle = Math.round(Math.abs(Phaser.Math.RadToDeg(this.ship.angle)))
        const allowedAngle = Math.round(Phaser.Math.RadToDeg(landing.angle))
        reasons.push(`ATTITUDE ${actualAngle}° / LIMIT ${allowedAngle}°`)
      }
      this.crash(reasons.join(' / ') || 'LANDING PARAMETERS OUT OF RANGE')
    }
  }

  land() {
    this.state = 'landed'
    this.ship.thrusting = false
    for (let index = 0; index < 32; index += 1) this.emitBurstParticle(0x8cf1c7)
    setMissionState(this.state)
    const isFinalLevel = this.levelIndex === LEVELS.length - 1
    const actionLabel = isFinalLevel ? 'PLAY AGAIN' : 'NEXT LEVEL'
    setMissionState(this.state, actionLabel)
    this.showResult(
      isFinalLevel ? 'MISSION COMPLETE' : 'LEVEL COMPLETE',
      `${this.level.name} secured. ${this.level.padName} has a stable signal.`,
      isFinalLevel ? 'CAMPAIGN COMPLETE' : 'TOUCHDOWN',
      Math.round(this.level.scoreBonus + this.ship.fuel * 10),
      actionLabel,
      { levelBonus: this.level.scoreBonus, fuelBonus: Math.round(this.ship.fuel * 10) },
    )
  }

  crash(reason) {
    this.state = 'crashed'
    this.ship.vx = 0
    this.ship.vy = 0
    this.ship.thrusting = false
    for (let index = 0; index < 26; index += 1) this.emitBurstParticle(0xff8b6f)
    setMissionState(this.state)
    this.showResult('SIGNAL LOST', `${reason}. The lander did not survive the approach.`, 'FLIGHT ABORTED', 0, 'RETRY DESCENT', { levelBonus: 0, fuelBonus: 0 })
  }

  showResult(title, detail, kicker, score, actionLabel, breakdown) {
    hud.resultKicker.textContent = kicker
    hud.resultTitle.textContent = title
    hud.resultDetail.textContent = detail
    hud.resultButtonLabel.textContent = actionLabel
    hud.resultScore.textContent = String(score).padStart(4, '0')
    hud.resultFuel.textContent = `${Math.round(this.ship.fuel).toString().padStart(2, '0')}%`
    hud.resultLevelBonus.textContent = `+${String(breakdown.levelBonus).padStart(4, '0')}`
    hud.resultFuelBonus.textContent = `+${String(breakdown.fuelBonus).padStart(4, '0')}`
    hud.resultTotal.textContent = String(score).padStart(4, '0')
    hud.resultOverlay.classList.remove('is-hidden')
  }

  hideResult() {
    hud.resultOverlay.classList.add('is-hidden')
  }

  emitThrustParticle() {
    const sin = Math.sin(this.ship.angle)
    const cos = Math.cos(this.ship.angle)
    const rearX = this.ship.x - sin * 16
    const rearY = this.ship.y + cos * 16
    this.particles.push({
      x: rearX + (Math.random() - 0.5) * 5,
      y: rearY + (Math.random() - 0.5) * 3,
      vx: sin * 22 + (Math.random() - 0.5) * 11,
      vy: cos * 22 + (Math.random() - 0.5) * 11,
      life: 0.32 + Math.random() * 0.16,
      maxLife: 0.48,
      size: 1.8 + Math.random() * 2.5,
      color: Math.random() > 0.35 ? 0xffbf69 : 0xfff2b3,
    })
  }

  emitBurstParticle(color) {
    const direction = Math.random() * Math.PI * 2
    const speed = 30 + Math.random() * 105
    this.particles.push({
      x: this.ship.x,
      y: this.ship.y,
      vx: Math.cos(direction) * speed,
      vy: Math.sin(direction) * speed,
      life: 0.65 + Math.random() * 0.55,
      maxLife: 1.2,
      size: 1.5 + Math.random() * 3,
      color,
    })
  }

  updateParticles(dt) {
    for (let index = this.particles.length - 1; index >= 0; index -= 1) {
      const particle = this.particles[index]
      particle.life -= dt
      particle.x += particle.vx * dt
      particle.y += particle.vy * dt
      particle.vy += 12 * dt
      if (particle.life <= 0) this.particles.splice(index, 1)
    }
  }

  drawParticles() {
    const graphics = this.fxGraphics
    graphics.clear()
    this.particles.forEach((particle) => {
      graphics.fillStyle(particle.color, Math.max(0, particle.life / particle.maxLife))
      graphics.fillCircle(particle.x, particle.y, particle.size)
    })
  }

  drawLander() {
    const graphics = this.landerGraphics
    const { x, y, angle } = this.ship
    const sin = Math.sin(angle)
    const cos = Math.cos(angle)
    const point = (localX, localY) => ({
      x: x + localX * cos - localY * sin,
      y: y + localX * sin + localY * cos,
    })
    const line = (start, end) => {
      graphics.beginPath()
      graphics.moveTo(start.x, start.y)
      graphics.lineTo(end.x, end.y)
      graphics.strokePath()
    }

    graphics.clear()
    if (this.ship.thrusting) {
      const flicker = 20 + Math.sin(this.elapsed * 62) * 3
      const flame = [point(-4, 10), point(0, flicker), point(4, 10)]
      graphics.fillStyle(0xffb84f, 0.95)
      graphics.beginPath()
      graphics.moveTo(flame[0].x, flame[0].y)
      graphics.lineTo(flame[1].x, flame[1].y)
      graphics.lineTo(flame[2].x, flame[2].y)
      graphics.closePath()
      graphics.fillPath()
      const innerFlame = [point(-2, 10), point(0, flicker - 6), point(2, 10)]
      graphics.fillStyle(0xfff1b1, 1)
      graphics.beginPath()
      graphics.moveTo(innerFlame[0].x, innerFlame[0].y)
      graphics.lineTo(innerFlame[1].x, innerFlame[1].y)
      graphics.lineTo(innerFlame[2].x, innerFlame[2].y)
      graphics.closePath()
      graphics.fillPath()
    }

    const body = [point(-14, 8), point(0, -15), point(14, 8)]
    graphics.fillStyle(0xcbd8d1, 1)
    graphics.beginPath()
    graphics.moveTo(body[0].x, body[0].y)
    graphics.lineTo(body[1].x, body[1].y)
    graphics.lineTo(body[2].x, body[2].y)
    graphics.closePath()
    graphics.fillPath()
    graphics.lineStyle(2, 0xeff6e9, 1)
    graphics.beginPath()
    graphics.moveTo(body[0].x, body[0].y)
    graphics.lineTo(body[1].x, body[1].y)
    graphics.lineTo(body[2].x, body[2].y)
    graphics.closePath()
    graphics.strokePath()

    graphics.fillStyle(0x183b42, 1)
    const window = point(0, -5)
    graphics.fillCircle(window.x, window.y, 4.2)
    graphics.lineStyle(1, 0x85c5b4, 1)
    graphics.strokeCircle(window.x, window.y, 4.2)

    graphics.lineStyle(2, 0xa9bdb4, 1)
    line(point(-9, 7), point(-18, 19))
    line(point(9, 7), point(18, 19))
    graphics.lineStyle(2.5, 0xe2eee2, 1)
    line(point(-21, 19), point(-14, 19))
    line(point(14, 19), point(21, 19))
  }

  updateHud() {
    const altitude = Math.max(0, (this.groundYAt(this.ship.x) - (this.ship.y + 24)) / 10)
    hud.altitude.textContent = altitude.toFixed(1)
    hud.vertical.textContent = Math.abs(this.ship.vy).toFixed(0)
    hud.horizontal.textContent = Math.abs(this.ship.vx).toFixed(0)
    hud.angle.textContent = Math.round(Phaser.Math.RadToDeg(this.ship.angle)).toString()
    hud.fuel.textContent = `${Math.ceil(this.ship.fuel)}%`
    hud.fuelFill.style.width = `${this.ship.fuel}%`
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#071318',
  render: {
    antialias: true,
    roundPixels: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [LanderScene],
})

const getScene = () => game.scene.getScene('LanderScene')

hud.launchButton.addEventListener('click', () => getScene().startFlight())
document.querySelector('#reset-button').addEventListener('click', () => getScene().resetFlight())
document.querySelector('#result-button').addEventListener('click', () => getScene().startFlight())

document.querySelectorAll('[data-control]').forEach((button) => {
  const control = button.dataset.control
  const release = (event) => {
    event.preventDefault()
    button.classList.remove('is-active')
    getScene().setTouchControl(control, false)
  }
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault()
    button.setPointerCapture(event.pointerId)
    button.classList.add('is-active')
    getScene().setTouchControl(control, true)
  })
  button.addEventListener('pointerup', release)
  button.addEventListener('pointercancel', release)
  button.addEventListener('pointerleave', release)
})

window.addEventListener('blur', () => getScene().clearTouchControls())
