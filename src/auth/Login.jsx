import { auth, provider } from "../../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./index.css";
import Logo from "../assets/imgs/MISSNUCITA LOGO EDITABLE-1_LOGO-MISS-NUCITA-GRUESO.png";

export const Login = () => {
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        navigate("/ruleta");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="containerLogin">
      <img className="logo" src={Logo} alt="Logo pic" />
      <h1 className="titleLogin">Inicia sesión para poder participar</h1>
      <button className="login-with-google-btn" onClick={signInWithGoogle}>
        Ingresa con Google
      </button>
    </div>
  );
};
