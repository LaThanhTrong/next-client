import StarsRating from "@/components/StarsRating";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Roboto } from 'next/font/google';

const rbt = Roboto({ subsets: ['latin'], weight: '400' })

export default function ProductReviews({inventoryId}){
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [stars,setStars] = useState(0);
    const [reviews,setReviews] = useState([]);
    const [reviewsLoading,setReviewsLoading] = useState(false);
    const [titleError, setTitleError] = useState('hidden');
    const [starsError, setStarsError] = useState('hidden');
    const {data:session} = useSession();

    function submitReview(){
        setStarsError('hidden');
        setTitleError('hidden');
        if(stars === 0){
            setStarsError('block');
        }
        else if(document.getElementById("title").value.length <= 0){
            setTitleError('block');
        }
        else{
            const data = {title,description,stars,inventory:inventoryId,userEmail:session.user.email,userName:session.user.name};
            axios.post('/api/reviews', data).then(res => {
                setTitle('');
                setDescription('');
                setStars(0);
                loadReviews();
            });
        }
    }

    useEffect(() => {
        loadReviews();
    }, []);

    function loadReviews() {
        setReviewsLoading(true);
        axios.get('/api/reviews?inventory='+inventoryId).then(res => {
          setReviews(res.data);
          setReviewsLoading(false);
        });
    }

    return(
        <div>
            <div className="grid gap-[20px] mb-[40px]" style={{gridTemplateColumns: '1fr'}}>
                <h1 className="p-[30px] pb-0 font-bold text-[2rem]">Reviews</h1>
                {session && (
                    <div className="bg-[#fff] rounded-sm p-[30px] pt-3">
                        <h3 className="text-xl mb-[5px]">Add a review</h3>
                        <div>
                            <StarsRating onChange={setStars}></StarsRating>
                        </div>
                        <p id="starsError" className={starsError+" mb-[5px] text-red-500"}>Please rate the product before submit.</p>
                        <h3 className="text-xl mb-1">Title*:</h3>
                        <input id="title" className="w-full p-[10px] mb-[5px] border border-[#ccc] rounded-sm box-border" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Title (*)"></input>
                        <p id="titleError" className={titleError+" mb-[5px] text-red-500"}>Title must be included</p>
                        <h3 className="text-xl mb-1">Description:</h3>
                        <textarea rows="8" className={rbt.className+" w-full p-[10px] mb-[5px] border border-[#ccc] rounded-sm box-border"} value={description} onChange={ev => setDescription(ev.target.value)} placeholder="Leave your thought here..."></textarea>
                        <button className={rbt.className+" bg-[#3db8a6] text-white px-3 py-2 rounded-md"} onClick={submitReview}>Submit your review</button>
                    </div>
                )}
                {!session && (
                    <div className="bg-[#fff] rounded-sm p-[30px] pt-3">
                        <h2 className="text-base">Login to add a review</h2>
                    </div>
                )}

                <div>
                    <div className="bg-[#fff] rounded-sm p-[30px] pt-3">
                        <h3 className="text-2xl mt-[5px] font-bold">All reviews</h3>
                        {reviewsLoading && (
                            <Spinner fullWidth={true}></Spinner>
                        )}
                        {reviews.length === 0 && (
                            <p className={rbt.className+" mt-3 text-base"}>No reviews :(</p>
                        )}
                        {reviews.length > 0 && reviews.map(review => (
                            <div key={review._id} className="mb-[10px] border-t-[1px] border-t-[#eee] py-[10px]">
                                <h2 className="text-base">{review.userName}</h2>
                                <h3 className="text-sm my-1">{review.userEmail}</h3>
                                <div className="flex justify-between">
                                    <StarsRating key={review._id} size={'md'} disabled={true} defaultHowMany={review.stars}></StarsRating>
                                    <time className="text-[12px] text-[#aaa]">{(new Date(review.createdAt)).toLocaleString('sv-SE')}</time>
                                </div>
                                <h3 className="my-[5px] text-xl text-[#333] font-bold mb-1">{review.title}</h3>
                                <p className={rbt.className+" m-0 text-sm leading-[1rem] text-[#555]"}>{review.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}