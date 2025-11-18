import ReactSwitch from 'react-switch';

type SwitchProps = {
  valueToChange: boolean;
  onChange: () => void;
};

export function Switch({ valueToChange, onChange }: SwitchProps) {
  return (
    <ReactSwitch
      checked={valueToChange}
      onChange={onChange}
      offColor="#c4bbdf"
      onColor="#3634c5"
      offHandleColor="#000"
      onHandleColor="#000"
      handleDiameter={20}
      height={18}
      width={48}
      borderRadius={12}
    />
  );
}
