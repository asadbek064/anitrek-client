
import Link from "next/link";
import Button from "./Button";

const EndOfPage = ({}) => {
    return (
        <div className="px-4 md:px-12 lg:px-20 xl:px-28 2xl:px-36"
        >
            <div className="flex flex-col justify-center space-y-6 mt-24">
                <div className="flex justify-center flex-col">
                    <div className="[font-size:var(--step-6)] text-center">
                        👋
                    </div>

                    <div className="flex flex-col text-center space-y-3">
                        <div className="[font-size:var(--step-3)] font-black">Hasta la vista, baby!</div>
                        <div className="[font-size:var(--step-0)]">Didn't find something to watch yet? We got you. Try one of these options insted:</div>
                    </div>
                </div>

                <div className="flex space-x-4 justify-center">
                    <Link href={"/browse?sort=UPDATED_AT_DESC&type=anime"}>
                        <Button className="font-semibold [font-size:var(--step-0)] px-5 py-4" primary>Check what's new</Button>
                    </Link>

                    <Link href={"/browse"}>
                        <Button className="font-semibold [font-size:var(--step-0)] px-5 py-4" primary>Browse and filter</Button>
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default EndOfPage;