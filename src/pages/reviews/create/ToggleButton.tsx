interface ToggleButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 m-2 rounded-md ${selected ? 'bg-red-500 text-white' : 'bg-neutral-700'}`}
    >
      {label}
    </button>
  );
};

export default ToggleButton;
