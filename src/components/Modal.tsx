import {
	cloneElement,
	createContext,
	useContext,
	useState,
	type ReactElement,
	type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import { useOutsideClick } from "../hooks/useOutsideClick";
import styles from "../styles/modal.module.css";

type ModalProviderProps = { children: ReactNode };

type ModalContextValue = {
	openName: string;
	open: (name: string) => void;
	close: () => void;
};

type OpenProps = {
	children: ReactElement<{ onClick?: React.MouseEventHandler }>;
	opens: string;
};

type WindowProps = {
	children: ReactElement<any> | null;
	name: string;
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);
function useModalContext() {
	const context = useContext(ModalContext);
	if (!context) throw new Error("Modal.* must be used within <Modal>.");
	return context;
}

function Modal({ children }: ModalProviderProps) {
	const [openName, setOpenName] = useState<string>("");

	const close = () => {
		setOpenName("");
	};
	const open = (name: string) => setOpenName(name);

	return (
		<ModalContext.Provider value={{ open, close, openName }}>{children}</ModalContext.Provider>
	);
}

function Open({ children, opens: opensWindowName }: OpenProps) {
	const { open } = useModalContext();

	return cloneElement(children, {
		onClick: (e: any) => {
			children.props?.onClick?.(e);
			open(opensWindowName);
		},
	});
}

function Window({ children, name }: WindowProps) {
	const { openName, close } = useModalContext();

	const ref = useOutsideClick<HTMLDivElement>(() => close());
	if (name !== openName) return null;

	return createPortal(
		<div className={styles.overlay}>
			<div className={styles.modal} ref={ref}>
				<button className={styles.button} onClick={close}>
					<HiXMark />
				</button>
				{children && cloneElement(children, { onCloseModal: close })}
			</div>
		</div>,
		document.body
	);
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
