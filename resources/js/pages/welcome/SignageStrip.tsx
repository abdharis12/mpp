import { BLUE, GOLD } from './content';

export default function SignageStrip() {
    return (
        <>
            <div
                className="h-[3px] w-full"
                style={{ backgroundColor: BLUE }}
                aria-hidden="true"
            />
            <div
                className="h-[3px] w-full"
                style={{ backgroundColor: GOLD }}
                aria-hidden="true"
            />
        </>
    );
}
