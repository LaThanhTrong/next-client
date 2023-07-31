import { BeatLoader } from "react-spinners";

export default function Spinner({fullWidth}){
    const active = "block flex justify-center"
    const inactive = "border border-blue-500"
    return(
        <div className={`${fullWidth ? active : inactive}`}>
            <BeatLoader speedMultiplier={3} color={'#786d7b'}></BeatLoader>
        </div>
    )
}