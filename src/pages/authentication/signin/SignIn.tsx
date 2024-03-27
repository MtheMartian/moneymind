import { Link, useNavigate, NavigateFunction } from "react-router-dom";
import { useRef, MouseEvent } from "react";
import { prefixUserURL } from "../user";

function SignIn(): JSX.Element{
  const navigator: NavigateFunction = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function signIn(e: MouseEvent<HTMLButtonElement>): Promise<void>{
    e.preventDefault();
    if(emailRef.current && passwordRef.current){
      try{
        console.log([emailRef.current.value, passwordRef.current.value]);
        const response: Response = await fetch(`${prefixUserURL}/signin`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            email: emailRef.current.value,
            password: passwordRef.current.value
          })
        });

        if(response.redirected && response.status == 200){
          navigator("/manager");
        }
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
          <input placeholder="Email" type="text" ref={emailRef}/>
          <input placeholder="Password" type="password" ref={passwordRef}/>
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