export default function SingleOrder({line_items, createdAt, ...rest}){
    const time = new Date(createdAt).toLocaleString('sv-SE').split(" ")[1]
    const date = new Date(createdAt).toLocaleString('sv-SE').split(" ")[0]
    const dateConvert = date.split("-").reverse().join("/")
    return(
        <div className="my-[10px] mx-0 py-[10px] px-0 flex gap-[20px] items-center">
            <div>
                <time>{dateConvert} | {time}</time>
                <div className="text-sm mt-[5px] text-[#888]">
                    {rest.name}<br />
                    {rest.email}<br />
                    {rest.phoneNumber}<br />
                    {rest.address}<br />
                </div>
            </div>
            <div>
                {line_items.map((item, i) => (
                    <div key={i}>
                        <span className="text-[#aaa]">{item.quantity} x </span>
                        {item.price_data.product_data.name}
                    </div>
                ))}
            </div>
        </div>
    )
}