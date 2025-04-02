import { useAuthContext } from "../../context/AuthContext.jsx";

const Home = () => {
   const { authUser } = useAuthContext();
  return (
    <div>
        <h1>Welocme {authUser.role}</h1>
    </div>
  )
}

export default Home
