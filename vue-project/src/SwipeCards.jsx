import React from 'react';
import { useUserStore } from '@/stores/UserStore'; // Assurez-vous d'adapter ce chemin pour l'import en React

function TinderCard({ image, name, id, age }) {
  // Utiliser le store dans un composant React
  const store = useUserStore();

  return (
    <div className="tinder">
      <div
        className="pic"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), transparent), url(${image})`
        }}
      ></div>

      <div className="btns">
        <img onClick={store.rewind} src="../assets/rewind.png" alt="rewind" />
        <img onClick={store.skip} src="../assets/nope.png" alt="nope" />
        <img src="../assets/super-like.png" alt="super like" />
        <img onClick={store.getNextUser} src="../assets/like.png" alt="like" />
      </div>

      <div className="absolute top-2 left-3 text-3xl text-white font-bold p-2">
        {name}, {age}
      </div>
    </div>
  );
}

export default TinderCard;
