import './App.css';
import { useState, useEffect} from "react";
import { BsTrash, BsBookmarkCheck, BsFillBookmarkCheckFill } from "react-icons/bs";

const API = "http://localhost:5000";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoanding] = useState(false);

  // Load todos on page load
  useEffect(() => {
    const loadData = async () => {
      setLoanding(true);

      const res = await fetch(`${API}/todos`)
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err))

     setLoanding(false) 
     setTodos(res)
    }

    loadData()
  },[]);
  

  const handleSubmit = async (e) => {
    e.preventDefault()

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false, 
    }

    await fetch(`${API}/todos`, {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    })

    setTodos((prevState) => [...prevState, todo])

    setTitle("")
    setTime("")
  }

  const handleDelete = async (id) => {
    await fetch(`${API}/todos/` + id, {
      method: "DELETE",
      })

      setTodos((prevState) => prevState.filter((todo) => todo.id !== id))

  }

    const handleEdit = async(todo) => {
      todo.done = !todo.done

      const data = await fetch(`${API}/todos/` + todo.id, {
        method: "PUT",
        body: JSON.stringify(todo),
        headers:{
          "Content-Type": "application/json", 
        }
        })
  
        setTodos((prevState) =>
           prevState.map((t) => (t.id === data.id ? (t = data) : t))
      )

    }

  if(loading) {
    return <p>carregando...</p>
  }
  
  return (
    <div className="App">
      <div className="todo-header">
        <h1>React Todo</h1>
      </div> 
      <div className="form-todo">
        <h2>Envie sua proxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title"> o que você vai fazer ?</label>
            <input 
              type="text"
              name="title"
              placeholder="Titulo da tarefa" 
              onChange={(e)=> setTitle(e.target.value)}
              value={title || ""} 
              required
            />        
          </div>
          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input 
              type="text"
              name="time"
              placeholder="Tempo estimado(em horas)" 
              onChange={(e)=> setTime(e.target.value)}
              value={time || ""} 
              required
            />        
          </div>
          <input type="submit" value="enviar" />

        </form>
      </div>
      <div className="list-todo">
        <p>Lista de tarefas:</p>
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsFillBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
            </div>
          </div>

        ))}
      </div>
    </div>
  );
}

export default App;