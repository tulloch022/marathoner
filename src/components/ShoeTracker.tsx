import { useState } from "react";


type Run = {
  miles: number;
  time: string;
  shoe: string;
};

type Shoes = {
  [key: string]: number;
};

export default function RunTracker() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [shoes, setShoes] = useState<Shoes>({});
  const [newShoe, setNewShoe] = useState<string>("");
  const totalMiles = runs.reduce((total, run) => total + run.miles, 0);
  const shoeCount = Object.keys(shoes).length;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const miles = parseFloat(formData.get("miles") as string);
    const time = formData.get("time") as string;
    const shoe = formData.get("shoe") as string;

    if (!miles || !time || !shoe) return;

    setRuns((prevRuns) => [...prevRuns, { miles, time, shoe }]);

    setShoes((prevShoes) => ({
      ...prevShoes,
      [shoe]: (prevShoes[shoe] || 0) + miles,
    }));

    e.currentTarget.reset();
  };

  const handleAddShoe = () => {
    if (newShoe.trim() && !shoes[newShoe]) {
      setShoes((prevShoes) => ({ ...prevShoes, [newShoe]: 0 }));
      setNewShoe("");
    }
  };

  return (
    <div className="tracker">
      <header className="tracker-header">
        <div>
          <span className="tracker-eyebrow">Training log</span>
          <h2>Every mile, accounted for.</h2>
          <p>Log the run, watch your volume grow, and know when your shoes need attention.</p>
        </div>
        <div className="tracker-week-summary" aria-label={`${totalMiles} total miles logged`}>
          <span>Total distance</span>
          <strong>{totalMiles.toFixed(1)}</strong>
          <small>miles logged</small>
        </div>
      </header>

      <section className="tracker-stats" aria-label="Training summary">
        <div className="tracker-stat">
          <span>Runs</span>
          <strong>{runs.length}</strong>
          <small>recorded sessions</small>
        </div>
        <div className="tracker-stat">
          <span>Rotation</span>
          <strong>{shoeCount}</strong>
          <small>active {shoeCount === 1 ? "shoe" : "shoes"}</small>
        </div>
        <div className="tracker-stat tracker-stat-accent">
          <span>Consistency</span>
          <strong>{runs.length === 0 ? "Ready" : "Building"}</strong>
          <small>{runs.length === 0 ? "log your first run" : "keep showing up"}</small>
        </div>
      </section>

      <div className="tracker-grid">
        <section className="tracker-card entry">
          <div className="tracker-card-heading">
            <div>
              <span className="tracker-step">01</span>
              <h3>Log a run</h3>
            </div>
            <p>Add the essentials while they are fresh.</p>
          </div>

          <form onSubmit={handleSubmit} className="tracker-form">
            <label className="tracker-field">
              <span>Distance</span>
              <div className="tracker-input-wrap">
                <input name="miles" type="number" step="0.1" placeholder="Miles" required />
                <small>mi</small>
              </div>
            </label>

            <label className="tracker-field">
              <span>Elapsed time</span>
              <input name="time" type="text" placeholder="Time (e.g. 45:30)" required />
            </label>

            <label className="tracker-field tracker-field-wide">
              <span>Shoes</span>
              <select name="shoe" required>
                <option value="">Select Shoes</option>
                {Object.keys(shoes).map((shoe) => (
                  <option key={shoe} value={shoe}>
                    {shoe} ({shoes[shoe]} mi)
                  </option>
                ))}
              </select>
            </label>

            <button type="submit" className="tracker-primary-button">
              Log Run
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </section>

        <section className="tracker-card shoe-tracking">
          <div className="tracker-card-heading">
            <div>
              <span className="tracker-step">02</span>
              <h3>Shoe rotation</h3>
            </div>
            <p>Track wear before it becomes a surprise.</p>
          </div>

          <div className="tracker-add-shoe">
            <label className="tracker-field">
              <span>New pair</span>
              <input
                type="text"
                value={newShoe}
                onChange={(e) => setNewShoe(e.target.value)}
                placeholder="Shoe Name"
              />
            </label>
            <button type="button" onClick={handleAddShoe}>Add</button>
          </div>

          <div className="tracker-list-heading">
            <span>Your shoes</span>
            <small>400 mi target</small>
          </div>

          {shoeCount === 0 ? (
            <div className="tracker-empty-state tracker-empty-shoes">
              <span aria-hidden="true">+</span>
              <p>Add your current shoes to start tracking their mileage.</p>
            </div>
          ) : (
            <ul className="shoe-list">
              {Object.entries(shoes).map(([shoe, miles]) => (
                <li key={shoe}>
                  <div className="shoe-row">
                    <span className="shoe-mileage-copy">{shoe}: {miles} mi</span>
                    <small>{Math.max(400 - miles, 0).toFixed(1)} mi left</small>
                  </div>
                  <div className="shoe-progress" aria-label={`${miles} of 400 miles`}>
                    <span style={{ width: `${Math.min((miles / 400) * 100, 100)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="tracker-card recent-runs">
        <div className="tracker-list-heading">
          <div>
            <span>Recent activity</span>
            <small>Your newest runs appear here</small>
          </div>
          <strong>{runs.length.toString().padStart(2, "0")}</strong>
        </div>

        {runs.length === 0 ? (
          <div className="tracker-empty-state recent-runs-empty">
            <div className="tracker-route-mark" aria-hidden="true">
              <span />
            </div>
            <div>
              <strong>No runs logged yet</strong>
              <p>Your training history starts with the next mile.</p>
            </div>
          </div>
        ) : (
          <ul className="run-list">
            {[...runs].reverse().map((run, index) => (
              <li key={`${run.shoe}-${run.time}-${index}`}>
                <div className="run-number">{(runs.length - index).toString().padStart(2, "0")}</div>
                <div className="run-copy">
                  <strong>{run.miles} miles</strong>
                  <span>{run.miles} mi in {run.time} wearing {run.shoe}</span>
                </div>
                <span className="run-status">Logged</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
