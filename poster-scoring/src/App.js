import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie"; // Import js-cookie library
// import { useSearchParams } from "react-router-dom"; // Import to get query params

import { useNavigate } from "react-router-dom";

function App() {
  const [judgeName, setJudgeName] = useState("");
  const [judgeId, setJudgeId] = useState("");
  const [posterId, setPosterId] = useState("");
  const [score, setScore] = useState("");
  const [existingScore, setExistingScore] = useState(null);
  const [judgeAssignments, setJudgeAssignments] = useState([]);
  const [unauthorized, setUnauthorized] = useState(false);
  const [pin, setPin] = useState("");
  const [isPinVerified, setIsPinVerified] = useState(false); // Track PIN verification
  // const navigate = useNavigate();

  // Fetch Judge ID from Cookies
  useEffect(() => {
    const savedJudgeId = Cookies.get("judgeId");
    if (savedJudgeId) {
      setJudgeId(savedJudgeId);
    }
  }, []);


  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromUrl = searchParams.get("posterId"); // Get posterId from URL

    if (idFromUrl) {
      setPosterId(idFromUrl);
    }
  }, []);

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const id = params.get("posterId");

  //   if (id) {
  //     setPosterId(id);  // Store in state
  //     localStorage.setItem("posterId", id); // Persist if needed

  //     // **Remove 'posterId' from URL without reloading**
  //     navigate(window.location.pathname, { replace: true });
  //   } else {
  //     // If 'posterId' is not in the URL, try fetching from localStorage
  //     const storedId = localStorage.getItem("posterId");
  //     if (storedId) {
  //       setPosterId(storedId);
  //     }
  //   }
  // }, [navigate]);



  useEffect(() => {
    const PIN = Cookies.get("pin");
    if (PIN) {
      setPin(PIN);
    }
  }, []);

  // Fetch Judge Name and PIN verification
  useEffect(() => {
    const fetchJudge = async () => {
      if (!judgeId) return;
      const judgeRef = doc(db, "judges", judgeId);
      const judgeSnapshot = await getDoc(judgeRef);
      if (judgeSnapshot.exists()) {
        const data = judgeSnapshot.data();
        setJudgeName(`${data.firstName} ${data.lastName}`);
      } else {
        console.log("No such judge!");
      }
    };
    fetchJudge();
  }, [judgeId]);

  // Fetch existing score and judge assignments
  useEffect(() => {
    const checkExistingScore = async () => {
      if (!judgeId || !posterId) return;

      const posterRef = doc(db, "posters", posterId);
      const posterSnapshot = await getDoc(posterRef);

      if (posterSnapshot.exists()) {
        setJudgeAssignments(posterSnapshot.data().judgeAssignments || []);
      } else {
        console.log("No such poster!");
        setJudgeAssignments([]);
      }

      const q = query(
        collection(db, "scores"),
        where("judgeId", "==", judgeId),
        where("posterId", "==", posterId)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        setExistingScore(docData);
        setScore(docData.score);
      } else {
        setExistingScore(null);
        setScore("");
      }
    };
    checkExistingScore();
  }, [judgeId, posterId]);

  // Verify PIN
  const verifyPin = async () => {
    try {
      // Fetch all documents from the "judges" collection
      const judgesQuery = collection(db, "judges");
      const judgesSnapshot = await getDocs(judgesQuery);

      let validJudge = null;

      // Iterate through each document in the collection
      judgesSnapshot.forEach((doc) => {
        console.log("Judge Data:", doc.id, doc.data().pin); // Debugging line
        const data = doc.data();

        // Check if the entered PIN matches any judge's stored PIN
        if (data.pin == pin) {
          validJudge = doc.id; // Store the matched judge's ID
        }
      });

      if (validJudge) {
        setJudgeId(validJudge); // Set the judge's ID
        Cookies.set("judgeId", validJudge, { expires: 1000 }); // Store in cookies
        setIsPinVerified(true);
        // alert("PIN Verified Successfully!");
      } else {
        alert("Invalid PIN. Please try again.");
        setIsPinVerified(false);
      }
    } catch (error) {
      console.error("Error fetching judges:", error);
      alert("Error verifying PIN. Please try again.");
    }
  };

  // Submit Score
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug logs
    console.log("Judge ID:", judgeId);
    console.log("Judge Assignments:", judgeAssignments);

    if (!isPinVerified) {
      alert("Please verify your PIN first!");
      return;
    }

    let isAuthorized = false;

    // Check authorization
    for (let i = 0; i < judgeAssignments.length; i++) {
      if (judgeId == judgeAssignments[i]) {
        isAuthorized = true;
        break;
      }
    }

    setUnauthorized(!isAuthorized);

    if (!isAuthorized) {
      alert("You are not authorized to score this poster.");
      return;
    }

    try {
      const docId = `${judgeId}-${posterId}`;

      await setDoc(doc(db, "scores", docId), {
        judgeId,
        posterId,
        score: parseInt(score, 10),
      });

      alert("Score submitted/updated successfully!");
      setExistingScore(null);
      setPosterId("");
      setScore("");

    } catch (error) {
      console.error("Error updating document:", error);
      alert("Failed to submit score.");
    }
  };


  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎨 Poster Scoring System</h1>

      {/* PIN Verification */}
      {!isPinVerified ? (
        <div style={styles.card}>
          <h2>🔒 Enter PIN</h2>
          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={styles.input}
            required
          />
          <button onClick={verifyPin} style={styles.button}>
            Verify PIN
          </button>
        </div>
      ) : (
        <div style={styles.card}>
          <h2>📌 Submit or Update Poster Score</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label>Judge Name:</label>
              <input type="text" value={judgeName} disabled style={styles.input} />
            </div>
            <div style={styles.field}>
              <label>Judge ID:</label>
              <input type="text" value={judgeId} disabled style={styles.input} />
            </div>
            <div style={styles.field}>
              <label>Poster ID:</label>
              <input type="text" value={posterId} disabled style={styles.input} />
            </div>
            <div style={styles.field}>
              <label>Score (1-10):</label>
              <input
                type="number"
                value={score}
                min="1"
                max="10"
                onChange={(e) => setScore(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            {existingScore && (
              <p style={{ color: "blue", fontWeight: "bold" }}>
                Existing score: {existingScore}. Submitting will **update** the score.
              </p>
            )}
            <button type="submit" style={styles.button}>
              Submit/Update Score
            </button>
          </form>
        </div>
      )}

      {unauthorized && (
        <div style={styles.error}>
          ❌ You are not authorized to score this poster. Please check your Judge ID.
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    textAlign: "center",
    fontFamily: "'Arial', sans-serif",
  },
  heading: {
    color: "#333",
    fontSize: "28px",
    marginBottom: "20px",
  },
  card: {
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  error: {
    marginTop: "10px",
    color: "red",
    fontWeight: "bold",
  },
};

export default App;
