import { motion } from "framer-motion";

export default function Analyze() {
  const totalMileage = 42;
  const averagePace = "7:30";
  const runsThisWeek = 5;
  const weeklyMileage = [
    { day: "Mon", miles: 5.2 },
    { day: "Tue", miles: 0 },
    { day: "Wed", miles: 6.5 },
    { day: "Thu", miles: 4.8 },
    { day: "Fri", miles: 0 },
    { day: "Sat", miles: 8.5 },
    { day: "Sun", miles: 17 },
  ];
  const highestMileage = Math.max(...weeklyMileage.map(({ miles }) => miles));

  return (
    <motion.div
      className="analyze-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <header className="analyze-header">
        <div>
          <span className="analyze-eyebrow">Training analysis</span>
          <h2>See the work taking shape.</h2>
          <p>Your week at a glance, with only the signals that help you move forward.</p>
        </div>
        <div className="analyze-signal">
          <span>Current signal</span>
          <strong>On track</strong>
          <small>volume is building steadily</small>
        </div>
      </header>

      <section className="analyze-metrics" aria-label="Current analytics summary">
        <article>
          <span>Total Mileage</span>
          <p>{totalMileage} mi</p>
          <small><b>+10%</b> from last week</small>
        </article>
        <article>
          <span>Average Pace</span>
          <p>{averagePace} /mi</p>
          <small><b>12 sec</b> more controlled</small>
        </article>
        <article>
          <span>Runs This Week</span>
          <p>{runsThisWeek}</p>
          <small><b>5 of 5</b> planned runs</small>
        </article>
      </section>

      <div className="analyze-grid">
        <section className="analyze-panel weekly-volume">
          <div className="analyze-panel-heading">
            <div>
              <span>Weekly volume</span>
              <small>Distance by day</small>
            </div>
            <strong>{totalMileage.toFixed(1)} <small>mi</small></strong>
          </div>

          <div className="volume-chart" aria-label="Daily mileage for the current week">
            {weeklyMileage.map(({ day, miles }) => (
              <div className="volume-day" key={day}>
                <div className="volume-track">
                  <span
                    className={miles === highestMileage ? "volume-bar volume-bar-highlight" : "volume-bar"}
                    style={{ height: `${miles === 0 ? 3 : (miles / highestMileage) * 100}%` }}
                    title={`${day}: ${miles} miles`}
                  />
                </div>
                <strong>{miles || "–"}</strong>
                <small>{day}</small>
              </div>
            ))}
          </div>

          <div className="volume-goal">
            <span><b>105%</b> of weekly target</span>
            <div><i /></div>
            <small>Goal: 40 mi</small>
          </div>
        </section>

        <section className="analyze-panel pace-trend">
          <div className="analyze-panel-heading">
            <div>
              <span>Easy-run pace</span>
              <small>Four-week trend</small>
            </div>
            <span className="analysis-chip">Controlled</span>
          </div>

          <div className="pace-chart">
            <div className="pace-chart-labels">
              <span>7:15</span>
              <span>7:45</span>
              <span>8:15</span>
            </div>
            <svg viewBox="0 0 320 128" role="img" aria-label="Easy-run pace becoming more controlled over four weeks">
              <line x1="0" y1="22" x2="320" y2="22" />
              <line x1="0" y1="64" x2="320" y2="64" />
              <line x1="0" y1="106" x2="320" y2="106" />
              <path d="M8 36 C62 42 76 76 118 70 S180 80 212 68 S264 54 312 58" />
              <circle cx="8" cy="36" r="4" />
              <circle cx="118" cy="70" r="4" />
              <circle cx="212" cy="68" r="4" />
              <circle className="pace-current-point" cx="312" cy="58" r="6" />
            </svg>
            <div className="pace-weeks">
              <span>4 weeks ago</span>
              <span>This week</span>
            </div>
          </div>

          <p className="pace-caption">Your pace is settling while mileage rises, a strong sign that easy effort is staying easy.</p>
        </section>

        <section className="analyze-panel training-balance">
          <div className="analyze-panel-heading">
            <div>
              <span>Training balance</span>
              <small>How the week was built</small>
            </div>
          </div>

          <div className="balance-bar" aria-label="70 percent easy, 20 percent long run, 10 percent quality">
            <span className="balance-easy" />
            <span className="balance-long" />
            <span className="balance-quality" />
          </div>

          <ul className="balance-list">
            <li><i className="balance-dot easy" /><span>Easy running</span><strong>70%</strong></li>
            <li><i className="balance-dot long" /><span>Long run</span><strong>20%</strong></li>
            <li><i className="balance-dot quality" /><span>Quality</span><strong>10%</strong></li>
          </ul>
        </section>

        <section className="analyze-insight">
          <div className="insight-mark" aria-hidden="true"><span /></div>
          <div>
            <span>What matters next</span>
            <h3>Protect the recovery.</h3>
            <p>You completed the planned work. Keep tomorrow genuinely easy and let this week settle in.</p>
          </div>
          <strong>01</strong>
        </section>
      </div>
    </motion.div>
  );
}
