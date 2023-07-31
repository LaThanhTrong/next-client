import { useState } from "react";
import StarOutline from "@/components/icons/StarOutline";
import StarSolid from "@/components/icons/StarSolid";

export default function StarsRating({size='md', defaultHowMany=0, disabled, onChange}){
    const [howMany,setHowMany] = useState(defaultHowMany)
    const five = [1,2,3,4,5];

    const propsSm = "w-[1rem] h-[1rem]"
    const propsMd = "w-[1.5rem] h-[1.5rem]"
    const propsDisabled = "cursor-default "

    function handleStarClick(n) {
        if (disabled) {
          return;
        }
        setHowMany(n);
        onChange(n);
    }

    return(
        <div className="inline-flex gap-1 items-center">
            {five.map(n => (
                <div key={n}>
                    <button className={`${disabled ? propsDisabled : ''}`+`${size === 'md' ? propsMd : ''}`+`${size === 'sm' ? propsSm : ''}`+` p-0 border-0 inline-block bg-transparent text-yellow-400`} onClick={() => handleStarClick(n)}>
                        {howMany >= n ? <StarSolid /> : <StarOutline />}
                    </button>
                </div>
            ))}
        </div>
    )
}