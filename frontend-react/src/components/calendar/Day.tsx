interface Props {
    date: Number,
    onClick: Function,
    highlight: boolean
}

const highlightStyle = {
    backgroundColor: "#c7dcff"
}

export default function Day(props: Props) {
    return (
          <div style={props.highlight ? highlightStyle : undefined} onClick={() => props.onClick(props.date)}>
              <p>{props.date}</p>
          </div>
      );
}