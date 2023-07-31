export default function Tabs({tabs, active, onChange}){
    const activeClass = "text-black border-b-[2px] border-b-black"
    const inactiveClass = "text-[#999]"
    return(
        <div className="flex gap-[20px] mb-[20px]">
            {tabs.map(tabName => (
                <span className={`${active === tabName ? activeClass : inactiveClass}`+` text-[1.5rem] cursor-pointer`} key={tabName} onClick={() => { onChange(tabName) }}>{tabName}</span>
            ))}
        </div>
    )
}