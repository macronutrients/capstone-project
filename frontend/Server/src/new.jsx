import React, {useState} from "react";
import {creteRoot} from "react-dom/client";

//Main Habit Tracker application 
function App()
{
    const [page, setPage] = useState("home");

    const[habits, setHabits] = useState([
        { id: 1, name: "Drink Water", completed: false},
        { id: 2, name: "Read a Book", completed: false},
        { id: 3, name: "Exersice", completed: false}
    ]);

    const [newHabit, setNewHabit] = useState("");

    //Add a new habit 
    function addHabit() {
        if(newHabit.trim() === "") {
            alert("Please enter a habit.");
            return;
        }

        const habit= {
            id: Date.now(),
            name: newHabit,
            completed: false
        };

        setHabits([...habits, habit]);
        setNewHabit("");
    }

    //Mark a habit as completed 
    function completeHabit(id) 
    {
        const updatedHabits = habits.map((habit) => 
            {
            if(habit.id === id) 
                {
                return {
                    ... habit,
                    completed: !habit.completed
                };
            }
            return habit;
        });
        setHabits(updatedHabits);
    }

    

    //Count completed habits
    const completedCount = habits.filter(
        (habit) => habit.completed 
    ).length;

    return(
        <div style={StyleSheet.container}>

            <h1 style = {StyleSheet.heading}>
            </h1>
            {page === "home" && (
                <div> 
                    <h2> Welcome to Habit Tracker!! </h2>

                    <p>
                        Build healthy habits, earn stars, 
                        and unlock adorable pets11
                    </p>
                    <button
                    style={StyleSheet.button}
                    onClick={() => {
                        window.location.href= 
                        "/User%20Authentication/Login.html";
                    }}
                    >
                        Login 
                    </button>

                    <button 
                    style ={Styles.button}
                    onClick={() => {
                        window.location.href = "/User%20Authentication/Registration.html";
                    }}
                    >
                        Register 
                    </button>
        </div>
    )}

    {page == "dashboard" && (
        <div>
            <h2> My Daily Habits </h2>
            <input 
            style = {styles.input}
            type = "text"
            placeholder = "Enter a new habit"
            value= {newHabit}
            onChange = {(event) =>
                setNewHabit(event.target.value)
            }
            
            />

            <button 
            style= {styles.button}
            onClick = {addHabit}
            >
                Add Habit
            </button>
            {habits.map((habit) => (
                <div key={habit.id} style={styles.habit}>
                    <input type= "checkbox"
                    checked={habit.completed}
                    onChange={() =>
                        completeHabit(habit.id)
                    }
                />
                <span>
                    {habit.name}
                </span>
                </div>
            ))}
            <h3> 
                Starts Earned: {completedCount}
            </h3>
            <button 
            style={styles.button}
        onclick={() => setPage("HOME")}
        >
            Back to Home 
        </button>
        </div>
    )}
</div>
    );
}

//Basic styling 
const styles= {
    conatiner: {
        fontfamily: "Arial, sans-serif",
        textAlign: "center",
        backgroundColor: "#e8f5e9",
        inheight: "100vh",
        padding: "40px 20px",
        boxSizing: "border-box"

    },

    heading:{
        color: "#2e7d32",
        fontsize: "36px"
    },

    button:{
        backgroundColor: "#2e7d32",
        color: "white",
        padding: "12px 20px",
        margin: "10px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
    },

    input: {
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid gray",
        margin: "10px"
    },

    habit: {
        backgroundColor: "white",
        pading: "12px,auto",
        borderRadius: "8px",
        margin: "10px  auto",
        maxwidth: "350px",
        display: "flex",
        alignItems: "center",
        gap: "15px"
    }
};

//Display React inside index.html
CreateRoot(
    document.getElementById("root")
).render(
    <React.StrictMode>
        <App />
        </React.StrictMode>
);
