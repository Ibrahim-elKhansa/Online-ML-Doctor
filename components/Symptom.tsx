type SymptomProps = {
  name: string;
  state: "not_selected" | "maybe" | "yes" | "no";
  onSelectMaybe: () => void;
  onSelectYes: () => void;
  onSelectNo: () => void;
  onRemove: () => void;
};

export default function Symptom({
  name,
  state,
  onSelectMaybe,
  onSelectYes,
  onSelectNo,
  onRemove,
}: SymptomProps) {

  const formatSymptomName = (name: string): string => {
    return name
      .replaceAll(" _", " ").replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className={`symptom symptom__state--${state}`}>
      <span className="symptom__name">{formatSymptomName(name)}</span>
      <div className="symptom__actions">
        {state !== "not_selected" && <button
          className="symptom__button symptom__button--remove"
          onClick={onRemove}
        >
          Remove
        </button>}
        {state !== "yes" && (
          <button
            className="symptom__button symptom__button--yes"
            onClick={onSelectYes}
          >
            Yes
          </button>
        )}
        {state !== "maybe" && (
          <button
            className="symptom__button symptom__button--maybe"
            onClick={onSelectMaybe}
          >
            Maybe
          </button>
        )}
        {state !== "no" && (
          <button
            className="symptom__button symptom__button--no"
            onClick={onSelectNo}
          >
            No
          </button>
        )}
      </div>
    </div>
  );
}
