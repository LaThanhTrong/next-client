import { useState, useEffect } from "react"

export default function ProductImages({images}){
    const [activeImage, setActiveImage] = useState(images?.[0])
    const activeClass = "border-[#ccc]"
    const inactiveClass = "border-transparent opacity-70"

    return(
        <> 
            <div className="flex justify-center">
                <img className="max-w-full h-[300px]" src={activeImage}></img>
            </div>
            <div className="flex gap-3 flex-grow-0 mt-5 justify-center">
                {images.map(image => (
                    <div key={image} onClick={() => setActiveImage(image)} className={`${image === activeImage ? activeClass : inactiveClass}`+` border-2 h-[70px] p-[2px] cursor-pointer rounded-md`}>
                        <img className="max-w-full max-h-full" src={image}></img>
                    </div>
                ))}
            </div>
        </>
    )
}
