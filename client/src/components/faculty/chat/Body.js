import React, { useState, useRef } from "react";
import SendIcon from '@mui/icons-material/Send';
import firebase from "firebase/compat/app";
import "./chat.css"
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/analytics";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  // your config
  apiKey: "AIzaSyCeIFVWU_0sFUjJLBODMIcrbrYPmLQKi0g",
  authDomain: "infocellchat.firebaseapp.com",
  projectId: "infocellchat",
  storageBucket: "infocellchat.appspot.com",
  messagingSenderId: "144880775130",
  appId: "1:144880775130:web:ea8e4ed8657ea3e9029ae3",
  measurementId: "G-J7N6R7SJ9K",
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

const Body = () => {
  const [user] = useAuthState(auth);
  return (
    <div className="App bg-gray-600  w-80 h-4/5">
      <header className="bg-gray-800 h-16 flex items-center justify-between px-2">
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section className="bg-gray-900 h-full flex
      flex-col items-center justify-center">
        {user ? <ChatRoom /> : <SignIn/>}
      </section>
    </div>
  );
};

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
      <button
        className="sign-in bg-green-600 h-14 w-40"
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </button>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button
        className="sign-out bg-red-600 h-12 w-20 rounded"
        onClick={() => auth.signOut()}
      >
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main className=" w-full px-3 py-3"  >
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form className="w-80  bg-indigo-900 h-10" onSubmit={sendMessage}>
        <input
          className="w-60 h-10 rounded bg-indigo-900 text-white px-2"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Message"
        />

        <button className="bg-indigo-900 h-8 w-20" type="submit" disabled={!formValue}>
          <SendIcon  className=" h-8 w-20 fill-current text-white"/>
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        {/* <img
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
           }
        /> */}
        <p className="text-white">{text}</p>
      </div>
    </>
  );
}

export default Body;
