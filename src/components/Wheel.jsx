import { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logOut } from "../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./index.css";
import { useNavigate } from "react-router-dom";

const data = [
  { option: "10% DESC" },
  { option: "Envío Gratis" },
  { option: "15% DESC" },
  { option: "Regalo sorpresa" },
  { option: "20% DESC" },
  { option: "10% DESC" },
  { option: "Envío Gratis" },
  { option: "15% DESC" },
  { option: "Regalo sorpresa" },
  { option: "20% DESC" },
];

export const WheelComponent = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(undefined);
  const [user, loading] = useAuthState(auth);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [prizeWon, setPrizeWon] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPrizeWon(docSnap.data().Premio);
          setHasPlayed(true);
          setDisabledButton(true);
        }
      }
    };

    fetchUserData();
  }, [user, prizeWon, hasPlayed]);

  const handleSpinClick = async () => {
    if (hasPlayed) return;
    setMustSpin(true);
    setDisabledButton(true);

    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    //Escribir en DB
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, {
      Nombre: user.displayName,
      Premio: data[newPrizeNumber].option,
    });
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  if (loading && !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="title">¡Ruleta Miss Nucita!</h1>
      <p className="eslogan">
        Descuentos y regalos de las marcas Magic Hair y Class Gold
      </p>
      {user && (
        <h3 className="user">
          Usuario: <span className="name">{user.displayName}</span>
        </h3>
      )}
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        outerBorderColor={["#a3741e"]}
        outerBorderWidth={[5]}
        innerBorderColor={["#a3741e"]}
        radiusLineColor={["tranparent"]}
        radiusLineWidth={[1]}
        textColors={["#f5f5f5"]}
        textDistance={55}
        fontSize={[18]}
        backgroundColors={[
          "#c9a179",
          "#37543c",
          "#cbb754",
          "#e3a32d",
          "#64b031",
        ]}
        onStopSpinning={() => {
          setMustSpin(false);
          setHasPlayed(true);
        }}
      />
      <button
        className={`${disabledButton ? "buttonDisabled" : "buttonOk"} button`}
        onClick={handleSpinClick}
        disabled={disabledButton}
      >
        GIRA Y GANA
      </button>
      <div>
        {!hasPlayed ? (
          <p className="oneTry">Tienes sólo 1 intento</p>
        ) : (
          <>
            <p style={{ color: "#c9a179" }}>No tienes más intentos</p>
            <p style={{ color: "#c9a179" }}>
              Premio obtenido:{" "}
              <span style={{ color: "white", textTransform: "uppercase" }}>
                {prizeWon}
              </span>
            </p>
          </>
        )}
      </div>
      <button className="logout-button" onClick={handleLogOut}>
        Cerrar sesión
      </button>
    </div>
  );
};
