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
      {/* Left Side: Run Entry Form */}
      <div className="entry">
        <h2 className="text-xl">Run</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="miles" type="number" step="0.1" placeholder="Miles" required />
          <input name="time" type="text" placeholder="Time (e.g. 45:30)" required />
          <select name="shoe" required>
            <option value="">Select Shoes</option>
            {Object.keys(shoes).map((shoe) => (
              <option key={shoe} value={shoe}>
                {shoe} ({shoes[shoe]} mi)
              </option>
            ))}
          </select>
          <button type="submit">Log Run</button>
        </form>

        <div className="mt-4">
          <h3 className="text-lg font-medium">Logged Runs</h3>
          <ul>
            {runs.map((run, index) => (
              <li key={index}>
                {run.miles} mi in {run.time} wearing {run.shoe}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side: Shoe Management */}
      <div className="shoe-tracking">
        <h3 className="text-lg font-medium">Add New Shoes</h3>
        <div className="flex space-x-2 mt-2">
          <input type="text" value={newShoe} onChange={(e) => setNewShoe(e.target.value)} placeholder="Shoe Name" />
          <button onClick={handleAddShoe}>Add</button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium">Shoe Mileage</h3>
          <ul>
            {Object.entries(shoes).map(([shoe, miles]) => (
              <li key={shoe}>
                {shoe}: {miles} mi
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
