import React from 'react';

export function Writings() {
  return (
    <main className="container-fluid body text-center">
      <h3>My Writings</h3>
      <p><i>Placeholder: In future this will be populated with what was submitted on the my page uploads.</i></p>

      <h3>Browse</h3>

      <label htmlFor="essay-little-red">Little Red Riding Hood:</label>
      <textarea
        id="essay-little-red"
        name="essay"
        rows="10"
        cols="50"
        defaultValue={`Once upon a time there was a dear little girl who was loved by every one who looked at her, but most of all by her grandmother, and there was nothing that she would not have given to the child. Once she gave her a little cap of red velvet, which suited her so well that she would never wear anything else. So she was always called Little Red Riding Hood.
        One day her mother said to her, "Come, Little Red Riding Hood, here is a piece of cake and a bottle of wine. Take them to your grandmother, she is ill and weak, and they will do her good. Set out before it gets hot, and when you are going, walk nicely and quietly and do not run off the path, or you may fall and break the bottle, and then your grandmother will get nothing. And when you go into her room, don't forget to say, good-morning, and don't peep into every corner before you do it."
        "I will take great care," said Little Red Riding Hood to her mother, and gave her hand on it...
        `}
      />
      <br />

      <label htmlFor="essay-goldilocks">Goldilocks and the Three Bears:</label>
      <textarea
        id="essay-goldilocks"
        name="essay"
        rows="10"
        cols="50"
        defaultValue={`Once upon a time there were three Bears, who lived together in a house of their own, in a wood. One of them was a Little Wee Bear, and one was a Middle-sized Bear, and the other was a Great Big Bear. They had each a bowl for their porridge; a little bowl for the Little Wee Bear; and a middle-sized bowl for the Middle-sized Bear; and a great bowl for the Great Big Bear.
        One day, after they had made the porridge for their breakfast, and poured it into their porridge-bowls, they walked out into the wood while the porridge was cooling, that they might not burn their mouths by beginning too soon, for they were polite, well-brought-up Bears. And while they were away a little girl called Goldilocks, who lived at the other side of the wood and had been sent on an errand by her mother, passed by the house, and looked in at the window. And then she peeped in at the keyhole, for she was not at all a well-brought-up little girl. Then seeing nobody in the house she lifted the latch...
        `}
      />
      <br />

      <p>
        <i>Placeholder: In future this will be populated with what others have submitted on in the database in real time using websocket.</i>
      </p>
    </main>
  );
}
