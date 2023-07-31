import Center from "./Center";
import Link from "next/link";

export default function Footer(){
    return(
        <div className="bg-[#f7f7f9] py-12 relative clear-both">
            <Center>
                <div className="grid gap-10" style={{gridTemplateColumns: "2fr 3fr 1fr 1fr 1fr"}}>
                    <div>
                        <h1 className="font-bold text-[2rem] mb-3">Mealies</h1>
                        <h2 className="font-bold text-[1rem]">Location</h2>
                        <p className="text-[#989898] mb-6">71 Pilgrim Avenue Chevy Chase, MD 20815, USA</p>
                        <div className="flex items-center gap-2">
                            <Link href="https://twitter.com/ElleAlana3" target="_blank"><img className="rounded-sm w-[35px] h-[35px]" src="/images/template/x.png"></img></Link>
                            <Link href="https://www.facebook.com/lathanhtrong2002" target="_blank"><img className="rounded-sm bg-white w-[35px] h-[35px]" src="/images/template/facebook.png"></img></Link>
                            <Link href="https://discordapp.com/users/577097299709394944" target="_blank"><img className="rounded-sm w-[35px] h-[35px]" src="/images/template/discord.png"></img></Link>
                            <Link href="https://github.com/LaThanhTrong" target="_blank"><img className="rounded-sm w-[35px] h-[35px]" src="/images/template/github.png"></img></Link>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-5">
                        <p className="text-[#7d7d7d]">
                            Have a question? Give us a call or fill out the contact form. We would love to hear from you
                        </p>
                        <a href="#">Contact Us</a>
                    </div>
                    <div className="block">
                        <h2 className="text-[1.3rem] font-[500]">Account</h2>
                        <hr className="my-2" />
                        <p className="py-1 text-[#515151]"><Link href="/account">My Account</Link></p>
                        <p className="py-1 text-[#515151]"><Link href="/account">Order History</Link></p>
                        <p className="py-1 text-[#515151]"><Link href="/account">Wish List</Link></p>
                    </div>
                    <div>
                        <h2 className="text-[1.3rem] font-[500]">Services</h2>
                        <hr className="my-2" />
                        <p className="py-1 text-[#515151]"><Link href="#">Policy</Link></p>
                        <p className="py-1 text-[#515151]"><Link href="#">Customer Service</Link></p>
                        <p className="py-1 text-[#515151]"><Link href="#">Term & Conditions</Link></p>
                    </div>
                    <div>
                        <h2 className="text-[1.3rem] font-[500]">Info</h2>
                        <hr className="my-2" />
                        <p className="py-1 text-[#515151]"><Link href="/">About Us</Link></p>
                        <p className="py-1 text-[#515151]"><Link href="#">FAQ</Link></p>
                        <p className="py-1 text-[#515151]"><Link href="#">Contact Us</Link></p>
                    </div>
                </div>
            </Center>
        </div>
    )
}