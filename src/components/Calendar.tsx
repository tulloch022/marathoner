const Calendar = () => {
    const activities = ["Tempo Run", "Long Run", "Rest"];
    const days = Array.from({ length: 30 }, () =>
      activities[Math.floor(Math.random() * activities.length)]
    );
  
    return (
      <div className="calendar-container">
        <h2 className="calendar-heading">30-Day Training Plan</h2>
        <div className="calendar-grid">
          {days.map((activity, index) => (
            <div key={index} className="calendar-day">
              <strong>Day {index + 1}</strong>
              <p>{activity}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
export default Calendar;