import { useEffect, useState } from "react";
import styles from "../styles/textExpander.module.css";

type TextExpanderProps = {
	text: string;
	numChars?: number;
};

function TextExpander({ text, numChars = 20 }: TextExpanderProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [shownText, setShownText] = useState<string>();

	useEffect(() => {
		if (open) setShownText(text);
		else setShownText(text.trim().slice(0, numChars - 6));
	}, [text, open, numChars]);

	if (text.length <= numChars) return <p>{text}</p>;

	return (
		<p>
			{shownText}
			<a className={styles.button} onClick={() => setOpen((prev) => !prev)}>
				{open ? " ...less" : " ...more"}
			</a>
		</p>
	);
}

export default TextExpander;
