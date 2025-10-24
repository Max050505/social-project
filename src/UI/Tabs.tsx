import { ReactNode, ElementType } from 'react';

interface TabsProps {
	children: ReactNode | (string | Element)[];
	buttons: ReactNode ;
	ButtonsContainer?: ElementType;
}

export default function Tabs({ children, buttons, ButtonsContainer = 'menu' }: TabsProps) {
	return (
		<>
			<ButtonsContainer>
				{buttons}
			</ButtonsContainer>
			{children}
		</>
	);
}