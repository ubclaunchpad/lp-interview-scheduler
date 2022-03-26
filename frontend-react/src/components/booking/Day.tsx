import styles from "./Day.module.css";

interface Props {
  date: Number;
  onClick: Function;
  highlight: boolean;
  selected: boolean;
  disabled: boolean;
}

export default function Day(props: Props) {
  let styleId = styles.day;
  if (props.disabled) {
    styleId += " " + styles.disabled;
  } else if (props.highlight) {
    styleId += " " + styles.highlighted;
  }

  if (props.selected) {
    styleId += " " + styles.selected;
  }

  return (
    <div
      className={styleId}
      onClick={() => !props.disabled && props.onClick(props.date)}
    >
      <p>{props.date}</p>
      <div className={styles.colorBar} />
    </div>
  );
}
