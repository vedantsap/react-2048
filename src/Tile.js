export default function Tile({ id, value }) {
    return <button class={`tile tile-${value}`} key={id}> {value} </button>
}