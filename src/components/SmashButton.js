export default function SmashButton({ text, onClick }) {
  return (
    <a className="smashButtonLink" onClick={onClick}>
      <div className="smashButton inline-block smash-button-border p-1.5">
        <button className="bg-black text-white uppercase font-bold px-3 py-1 flex items-center gap-1 whitespace-nowrap">
          <span>{text}</span>
        </button>
      </div>
    </a>
  )
}
