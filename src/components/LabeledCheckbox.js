export default function LabeledCheckbox({
  label,
  id,
  checkedValue,
  setCheckedValue,
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checkedValue}
        id={id}
        onChange={() => {
          setCheckedValue((v) => !v)
        }}
        className="relative w-6 h-6 flex items-center justify-center appearance-none cursor-pointer border-zinc-400 hover:border-zinc-600 border-2 checked:before:font-bold checked:before:inset-1 checked:before:bg-black checked:before:absolute"
      ></input>
      <label htmlFor={id} className="uppercase font-bold text-sm">
        {label}
      </label>
    </div>
  )
}
