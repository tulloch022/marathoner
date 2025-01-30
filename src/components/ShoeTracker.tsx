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
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Run Tracker</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="miles" type="number" step="0.1" placeholder="Miles" required className="w-full p-2 border rounded" />
        <input name="time" type="text" placeholder="Time (e.g. 45:30)" required className="w-full p-2 border rounded" />
        <select name="shoe" required className="w-full p-2 border rounded">
          <option value="">Select Shoes</option>
          {Object.keys(shoes).map((shoe) => (
            <option key={shoe} value={shoe}>
              {shoe} ({shoes[shoe]} mi)
            </option>
          ))}
        </select>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Log Run
        </button>
      </form>

      <div className="mt-4">
        <h3 className="text-lg font-medium">Add New Shoes</h3>
        <div className="flex space-x-2 mt-2">
          <input
            type="text"
            value={newShoe}
            onChange={(e) => setNewShoe(e.target.value)}
            placeholder="Shoe Name"
            className="flex-grow p-2 border rounded"
          />
          <button onClick={handleAddShoe} className="p-2 bg-green-500 text-white rounded">
            Add
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium">Shoe Mileage</h3>
        <ul className="mt-2 space-y-1">
          {Object.entries(shoes).map(([shoe, miles]) => (
            <li key={shoe} className="text-gray-700">
              {shoe}: {miles} mi
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium">Logged Runs</h3>
        <ul className="mt-2 space-y-1">
          {runs.map((run, index) => (
            <li key={index} className="text-gray-700">
              {run.miles} mi in {run.time} wearing {run.shoe}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
