import { useEffect, useState } from "react";
//import { getWishes } from "../api/api";

function WishList({ weddingId }) {
  const [wishes, setWishes] = useState([{id: '1', message: 'This Timeline was created to remember and cherish the memories of a beloved family member, Jack David. He was a beautiful Person and will always have a special place in our hearts.'},
  {id: '2', message: 'Tamara was predeceased by her grandparents Myron and Evis Harlow as well as Richard Bean Sr. and Richard 	&#40;Ricky&#41; Bean Jr. Tamara was born at Stephen&#39;s Memorial Hospital in Norway, Maine. She grew up in Bryant Pond, Maine and attended Telstar high school. She later on attended Bernard&#39;s School of Hair Fashion.'},
  {id: '3', message: 'Tamara was a fun spirited soul who took on many passions. One of which included photography. She had incredible artistic talent. She found comfort and peace in capturing raw nature and using it to express herself. One of her favorite places was the ocean. More specifically, Bar Harbor. This has been one of her favorite places since she was a young child.'},
  {id: '4', message: 'Tamara was a beautiful person inside and out. Her smile was so stunning it would light up the whole room. She cared so deeply for the people around her. She was so kind and passionate. She made an impact on many lives. She will be forever missed. Until we meet again.'}
  ]);

//   useEffect(() => {
//     getWishes(weddingId).then(setWishes);
//   }, [weddingId]); 
// if (!weddingData?.wishes?.length)
  // return <p>No wishes yet.</p>;

  return (
    <ul className="wish-list">
      {wishes.map((wish) => (
        <li key={wish.id}>
          <p>{wish.message}</p>
        </li>
      ))}
    </ul>
  );
}

export default WishList;
