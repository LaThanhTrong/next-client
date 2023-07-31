import { RevealWrapper } from "next-reveal";
import Center from "./Center";

export default function AboutUs(){
    return(
        <Center>
            <hr className="border-1 my-16" />
            <RevealWrapper>
                <div className="flex items-center justify-center gap-20 mb-20">
                    <div className="w-[50%]">
                        <h1 className="mb-8 font-bold text-[3rem]">About Us</h1>
                        <div>
                            <p className="my-4">Mealies is a low-cost online general store that gets items crosswise over classifications like grocery, natural products and vegetables, excellence and health, family unit care, infant care, pet consideration, and meats and fish conveyed to your doorstep.</p>
                            <p className="my-4">Our goal is to give our clients the best shopping background as far as service, range, and value, which assembles a solid business and conveys long haul an incentive for our investors.</p>
                            <p className="my-4">We have built up a novel start to finish working answer for online grocery retail dependent on restrictive innovation and IP, appropriate for working our very own business and those of our business accomplices.</p>
                        </div>
                    </div>
                    <div>
                        <img className="w-[500px] rounded-[1.2rem]" src="/images/template/store.png"></img>
                    </div>
                </div>
            </RevealWrapper>
        </Center>
    )
}