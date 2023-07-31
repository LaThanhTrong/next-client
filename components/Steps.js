import { RevealWrapper } from "next-reveal";
import Center from "./Center";

export default function Steps(){
    return(
        <Center>
            <hr className="border-1 my-16" />
            <RevealWrapper delay={0}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 xl:gap-20">
                    <div className="flex flex-col items-center max-w-xs mx-auto">
                        <div className="mb-4 sm:mb-10 max-w-[140px] mx-auto">
                            <img className="max-w-full h-auto" src="/images/template/find.png"></img>
                        </div>
                        <div className="text-center mt-auto space-y-5">
                            <span className="inline-flex px-2.5 py-1 rounded-full font-medium text-xs text-red-800 bg-red-100">Step 1</span>
                            <h3 className="text-base font-semibold">Filter and Discover</h3>
                            <span className="block text-slate-600 dark:text-slate-400 text-sm leading-6">Start by searching and filtering make it easy to find</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center max-w-xs mx-auto">
                        <div className="mb-4 sm:mb-10 max-w-[140px] mx-auto">
                            <img className="max-w-full h-auto" src="/images/template/bag.png"></img>
                        </div>
                        <div className="text-center mt-auto space-y-5">
                            <span className="inline-flex px-2.5 py-1 rounded-full font-medium text-xs text-indigo-800 bg-indigo-100">Step 2</span>
                            <h3 className="text-base font-semibold">Add to bag</h3>
                            <span className="block text-slate-600 dark:text-slate-400 text-sm leading-6">Easily select the correct items and add them to the cart</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center max-w-xs mx-auto">
                        <div className="mb-4 sm:mb-10 max-w-[140px] mx-auto">
                            <img className="max-w-full h-auto" src="/images/template/ship.png"></img>
                        </div>
                        <div className="text-center mt-auto space-y-5">
                            <span className="inline-flex px-2.5 py-1 rounded-full font-medium text-xs text-yellow-800 bg-yellow-100">Step 3</span>
                            <h3 className="text-base font-semibold">Fast shipping</h3>
                            <span className="block text-slate-600 dark:text-slate-400 text-sm leading-6">The carrier will confirm and ship quickly to you</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center max-w-xs mx-auto">
                        <div className="mb-4 sm:mb-10 max-w-[140px] mx-auto">
                            <img className="max-w-full h-auto" src="/images/template/enjoy.png"></img>
                        </div>
                        <div className="text-center mt-auto space-y-5">
                            <span className="inline-flex px-2.5 py-1 rounded-full font-medium text-xs text-purple-800 bg-purple-100">Step 4</span>
                            <h3 className="text-base font-semibold">Enjoy the product</h3>
                            <span className="block text-slate-600 dark:text-slate-400 text-sm leading-6">Have fun and enjoy our 5-star quality foods</span>
                        </div>
                    </div>
                </div>
            </RevealWrapper>
        
        </Center>
    )
}