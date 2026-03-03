const Tabs = ({ tabs, value, onChange }) => {
  return (
    <div className="tabsBar">
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <button
            key={t.key}
            type="button"
            className={`tabBtn ${active ? "active" : ""}`}
            onClick={() => onChange(t.key)}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
