import { Link } from "react-router-dom";
import { useRef } from "react";
import { prefixUserURL } from "../user";

function SignIn(): JSX.Element{

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function signIn(): Promise<void>{
    if(emailRef.current && passwordRef.current){
      try{
        const response: Response = await fetch(`${prefixUserURL}/signin`, {
          method: "post",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            email: emailRef.current.value,
            password: passwordRef.current.value
          })
        });

        console.log(response.status);
      }
      catch(err){
        console.log("Sign in failed.", err);
      }
    }
  }

  return(
    <main>
      <form>
        <h1>SIgn In</h1>
        <div>  
          <input placeholder="Email" ref={emailRef}/>
          <input placeholder="Password" ref={passwordRef}/>
          <button onClick={signIn}>Sign In</button>
        </div>
        <div>
          <p>Don't have an account?</p>
          <Link to="/signup">Create account</Link>
        </div> 
      </form>
    </main>
  )
}

export default SignIn;